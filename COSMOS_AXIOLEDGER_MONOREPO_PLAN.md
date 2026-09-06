# KẾ HOẠCH TÍCH HỢP HỆ SINH THÁI COSMOS VÀO AXIOLEDGER MONOREPO

> **Tác giả:** Chief Architect · Axioledger Foundation  
> **Phiên bản:** v2.0 (Genesis Milestone)  
> **Ngày cập nhật:** 2026-02  
> **Phân loại:** Kế Hoạch Kiến Trúc Kỹ Thuật & Tích Hợp Cosmos Core  
> **Phạm vi:** Kế thừa 12 repository từ `@cosmos` → Tích hợp toàn bộ vào Axioledger Monorepo (`pnpm-workspace`)

---

## Mục Lục

1. [Mục Tiêu Chiến Lược](#1-mục-tiêu-chiến-lược)
2. [Bản Đồ Kế Thừa Repositories](#2-bản-đồ-kế-thừa-repositories)
3. [Cấu Trúc Monorepo Tích Hợp](#3-cấu-trúc-monorepo-tích-hợp)
4. [Quy Chuẩn Cấu Hình Workspace](#4-quy-chuẩn-cấu-hình-workspace)
5. [Kịch Bản Tự Động Kế Thừa & Chuyển Đổi](#5-kịch-bản-tự-động-kế-thừa--chuyển-đổi)
6. [Chuẩn Hóa Package JSON cho Go Modules & Cấu Hình `go.work`](#6-chuẩn-hóa-package-json-cho-go-modules--cấu-hình-gowork)
7. [Hệ Sinh Thái NPM (9 Nhóm Package Cosmos / CosmJS / CosmWasm)](#7-hệ-sinh-thái-npm-9-nhóm-package-cosmos--cosmjs--cosmwasm)
8. [Lộ Trình Thực Thi 5 Bước (5-Step Execution Roadmap)](#8-lộ-trình-thực-thi-5-bước-5-step-execution-roadmap)

---

## 1. Mục Tiêu Chiến Lược

### 1.1 Thừa Hưởng Toàn Diện Hạ Tầng Interchain

Kế thừa có chọn lọc và tái cấu trúc toàn bộ hạ tầng từ tổ chức `orgs/cosmos` — bao gồm State Machine (`cosmos-sdk`), Giao thức Liên chuỗi (`ibc-go`, `ibc`), Cấu trúc Merkle (`iavl`), Mật mã học (`gogoproto`, `kms`) — làm nền tảng kỹ thuật cốt lõi cho mạng lưới **Axio-Stateless SVM** và **5-Token Protocol Suite** (`$AXQ`, `$VPX`, `$SQX`, `$KPX`, `$VRQ`). Mục tiêu là đứng trên vai người khổng lồ về hạ tầng Interchain, đồng thời tái định hình triệt để theo kiến trúc Stateless và mô hình kinh tế 10 nghìn tỷ `$AXQ`.

### 1.2 Quyền Tự Chủ Mã Nguồn (Sovereign Codebase)

Tách biệt hoàn toàn khỏi tổ chức gốc `github.com/cosmos`, chuẩn hóa và chuyển đổi toàn bộ namespace Go module, địa chỉ Git remote, và NPM package scope về:
- **Go modules:** `github.com/axioledger/<repo>` (thay thế `github.com/cosmos/<repo>`)
- **NPM scopes:** `@axioledger/*` (cho tất cả packages tích hợp từ Cosmos)
- **Git remotes:** `https://github.com/axioledger/<repo>.git`

Điều này đảm bảo Axioledger không bị ràng buộc bởi lịch trình phát hành, quyết định quản trị hay giấy phép thay đổi của tổ chức cũ.

### 1.3 Đồng Bộ Hóa Workspace (`workspace:*`)

Thay thế toàn bộ liên kết phụ thuộc chéo giữa các package nội bộ trong monorepo bằng giao thức `"workspace:*"` của `pnpm`, đảm bảo:
- Mọi thay đổi mã nguồn được phản ánh tức thì không cần publish lên NPM registry
- Quy trình kiểm thử (`test`), sửa đổi (`patch`) và build (`build`) diễn ra hoàn toàn local
- `pnpm --recursive run build` biên dịch đúng thứ tự phụ thuộc (topological sort) tự động

---

## 2. Bản Đồ Kế Thừa Repositories

| Repo gốc (Cosmos) | Vị trí Monorepo mới | Scope Package NPM | Mục đích & Phân hệ tương ứng |
|---|---|---|---|
| `cosmos/cosmos-sdk` | `packages/axioledger/cosmos-sdk/` | `@axioledger/cosmos-sdk` | Lõi State Machine, Modules Auth/Bank/Gov/Staking — nền tảng cho Axio-Stateless SVM |
| `cosmos/ibc-go` | `packages/axioledger/ibc-go/` | `@axioledger/ibc-go` | Giao tiếp liên chuỗi IBC (Go), Relayer communication — tích hợp vào `@sequentichain/*` |
| `cosmos/ibc` | `packages/axioledger/ibc/` | `@axioledger/ibc` | Tiêu chuẩn Interchain Standards (ICS specs) — tài liệu kỹ thuật & protocol definitions |
| `cosmos/ibc-contracts` | `packages/axioledger/ibc-contracts/` | `@axioledger/ibc-contracts` | Hợp đồng IBC v2 Solidity/Rust cho EVM Vault — tích hợp vào `@kinetoprotocol/bridge-relayer` |
| `cosmos/iavl` | `packages/axioledger/iavl/` | `@axioledger/iavl` | Cấu trúc cây Merkle IAVL+ phục vụ Merkle Witness O(1) — lõi Data Structures & Ledger State |
| `cosmos/interchain-security` | `packages/axioledger/interchain-security/` | `@axioledger/interchain-security` | Lớp chia sẻ bảo chứng Validator cho `$VPX` — Shared Security Model |
| `cosmos/tokenfactory` | `packages/axioledger/tokenfactory/` | `@axioledger/tokenfactory` | Đúc, quản lý vòng đời và điều tiết 5-Token Suite (`$AXQ`/`$VPX`/`$SQX`/`$KPX`/`$VRQ`) |
| `cosmos/evm` | `packages/axioledger/evm/` | `@axioledger/evm` | Tương thích máy ảo EVM — ZK-EVM Cross-Chain Bridge, tương thích Solidity |
| `cosmos/kms` | `packages/axioledger/kms/` | `@axioledger/kms` | Quản lý khóa HSM/Enclave cho ví AxioPass — Zero Seed Phrase architecture |
| `cosmos/gogoproto` | `packages/axioledger/gogoproto/` | `@axioledger/gogoproto` | Tối ưu hóa serialization Protobuf với độ trễ thấp — phục vụ mục tiêu 600K TPS |
| `cosmos/interchaintest` | `packages/axioledger/interchaintest/` | `@axioledger/interchaintest` | Framework chạy E2E testing đa chuỗi nội bộ — Testnet Phase 0/1 validation |
| `cosmos/rosetta` | `packages/axioledger/rosetta/` | `@axioledger/rosetta` | Chuẩn hóa API dữ liệu block cho sàn giao dịch — Distributed Indexing & Telemetry |

---

## 3. Cấu Trúc Monorepo Tích Hợp

```
Axioledger_Monorepo/
│
├── pnpm-workspace.yaml               # Workspace glob config (tất cả packages)
├── package.json                      # Root — axioledger v2.0.22 engine
├── .npmrc                            # Scoped registry + NTM security
├── go.work                           # Go workspace đa module (10 Go cores)
├── index.js                          # axioledger VDOM Core Engine (1 kB)
├── index.d.ts                        # TypeScript type definitions
│
├── apps/                             # ── Frontend Applications ──
│   ├── wallet-web/                   # AxioPass PWA (WebAuthn + Passkey)
│   ├── exchange-web/                 # Kinetoprotocol DEX
│   └── dao-dashboard/                # DAO Governance Portal
│
├── external/
│   └── cosmos/
│       ├── cometbft/                 # [Go Engine] Consensus engine (CometBFT)
│       ├── cosmos-proto/             # [Proto] Common protobuf definitions
│       ├── cosmos-sdk/               # [Go Engine] Main Cosmos SDK framework
│       ├── cosmwasm/                 # [Rust Core] CosmWasm VM engine
│       ├── gogoproto/                # [Proto] High-performance Protobuf library
│       ├── iavl/                     # [Go Storage] Immutable AVL+ tree
│       ├── ibc-contracts/            # [Solidity/CW] Standard IBC smart contracts
│       ├── ibc-go/                   # [Go Protocol] Inter-Blockchain Communication
│       ├── ics23/                    # [Go/Rust Proofs] Merkle proof verification
│       ├── kms/                      # [Rust Daemon] Key Management Service
│       ├── relayer/                  # [Go Service] IBC Relayer daemon
│       └── wasmd/                    # [Go App] x/wasm Cosmos SDK module
│
├── packages/
│   │
│   ├── axioledger/                   # ── Scope: @axioledger/* ──
│   │   ├── ans-sdk/                  # ANS .axq domain resolution
│   │   ├── wallet-connector/         # WebAuthn + CosmJS + secp256k1
│   │   ├── ui-kit/                   # AXQ Design System + Cosmos Kit
│   │   ├── cli/                      # axio-cli developer tooling
│   │   ├── create-app/               # Project scaffolding
│   │   ├── axioledger-adapter/       # VDOM ↔ AXQ adapter
│   │   │
│   │   ├── cosmos-sdk/               # [Kế thừa] github.com/cosmos/cosmos-sdk
│   │   │   ├── go.mod                # module github.com/axioledger/cosmos-sdk
│   │   │   ├── package.json          # @axioledger/cosmos-sdk v2.0.22
│   │   │   └── x/                   # Modules: auth, bank, gov, staking, ...
│   │   │
│   │   ├── ibc-go/                   # [Kế thừa] github.com/cosmos/ibc-go
│   │   │   ├── go.mod                # module github.com/axioledger/ibc-go
│   │   │   └── package.json          # @axioledger/ibc-go v2.0.22
│   │   │
│   │   ├── ibc/                      # [Kế thừa] github.com/cosmos/ibc
│   │   │   ├── go.mod                # module github.com/axioledger/ibc
│   │   │   └── package.json          # @axioledger/ibc v2.0.22
│   │   │
│   │   ├── ibc-contracts/            # [Kế thừa] github.com/cosmos/ibc-contracts
│   │   │   └── package.json          # @axioledger/ibc-contracts v2.0.22
│   │   │
│   │   ├── iavl/                     # [Kế thừa] github.com/cosmos/iavl
│   │   │   ├── go.mod                # module github.com/axioledger/iavl
│   │   │   └── package.json          # @axioledger/iavl v2.0.22
│   │   │
│   │   ├── interchain-security/      # [Kế thừa] github.com/cosmos/interchain-security
│   │   │   ├── go.mod                # module github.com/axioledger/interchain-security
│   │   │   └── package.json          # @axioledger/interchain-security v2.0.22
│   │   │
│   │   ├── tokenfactory/             # [Kế thừa] github.com/cosmos/tokenfactory
│   │   │   ├── go.mod                # module github.com/axioledger/tokenfactory
│   │   │   └── package.json          # @axioledger/tokenfactory v2.0.22
│   │   │
│   │   ├── evm/                      # [Kế thừa] github.com/cosmos/evm
│   │   │   ├── go.mod                # module github.com/axioledger/evm
│   │   │   └── package.json          # @axioledger/evm v2.0.22
│   │   │
│   │   ├── kms/                      # [Kế thừa] github.com/cosmos/kms
│   │   │   └── package.json          # @axioledger/kms v2.0.22
│   │   │
│   │   ├── gogoproto/                # [Kế thừa] github.com/cosmos/gogoproto
│   │   │   ├── go.mod                # module github.com/axioledger/gogoproto
│   │   │   └── package.json          # @axioledger/gogoproto v2.0.22
│   │   │
│   │   ├── interchaintest/           # [Kế thừa] github.com/cosmos/interchaintest
│   │   │   ├── go.mod                # module github.com/axioledger/interchaintest
│   │   │   └── package.json          # @axioledger/interchaintest v2.0.22
│   │   │
│   │   └── rosetta/                  # [Kế thừa] github.com/cosmos/rosetta
│   │       ├── go.mod                # module github.com/axioledger/rosetta
│   │       └── package.json          # @axioledger/rosetta v2.0.22
│   │
│   ├── valiprecision/                # ── Scope: @valiprecision/* — Token: $VPX ──
│   │   ├── core-daemon/              # P2P node daemon, libp2p transport
│   │   └── reputation-engine/        # Slashing, uptime, validator reputation
│   │
│   ├── sequentichain/                # ── Scope: @sequentichain/* — Token: $SQX ──
│   │   ├── async-task-runner/        # Priority queue, AF_XDP micro-batch
│   │   └── network-stack/            # smoltcp Rust, zero-copy AF_XDP socket
│   │
│   ├── kinetoprotocol/               # ── Scope: @kinetoprotocol/* — Token: $KPX ──
│   │   ├── bridge-relayer/           # ZK-EVM bridge, IBC relayer, escape hatch
│   │   └── clamm-engine/             # CLAMM tick math, LP lifecycle, swap router
│   │
│   └── veraciphers/                  # ── Scope: @veraciphers/* — Token: $VRQ ──
│       ├── circuit-compiler/         # Halo2/PlonKy2 circuit registry
│       └── did-identity-verifier/    # ZK-DID, SBT, MACI anti-collusion
│
├── contracts/
│   └── core/
│       └── escrow/
│           ├── TreasuryEscrowContract.js   # JS simulation
│           └── src/lib.rs                  # Rust SVM contract
│
├── toolchain/
│   ├── build-scripts/                # axio-build (esbuild), generate-proto.sh, telescope.config.ts
│   ├── eslint-config/                # Shared ESLint rules
│   ├── proto/                        # Custom Axioledger Protobuf definitions
│   └── tsconfig/                     # Shared TypeScript baselines
│
├── config/
│   └── genesis.json                  # Phase 0 Testnet genesis parameters
│
├── scripts/
│   ├── migrate-cosmos-cores.sh       # Kịch bản kế thừa 12 repos Cosmos
│   ├── install-cosmos-libs.sh        # Cài đặt 9 nhóm CosmJS / Cosmos Kit NPM
│   ├── check-doc-links.js            # Automated link checker
│   └── setup-wsl.sh                  # WSL1 compatibility setup
│
├── docs/
│   ├── AXIOLEDGER_ROADMAP.md
│   ├── LIBRARY_MAP.md
│   ├── RD_UPDATE_NOTICE.md
│   └── logic/
│       ├── logic.md
│       ├── GENESIS_ALLOCATION.md
│       ├── COSMOS_INTEGRATION.md
│       └── CONTRIBUTION_GROUPS.md
│
└── tests/
    └── escrow/
        └── TreasuryEscrowContract.test.js
```

---

## 4. Quy Chuẩn Cấu Hình Workspace

### `pnpm-workspace.yaml` — Cấu Hình Đầy Đủ

```yaml
packages:
  - "."
  - "apps/*"
  - "packages/**"
  - "packages/axioledger/*"
  - "packages/valiprecision/*"
  - "packages/sequentichain/*"
  - "packages/kinetoprotocol/*"
  - "packages/veraciphers/*"
  - "toolchain/*"
```

### `.npmrc` — Scoped Registry Mapping

```ini
# Tất cả scope Axioledger resolve về NPM public registry
@axioledger:registry     = https://registry.npmjs.org/
@valiprecision:registry  = https://registry.npmjs.org/
@sequentichain:registry  = https://registry.npmjs.org/
@kinetoprotocol:registry = https://registry.npmjs.org/
@veraciphers:registry    = https://registry.npmjs.org/
@hot-labs:registry       = https://registry.npmjs.org/
@cosmjs:registry         = https://registry.npmjs.org/
@cosmos-kit:registry     = https://registry.npmjs.org/

# Bảo mật Supply Chain — NTM (Node Trust Model)
save-exact = true
strict-peer-dependencies = false
```

### Quy Tắc Dependency Cross-Package

```
workspace:*   — Dùng cho tất cả @axioledger/*, @valiprecision/*, @sequentichain/*,
                @kinetoprotocol/*, @veraciphers/* trong nội bộ monorepo.
^x.y.z        — Dùng cho external dependencies (CosmJS, React, hot-labs, ...).
```

---

## 5. Kịch Bản Tự Động Kế Thừa & Chuyển Đổi

> Xem file thực thi đầy đủ: [`scripts/migrate-cosmos-cores.sh`](scripts/migrate-cosmos-cores.sh)

Script thực hiện 5 bước cho mỗi trong 12 repos:

1. **Clone shallow** từ `github.com/cosmos/<repo>` (`--depth 1` tiết kiệm bandwidth)
2. **Xóa `.git`** gốc, khởi tạo git mới với remote trỏ về `github.com/axioledger/<repo>`
3. **Thay thế namespace** `github.com/cosmos/<repo>` → `github.com/axioledger/<repo>` trong tất cả file `.go`, `go.mod`, `go.sum`, `.proto`, `.md`
4. **Tạo/cập nhật `package.json`** với `name: @axioledger/<repo>`, `version: 2.0.22`, `private: true`, trường `files` phù hợp
5. **Commit genesis** với message chuẩn hóa

Sau khi hoàn thành tất cả repos, Node.js inline script quét toàn bộ `package.json` trong workspace và thay thế mọi dependency có prefix `@axioledger/` sang `"workspace:*"`. Cuối cùng chạy `pnpm install --no-frozen-lockfile`.

---

## 6. Chuẩn Hóa Package JSON cho Go Modules & Cấu Hình `go.work`

### Package JSON cho Go Modules thuần

Các repository Go thuần cần `package.json` tối giản để pnpm nhận diện workspace, nhưng phải tránh build toolchain TypeScript quét nhầm file `.go`:

```json
{
  "name": "@axioledger/cosmos-sdk",
  "version": "2.0.22",
  "private": true,
  "main": "index.js",
  "types": "index.d.ts",
  "files": ["index.js", "index.d.ts", "proto", "types"],
  "scripts": {
    "build": "echo 'Go module — build via go build ./...'",
    "test":  "echo 'Go module — test via go test ./...'"
  }
}
```

> Quy tắc chung: `"files"` chỉ liệt kê các thư mục TypeScript/proto binding. Thư mục Go source (`x/`, `modules/`, `cmd/`) **không** đưa vào `files` để tránh npm pack.

### Cấu Hình `go.work` Đa Module

File `go.work` tại gốc monorepo cho phép `go vet`, `go build` và CI/CD pipeline kiểm tra cú pháp chéo giữa tất cả module Go local mà không cần đẩy lên remote `github.com/axioledger/*` trước:

```go
go 1.23.0

use (
    ./external/cosmos/cometbft
    ./external/cosmos/cosmos-proto
    ./external/cosmos/cosmos-sdk
    ./external/cosmos/gogoproto
    ./external/cosmos/iavl
    ./external/cosmos/ibc-go
    ./external/cosmos/ics23
    ./external/cosmos/relayer
    ./external/cosmos/wasmd
    ./packages/axioledger/core-daemon
)
```

> **Lưu ý:** `ibc-contracts` và `kms` không phải Go module thuần (Solidity/Rust), nên không cần liệt kê trong `go.work`.

---

## 7. Hệ Sinh Thái NPM (9 Nhóm Package Cosmos / CosmJS / CosmWasm)

Để kết nối toàn diện giữa hạ tầng Cosmos SDK ở Backend và giao diện Web3 Frontend / Relayer SDK, Axioledger tích hợp 9 nhóm package NPM chuẩn vào Monorepo:

| Group # | Nhóm Thư Viện NPM | Các Package Cốt Lõi | Ứng dụng trong Axioledger Monorepo |
| :---: | :--- | :--- | :--- |
| **G1** | **CosmJS Client Utilities** | `@cosmjs/stargate`<br>`@cosmjs/launchpad`<br>`@cosmjs/encoding` | Dùng trong `@axioledger/wallet-connector` và `@axioledger/sdk` để ký và gửi giao dịch Stargate Msg qua RPC/REST. |
| **G2** | **CosmJS Cryptography & Auth** | `@cosmjs/crypto`<br>`@cosmjs/amino`<br>`@cosmjs/math` | Quản lý khoá Secp256k1/Ed25519, tính toán Gas Price, mã hóa/giải mã WebAuthn passkey credentials. |
| **G3** | **CosmWasm Smart Contracts** | `@cosmjs/cosmwasm-stargate`<br>`@cosmjs/cosmwasm-cli` | Tương tác với Wasm smart contracts trên `@sequentichain/sequencer-node` (x/wasm runtime). |
| **G4** | **IBC & Interchain Utilities** | `@ibc-zone/widget`<br>`@chain-registry/types`<br>`chain-registry` | Tra cứu metadata chuỗi, cấu hình kênh IBC (channels/connections) trong `@kinetoprotocol/bridge-relayer`. |
| **G5** | **Telescope Codegen Suite** | `@cosmology/telescope`<br>`@cosmology/ast`<br>`@cosmology/types` | Tự động sinh mã TypeScript client từ các file Protobuf Cosmos SDK trong `toolchain/build-scripts/`. |
| **G6** | **Cosmos Kit Wallet Adapter** | `@cosmos-kit/core`<br>`@cosmos-kit/react`<br>`@cosmos-kit/keplr` | Tích hợp giao diện kết nối ví đa chuỗi (Keplr, Leap, Cosmostation) vào `@axioledger/ui-kit`. |
| **G7** | **IBC Relayer JS Toolkit** | `@confio/relayer`<br>`@hyperlane-xyz/sdk` | Xây dựng logic Relayer giám sát sự kiện IBC packet event trong `@kinetoprotocol/bridge-relayer`. |
| **G8** | **Testing & Simulation** | `starshipjs`<br>`@cosmjs/tendermint-rpc` | Khởi tạo môi trường Localnet giả lập đa chuỗi (Multi-chain Localnet) để phục vụ Integration Test và Stress Testing 10,000+ TPS. |
| **G9** | **Proto Encoding & Types** | `cosmjs-types`<br>`protobufjs`<br>`long` | Định nghĩa các kiểu cấu trúc Protobuf tĩnh cho giao dịch Axioledger-Stateless SVM. |

### Ánh Xạ Nhóm NPM → Package Axioledger

```
G1 + G2 ──► @axioledger/wallet-connector  (WebAuthn + Stargate signing)
G3      ──► @sequentichain/sequencer-node  (x/wasm CosmWasm runtime)
G4 + G7 ──► @kinetoprotocol/bridge-relayer (IBC channels + packet relay)
G5      ──► toolchain/build-scripts/        (Telescope Protobuf codegen)
G6      ──► @axioledger/ui-kit              (Multi-wallet connect UI)
G8      ──► tests/                          (StarshipJS stress testing)
G9      ──► packages/axioledger/sdk/src/    (Proto type bindings)
```

---

## 8. Lộ Trình Thực Thi 5 Bước (5-Step Execution Roadmap)

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           BƯỚC 1: MIGRATE CORES                                   │
│  Chạy `scripts/migrate-cosmos-cores.sh` để kéo 12 repos Cosmos về external/cosmos/│
└────────────────────────────┬──────────────────────────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           BƯỚC 2: INSTALL NPM LIBS                                │
│  Chạy `scripts/install-cosmos-libs.sh` cài đặt 9 nhóm NPM packages vào Workspaces │
└────────────────────────────┬──────────────────────────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           BƯỚC 3: PROTO CODEGEN                                   │
│  Chạy `toolchain/build-scripts/generate-proto.sh` biên dịch Protobuf → TypeScript │
└────────────────────────────┬──────────────────────────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           BƯỚC 4: LOCALNET INTEGRATION                            │
│  Khởi chạy `go.work` kết hợp `contracts/core/escrow/TreasuryEscrowContract.js`    │
└────────────────────────────┬──────────────────────────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           BƯỚC 5: STRESS TESTING WITH STARSHIPJS                  │
│  Dùng `starshipjs` lập trình giả lập 10,000 TPS cross-chain IBC & Slashing Matrix │
└───────────────────────────────────────────────────────────────────────────────────┘
```

### Chi Tiết Từng Bước

**Bước 1 — Migration:**  
Thực thi script kéo mã nguồn 12 kho lưu trữ Cosmos về thư mục `external/cosmos/`, cấu hình `go.work` tự động nhận diện 10 Go modules.

```bash
chmod +x scripts/migrate-cosmos-cores.sh
./scripts/migrate-cosmos-cores.sh
```

**Bước 2 — Library Setup:**  
Thực thi script cài đặt đầy đủ các thư viện thuộc 9 nhóm NPM ecosystem vào các thư mục package tương ứng.

```bash
chmod +x scripts/install-cosmos-libs.sh
./scripts/install-cosmos-libs.sh
```

**Bước 3 — Code Generation:**  
Chạy `@cosmology/telescope` quét toàn bộ Protobuf definitions để tạo ra TypeScript SDK hoàn chỉnh tại `packages/axioledger/sdk/src/generated`.

```bash
chmod +x toolchain/build-scripts/generate-proto.sh
./toolchain/build-scripts/generate-proto.sh
```

**Bước 4 — Integration:**  
Kiểm tra tích hợp giữa Go backend node, Rust SVM smart contract (`packages/axioledger/contracts/escrow/src/lib.rs`), và TypeScript WebAuthn connector.

```bash
# Kiểm tra Go modules
go work sync
go vet ./external/cosmos/cosmos-sdk/...

# Kiểm tra Rust contract
cargo check --manifest-path packages/axioledger/contracts/escrow/Cargo.toml

# Kiểm tra TypeScript
pnpm --recursive --filter "./packages/axioledger/wallet-connector" run typecheck
pnpm --recursive --filter "./packages/kinetoprotocol/bridge-relayer" run typecheck
```

**Bước 5 — Stress Testing với StarshipJS:**  
Sử dụng `starshipjs` để dựng Localnet Kubernetes/Docker giả lập mạng lưới đa chuỗi, thực hiện Stress Test tải cao (10,000+ TPS), mô phỏng vi phạm Slash Collusion (100%) và kiểm thử quy trình khóa/giải ngân Escrow.

```bash
# Khởi tạo môi trường Starship multi-chain localnet
npx starshipjs@latest start --config tests/starship/starship.yaml

# Chạy stress test cross-chain IBC
npx starshipjs@latest test --file tests/starship/ibc-stress.test.ts

# Kiểm tra Slashing Matrix (100% collusion slash)
npx starshipjs@latest test --file tests/starship/slashing-matrix.test.ts
```

---

## Quy Chuẩn Codegen — Cấu Hình Telescope

Cấu hình `@cosmology/telescope` tại `toolchain/build-scripts/telescope.config.ts`:

- **Nguồn Protobuf:**
  - `external/cosmos/cosmos-sdk/proto`
  - `external/cosmos/ibc-go/proto`
  - `external/cosmos/wasmd/proto`
  - `external/cosmos/cosmos-proto/proto`
  - `toolchain/proto`
- **Xuất tại:** `packages/axioledger/sdk/src/generated`
- **Tùy chọn:** `aminoEncoding.enabled = true` · `lcdClients.enabled = true` · `rpcClients.enabled = true` · `useSDKTypes = true`

---

*Axioledger Foundation — Cosmos Integration Master Plan v2.0 (Genesis Milestone) · Copyright © 2026*
