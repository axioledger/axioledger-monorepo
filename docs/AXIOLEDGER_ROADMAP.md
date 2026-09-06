# AXIOLEDGER — Master Roadmap & Architecture Blueprint

> **Tác giả:** Chief Architect · Axioledger Foundation  
> **Phiên bản:** v2.0 · Cập nhật: 2025  
> **Phạm vi:** Toàn hệ sinh thái — Hạ tầng cốt lõi · Protocol Layer · UI/UX System · Tokenomics · Governance  
> **Token chính:** $AXQ · Nhánh: $VPX · $SQX · $KPX · $VRQ

---

## Mục Lục

1. [Tổng Quan Kiến Trúc](#1-tổng-quan-kiến-trúc)
2. [Bản Đồ Hệ Sinh Thái](#2-bản-đồ-hệ-sinh-thái)
3. [Cấu Trúc Monorepo](#3-cấu-trúc-monorepo)
4. [Layer Stack — 5 Tầng Kỹ Thuật](#4-layer-stack--5-tầng-kỹ-thuật)
5. [Luồng Dữ Liệu Tương Tác DApp](#5-luồng-dữ-liệu-tương-tác-dapp)
6. [Tokenomics & Mô Hình Kinh Tế 5-Token](#6-tokenomics--mô-hình-kinh-tế-5-token)
7. [Design System — AXQ UI/UX Foundation](#7-design-system--axq-uiux-foundation)
8. [Axiopass Wallet — Product Roadmap](#8-axiopass-wallet--product-roadmap)
9. [Lộ Trình Kỹ Thuật 4 Giai Đoạn](#9-lộ-trình-kỹ-thuật-4-giai-đoạn)
10. [Ma Trận Deliverables & KPIs](#10-ma-trận-deliverables--kpis)
11. [Kiến Trúc Quản Trị — Axio-DAO & Tribunal](#11-kiến-trúc-quản-trị--axio-dao--tribunal)
12. [Bảo Mật & Kiểm Toán](#12-bảo-mật--kiểm-toán)
13. [Hạ Tầng DevOps & Toolchain](#13-hạ-tầng-devops--toolchain)
14. [Kế Hoạch Khởi Tạo Sổ Cái Giá Trị — Genesis Phasing](#14-kế-hoạch-khởi-tạo-sổ-cái-giá-trị--genesis-phasing)
15. [Quy Trình Tham Gia & Nhận Phân Bổ Giá Trị](#15-quy-trình-tham-gia--nhận-phân-bổ-giá-trị)

---

## 1. Tổng Quan Kiến Trúc

Axioledger là **Layer-1/Layer-2 Blockchain Ecosystem** được xây dựng trên nền tảng **Stateless SVM (Solana Virtual Machine)** tùy biến, tích hợp:

- **Omni-chain Intents Engine** qua `@hot-labs/omni-sdk` (NEAR Protocol)
- **Distributed Compute Grid** qua Golem Factory (`golem-workers`, `smoltcp`)
- **axioledger UI Engine** (1 kB VDOM framework) cho toàn bộ DApp frontend
- **ZK Cryptography Stack** (Halo2 / PlonKy2) cho privacy và trustless verification
- **Biometric Passkey Native Wallet** (WebAuthn P-256 + Secure Enclave)

### Triết Lý Thiết Kế

```
Tối giản ở tầng UI (axioledger 1kB VDOM)
    ×
Tối đa ở tầng bảo mật (ZK Proof mọi lớp)
    ×
Phi tập trung ở tầng quản trị (DAO + Tribunal)
    ×
Hiệu năng cao ở tầng thực thi (600K TPS Sequentichain)
```

### 5 Thực Thể Cốt Lõi

| Thực Thể | Ticker | Vai Trò | Công Nghệ Nền |
|---|---|---|---|
| **Axioledger** | `$AXQ` | Layer-1 Asset & Governance Token | Stateless SVM, ANS (.axq), ZK-EVM Bridge |
| **Valiprecision** | `$VPX` | Validator Network & Slashing Engine | Stateless Verifier Node, Reputation Engine |
| **Sequentichain** | `$SQX` | L2 Sequencer & ZK Batch Prover | AF_XDP Socket, ZK-SNARK Aggregator, 600K TPS |
| **Kinetoprotocol** | `$KPX` | Liquidity & Cross-chain AMM | Concentrated Liquidity, Smart Order Router |
| **Veraciphers** | `$VRQ` | ZK Cryptography & Identity Layer | Halo2/PlonKy2, ZK-DID, MACI Anti-Collusion |

---

## 2. Bản Đồ Hệ Sinh Thái

```
                         ┌─────────────────────────────────────────────────┐
                         │            AXIOLEDGER ECOSYSTEM                 │
                         │         Copyright © 2026 Axioledger Foundation  │
                         └─────────────────────────────────────────────────┘
                                              │
              ┌───────────────────────────────┼────────────────────────────┐
              │                               │                            │
    ┌─────────▼──────────┐       ┌────────────▼──────────┐    ┌───────────▼──────────┐
    │  APPLICATIONS TIER │       │    PROTOCOL TIER      │    │  COMPUTE GRID TIER   │
    │                    │       │                       │    │                      │
    │  apps/wallet-web   │       │  @kinetoprotocol/     │    │  @valiprecision/     │
    │  apps/exchange-web │       │  intents-engine       │    │  worker-pool         │
    │  apps/craft-portal │       │  bridge-relayer       │    │  reputation-engine   │
    │  apps/pay-gateway  │       │  market-registry      │    │  @sequentichain/     │
    │  apps/dao-dashboard│       │                       │    │  gpu-executor        │
    │  apps/docs-site    │       │  @hot-labs/omni-sdk   │    │  docker-runtime      │
    └─────────┬──────────┘       └────────────┬──────────┘    └───────────┬──────────┘
              │                               │                            │
    ┌─────────▼──────────┐       ┌────────────▼──────────┐    ┌───────────▼──────────┐
    │   UI ENGINE TIER   │       │   CRYPTOGRAPHY TIER   │    │   NETWORK STACK TIER │
    │                    │       │                       │    │                      │
    │  axioledger v2 VDOM  │       │  @veraciphers/        │    │  @sequentichain/     │
    │  @axioledger/      │       │  zk-prover-runtime    │    │  network-stack       │
    │  axioledger-adapter  │       │  did-identity-verifier│    │  (smoltcp Rust)      │
    │  @axioledger/      │       │  ZK-DID, MACI         │    │  async-task-runner   │
    │  ui-kit (AXQ DS)   │       │  Halo2 / PlonKy2      │    │  AF_XDP Zero-Copy    │
    └────────────────────┘       └───────────────────────┘    └──────────────────────┘
```

---

## 3. Cấu Trúc Monorepo

```
axioledger-monorepo/                                (root)
│
├── .github/workflows/
│   ├── ci-test.yml                                 # Test suite mọi packages
│   ├── publish-npm-scopes.yml                      # Auto-publish lên NPM Registry
│   └── publish-docker.yml                          # Build & push Docker images
│
├── apps/                                           # Các DApp đầu cuối
│   ├── wallet-web/                                 # Axiopass Wallet (axioledger + near-connect)
│   ├── exchange-web/                               # Axioledger DEX (axioledger + omni-sdk)
│   ├── craft-portal/                               # Compute Grid Marketplace
│   ├── pay-gateway/                                # Payment Gateway Widget
│   ├── docs-site/                                  # Technical Docs & Whitepaper
│   └── dao-dashboard/                              # DAO Governance Portal
│
├── packages/
│   ├── axioledger/                                 # Scope: @axioledger/*
│   │   ├── cli/                                    # CLI quản trị Node & SDK
│   │   ├── create-app/                             # DApp Scaffolder Boilerplate
│   │   ├── axioledger-adapter/                       # Wrapper axioledger → AXQ patterns
│   │   ├── wallet-connector/                       # Wrapper: @hot-labs/near-connect + kit
│   │   ├── ans-sdk/                                # ANS Domain System (.axq resolver)
│   │   └── ui-kit/                                 # Atomic UI Components (AXQ Design System)
│   │
│   ├── valiprecision/                              # Scope: @valiprecision/*
│   │   ├── worker-pool/                            # Golem Workers Management
│   │   ├── core-daemon/                            # P2P Node Daemon
│   │   ├── reputation-engine/                      # Validator Slashing & Uptime Auditor
│   │   └── node-diagnostics/                       # Pre-flight Node Health Check
│   │
│   ├── sequentichain/                              # Scope: @sequentichain/*
│   │   ├── docker-runtime/                         # Isolated Execution Container
│   │   ├── gpu-executor/                           # GPU Accelerated VM Runtime
│   │   ├── network-stack/                          # smoltcp Rust Network Stack
│   │   └── async-task-runner/                      # Micro-batch Transaction Executor
│   │
│   ├── kinetoprotocol/                             # Scope: @kinetoprotocol/*
│   │   ├── market-registry/                        # Liquidity Pool & Token Registry
│   │   ├── bridge-relayer/                         # Cross-chain Message Relayer
│   │   ├── intents-engine/                         # @hot-labs/omni-sdk wrapper (NEAR Intents)
│   │   └── liquidity-node-docker/                  # Market Maker Container Environment
│   │
│   └── veraciphers/                                # Scope: @veraciphers/*
│       ├── zk-prover-runtime/                      # Halo2/PlonKy2 Prover (mobile-optimized)
│       ├── did-identity-verifier/                  # ZK-DID & NPM Checksum Security
│       └── specs-and-docs/                         # Cryptography Architecture Specs
│
├── toolchain/
│   ├── eslint-config/                              # Shared ESLint rules
│   ├── tsconfig/                                   # Shared TypeScript configs
│   └── build-scripts/                              # Shared build utilities
│
├── docs/
│   ├── architecture/                               # axioledger architecture docs
│   │   ├── actions.md, effects.md, state.md
│   │   ├── views.md, subscriptions.md, dispatch.md
│   │   └── flowchart.md
│   ├── api/                                        # API reference (h, app, memo, text)
│   ├── ui/
│   │   └── design-system-roadmap.md                # AXQ Design System full spec
│   ├── reference.md
│   ├── tutorial.md
│   └── AXIOLEDGER_ROADMAP.md                       # ← tệp này
│
├── .npmrc                                          # Scopes & NTM Security config
├── pnpm-workspace.yaml
├── package.json                                    # Root workspace (axioledger v2.0.22)
├── index.js                                        # axioledger core (1 kB VDOM engine)
├── index.d.ts                                      # TypeScript definitions
├── LICENSE.md / README.md
└── Axioledger.md                                   # Master design document
```

### Dependency Map — Hot-labs Integration

| App / Package | `@hot-labs` Dependency | Golem Factory Dependency | UI Engine |
|---|---|---|---|
| `apps/wallet-web` | `near-connect` + `kit` | `smoltcp` → `network-stack` | `axioledger-adapter` + `ui-kit` |
| `apps/exchange-web` | `omni-sdk` (NEAR Intents) | `outbound-helper-scripts` → `bridge-relayer` | `ui-kit` Trading Dashboard |
| `apps/craft-portal` | `kit` (Omni-Payment) | `golem-workers` → `worker-pool` | axioledger Reactive State |
| `apps/pay-gateway` | `omni-sdk` + `wibe3` | `smol-async-process` → `async-task-runner` | axioledger Micro-Widget |

---

## 4. Layer Stack — 5 Tầng Kỹ Thuật

```
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 5 — APPLICATION LAYER                                         │
│  Axiopass Wallet · Exchange DEX · Craft Portal · Pay Gateway · DAO   │
│  Stack: Next.js 14 · React 18 · TypeScript · axioledger v2 VDOM        │
└──────────────────────────────────────────────────────────────────────┘
                                  ↕
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 4 — PROTOCOL & INTENT LAYER                                   │
│  @axioledger/wallet-connector  →  @hot-labs/near-connect + kit       │
│  @kinetoprotocol/intents-engine  →  @hot-labs/omni-sdk (NEAR Intents)│
│  @kinetoprotocol/bridge-relayer  →  Cross-chain Message              │
│  ANS SDK (.axq domain resolution < 10ms)                             │
└──────────────────────────────────────────────────────────────────────┘
                                  ↕
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 3 — EXECUTION & SEQUENCER LAYER                               │
│  @sequentichain/async-task-runner  (600K TPS, AF_XDP Zero-Copy)      │
│  @sequentichain/gpu-executor  (GPU-accelerated ZK Prover)            │
│  ZK-SNARK Batch Aggregator  →  State Root Commitment to L1           │
│  Stateless SVM Engine  (Sealevel Parallel, no full-state storage)    │
└──────────────────────────────────────────────────────────────────────┘
                                  ↕
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 2 — VALIDATION & CRYPTOGRAPHY LAYER                           │
│  @valiprecision/reputation-engine  (Slashing, Uptime)                │
│  @valiprecision/core-daemon  (P2P Node Daemon)                       │
│  @veraciphers/zk-prover-runtime  (Halo2/PlonKy2, mobile < 100ms)    │
│  @veraciphers/did-identity-verifier  (ZK-DID, Soulbound, MACI)      │
└──────────────────────────────────────────────────────────────────────┘
                                  ↕
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 1 — NETWORK & STORAGE LAYER                                   │
│  @sequentichain/network-stack  (smoltcp Rust, zero-copy AF_XDP)      │
│  @sequentichain/docker-runtime  (Isolated Container Execution)       │
│  @valiprecision/worker-pool  (Golem Distributed Compute Grid)        │
│  L1 State Root Contract · EVM_Vault.sol · Kpx_Bridge.rs             │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 5. Luồng Dữ Liệu Tương Tác DApp

### axioledger State Machine (Engine UI)

axioledger v2 (`index.js`, 1 kB) được dùng làm **UI Engine** cho toàn bộ DApp:

```
┌─────────────┐     Action     ┌─────────────┐     Effect     ┌─────────────┐
│   DOM/View  │ ─────────────► │    State    │ ─────────────► │  Side-fx    │
│  (h, text)  │                │  (pure obj) │                │  (impure)   │
└─────────────┘ ◄───────────── └─────────────┘ ◄─────────────  └─────────────┘
                  re-render          ↑                  dispatch Action
                                     │
                              Subscriptions
                             (external events:
                              WebSocket, Timer,
                              Window Resize...)
```

**API cốt lõi của axioledger:**
- `app({ init, view, subscriptions, dispatch })` — khởi tạo instance
- `h(tag, props, children)` — tạo VNode
- `text(value)` — tạo TextVNode
- `memo(view, data)` — lazy render (memoization)

### Luồng Cross-Chain Swap / Bridge / Payment

```
User Input
    │
    ▼ (1) axioledger View Layer
SwapIntentAction dispatched
    │
    ▼ (2) @axioledger/wallet-connector
@hot-labs/near-connect + @hot-labs/kit
→ Multi-chain session init (EVM / NEAR / Solana)
→ Transaction signing
    │
    ▼ (3) @kinetoprotocol/intents-engine
@hot-labs/omni-sdk → NEAR Intents Engine
→ Route discovery (best path, lowest fee)
→ Cross-chain settlement initiation
    │
    ▼ (4) @valiprecision/* + @sequentichain/*
Stateless Verifier Nodes kiểm tra tính hợp lệ
@veraciphers/did-identity-verifier → checksum xác thực
ZK-Batch Aggregator gom giao dịch → State Root
    │
    ▼ (5) L1 Settlement
State Root commit lên L1 Contract
EVM_Vault.sol / Kpx_Bridge.rs xác nhận
→ Finality đạt được
    │
    ▼ (6) axioledger re-render
Cập nhật UI, phát Toast, cập nhật Balance
```

### StatelessTransaction — Cấu Trúc Gói Dữ Liệu

```
StatelessTransaction {
    TransactionPayload     ← Dữ liệu giao dịch thực tế
    ZkAuthProof            ← P-256 WebAuthn (AxioPass Secure Enclave)
    MerkleWitness          ← State proof (bơm bởi $SQX Sequencer)
}
```

**Client-side (AxioPass):** Sinh khóa P-256 qua WebAuthn + ZK Auth Proof  
**Network-side ($SQX):** Tra cứu Access List + bơm `state_witness`  
**Escape Hatch:** AxioPass rút Merkle Witness từ L1 Indexer khi L2 sự cố

---

## 6. Tokenomics & Mô Hình Kinh Tế 5-Token

### Cơ Cấu Token

```
                    ┌─────────────────────────────┐
                    │        $AXQ (500B cap)       │
                    │  Layer-1 Governance Asset    │
                    │  Bảo chứng cốt lõi toàn hệ  │
                    └──────────────┬──────────────┘
                                   │ Proof-of-Lock
              ┌────────────────────┼────────────────────┐
              │                    │                    │
    ┌─────────▼──────┐  ┌──────────▼──────┐  ┌─────────▼──────┐  ┌──────────────────┐
    │   $VPX         │  │    $SQX         │  │    $KPX         │  │    $VRQ          │
    │  Validator     │  │  Sequencer Fee  │  │  AMM/Liquidity  │  │  ZK Prover Fee   │
    │  Staking/Slash │  │  L2 Gas Token   │  │  Market Making  │  │  Privacy Ops     │
    └────────────────┘  └─────────────────┘  └─────────────────┘  └──────────────────┘
```

### Cơ Chế Dòng Tiền

| Nguồn Thu | Phân Phối |
|---|---|
| L2 Transaction Fees | → 50% Buyback & Burn $AXQ · 30% Treasury · 20% $SQX Stakers |
| AMM Swap Fees (KPX) | → 60% LP Providers · 25% Buyback $AXQ · 15% Treasury |
| ZK Prover Fees | → 70% $VRQ Operators · 30% Treasury |
| Validator Rewards | → $VPX Stakers (Base Reward + MEV share) |
| Ecosystem Royalties | → 0.5% doanh thu dApp tài trợ → nạp lại Treasury Reserve |

### Proof-of-Lock Model

```
Stake $AXQ → Nhận quyền:
    ├── Khai thác $VPX (chạy Validator Node)
    ├── Khai thác $SQX (chạy Sequencer Node)
    ├── Khai thác $KPX (cung cấp thanh khoản AMM)
    └── Khai thác $VRQ (vận hành ZK Prover Node)
```

### Buyback & Burn Loop

```
Doanh thu giao dịch
    → Trích % → Mua $AXQ trên thị trường
    → Đốt $AXQ
    → Giảm tổng cung → Tăng giá trị từng đơn vị
    → Thu hút thêm stakers → Tăng bảo mật mạng
    → Vòng lặp dương tính
```

---

## 7. Design System — AXQ UI/UX Foundation

> Chi tiết đầy đủ: [`docs/ui/design-system-roadmap.md`](ui/design-system-roadmap.md)

### Kiến Trúc 3 Tầng Token

```
Primitive (Giá trị gốc)
    → Semantic (Ý nghĩa UI — Light/Dark Mode)
        → Component (Token linh kiện cụ thể)
```

### Bảng Collections Figma

| Collection | Mode | Phạm Vi |
|---|---|---|
| `AXQ / Primitive / Color` | Value | greyscale · brand (7 màu) · status (100–900) |
| `AXQ / Primitive / Spacing` | Value | space/0 → space/128 |
| `AXQ / Primitive / Radius` | Value | none → full (9 bậc) |
| `AXQ / Primitive / Font Size` | Value | 10px → 96px (Work Sans) |
| `AXQ / Semantic / Color` | **Light / Dark** | text · bg · surface · icon · border · status · accent |
| `AXQ / Semantic / Spacing+Radius` | Default | inset · gap · spacing · radius · type |
| `AXQ / Component` | Default | button · input · card · badge · toggle · navbar · modal · avatar · tooltip |

### Brand Colors — AXQ Accent Palette

| Token | Hex | Vai trò |
|---|---|---|
| `brand/teal` | `#49DBC8` | Accent chủ đạo — logo, highlight |
| `brand/green` | `#BEFF6C` | Success accent |
| `brand/orange` | `#FC7339` | Warning / CTA phụ |
| `brand/purple` | `#AF96FB` | Governance / DAO |
| `brand/yellow` | `#FFF172` | Reward / Yield indicator |
| `greyscale/900` | `#101426` | Primary text |
| `black` | `#000000` | Brand primary background |

### Typography Scale (Work Sans)

| Style | Size | Token | Weight |
|---|---|---|---|
| H1 | 96px | `type/h1` | 400–700 |
| H2 | 60px | `type/h2` | 400–700 |
| H3 | 48px | `type/h3` | 400–700 |
| H4 | 34px | `type/h4` | 400–700 |
| H5 | 24px | `type/h5` | 400–600 |
| H6 | 20px | `type/h6` | 400–600 |
| Body | 16px | `type/body` | 400–500 |
| Body Small | 14px | `type/body-sm` | 400–500 |
| Caption | 12px | `type/caption` | 400–500 |
| Overline | 10px | `type/overline` | 400 · UPPERCASE |

---

## 8. Axiopass Wallet — Product Roadmap

> Chi tiết đầy đủ 65+ màn hình: [`docs/ui/design-system-roadmap.md#axiopass-wallet`](ui/design-system-roadmap.md)

### Stack Kỹ Thuật

```
Frontend : Next.js 14 · React 18 · TypeScript
UI       : @axioledger/ui-kit (AXQ Design System v2.0)
Auth     : WebAuthn Passkey · Face ID · Touch ID
Crypto   : @hot-labs/near-connect · @hot-labs/kit
Network  : @sequentichain/network-stack (smoltcp)
Platform : iOS-first (390×844) · Web PWA
```

### 4 Design Phases

| Phase | Tên | Tuần | Screens | Ưu tiên |
|---|---|---|---|---|
| **Phase 1** | Auth & KYC | 1–2 | 24 | Critical |
| **Phase 2** | Home & Card | 3–4 | 16 | High |
| **Phase 3** | Crypto & Transfer | 5–6 | 19 | Medium |
| **Phase 4** | Profile & System | 7 | 16 | Polish |

### 8 Zones — 65+ Màn Hình

| Zone | Tên | Screens | Mô tả |
|---|---|---|---|
| Zone 1 | Onboarding & Auth | 14 | Splash · OTP · PIN · Passkey · Biometric |
| Zone 2 | KYC & Compliance | 10 | eKYC · Doc Scan · Liveness · FATCA |
| Zone 3 | Home & Dashboard | 7 | Balance · Cashback · Analytics · Loyalty |
| Zone 4 | Card Management | 9 | Virtual/Physical · Top-up · Reveal CVV |
| Zone 5 | Crypto & Web3 | 10 | Portfolio · Swap · Staking · ANS · ZK-DID |
| Zone 6 | Transfer & Payments | 9 | Transfer Hub · QR · Receipt · Tx Auth |
| Zone 7 | Profile & Settings | 8 | Security · Linked Banks · Notifications |
| Zone 8 | System States | 8 | Offline · 500 Error · Jailbreak · Blocked |

### 5 New Components To Build

```
PINPad          — dot display + numpad (6-digit animated)
CardVisual      — flip 3D animation (Virtual/Physical)
QRDisplay       — generate + zoom + network picker
LivenessFrame   — camera overlay (active liveness)
GasFeeSelector  — slow / average / fast gas presets
```

---

## 9. Lộ Trình Kỹ Thuật 4 Giai Đoạn

### Tổng Quan Timeline

```
Tháng 1–3    [Giai đoạn 1] Chuẩn hóa & Hạ tầng Cốt lõi
Tháng 4–6    [Giai đoạn 2] Phát triển & Kiểm thử Module Lõi
Tháng 7–9    [Giai đoạn 3] Mạng lưới Mở rộng, Quản trị & Testnet
Tháng 10–12  [Giai đoạn 4] Mainnet Launch & Mở rộng Hệ sinh thái
```

---

### Giai Đoạn 1 — Chuẩn Hóa & Hạ Tầng Cốt Lõi (Tháng 1–3)

#### 1.1 Chuẩn Hóa Thương Hiệu & Codebase

- [ ] Đồng bộ nhận diện thương hiệu — chốt danh xưng: **Axioledger ($AXQ)** + 4 nhánh
- [ ] Tái cấu trúc Monorepo → `axioledger-workspace/`
- [ ] Fork `solana_program` → `axioledger_program` trong `ANSRegistry/processor.rs`
- [ ] Chuẩn hóa `pnpm-workspace.yaml` và `.npmrc` NTM Security
- [ ] Root `package.json`: pin hot-labs (`@hot-labs/kit@1.6.4`, `@hot-labs/omni-sdk@2.25.5`)

#### 1.2 Hoàn Thiện ANS SDK (`@axioledger/ans-sdk`)

- [ ] TypeScript modules: `AnsClient`, `getDomainKey`, `namehash`, Borsh Schema
- [ ] Đa định dạng bản ghi: `.axq` → Native SVM / EVM `0x...` / ZK-DID Hash / IPFS CID
- [ ] Unit tests Localnet: domain resolution < **10ms**
- [ ] Publish `@axioledger/ans-sdk@1.0.0` lên NPM

#### 1.3 Kiến Trúc StatelessTransaction

- [ ] Đặc tả `StatelessTransaction`: `TransactionPayload` + `ZkAuthProof` + `MerkleWitness`
- [ ] Client-side AxioPass: sinh khóa P-256 WebAuthn + Secure Enclave
- [ ] Network-side $SQX: bơm `state_witness` vào gói giao dịch
- [ ] Cơ chế **Escape Hatch** (L1 Fallback khi L2 sự cố)

#### 1.4 Đặc Tả ZK-EVM Bridge

- [ ] Thiết kế **ZK-Light Client Bridge** (không Multi-sig, dựa ZK Storage Proof)
- [ ] Contract `EVM_Vault.sol` trên Ethereum (ZK-Verifier)
- [ ] Contract `Kpx_Bridge.rs` trên Axioledger L1/L2 (mint/burn axToken)
- [ ] Tích hợp luồng Bridge → AMM Pool KPX (Cross-chain Swap 1-click)

#### 1.5 Mô Hình Kinh Tế Vĩ Mô 5-Token

- [ ] Xây dựng ma trận dòng tiền — tổng cung 500B $AXQ
- [ ] Thiết kế Proof-of-Lock: stake $AXQ → unlock mining quyền 4 nhánh
- [ ] Vòng lặp Buyback & Burn từ L2 fees + AMM fees + ZK Prover fees
- [ ] Kiểm định mô hình bằng Monte Carlo simulation

---

### Giai Đoạn 2 — Phát Triển & Kiểm Thử Module Lõi (Tháng 4–6)

#### 2.1 Stateless SVM Engine

- [ ] Phát triển **Axio-Stateless SVM**: xác thực giao dịch chỉ với State Root + Merkle Witness
- [ ] Tích hợp Sealevel Parallel Execution (đa nhân CPU)
- [ ] Benchmark: mục tiêu throughput vượt **500,000 TPS** trên Testnet

#### 2.2 Sequentichain ($SQX)

- [ ] Sequencer độ trễ thấp: tích hợp **Zero-Copy AF_XDP socket** (bypass kernel network stack)
- [ ] ZK-Aggregator Prover: batch ngàn giao dịch L2 → 1 ZK-SNARK → commit L1
- [ ] Mục tiêu: **600,000 TPS** peak throughput

#### 2.3 Veraciphers ($VRQ) — ZK Cryptography

- [ ] Thư viện **Halo2 / PlonKy2** tối ưu hóa cho mobile
- [ ] **ZK-DID** (Soulbound Identity) + **MACI** (Minimum Anti-Collusion Infrastructure)
- [ ] ZK Auth Proof trên mobile: mục tiêu < **1 giây**

#### 2.4 AxioPass Wallet — Native Build

- [ ] Passkey-Native (WebAuthn P-256): **zero seed phrase**
- [ ] ZK-Auth flow: Secure Enclave → ZK Proof → Stateless TX
- [ ] **Paymaster Fee Delegation**: dApp trả phí thay user (USDC / $SQX)
- [ ] Biometric: Face ID · Touch ID · Fallback PIN (6-dot)
- [ ] 24 screens Phase 1 & 2 hoàn chỉnh (pixel-perfect, 390×844)

#### 2.5 Kinetoprotocol ($KPX) — Liquidity Infrastructure

- [ ] **Concentrated Liquidity AMM** (Uni v3/Saber-style)
- [ ] **Smart Order Router (SOR)**: tự động tìm đường thanh khoản tối ưu
- [ ] Tích hợp `@kinetoprotocol/intents-engine` với `@hot-labs/omni-sdk`

---

### Giai Đoạn 3 — Mạng Lưới Mở Rộng, Quản Trị & Testnet (Tháng 7–9)

#### 3.1 Valiprecision ($VPX) — Validator Network

- [ ] **Stateless Verifier Node**: 4 Cores / 8GB RAM (phổ thông)
- [ ] **Sequencer/Prover Node**: AMD EPYC / 128GB+ RAM (doanh nghiệp)
- [ ] Cơ chế Slashing tự động: chém $VPX/$AXQ của Validator gian lận
- [ ] Triển khai `reputation-engine` + `node-diagnostics`

#### 3.2 ZK-Metrics Coprocessor Oracle

- [ ] **Native Indexer Stack**: PM2 + Nginx + Node.js + Elixir + Rust
- [ ] Đọc dữ liệu L2 real-time → Sinh ZK-Proof KPI
- [ ] Gửi ZK-Proof vào `TreasuryEscrowContract` → giải ngân tự động **100%** không cần con người

#### 3.3 Axioledger DAO & Axio-Tribunal

- [ ] **Hàm suy biến thời gian**: $D(t) = e^{-\lambda \int_{0}^{t} (1-A(\tau))d\tau}$ — bào mòn quyền biểu quyết Whales thụ động
- [ ] **Asset Haircuts**: cắt giảm phiếu bầu vượt ngưỡng 1% / 3% / đóng băng > 5%
- [ ] **Lưỡng viện**: Hạ viện ($AXQ Stakers) + Thượng viện ($VPX Operators)
- [ ] **ZK Jury**: VRF ngẫu nhiên chọn Bồi thẩm đoàn giải quyết tranh chấp / Hard Fork

#### 3.4 Treasury DAO & Milestone Streaming

- [ ] **Milestone Streaming**: giải ngân R&D từng block dựa trên ZK-Metrics KPI
- [ ] **Royalty Cashflows**: tự động trích 0.5% doanh thu dApp → nạp Treasury Reserve

#### 3.5 Public Testnet & Bug Bounty

- [ ] Khai trương **Devnet** → **Public Testnet**
- [ ] Cộng đồng: tạo tên miền `.axq`, thử dApp, test Cross-chain Bridge
- [ ] **Bug Bounty Program**: tài trợ auditing firms + white-hat hackers
- [ ] Audit toàn bộ Smart Contracts + Rust codebase

---

### Giai Đoạn 4 — Mainnet Launch & Mở Rộng Hệ Sinh Thái (Tháng 10–12)

#### 4.1 Mainnet Genesis

- [ ] Khai sinh **Genesis Block** Axioledger L1
- [ ] **TGE (Token Generation Event)**: kích hoạt khóa $AXQ → nhận $VPX/$SQX/$KPX/$VRQ
- [ ] Chạy thử nghiệm **Shadow Partition** (L2 isolation trên Mainnet thực)

#### 4.2 ZK-EVM Bridge Mainnet & RWA

- [ ] Kích hoạt cầu nối chính thức: **Ethereum Mainnet ↔ Axioledger L1/L2**
- [ ] Bảo chứng tài sản **RWA** (Trái phiếu mã hóa, Chứng khoán) vào Kho bạc Reserve

#### 4.3 Ecosystem Grant & Incubation

- [ ] Tài trợ dApp tiên phong: DEX · Lending · NFT Marketplace · GameFi
- [ ] Yêu cầu sử dụng: **ANS SDK** + **AxioPass** + **AXQ UI Kit**
- [ ] Tích hợp B2B: thanh toán doanh nghiệp qua `@hot-labs/wibe3` + `pay-gateway`

#### 4.4 Tối Ưu Hóa Hiệu Năng

- [ ] **Dynamic State Sharding** cho Sequentichain khi dApp tăng đột biến
- [ ] Nâng cấp ZK Prover: giảm thời gian sinh bằng chứng mobile xuống < **100ms**

---

## 10. Ma Trận Deliverables & KPIs

| Giai đoạn | Thời gian | Core Deliverables | KPIs Nghiệm Thu |
|---|---|---|---|
| **Giai đoạn 1** | Tháng 1–3 | `@axioledger/ans-sdk` v1.0 · `StatelessTransaction` Spec · ZK-Bridge Spec · Monorepo chuẩn | Domain resolve < **10ms** · Fork `axioledger_program` hoàn tất · hot-labs deps pinned |
| **Giai đoạn 2** | Tháng 4–6 | Axio-Stateless SVM Core · AxioPass App (Phase 1&2) · Sequentichain Alpha · KPX AMM | TPS Testnet > **500,000** · ZK-Auth Proof mobile < **1s** · Passkey zero seed-phrase ✓ |
| **Giai đoạn 3** | Tháng 7–9 | Public Testnet · Axio-Tribunal DAO · ZK-Metrics Oracle · $VPX Validator Network | $VPX Node khởi chạy mượt 4C/8GB · Oracle giải ngân tự động **100%** · Bug Bounty audit pass |
| **Giai đoạn 4** | Tháng 10–12 | Mainnet Genesis · ZK-EVM Bridge Mainnet · RWA Vault · Ecosystem Grants | TVL > **$100M** · Zero Critical Bugs · dApp ecosystem ≥ 5 projects live |

---

## 11. Kiến Trúc Quản Trị — Axio-DAO & Tribunal

### Mô Hình Lưỡng Viện

```
┌─────────────────────────────────────────────────────────┐
│                  AXIOLEDGER GOVERNANCE                  │
├─────────────────────────────┬───────────────────────────┤
│      HẠ VIỆN                │      THƯỢNG VIỆN          │
│  $AXQ Stakers               │  $VPX Operators           │
│  (Community Governance)     │  (Infrastructure Senate)  │
│  Voting weight decay:       │  Veto power on:           │
│  D(t) = e^(-λ∫(1-A(τ))dτ) │  Protocol upgrades        │
│  Caps: 1% / 3% / 5%        │  Critical security fixes  │
└─────────────────────────────┴───────────────────────────┘
                          │
              ┌───────────▼───────────┐
              │    AXIO-TRIBUNAL      │
              │  ZK Jury (VRF random) │
              │  Tranh chấp protocol  │
              │  Hard Fork resolution │
              └───────────────────────┘
```

### Hàm Quản Trị Suy Biến

```math
D(t) = e^{-λ ∫₀ᵗ (1 - A(τ)) dτ}
```

- `D(t)`: Hệ số suy biến quyền biểu quyết theo thời gian
- `A(τ)`: Chỉ số hoạt động của Whale tại thời điểm τ (0 = thụ động, 1 = tích cực)
- `λ`: Hằng số suy biến (governance parameter, có thể điều chỉnh qua DAO vote)

---

## 12. Bảo Mật & Kiểm Toán

### Các Lớp Bảo Mật

| Lớp | Cơ Chế | Công Nghệ |
|---|---|---|
| **Identity** | Passkey WebAuthn P-256 + ZK-DID Soulbound | Secure Enclave · `@veraciphers/did-identity-verifier` |
| **Transaction** | ZK-Auth Proof mọi giao dịch | Halo2 / PlonKy2 · StatelessTransaction |
| **Network** | Checksum NPM hash + Supply Chain Security | `.npmrc` NTM · `@veraciphers/did-identity-verifier` |
| **Validator** | Slashing tự động + Reputation Score | `@valiprecision/reputation-engine` |
| **Bridge** | ZK Storage Proof (không Multi-sig) | ZK-Light Client · `EVM_Vault.sol` |
| **Governance** | MACI Anti-Collusion + ZK Jury | `@veraciphers/zk-prover-runtime` |
| **Mobile App** | Screenshot blocker · Jailbreak detection · Session timeout | WebAuthn · Biometric fallback |

### UX Security Checklist (AxioPass)

- [ ] Screenshot blocker (iOS/Android secure screen)
- [ ] Jailbreak / Root detection (full-screen warning, non-bypassable)
- [ ] Session timeout (auto-logout + preserve context)
- [ ] Biometric fallback (Face ID fail × 3 → PIN)
- [ ] Brute-force PIN protection (retry limit + lockout)
- [ ] WCAG 2.1 AA accessibility compliance

---

## 13. Hạ Tầng DevOps & Toolchain

### Package Manager & Build

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/axioledger/*'
  - 'packages/valiprecision/*'
  - 'packages/sequentichain/*'
  - 'packages/kinetoprotocol/*'
  - 'packages/veraciphers/*'
  - 'toolchain/*'
```

```json
// Root scripts
{
  "build":     "pnpm --recursive run build",
  "test":      "pnpm --recursive run test",
  "lint":      "pnpm --recursive run lint",
  "dev":       "pnpm --parallel --filter \"./apps/*\" dev",
  "clean":     "pnpm --recursive run clean && rimraf node_modules",
  "changeset": "changeset",
  "release":   "pnpm build && changeset publish"
}
```

### CI/CD Pipelines

| Workflow | Trigger | Hành Động |
|---|---|---|
| `ci-test.yml` | Push / PR | Run tests toàn workspace, typecheck, lint |
| `publish-npm-scopes.yml` | Tag release | Publish `@axioledger/*`, `@valiprecision/*`, `@sequentichain/*`, `@kinetoprotocol/*`, `@veraciphers/*` |
| `publish-docker.yml` | Tag release | Build & push Docker images (Sequencer, Validator, ZK Prover) |

### Node Requirements

```
packageManager: pnpm@9.0.0
node:           >=20.0.0
typescript:     ^5.3.0
```

### axioledger Core — Packages

| Package | Version | Chức Năng |
|---|---|---|
| `axioledger` (core) | `2.0.22` | 1 kB VDOM engine: `h()`, `text()`, `app()`, `memo()` |
| `@axioledger/dom` | stable | Inspect DOM, focus/blur |
| `@axioledger/svg` | stable | Draw SVG với plain functions |
| `@axioledger/html` | stable | Write HTML với plain functions |
| `@axioledger/time` | stable | Subscribe intervals, get time |
| `@axioledger/events` | stable | Mouse, keyboard, window, frame events |
| `@axioledger/http` | planned | HTTP requests |
| `@axioledger/navigation` | planned | Browser URL history management |

---

## Phụ Lục — Tham Chiếu Tài Liệu

| Tài liệu | Đường dẫn | Nội dung |
|---|---|---|
| Master Design Document | `Axioledger.md` | Kiến trúc tích hợp hot-labs · Monorepo · Data flow |
| Design System Roadmap | `docs/ui/design-system-roadmap.md` | AXQ Token System · Typography · Axiopass UI 65+ screens |
| axioledger Architecture | `docs/architecture/*.md` | Actions · Effects · State · Subscriptions · Dispatch · Flowchart |
| API Reference | `docs/api/*.md` | `h()` · `text()` · `app()` · `memo()` |
| axioledger Core | `index.js` | VDOM engine source (1 kB) |
| TypeScript Definitions | `index.d.ts` | Full type system: Action · Dispatch · VNode · Subscription |
| Tutorial | `docs/tutorial.md` | Getting started guide |
| Full Reference | `docs/reference.md` | Complete API + Glossary |

---

> **Nguyên Tắc Thiết Kế Cốt Lõi:**
>
> 1. **Phi trạng thái ở tầng xác thực** — Validators không lưu toàn bộ state, chỉ cần State Root + Merkle Witness
> 2. **Zero Seed Phrase** — Passkey WebAuthn thay thế hoàn toàn, không thể mất khóa
> 3. **ZK làm tầng tin cậy** — Mọi KPI, giải ngân, bridge, identity đều qua ZK Proof
> 4. **Component không trỏ thẳng Primitive** — Token chain phải qua đủ 3 tầng (Primitive → Semantic → Component)
> 5. **axioledger là UI engine tối giản** — 1 kB VDOM, Actions pure functions, no side effects in view

---

## 14. Kế Hoạch Khởi Tạo Sổ Cái Giá Trị — Genesis Phasing

> **Nguồn chính thức:** [`core.md`](../core.md) — Ledger Genesis & Allocation Plan

Để đảm bảo hệ sinh thái khởi chạy mượt mà, không bị lạm phát token sớm và có đủ hạ tầng bảo chứng, quá trình phân bổ giá trị được chia thành **4 Giai đoạn chiến lược (Phases)**:

```
[Phase 0: Foundation] ──► [Phase 1: Bootstrap] ──► [Phase 2: Expansion] ──► [Phase 3: Maturity]
 (Testnet & Genesis)       (Node & Dev Launch)       (DeFi & Enterprise)       (Full Decentralization)
```

### Phase 0 — Giai đoạn Nền móng & Kỹ thuật (Tháng 1 – Tháng 2)

- **Mục tiêu:** Xây dựng khung pháp lý mã nguồn, triển khai Testnet, thiết lập Smart Contract cốt lõi cho Hub (`$AXQ`) và các Subnet (`$VPX`, `$SQX`, `$KPX`, `$VRQ`).
- **Đối tượng phân bổ:** Đội ngũ Core Dev, Quỹ R&D Bảo mật, Nhà đầu tư hạt giống (Seed Investors — khóa 12–24 tháng).
- **Hoạt động chính:** Stress-test mạng lưới qua chương trình *Public Testnet Stress-Test*, kiểm định các mạch ZK-Circuit và hoàn thiện SDK cơ bản.

### Phase 1 — Giai đoạn Khởi động Hạ tầng & Nhà phát triển (Tháng 3 – Tháng 6)

- **Mục tiêu:** Kích hoạt lớp đồng thuận và thực thi (Nhóm I & Nhóm II).
- **Node Operators:** Khởi chạy Mainnet Genesis cho Validating Nodes (`$VPX`) và DA Nodes.
- **Developers:** Phát hành chính thức `@axioledger/ans-sdk`, `Circuit Registry`, và mở cổng đăng ký Quỹ Grants (`$AXQ`) cho các dApp đầu tiên.
- **Cơ chế:** Kích hoạt phần thưởng đúc khối (Block Rewards) ban đầu và cơ chế thưởng Uptime 99.9%.

### Phase 2 — Giai đoạn Mở rộng Thanh khoản & Doanh nghiệp (Tháng 7 – Tháng 12)

- **Mục tiêu:** Thu hút dòng tiền từ DeFi, LPs, và tích hợp các giải pháp doanh nghiệp Enterprise (Nhóm III & Nhóm IV).
- **LPs & Investors:** Mở các Bể AMM trên Kinetoprotocol, kích hoạt hệ thống khóa token nhận quyền biểu quyết `$veKPX`.
- **Enterprise:** Đưa các hợp đồng ZK-KYC và RWA Tokenization đầu tiên lên chuỗi.
- **Cơ chế:** Phân phối phần thưởng Liquidity Mining (`$KPX`) và chia sẻ doanh thu cổ tức phí giao dịch.

### Phase 3 — Giai đoạn Toàn dụng Cộng đồng & Tự trị (Năm thứ 2 trở đi)

- **Mục tiêu:** Hoàn thiện mô hình DAO, giao quyền quản trị hoàn toàn cho Thượng viện và Cộng đồng (Nhóm V & Nhóm VI).
- **Đối tượng phân bổ:** Bồi thẩm đoàn ZK-Jury, chương trình Bug Bounty mở rộng, Airdrop định kỳ cho Proof-of-Activity và các chiến dịch Feedback.

> Chi tiết đầy đủ về TreasuryEscrowContract, ZK-Jury, Tokenomics & Handbooks: [`docs/logic/GENESIS_ALLOCATION.md`](logic/GENESIS_ALLOCATION.md)

---

## 15. Quy Trình Tham Gia & Nhận Phân Bổ Giá Trị

> Quy trình chuẩn hóa từ lúc một thành viên bắt đầu tham gia đóng góp cho hệ sinh thái Axioledger đến khi nhận được phần thưởng (Token / Phí bản quyền / Grants).

```
┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│  1. Đăng ký & Định danh │ ──► │  2. Thực hiện Đóng góp │ ──► │  3. Thẩm định & Kiểm tra│
│      (ZK-DID / Subnet) │     │  (Code / Uptime / RWA) │     │  (Oracle / ZK-Jury)    │
└────────────────────────┘     └────────────────────────┘     └─────────────────────────┘
                                                                           │
                                                                           ▼
┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│  6. Tái đầu tư / Stake │ ◄── │  5. Nhận Phân bổ Giá trị│ ◄── │  4. Phê duyệt Tự động  │
│  ($veKPX / Staking)    │     │  ($AXQ / $VRQ / $SQX)  │     │  (Smart Contract Escrow│
└────────────────────────┘     └────────────────────────┘     └────────────────────────┘
```

### Bước 1 — Đăng ký & Định danh (Onboarding & Identity)

- **Công cụ:** Sử dụng **AxioPasskey** hoặc tích hợp **ZK-DID** để tạo danh tính phi tập trung trên mạng lưới.
- **Yêu cầu:** Xác định rõ nhóm vai trò tham gia (ví dụ: Developer đăng ký ví nhận SDK Grants; Node Operator đăng ký IP và stake token bảo chứng `$VPX`/`$SQX`).

### Bước 2 — Thực hiện Đóng góp (Contribution Execution)

Tùy theo nhóm vai trò, thành viên thực hiện các công việc cụ thể được ghi nhận On-chain:

- **Nhóm I (Dev):** Submit Pull Request cho SDK, publish ZK-Circuit lên `Circuit Registry`, hoặc deploy Smart Contract dApp lên Kinetoprotocol.
- **Nhóm II (Nodes):** Duy trì Uptime của Validator, cung cấp dung lượng phần cứng GPU/FPGA hoặc lưu trữ Blob Data.
- **Nhóm III (Enterprise):** Khởi tạo hợp đồng RWA hoặc nạp quỹ Paymaster trả phí gas thay người dùng.
- **Nhóm IV, V, VI (LPs, Cộng đồng, End-Users):** Thêm thanh khoản vào Bể AMM, khóa `$KPX` nhận `$veKPX`, tham gia bỏ phiếu DAO hoặc báo cáo lỗi hệ thống (Bug Bounty).

### Bước 3 — Thẩm định & Kiểm chứng Tự động (Validation & Oracle Audit)

- **ZK-Metrics Coprocessor Oracle:** Tự động đo lường KPI (Uptime của node, tốc độ sinh proof của GPU, khối lượng giao dịch dApp).
- **ZK-Jury (Bồi thẩm đoàn phân tán):** Giải quyết các tranh chấp phức tạp hoặc kiểm duyệt nội dung ZK-DID / Grant proposals.

### Bước 4 — Phê duyệt từ Kho bạc Thông minh (Smart Contract Escrow Execution)

Sau khi hoàn thành tiêu chí (Code đạt chuẩn kiểm toán, Uptime đạt 99.9% trong chu kỳ epoch 7 ngày, hoặc hoàn tất bỏ phiếu quản trị DAO), hợp đồng thông minh **`TreasuryEscrowContract`** sẽ tự động kích hoạt lệnh giải ngân.

### Bước 5 — Nhận Phân bổ Giá trị (Token & Fee Distribution)

Phần thưởng được chuyển thẳng về ví cá nhân:

| Token | Nguồn phần thưởng |
|---|---|
| `$AXQ` | Phí truy xuất dữ liệu, cổ tức RWA, Grants từ Treasury |
| `$VRQ` | Phí ZK-Proof, bảo mật ZK-KYC |
| `$SQX` | Doanh thu L2 Sequencer, chiết khấu Paymaster |
| `$KPX` | Liquidity mining rewards, phí giao dịch DEX |
| `$VPX` | Phần thưởng Staking và đúc khối L1 |

### Bước 6 — Tái đầu tư và Thúc đẩy Quản trị (Staking & Governance Cycling)

Thành viên có thể rút token ra thị trường tự do hoặc tiếp tục **khóa token nhận `$veKPX`** để tham gia **Gauge Voting** — gia tăng tỷ suất sinh lời, nhận thêm quyền phân bổ phí hối lộ (Bribes) hoặc tham gia bầu cử Thượng viện quản trị hệ sinh thái.

> Chi tiết đầy đủ về phân nhóm vai trò (Nhóm I–VI): [`docs/logic/CONTRIBUTION_GROUPS.md`](logic/CONTRIBUTION_GROUPS.md)

---

*Axioledger Monorepo — Master Roadmap v2.0 · Copyright © 2026 Axioledger Foundation*
