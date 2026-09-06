# Axioledger Monorepo

> **The Omni-chain Ecosystem powering the next generation of decentralized finance, identity, and compute.**

Built on a **Stateless SVM** core, Axioledger integrates Omni-chain Intents (hot-labs), a Distributed Compute Grid (Golem), a ZK cryptography stack (Halo2/PlonKy2), and a biometric-native wallet — all orchestrated through the lightweight **axioledger v2** UI engine.

---

## Hệ Sinh Thái 5-Token

| Token | Vai Trò | Công Nghệ |
|---|---|---|
| **$AXQ** | Layer-1 Governance & Settlement Asset · Tổng cung 10 nghìn tỷ | Stateless SVM · ANS (.axq) · ZK-EVM Bridge |
| **$VPX** | Validator Network & Slashing Engine | Stateless Verifier Node · Reputation Engine |
| **$SQX** | L2 Sequencer & ZK Batch Prover · 600K TPS | AF_XDP Zero-Copy · ZK-SNARK Aggregator |
| **$KPX** | Liquidity & Cross-chain Concentrated AMM | CLAMM · Smart Order Router |
| **$VRQ** | ZK Cryptography & Identity Layer | Halo2/PlonKy2 · ZK-DID · MACI Anti-Collusion |

---

## Kiến Trúc Tổng Quan

```
APPLICATIONS          PROTOCOL              COMPUTE GRID
─────────────         ────────────          ─────────────
wallet-web            intents-engine        worker-pool
exchange-web    ───►  bridge-relayer  ───►  gpu-executor
craft-portal          market-registry       network-stack
pay-gateway           @hot-labs/omni-sdk    async-task-runner
dao-dashboard

UI ENGINE             CRYPTOGRAPHY          IDENTITY
─────────────         ────────────          ─────────────
axioledger v2 (1kB)     zk-prover-runtime     ANS SDK (.axq)
axioledger-adapter      did-identity-verifier AxioPass Wallet
ui-kit (AXQ DS)       Halo2 / PlonKy2       ZK-DID · MACI
```

---

## Packages trong Monorepo

### @axioledger/* — Core Platform Packages

| Package | Mô tả |
|---|---|
| `@axioledger/ans-sdk` | ANS Domain System — phân giải tên miền `.axq` ra SVM/EVM/ZK-DID/IPFS < 10ms |
| `@axioledger/wallet-connector` | Wrapper chuẩn hóa cho `@hot-labs/near-connect` & `@hot-labs/kit` |
| `@axioledger/axioledger-adapter` | UI Engine Adapter tích hợp axioledger vào AXQ patterns |
| `@axioledger/ui-kit` | Atomic UI Components — AXQ Design System v2.0 |
| `@axioledger/cli` | CLI quản trị Node & SDK |
| `@axioledger/create-app` | DApp Scaffolder Boilerplate |

### @axioledger/* — UI Engine Official Packages

| Package | Mô tả |
|---|---|
| [`@axioledger/dom`](packages/dom) | Inspect DOM, focus và blur |
| [`@axioledger/svg`](packages/svg) | Vẽ SVG bằng plain functions |
| [`@axioledger/html`](packages/html) | Viết HTML bằng plain functions |
| [`@axioledger/time`](packages/time) | Subscribe intervals, lấy thời gian hiện tại |
| [`@axioledger/events`](packages/events) | Subscribe mouse, keyboard, window, frame events |

### Protocol & Infrastructure Packages

| Scope | Packages |
|---|---|
| `@valiprecision/*` | `worker-pool` · `core-daemon` · `reputation-engine` · `node-diagnostics` |
| `@sequentichain/*` | `docker-runtime` · `gpu-executor` · `network-stack` · `async-task-runner` |
| `@kinetoprotocol/*` | `market-registry` · `bridge-relayer` · `intents-engine` · `liquidity-node-docker` |
| `@veraciphers/*` | `zk-prover-runtime` · `did-identity-verifier` · `specs-and-docs` |

---

## Quick Start

### Linux / macOS / WSL 2

```console
# Yêu cầu: Node >= 20, pnpm >= 9
npm install -g pnpm@9

# Cài dependencies toàn workspace
pnpm install

# Chạy dev tất cả apps song song
pnpm dev

# Build toàn bộ packages
pnpm build

# Chạy toàn bộ tests
pnpm test
```

### WSL 1 (Windows Subsystem for Linux — legacy)

> **Lưu ý:** WSL 1 không hỗ trợ `renameat2` (atomic rename). pnpm mặc định
> sẽ thất bại với `ERR_PNPM_EACCES` nếu `node_modules` nằm trên Windows FS.
> Chạy script bootstrap một lần duy nhất sau mỗi lần clone:

```console
# Bước 1 — Cài pnpm nếu chưa có
npm install -g pnpm@9

# Bước 2 — Bootstrap môi trường WSL1 (chỉ cần chạy một lần sau clone)
bash scripts/setup-wsl.sh

# Hoặc dùng npm script sau khi đã có pnpm:
pnpm setup:wsl
```

Script `setup-wsl.sh` tự động thực hiện:
1. Tạo `/tmp/axio-nm` trên **tmpfs** (hỗ trợ rename) và symlink thành `node_modules`
2. Cài `@esbuild/linux-x64` binary đúng phiên bản cho cả root (`0.20.x`) và vite (`0.21.x`)
3. Chạy `pnpm install --ignore-scripts` rồi patch esbuild postinstall thủ công

> **Khi nào cần chạy lại:** sau `git clean -fdx`, sau khi `/tmp` bị xóa
> (reboot), hoặc khi `node_modules` bị xóa thủ công.

### Tích Hợp ANS SDK

```js
import { AnsClient, getDomainKey, namehash } from "@axioledger/ans-sdk"

// Phân giải tên miền .axq → địa chỉ multi-chain (< 10ms)
const client = new AnsClient({ network: "mainnet" })
const record = await client.resolve("alice.axq")
// → { svm: "7Xk...", evm: "0x1a...", did: "did:axq:...", ipfs: "Qm..." }
```

### Khởi Tạo DApp với axioledger

```js
import { app, h, text } from "axioledger"
import { WalletConnect, SwapIntent } from "@axioledger/wallet-connector"

// Mọi state transition đều pure — side effects qua Effects
const SwapIntentAction = (state, intentPayload) => [
  { ...state, loading: true },
  SwapIntent(intentPayload, SwapCompleted),  // effect: gọi @hot-labs/omni-sdk
]

app({
  init: { balance: 0, loading: false },
  view: (state) =>
    h("main", {}, [
      h("p", {}, text(`Balance: ${state.balance} AXQ`)),
      h("button", { onclick: [SwapIntentAction, { from: "AXQ", to: "USDC", amount: 100 }] },
        text("Swap")
      ),
    ]),
  node: document.getElementById("app"),
})
```

---

## Tài Liệu

| Tài liệu | Mô tả |
|---|---|
| [**Master Roadmap**](docs/AXIOLEDGER_ROADMAP.md) | Lộ trình đầy đủ 4 giai đoạn · Tokenomics · Governance |
| [**Design System**](docs/ui/design-system-roadmap.md) | AXQ Variable Token Architecture · Axiopass UI 65+ screens |
| [**Architecture**](docs/architecture/flowchart.md) | axioledger state machine · Actions · Effects · Subscriptions |
| [**API Reference**](docs/reference.md) | `app()` · `h()` · `text()` · `memo()` |
| [**Tutorial**](docs/tutorial.md) | Hướng dẫn bắt đầu |
| [**Logic & Tokenomics**](docs/logic/logic.md) | Sổ cái 32 mục · 32 kịch bản đóng góp · Genesis narrative |

---

## Lộ Trình 4 Giai Đoạn

```
Tháng 1–3   [Phase 1] Chuẩn hóa & Hạ tầng Cốt lõi
              → ANS SDK · StatelessTransaction Spec · ZK-Bridge Spec

Tháng 4–6   [Phase 2] Module Lõi & AxioPass Wallet
              → Stateless SVM · Sequentichain Alpha · AxioPass (zero seed-phrase)

Tháng 7–9   [Phase 3] Testnet · DAO · Validator Network
              → Public Testnet · Axio-Tribunal · ZK-Metrics Oracle

Tháng 10–12 [Phase 4] Mainnet Launch & Ecosystem
              → Genesis Block · ZK-EVM Bridge · RWA Vault · dApp Grants
```

---

## Đóng Góp

Axioledger là hệ sinh thái mã nguồn mở. Xem [docs/logic/logic.md](docs/logic/logic.md) để hiểu **32 cách đóng góp** và nhận token thưởng tương ứng ($AXQ · $VPX · $SQX · $KPX · $VRQ).

---

## Bản Quyền

Copyright © 2026 Axioledger Foundation · [MIT License](LICENSE.md)
