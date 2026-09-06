# Veraciphers — ZK Cryptography Architecture Specification

> **Scope:** `@veraciphers/*` · Giai đoạn 1–2  
> **Công nghệ:** Halo2 · PlonKy2 · ZK-DID · MACI

---

## 1. Tổng Quan

`@veraciphers/*` là tầng **ZK Cryptography & Identity Layer** của Axioledger:

| Package | Vai Trò | Giai Đoạn |
|---|---|---|
| `zk-prover-runtime` | Halo2/PlonKy2 Prover tối ưu mobile (<100ms) | Giai đoạn 2 |
| `did-identity-verifier` | ZK-DID, Soulbound Token, NPM Checksum Security | Giai đoạn 2 |
| `specs-and-docs` ← tệp này | Architecture specs | Giai đoạn 1 |

---

## 2. ZK Stack

### 2.1 Proving Systems

| System | Ưu Điểm | Dùng Cho |
|---|---|---|
| **Halo2** | Không cần trusted setup, recursive | ZK-Auth Proof (AxioPass) |
| **PlonKy2** | Rất nhanh native (< 1s mobile) | L2 Batch Aggregation |

### 2.2 Kiến Trúc Prover Runtime

```
AxioPass (client)
    │ P-256 WebAuthn signature
    ▼
ZK Auth Circuit (Halo2)
    │ generates ZkAuthProof (< 100ms mobile target)
    ▼
StatelessTransaction { TransactionPayload + ZkAuthProof + MerkleWitness }
    │
    ▼
@sequentichain/async-task-runner (ZK-SNARK Batch Aggregator)
    │ aggregates N proofs → 1 ZK-SNARK
    ▼
L1 State Root Commitment
```

---

## 3. ZK-DID (Soulbound Identity)

### 3.1 Định Nghĩa

**ZK-DID** là định danh phi tập trung (Decentralized Identity) được neo vào ZK Proof thay vì khoá công khai trần. Không thể chuyển nhượng (Soulbound).

### 3.2 Cấu Trúc

```
ZK-DID {
    did: "did:axq:<namehash>",
    proof: ZkAuthProof,          // chứng minh sở hữu không lộ private key
    soulbound: true,             // non-transferable
    checksum: Uint8Array[32],    // NPM package integrity hash
    revocationRoot: MerkleRoot   // optional revocation tree
}
```

### 3.3 `did-identity-verifier`

- Xác minh `ZkAuthProof` theo circuit Halo2
- Kiểm tra NPM package checksum (Supply Chain Security)
- Tra cứu Soulbound Token trên L1
- Cung cấp MACI integration hook

---

## 4. MACI — Minimum Anti-Collusion Infrastructure

### 4.1 Mục Đích

Ngăn chặn mua bán phiếu (vote buying) và cấu kết trong Axio-DAO bằng cách mã hóa lá phiếu và ẩn nội dung khỏi kẻ tấn công cho đến sau khi bỏ phiếu kết thúc.

### 4.2 Luồng

```
Voter → mã hóa lá phiếu bằng khóa công khai MACI Coordinator
    │
    ▼ (on-chain)
Encrypted vote batch merkle tree
    │
    ▼ (sau voting period)
ZK Tally Circuit: giải mã + tổng hợp → ZK Proof kết quả
    │
    ▼
On-chain: xác minh ZK Proof → công bố kết quả
```

---

## 5. ZK-Light Client Bridge

### 5.1 Thiết Kế (không Multi-sig)

Cầu nối **Ethereum ↔ Axioledger** không dựa trên ký hiệu đa chữ ký (Multi-sig) mà dùng **ZK Storage Proof** để xác minh trạng thái.

```
Ethereum Mainnet
    │ EVM_Vault.sol
    │   - Lock/unlock token
    │   - Verify ZK Storage Proof from Axioledger L1
    ▼
ZK Light Client
    │   - Theo dõi block header Axioledger L1
    │   - Sinh ZK Proof chứng minh trạng thái vault
    ▼
Axioledger L1/L2
    │ Kpx_Bridge.rs
    │   - Mint/burn axToken tương ứng
    │   - Xác minh ZK Proof từ Ethereum
    ▼
@kinetoprotocol/bridge-relayer (off-chain relay)
```

### 5.2 Contracts (Phase 4.1)

| Contract | Chain | Ngôn Ngữ | Chức Năng |
|---|---|---|---|
| `EVM_Vault.sol` | Ethereum | Solidity | Lock/unlock + ZK Verifier |
| `Kpx_Bridge.rs` | Axioledger L1 | Rust/SVM | Mint/burn axToken |

---

## 6. KPIs Giai Đoạn 2

| Metric | Mục Tiêu |
|---|---|
| ZK-Auth Proof (mobile) | < **1 giây** |
| ZK Prover (server) | < **100ms** |
| Batch Aggregation (1000 txs → 1 SNARK) | < **10 giây** |
| ZK-DID lookup | < **50ms** |

---

*Veraciphers Specs v1.0 — Axioledger Foundation · 2025*
