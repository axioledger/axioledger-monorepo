# `@sequentichain/da-layer` — Architecture Specification

> **Module:** 12 — Data Availability Layer  
> **Package:** `@sequentichain/da-layer`  
> **Version:** 1.0.0  
> **Status:** Phase 1 complete · Phase 2 wiring pending  
> **Tác giả:** Axioledger Foundation — Chief Architect  
> **Cập nhật:** 2025

---

## 1. Mục tiêu & Vai trò trong Hệ sinh thái

`@sequentichain/da-layer` là **upstream blocker** của toàn bộ ZK-pipeline Axioledger. Không có DA Layer, các module sau đây không thể hoạt động đúng:

| Module phụ thuộc | Cần DA Layer vì |
|---|---|
| `@sequentichain/zk-batcher` | Cần nơi ghi blob data trước khi gom batch ZK-SNARK |
| `@sequentichain/proving-marketplace` | Prover node cần đọc blob để sinh ZK-proof |
| `@valiprecision/reputation-engine` | Cần PoR challenge results để tính Slashing |
| `TreasuryEscrowContract` | ZK-Metrics Oracle đọc Merkle roots từ DA để verify KPI |

---

## 2. Kiến trúc Tổng quan

```
L2 Sequencer (zk-batcher)
        │
        │  submit(blob)
        ▼
┌──────────────────────────────────────────────────────┐
│              @sequentichain/da-layer                 │
│                                                      │
│  ┌─────────────┐   encode()   ┌──────────────────┐  │
│  │  BlobStore  │ ──────────── │  ErasureCoder    │  │
│  │  (hot/cold/ │   k=32,m=32  │  Reed-Solomon    │  │
│  │   pruned)   │              │  2D RS + Merkle  │  │
│  └──────┬──────┘              └────────┬─────────┘  │
│         │ putShards()                  │ EncodedBlob  │
│         │ ◄────────────────────────────┘              │
│         │                                             │
│         │  sample()    ┌──────────────┐               │
│         │ ──────────── │  DASampler   │               │
│         │              │  t=20 random │               │
│         │              │  + MerkleProof verify        │
│         │              └──────────────┘               │
│         │                                             │
│         │  issueChallenge()  ┌──────────────────┐    │
│         │ ─────────────────► │ ChallengeManager │    │
│         │                    │ PoR Protocol     │    │
│         │                    │ 12-block window  │    │
│         │                    └──────────────────┘    │
│                                                      │
│  estimateFee()  →  FeeModel (dynamic, $AXQ)          │
└──────────────────────────────────────────────────────┘
        │
        │  archiveCold() / evictCold()
        ▼
L1 Contract: IDANodeRegistry.sol
  - BlobArchived(blobId, merkleRoot)  ← permanent anchor
  - NodeSlashed(challengeId, node, amount)
```

---

## 3. Sub-modules Chi tiết

### 3.1 Blob Data Format (Module 12.1)

**File:** [`src/types.ts`](src/types.ts) · [`src/blob-store.ts`](src/blob-store.ts)

| Tham số | Giá trị | Lý do |
|---|---|---|
| `MAX_BLOB_SIZE_BYTES` | `131_072` (128 KB) | Tối ưu băng thông P2P gossip |
| `HOT_RETENTION_BLOCKS` | `302_400` | ≈ 7 ngày tại 2s/block |
| Commitment | SHA-256 hex (Phase 1) / KZG (Phase 2) | KZG cho phép polynomial opening proof |

**Lifecycle:**

```
submit() → hot storage (BlobStore.put)
         → ErasureCoder.encode() → BlobStore.putShards()
         → [302,400 blocks later] → archiveCold() → L1 anchor
         → [additional 302,400 blocks] → evictCold() → pruned
```

**BlobValidationError** được throw khi:
- Duplicate `blobId` trong store
- Payload vượt 128 KB sau decode base64

---

### 3.2 Erasure Coding — 2D Reed-Solomon (Module 12.1)

**File:** [`src/erasure-coding.ts`](src/erasure-coding.ts)

```
k = 32 data shards
m = 32 parity shards
──────────────────
Tổng: 64 shards / blob
Khả năng chịu lỗi: mất bất kỳ 32/64 shards vẫn khôi phục hoàn toàn (50%)
```

**Merkle Tree** được xây trên SHA-256 checksums của tất cả 64 shards:

```
            merkleRoot = H(L, R)
           /                    \
    H(LL, LR)              H(RL, RR)
    /       \              /       \
 H(s0,s1) H(s2,s3) ...  H(s62,s63)
```

Mỗi shard kèm theo Merkle proof (`generateProof`) cho phép Verifier xác nhận shard thuộc đúng blob mà **không cần download toàn bộ 64 shards**.

**Phase 2 upgrade path:** Thay thế `rsEncode`/`rsDecode` bằng WASM binding đến `leopard-rs` (Rust crate) — API không thay đổi.

---

### 3.3 Data Availability Sampling (Module 12.2)

**File:** [`src/das.ts`](src/das.ts)

```
t = 20 random samples (DAS_SAMPLE_COUNT)

P(miss | data withheld by ≥ k nodes) = ((N-k)/N)^t
                                      = (32/64)^20
                                      = 0.5^20
                                      ≈ 9.5 × 10⁻⁷
                                      < 0.0001% ✓
```

**Quy trình DAS:**
1. Chọn ngẫu nhiên `t=20` shard index khác nhau (Fisher-Yates shuffle)
2. Gọi `ShardFetcher(blobId, index)` cho từng index (timeout 5s/request)
3. Với mỗi shard nhận được: verify `sha256(shard.data) === shard.checksum`
4. Verify Merkle proof: `verifyMerkleProof(checksum, proof, index, merkleRoot)`
5. `available = successfulChunks === sampledChunks`

**Phase 2:** Thay `localShardFetcher` bằng libp2p/QUIC transport.

---

### 3.4 Retention Policy (Module 12.3)

**File:** [`src/blob-store.ts`](src/blob-store.ts)

| Phase | Trigger | Hành động | Storage |
|---|---|---|---|
| `hot` | `put()` | Lưu raw blob + shards | RAM/SSD |
| `cold` | `archiveCold(currentBlock)` khi `expiresAt <= currentBlock` | Ghi `merkleRoot` lên L1 · Xóa raw bytes | Shards còn trong RAM |
| `pruned` | `evictCold()` sau thêm 302,400 blocks | Xóa hoàn toàn | — |

---

### 3.5 Dynamic Fee Model (Module 12.4)

**File:** [`src/fee-model.ts`](src/fee-model.ts)

$$\text{Fee} = \lceil\text{sizeBytes} / 1024\rceil \times \text{baseFeePerKb} \times \left(1 + \frac{\text{queueLoad}}{\text{maxCapacity}}\right)$$

| Tham số | Default | Ý nghĩa |
|---|---|---|
| `baseFeePerKb` | `10 μAXQ` | 0.00001 AXQ / KB tại queue trống |
| `congestionMultiplier` | `1.0 → 2.0` | Tuyến tính theo mức độ tắc nghẽn |
| Token | `$AXQ` (micro-AXQ) | DAO có thể điều chỉnh `baseFeePerKb` qua governance |

Ví dụ: 128 KB blob, queue 50% đầy → `128 × 10 × 1.5 = 1,920 μAXQ` (~0.00192 AXQ)

---

### 3.6 P2P Gossip Protocol (Module 12.5)

**Types:** [`src/types.ts`](src/types.ts) — `BlobAnnouncementMessage`, `ShardRequest`, `ShardResponse`

```
Sequencer broadcast:  BlobAnnouncementMessage { blobId, merkleRoot, totalShards, origin }
DA Node → DA Node:    ShardRequest { blobId, shardIndex }
DA Node → Requester:  ShardResponse { blobId, shard, proof[] }
```

**Phase 2 implementation:** libp2p gossipsub topic `/axioledger/da/blob/1.0.0`

---

### 3.7 Proof-of-Retrievability Challenge (Module 12.6)

**File:** [`src/challenge.ts`](src/challenge.ts) · **Contract:** [`src/contracts/IDANodeRegistry.sol`](src/contracts/IDANodeRegistry.sol)

```
CHALLENGE_WINDOW_BLOCKS = 12  (≈ 24 giây)

Flow:
  Challenger                 DA Node               L1 Contract
      │                         │                      │
      │──issueChallenge()───────►│                      │
      │                         │  (12 blocks window)  │
      │                         │──respondToChallenge()─►│  ← verify proof on-chain
      │                         │                      │
      │  (deadline passed, no response)                │
      │──────────────────────────────finalizeExpired()─►│
      │                                  slash(node, amount) │
```

**Slashing amount:** `10% of node stake` per failed challenge (configurable via DAO).

---

### 3.8 DA Node Registry — On-Chain Interface (Module 12.7)

**File:** [`src/contracts/IDANodeRegistry.sol`](src/contracts/IDANodeRegistry.sol)

| Hàm | Ai gọi | Mục đích |
|---|---|---|
| `registerNode(stake, endpoint)` | DA Node operator | Đăng ký + stake $AXQ |
| `submitBlob(id, root, size, fee)` | L2 Sequencer | Ghi blob record + thu phí |
| `archiveBlob(blobId)` | DA Node daemon | Anchor merkle root lên L1 |
| `issueChallenge(blobId, shard, node)` | Bất kỳ | Phát thách thức PoR |
| `respondToChallenge(id, data, checksum, proof[])` | DA Node | Nộp shard + proof |
| `finalizeExpiredChallenge(id)` | Bất kỳ sau deadline | Kích hoạt slashing |
| `estimateFee(sizeBytes)` | Sequencer (view) | Tính phí trước khi submit |

---

## 4. Cấu trúc File Package

```
packages/sequentichain/da-layer/
├── src/
│   ├── types.ts              # All types & constants (12.1–12.7)
│   ├── blob-store.ts         # Hot/cold/pruned storage (12.1, 12.3)
│   ├── erasure-coding.ts     # RS encoder + Merkle tree/proof (12.1)
│   ├── das.ts                # DAS sampler + localShardFetcher (12.2)
│   ├── fee-model.ts          # Dynamic fee calculation (12.4)
│   ├── challenge.ts          # PoR challenge lifecycle (12.6)
│   ├── da-client.ts          # Unified orchestrator (all modules)
│   ├── index.ts              # Public API
│   └── contracts/
│       └── IDANodeRegistry.sol  # On-chain verifier interface (12.7)
│   └── __tests__/
│       └── da.test.ts        # 33 tests — all passing ✓
├── package.json
└── tsconfig.json
```

---

## 5. KPIs Nghiệm Thu

| Chỉ số | Target | Đo lường |
|---|---|---|
| DAS miss probability (t=20, k=32, N=64) | < 0.0001% | `computeMissProbability(64, 32, 20)` ≈ 9.5e-7 ✓ |
| Blob size limit | ≤ 128 KB | `MAX_BLOB_SIZE_BYTES = 131_072` ✓ |
| PoR challenge window | 12 blocks | `CHALLENGE_WINDOW_BLOCKS = 12` ✓ |
| Hot retention | 7 ngày | `HOT_RETENTION_BLOCKS = 302_400` ✓ |
| RS recovery threshold | 50% shard loss | k=32, m=32 ✓ |
| Fee model | Dynamic 1×–2× congestion | `estimateFee()` pure function ✓ |
| TypeScript typecheck | Zero errors | `tsc --strict --noEmit` ✓ |
| Test coverage | 33/33 pass | `vitest run` ✓ |

---

## 6. Lộ Trình Phase 2

| Hạng mục | Mô tả | Ưu tiên |
|---|---|---|
| **RS WASM codec** | Thay `rsEncode`/`rsDecode` bằng `leopard-rs` WASM | High |
| **KZG commitment** | Thay SHA-256 commitment bằng KZG polynomial | High |
| **P2P transport** | Wire `DASampler` vào libp2p gossipsub | High |
| **DANodeRegistry.sol** | Triển khai contract đầy đủ từ `IDANodeRegistry` | High |
| **GPU-accelerated Merkle** | Parallel Merkle tree computation cho k=32 | Medium |
| **Cold archival to Filecoin/Arweave** | `archiveCold()` → ghi lên decentralized cold storage | Medium |

---

> **Liên kết:** [`AXIOLEDGER_ROADMAP.md §3.2`](../../AXIOLEDGER_ROADMAP.md) · [`@sequentichain/proving-marketplace`](../proving-marketplace/) (Track A — tiếp theo)
