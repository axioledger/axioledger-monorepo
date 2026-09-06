# Axioledger Reference

Complete technical reference for the **Axioledger Monorepo** — a Layer-1/Layer-2 Blockchain Ecosystem with AxioPass Wallet, built on a axioledger v2 VDOM engine.

> **Quick links:** [Roadmap](AXIOLEDGER_ROADMAP.md) · [Design System](ui/DESIGN_SYSTEM.md) · [Icon System](asset/ICON_SYSTEM.md) · [Component Inventory](ui/COMPONENT_INVENTORY.md) · [Draft Analysis](logic/draft/DRAFT_ANALYSIS.md) · [Logic / Tokenomics](logic/logic.md) · [Genesis Allocation](logic/GENESIS_ALLOCATION.md) · [Cosmos Integration](logic/COSMOS_INTEGRATION.md) · [Contribution Groups](logic/CONTRIBUTION_GROUPS.md)

---

## API

| Function | Signature | Description |
| -------- | --------- | ----------- |
| [`h()`](api/h.md) | `(tag, props, children?) → VNode` | Creates a virtual DOM node. Foundation of all AXQ Design System components. |
| [`text()`](api/text.md) | `(String\|Number) → VNode` | Creates a text VNode. **Always pass token amounts as `string`.** |
| [`app()`](api/app.md) | `({ init, view, node, subscriptions?, dispatch? }) → DispatchFn` | Initializes and mounts the AxioPass DApp. |
| [`memo()`](api/memo.md) | `(View, IndexableData) → VNode` | Memoizes expensive view components (price charts, tx lists). |

---

## Architecture

| Module | Description |
| ------ | ----------- |
| [State](architecture/state.md) | Zone-sliced app state, StatelessTransaction shape, 5-token balances as `string`. |
| [Views](architecture/views.md) | Screen router FSM, AXQ component token mapping, WCAG 2.1 AA, EmptyState. |
| [Actions](architecture/actions.md) | AxioPass auth chain, SwapIntent, Bridge actions, error recovery/retry. |
| [Effects](architecture/effects.md) | 11 effects — broadcastStatelessTx, paymasterSponsor, saveSession, lockAssetsOnL2, +more. |
| [Subscriptions](architecture/subscriptions.md) | 9 subscriptions — WebAuthn, L2 health, DAO countdown, ANS watcher, +more. |
| [Dispatch](architecture/dispatch.md) | 7 middlewares — KYC gate, perf tracer, state mutation guard, composeMiddleware. |
| [Flowcharts](architecture/flowchart.md) | 7 diagrams: core data flow, auth FSM, cross-chain tx, ZK-KYC, tokenomics, screen router, DAO governance. |

---

## Packages

| Package | Description |
| ------- | ----------- |
| [`@axioledger/dom`](../packages/dom/README.md) | DOM effects — focus trap modal, scroll-to-top, KYC camera inspection. |
| [`@axioledger/events`](../packages/events/README.md) | Event subscriptions — WebAuthn bridge, deep link handler, swipe gesture onboarding. |
| [`@axioledger/html`](../packages/html/README.md) | HTML components — TxReceiptView, PINPadView (6-dot + numpad), ToastView. |
| [`@axioledger/svg`](../packages/svg/README.md) | SVG charts — Cashback line chart, QR code, Staking APY bars, price sparkline. |
| [`@axioledger/time`](../packages/time/README.md) | Time effects — adaptive polling, ZK-Metrics circuit breaker, DCA scheduler, loading timeout. |

---

## Design & UI

| Resource | Description |
| -------- | ----------- |
| [DESIGN_SYSTEM.md](ui/DESIGN_SYSTEM.md) | v2.1 — Full 3-layer token system (Primitive → Semantic → Component), CSS output, Figma JSON, 65+ AxioPass screen specs. |
| [design-system-roadmap.md](ui/design-system-roadmap.md) | Quick reference entry-point with icon summary and token table. |
| [COMPONENT_INVENTORY.md](ui/COMPONENT_INVENTORY.md) | 201 components across 15 groups — AXQ tokens, zone mapping, status, priority. |
| [ICON_SYSTEM.md](asset/ICON_SYSTEM.md) | 1898 SVG icons (979 bold + 919 linear) — 8 categories, Bold/Linear rules, zone→icon mapping. |
| [DRAFT_ANALYSIS.md](logic/draft/DRAFT_ANALYSIS.md) | Screen-by-screen analysis of 37 Cashie UI Kit PNGs — color palette, typography, patterns. |

---

## Tokenomics & Logic

| Resource | Description |
| -------- | ----------- |
| [logic.md](logic/logic.md) | **Source of truth** — Genesis narrative, 10T $AXQ tokenomics, 32-item ledger, 32 contribution scenarios. |
| [AXIOLEDGER_ROADMAP.md](AXIOLEDGER_ROADMAP.md) | 15-chapter master roadmap — L1 mainnet → L2 → DeFi → DAO → Ecosystem expansion → Genesis Phasing → Contribution Process. |
| [GENESIS_ALLOCATION.md](logic/GENESIS_ALLOCATION.md) | **TreasuryEscrowContract** spec (Rust), **ZK-Jury** slashing matrix, 5-Token vesting schedule, Node & Developer Quickstart Handbooks. |
| [COSMOS_INTEGRATION.md](logic/COSMOS_INTEGRATION.md) | Repository inheritance map — `@cosmos` → Axioledger 32-Module Master Ledger (cosmos-sdk, ibc, tokenfactory, rosetta, …). |
| [CONTRIBUTION_GROUPS.md](logic/CONTRIBUTION_GROUPS.md) | 6 contributor role groups (Dev / Nodes / Enterprise / LPs / Governance / End-Users) with reward token breakdown. |

---

## Glossary

### Core axioledger Terms

- **Action** — An app behavior that transitions state and invokes effects. Pure function: `(state, payload?) → newState | [newState, ...effects]`.
- **Action Descriptor** — A tuple `[Action, payload]` representing an action with its payload.
- **Component** — A view with a specific purpose, encapsulating a fragment of the VNode tree.
- **Dispatch Function** — The engine that executes actions, applies state, and calls effects.
- **Dispatch Initializer** — A function that wraps and controls the dispatch function (middleware pattern).
- **Effect** — A generalized encapsulation of an external process: `[effecter, options]` tuple.
- **Effecter** — A function `(dispatch, options) → void` that carries out an effect.
- **Event Payload** — A payload specific to a DOM event, auto-provided when an action is bound without a payload descriptor.
- **Memoization** — In axioledger, the delayed rendering of VNodes via `memo()` based on data change detection.
- **Mount Node** — The DOM element replaced by the axioledger application on `app()` call.
- **Payload** — Data given to an action as its second argument.
- **State** — The unified set of data the Axioledger DApp uses and maintains.
- **State Transition** — An evolutionary step for the state produced by an action.
- **Subscriber** — A function `(dispatch, options) → cleanupFn` that carries out a subscription.
- **Subscription** — A binding between the app and external events: `[subscriber, options]` tuple.
- **Top-Level View** — The main view function (`ScreenRouter`) given the full state.
- **VDOM** — Virtual DOM — an in-memory representation of the current UI tree, diffed against the real DOM.
- **View** — A function describing desired DOM as a VNode tree, as a function of the current state.
- **Wrapped Action** — An action returned by another action, delegating dispatch to a different action.

---

### Axioledger-Specific Terms

- **$AXQ** — Primary governance and payment token. Total supply: `"10000000000000"` (10 trillion, stored as `string`).
- **$VPX** — Valiprecision validator staking token. 15% supply. Earned by running validator nodes.
- **$SQX** — Sequentichain gas and sequencer token. 10% supply. Powers L2 transaction ordering.
- **$KPX** — Kinetoprotocol liquidity provision token. 35% supply. Earned by providing CLAMM liquidity.
- **$VRQ** — Veraciphers ZK proof fee token. 15% supply. Paid to prover clusters for ZK circuit execution.
- **$veKPX** — Vote-escrowed KPX. Locked 1–4 years for governance weight and fee dividends.
- **ANS** — Axio Name Service. `.axq` top-level domain for human-readable wallet addresses (`alice.axq`).
- **AxioPass** — The mobile wallet app (iOS 375×812, 8px grid, Neubrutal style). 5-tab bottom navbar: Home · Crypto · Card · Cashback · More.
- **Axio-Tribunal** — Decentralized dispute resolution system with VRF-selected ZK jury.
- **Axio-Stateless SVM** — Stateless Sealevel Virtual Machine. Users carry Merkle Witnesses; validators stay lightweight (4C/8GB).
- **Bridge (ZK-EVM)** — Lock-and-mint cross-chain bridge between EVM chains and Axioledger L1, secured by ZK storage proofs.
- **DA (Data Availability)** — Blob transaction layer for transient state; uses Erasure Coding + DAS.
- **Deflationary Mechanics** — Buyback & burn: 50% of L2 gas fees + 0.1% Kinetoprotocol swap fees + 0.1–0.5% SDK royalties.
- **Escape Hatch** — Emergency L1 fallback liquidation mechanism if L2 sequencer fails.
- **Genesis Block** — The origin block establishing 10T $AXQ supply in public escrow smart contracts.
- **KYC Gate** — Middleware that blocks sensitive actions (`transfer`, `swap`, `stake`) if ZK-DID KYC is not verified.
- **MACI** — Minimum Anti-Collusion Infrastructure. Encrypted vote submission for bribery-resistant governance.
- **Merkle Witness** — Per-user state proof enabling stateless verification without full node storage.
- **Paymaster** — Fee Abstraction Protocol. dApp-sponsored gas; lets Web2 users transact without holding gas tokens.
- **Proof-of-Lock** — Mechanism to mint utility sub-tokens ($VPX, $SQX, $KPX, $VRQ) by locking $AXQ.
- **RWA** — Real World Asset. Tokenized off-chain assets (bonds, real estate, gold) brought on-chain.
- **Sequentichain** — The L2 execution layer. Uses AF_XDP Zero-Copy sockets for sub-millisecond latency.
- **SBT** — Soulbound Token. Non-transferable identity badge issued by the ZK-DID system after KYC.
- **StatelessTransaction** — A transaction that includes the user's Merkle Witness, allowing validation without full state storage.
- **Treasury DAO** — 25% supply reserve; auto-disbursed via ZK-Metrics Coprocessor Oracle based on on-chain KPIs.
- **Veraciphers** — The ZK proof infrastructure. Uses Halo2 / PlonKy2 circuits with GPU/FPGA prover clusters.
- **WebAuthn / Passkey** — FIDO2 standard used by AxioPass for passwordless wallet authentication with P-256 keys.
- **ZK-DID** — Zero-Knowledge Decentralized Identity. Selective disclosure KYC without exposing raw personal data.
- **ZK-Metrics Coprocessor** — Off-chain analytics oracle that generates ZK proofs of on-chain KPIs to trigger Treasury disbursement.
- **ZK-SNARK** — Zero-Knowledge Succinct Non-Interactive Argument of Knowledge. Used for L2 state commitment proofs.

---

## AXQ Design System Quick Reference

### Font
`Work Sans` — 400 Regular, 500 Medium, 600 SemiBold, 700 Bold

### Brand Colors

| Token              | Value       | Usage                          |
| ------------------ | ----------- | ------------------------------ |
| `color.brand.teal` | `#49DBC8`   | Primary — Home, Crypto, CTA    |
| `color.brand.black`| `#000000`   | Text, active nav, pill buttons |
| `color.brand.green`| `#BEFF6C`   | Cashback zone accent           |
| `color.brand.purple`| `#AF96FB`  | Card zone accent               |
| `color.brand.pink` | `#FD9FDD`   | Alerts, highlight accent       |

> Kit color mapping: Cashie "Blue" = teal, "Greeny" = green, "Magenta" = pink, "Violet" = purple.

### 5-Tab Bottom Navbar

```
[ Home ]  [ Crypto ]  [ Card ]  [ Cashback ]  [ More ]
```

- **Active tab:** Bold icon + brand teal label
- **Inactive tab:** Linear icon + muted grey label
- **Security:** OTP = 6 digits · PIN = 6 dots (not 4)

### Icon Library

- **Location:** `docs/asset/icon/bold/` (979) + `docs/asset/icon/linear/` (919)
- **Format:** SVG, 24×24px, fill `#101426`
- **Rule:** Bold = active/selected · Linear = default/inactive

---

## Token Amount Safety Rule

> **Always store and render token amounts as `string`.** The 10T $AXQ total supply (`10000000000000`) exceeds JavaScript's `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991). All 5 token balances in state must be strings.

```js
// ✅ Correct
const wallet = { axq: "5000000000000", vpx: "0", sqx: "100", kpx: "250", vrq: "0" }

// ❌ Incorrect — will lose precision
const wallet = { axq: 5000000000000 }  // → 5000000000000 (may corrupt for larger values)
```
