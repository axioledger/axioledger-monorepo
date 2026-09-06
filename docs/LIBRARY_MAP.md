# Axioledger Monorepo — Library Map & Dependency Graph

**Version:** 2.0.22 · **Workspace manager:** pnpm@9  
**Total packages:** 34 · **Total apps:** 6 · **Toolchain:** 3

---

## Directory Tree

```
Axioledger_Monorepo/
│
├── index.js                          # axioledger VDOM Core Engine v2.0.22 (1 kB)
├── index.d.ts                        # TypeScript type definitions
├── package.json                      # Root workspace (axioledger)
├── pnpm-workspace.yaml               # Workspace glob config
├── .npmrc                            # Scoped registry + NTM security
│
├── apps/                             # ── Frontend Applications ──
│   ├── wallet-web/                   # @axioledger/wallet-web      — AxioPass PWA
│   ├── exchange-web/                 # @axioledger/exchange-web    — Kinetoprotocol DEX
│   ├── craft-portal/                 # @axioledger/craft-portal    — Developer Portal
│   ├── pay-gateway/                  # @axioledger/pay-gateway     — Merchant Checkout
│   ├── dao-dashboard/                # @axioledger/dao-dashboard   — DAO Governance
│   └── docs-site/                    # @axioledger/docs-site       — Documentation Site
│
├── packages/
│   │
│   ├── axioledger/                   # ── Scope: @axioledger/* ──
│   │   ├── ans-sdk/                  # @axioledger/ans-sdk         — .axq Name Service SDK
│   │   ├── axioledger-adapter/       # @axioledger/axioledger-adapter — VDOM ↔ AXQ Adapter
│   │   ├── cli/                      # @axioledger/cli             — Developer CLI
│   │   ├── create-app/               # @axioledger/create-app      — Project Scaffolding
│   │   ├── ui-kit/                   # @axioledger/ui-kit          — AXQ Design System
│   │   └── wallet-connector/         # @axioledger/wallet-connector — Web3/WebAuthn Connector
│   │
│   ├── dom/                          # @axioledger/dom             — DOM Renderer Engine
│   ├── events/                       # @axioledger/events          — Event Delegation
│   ├── html/                         # @axioledger/html            — HTML Element Builders
│   ├── svg/                          # @axioledger/svg             — SVG Rendering
│   ├── time/                         # @axioledger/time            — Timer Utilities
│   │
│   ├── valiprecision/                # ── Scope: @valiprecision/* ──
│   │   ├── core-daemon/              # @valiprecision/core-daemon        — P2P Node Daemon
│   │   ├── node-diagnostics/         # @valiprecision/node-diagnostics   — Health Checks
│   │   ├── reputation-engine/        # @valiprecision/reputation-engine  — Slashing & Uptime
│   │   └── worker-pool/              # @valiprecision/worker-pool        — Golem Compute Grid
│   │
│   ├── sequentichain/                # ── Scope: @sequentichain/* ──
│   │   ├── async-task-runner/        # @sequentichain/async-task-runner  — Micro-batch Executor
│   │   ├── da-layer/                 # @sequentichain/da-layer           — Data Availability
│   │   ├── docker-runtime/           # @sequentichain/docker-runtime     — Container Runtime 🐳
│   │   ├── gpu-executor/             # @sequentichain/gpu-executor       — GPU Compute Fleet
│   │   ├── network-stack/            # @sequentichain/network-stack      — AF_XDP Zero-Copy
│   │   ├── sequencer-node/           # @sequentichain/sequencer-node     — L2 Sequencer
│   │   └── zk-batcher/               # @sequentichain/zk-batcher         — ZK Batch Aggregator
│   │
│   ├── kinetoprotocol/               # ── Scope: @kinetoprotocol/* ──
│   │   ├── bridge-relayer/           # @kinetoprotocol/bridge-relayer          — ZK-EVM Bridge
│   │   ├── clamm-engine/             # @kinetoprotocol/clamm-engine            — CLAMM AMM
│   │   ├── intents-engine/           # @kinetoprotocol/intents-engine          — NEAR Intents
│   │   ├── liquidity-node-docker/    # @kinetoprotocol/liquidity-node-docker   — LP Node 🐳
│   │   └── market-registry/          # @kinetoprotocol/market-registry         — Pool Registry
│   │
│   └── veraciphers/                  # ── Scope: @veraciphers/* ──
│       ├── circuit-compiler/         # @veraciphers/circuit-compiler       — Halo2/PlonKy2 Circuits
│       ├── did-identity-verifier/    # @veraciphers/did-identity-verifier  — ZK-DID + MACI
│       ├── on-chain-verifier/        # @veraciphers/on-chain-verifier      — SVM Proof Verifier
│       ├── proof-aggregator/         # @veraciphers/proof-aggregator       — Recursive Folding
│       ├── specs-and-docs/           # @veraciphers/specs-and-docs         — ZK Architecture Docs
│       └── zk-prover-runtime/        # @veraciphers/zk-prover-runtime      — GPU Prover Service 🐳
│
├── toolchain/                        # ── Build Toolchain ──
│   ├── build-scripts/                # @axioledger/build-scripts  — axio-build (esbuild)
│   ├── eslint-config/                # @axioledger/eslint-config  — Shared ESLint Rules
│   └── tsconfig/                     # @axioledger/tsconfig       — Shared TS Baselines
│
├── .github/workflows/
│   ├── ci-test.yml                   # Push/PR: test + typecheck + lint + build
│   ├── publish-npm-scopes.yml        # Tag: publish all 5 scopes to NPM
│   └── publish-docker.yml            # Tag: build & push 3 Docker images to GHCR
│
├── docs/
│   ├── AXIOLEDGER_ROADMAP.md
│   ├── logic/logic.md                # Genesis Architecture & Tokenomics Spec
│   ├── architecture/                 # axioledger VDOM — actions/effects/state/views/...
│   ├── api/                          # h() · text() · app() · memo()
│   ├── ui/                           # DESIGN_SYSTEM.md · design-system-roadmap.md
│   ├── asset/                        # Icon system (Bold + Linear SVGs)
│   ├── reference.md
│   └── tutorial.md
│
└── scripts/
    └── setup-wsl.sh                  # WSL1 esbuild / pnpm compatibility setup
```

---

## Package Dependency Graph

> Arrows show `workspace:*` production + dev dependencies between packages.
> Toolchain deps (@axioledger/build-scripts, @axioledger/tsconfig, @axioledger/eslint-config) are omitted — they apply to all packages.

```
════════════════════════════════════════════════════════════
  AXIOLEDGER CORE ENGINE  (root)
════════════════════════════════════════════════════════════
  axioledger (index.js v2.0.22)
      │
      ├──► @axioledger/dom
      ├──► @axioledger/events
      ├──► @axioledger/html
      ├──► @axioledger/svg
      └──► @axioledger/time

════════════════════════════════════════════════════════════
  @axioledger/* — Application Layer SDK
════════════════════════════════════════════════════════════
  @axioledger/axioledger-adapter ──────────────► axioledger (core)
  @axioledger/ans-sdk             (standalone)
  @axioledger/wallet-connector    (standalone)
  @axioledger/ui-kit              (standalone)
  @axioledger/cli                 (standalone)
  @axioledger/create-app          (standalone)

════════════════════════════════════════════════════════════
  @valiprecision/* — Validator Network
════════════════════════════════════════════════════════════
  @valiprecision/core-daemon      (standalone)
      │
      ├──◄── @valiprecision/node-diagnostics
      └──◄── @valiprecision/reputation-engine

  @valiprecision/worker-pool      (standalone)

════════════════════════════════════════════════════════════
  @sequentichain/* — L2 Execution & Network
════════════════════════════════════════════════════════════
  @sequentichain/async-task-runner   (standalone)
      │
      ├──◄── @sequentichain/sequencer-node
      │          └──◄── @sequentichain/docker-runtime 🐳
      │
      ├──◄── @sequentichain/zk-batcher
      └──◄── @sequentichain/gpu-executor ──► @veraciphers/circuit-compiler

  @sequentichain/da-layer            (standalone)
  @sequentichain/network-stack       (standalone)

════════════════════════════════════════════════════════════
  @kinetoprotocol/* — DeFi & Liquidity
════════════════════════════════════════════════════════════
  @kinetoprotocol/clamm-engine       (standalone)
  @kinetoprotocol/market-registry    (standalone)
  @kinetoprotocol/intents-engine     (standalone)

  @kinetoprotocol/bridge-relayer ──► @kinetoprotocol/clamm-engine

  @kinetoprotocol/liquidity-node-docker 🐳
      ├──► @kinetoprotocol/clamm-engine
      ├──► @kinetoprotocol/market-registry
      └──► @kinetoprotocol/intents-engine

════════════════════════════════════════════════════════════
  @veraciphers/* — ZK Cryptography Layer
════════════════════════════════════════════════════════════
  @veraciphers/circuit-compiler      (standalone)  ◄── FOUNDATION
      │
      ├──◄── @veraciphers/on-chain-verifier
      │          └──◄── @veraciphers/did-identity-verifier
      │
      ├──◄── @veraciphers/proof-aggregator
      └──◄── @veraciphers/zk-prover-runtime 🐳

  @veraciphers/did-identity-verifier
      ├──► @veraciphers/circuit-compiler
      └──► @veraciphers/on-chain-verifier

  @veraciphers/specs-and-docs        (docs only)

════════════════════════════════════════════════════════════
  apps/* — Frontend Applications
════════════════════════════════════════════════════════════
  @axioledger/wallet-web
      ├──► axioledger (core)
      ├──► @axioledger/axioledger-adapter
      ├──► @axioledger/ui-kit
      ├──► @axioledger/wallet-connector
      └──► @axioledger/ans-sdk

  @axioledger/exchange-web
      ├──► axioledger (core)
      ├──► @axioledger/axioledger-adapter
      ├──► @axioledger/ui-kit
      ├──► @axioledger/wallet-connector
      ├──► @kinetoprotocol/intents-engine
      └──► @kinetoprotocol/market-registry

  @axioledger/craft-portal
      ├──► axioledger (core)
      ├──► @axioledger/axioledger-adapter
      ├──► @axioledger/ui-kit
      ├──► @axioledger/wallet-connector
      └──► @axioledger/ans-sdk

  @axioledger/pay-gateway
      ├──► axioledger (core)
      ├──► @axioledger/axioledger-adapter
      ├──► @axioledger/ui-kit
      ├──► @axioledger/wallet-connector
      └──► @axioledger/ans-sdk

  @axioledger/dao-dashboard
      ├──► axioledger (core)
      ├──► @axioledger/axioledger-adapter
      ├──► @axioledger/ui-kit
      └──► @axioledger/wallet-connector

  @axioledger/docs-site
      ├──► axioledger (core)
      ├──► @axioledger/ui-kit
      └──► @axioledger/html
```

---

## Package Reference Table

### Core VDOM Engine

| Package | Version | Path | Description |
|---------|---------|------|-------------|
| `axioledger` | `2.0.22` | `./index.js` | 1 kB VDOM engine: `h()` `text()` `app()` `memo()` |
| `@axioledger/dom` | `1.0.0` | `packages/dom/` | DOM inspect, focus/blur |
| `@axioledger/events` | `2.0.0` | `packages/events/` | Mouse, keyboard, window, frame subscriptions |
| `@axioledger/html` | `2.0.0` | `packages/html/` | HTML element builder functions |
| `@axioledger/svg` | `2.0.0` | `packages/svg/` | SVG drawing with plain functions |
| `@axioledger/time` | `2.0.0` | `packages/time/` | Reactive timer/interval subscriptions |

### @axioledger/* — Application SDK

| Package | Version | Path | Description |
|---------|---------|------|-------------|
| `@axioledger/ans-sdk` | `1.0.0` | `packages/axioledger/ans-sdk/` | `.axq` domain registration, resolution, PDA derivation |
| `@axioledger/axioledger-adapter` | `1.0.0` | `packages/axioledger/axioledger-adapter/` | Bridges axioledger VDOM actions → blockchain effects |
| `@axioledger/cli` | `1.0.0` | `packages/axioledger/cli/` | Developer CLI — node management, scaffolding |
| `@axioledger/create-app` | `1.0.0` | `packages/axioledger/create-app/` | `pnpm create axioledger-app` scaffolding tool |
| `@axioledger/ui-kit` | `1.0.0` | `packages/axioledger/ui-kit/` | AXQ Design System — 100+ atomic React components |
| `@axioledger/wallet-connector` | `1.0.0` | `packages/axioledger/wallet-connector/` | WebAuthn Passkey + multi-chain wallet session |

### @valiprecision/* — Validator Network ($VPX)

| Package | Version | Path | Description |
|---------|---------|------|-------------|
| `@valiprecision/core-daemon` | `1.0.0` | `packages/valiprecision/core-daemon/` | P2P node daemon, peer manager, libp2p transport |
| `@valiprecision/node-diagnostics` | `1.0.0` | `packages/valiprecision/node-diagnostics/` | Pre-flight health checks, Prometheus metrics export |
| `@valiprecision/reputation-engine` | `1.0.0` | `packages/valiprecision/reputation-engine/` | Slashing, uptime scoring, validator reputation |
| `@valiprecision/worker-pool` | `1.0.0` | `packages/valiprecision/worker-pool/` | Golem Factory distributed compute grid management |

### @sequentichain/* — L2 Scaling ($SQX)

| Package | Version | Path | Description |
|---------|---------|------|-------------|
| `@sequentichain/async-task-runner` | `1.0.0` | `packages/sequentichain/async-task-runner/` | Priority queue + worker pool + exponential backoff |
| `@sequentichain/da-layer` | `1.0.0` | `packages/sequentichain/da-layer/` | Blob store, erasure coding, DAS, Celestia/EigenDA adapter |
| `@sequentichain/docker-runtime` 🐳 | `1.0.0` | `packages/sequentichain/docker-runtime/` | Containerized L2 sequencer with HTTP health server |
| `@sequentichain/gpu-executor` | `1.0.0` | `packages/sequentichain/gpu-executor/` | GPU cluster fleet manager for ZK proof jobs |
| `@sequentichain/network-stack` | `1.0.0` | `packages/sequentichain/network-stack/` | AF_XDP zero-copy socket, peer table, packet router |
| `@sequentichain/sequencer-node` | `1.0.0` | `packages/sequentichain/sequencer-node/` | FIFO fair-ordering queue, batch sealing (anti-MEV) |
| `@sequentichain/zk-batcher` | `1.0.0` | `packages/sequentichain/zk-batcher/` | L2 state transitions → ZK-SNARK BatchCommitment |

### @kinetoprotocol/* — DeFi & Liquidity ($KPX)

| Package | Version | Path | Description |
|---------|---------|------|-------------|
| `@kinetoprotocol/bridge-relayer` | `1.0.0` | `packages/kinetoprotocol/bridge-relayer/` | ZK-EVM lock/mint, cross-chain relay, escape hatch |
| `@kinetoprotocol/clamm-engine` | `1.0.0` | `packages/kinetoprotocol/clamm-engine/` | CLAMM tick math (Q64.96), LP position lifecycle, swap router |
| `@kinetoprotocol/intents-engine` | `1.0.0` | `packages/kinetoprotocol/intents-engine/` | NEAR Intents solver — swap/bridge/limit-order intents |
| `@kinetoprotocol/liquidity-node-docker` 🐳 | `1.0.0` | `packages/kinetoprotocol/liquidity-node-docker/` | Dockerized LP node — auto-rebalancer + bribe aggregator |
| `@kinetoprotocol/market-registry` | `1.0.0` | `packages/kinetoprotocol/market-registry/` | Liquidity pool registry, token pairs, fee tiers |

### @veraciphers/* — ZK Cryptography ($VRQ)

| Package | Version | Path | Description |
|---------|---------|------|-------------|
| `@veraciphers/circuit-compiler` | `1.0.0` | `packages/veraciphers/circuit-compiler/` | Halo2/PlonKy2 circuit registry, witness builder, prover client |
| `@veraciphers/did-identity-verifier` | `1.0.0` | `packages/veraciphers/did-identity-verifier/` | ZK-DID, SBT issuance, selective disclosure, MACI voting |
| `@veraciphers/on-chain-verifier` | `1.0.0` | `packages/veraciphers/on-chain-verifier/` | SVM instruction builder, VKey registry, proof verification |
| `@veraciphers/proof-aggregator` | `1.0.0` | `packages/veraciphers/proof-aggregator/` | Recursive proof folding (Halo2 accumulator / PlonKy2) |
| `@veraciphers/specs-and-docs` | `—` | `packages/veraciphers/specs-and-docs/` | ZK architecture specs — ZK_ARCHITECTURE.md |
| `@veraciphers/zk-prover-runtime` 🐳 | `1.0.0` | `packages/veraciphers/zk-prover-runtime/` | HTTP/gRPC prover service, NVIDIA CUDA Docker image |

### apps/* — Frontend Applications

| App | Package | Path | Stack | Description |
|-----|---------|------|-------|-------------|
| AxioPass Wallet | `@axioledger/wallet-web` | `apps/wallet-web/` | React + Vite | WebAuthn PWA — multi-chain balance, transfers |
| Kinetoprotocol Exchange | `@axioledger/exchange-web` | `apps/exchange-web/` | React + Vite | DEX — CLAMM swaps, veKPX governance |
| Craft Portal | `@axioledger/craft-portal` | `apps/craft-portal/` | React + Vite | Developer portal, SDK playground |
| Pay Gateway | `@axioledger/pay-gateway` | `apps/pay-gateway/` | React + Vite | Enterprise merchant checkout |
| DAO Dashboard | `@axioledger/dao-dashboard` | `apps/dao-dashboard/` | React + Vite | Dual-chamber governance, Axio-Tribunal |
| Docs Site | `@axioledger/docs-site` | `apps/docs-site/` | React + Vite | Developer documentation |

### toolchain/* — Build Toolchain

| Package | Path | Description |
|---------|------|-------------|
| `@axioledger/build-scripts` | `toolchain/build-scripts/` | `axio-build` CLI — esbuild dual CJS/ESM bundler |
| `@axioledger/eslint-config` | `toolchain/eslint-config/` | Shared ESLint + TypeScript-ESLint rules |
| `@axioledger/tsconfig` | `toolchain/tsconfig/` | `base.json`, `library.json`, `nextjs.json` |

---

## Docker Images

| Image | Build Context | Docker Compose |
|-------|--------------|----------------|
| `axioledger/sequencer` | `packages/sequentichain/docker-runtime/` | `docker-runtime/docker-compose.yml` |
| `axioledger/validator` | `packages/valiprecision/core-daemon/` | — |
| `axioledger/zk-prover` | `packages/veraciphers/zk-prover-runtime/` | `zk-prover-runtime/` (embedded) |
| `axioledger/liquidity-node` | `packages/kinetoprotocol/liquidity-node-docker/` | `liquidity-node-docker/docker-compose.yml` |

> 🐳 = package includes a `Dockerfile` and optionally `docker-compose.yml`

---

## CI/CD Pipelines

| Workflow | Trigger | Actions |
|----------|---------|---------|
| `ci-test.yml` | push/PR → `main`, `develop` | typecheck → lint → build → test → coverage upload |
| `publish-npm-scopes.yml` | tag `v*` | build → test → publish 5 scopes to NPM with provenance |
| `publish-docker.yml` | tag `v*` | build & push `sequencer`, `validator`, `zk-prover` to GHCR |

---

## Scope Registry Mapping

```ini
# .npmrc — all scopes resolve to the public NPM registry
@axioledger:registry     = https://registry.npmjs.org/
@valiprecision:registry  = https://registry.npmjs.org/
@sequentichain:registry  = https://registry.npmjs.org/
@kinetoprotocol:registry = https://registry.npmjs.org/
@veraciphers:registry    = https://registry.npmjs.org/
@hot-labs:registry       = https://registry.npmjs.org/
```

---

## Package Count Summary

| Scope | Count |
|-------|-------|
| `axioledger` (core + sub-packages) | 6 + 5 primitives = **11** |
| `@valiprecision/*` | **4** |
| `@sequentichain/*` | **7** |
| `@kinetoprotocol/*` | **5** |
| `@veraciphers/*` | **6** |
| `apps/*` | **6** |
| `toolchain/*` | **3** |
| **Total** | **42** |

---

*Axioledger Monorepo Library Map — auto-generated · v2.0.22 · Copyright © 2026 Axioledger Foundation*
