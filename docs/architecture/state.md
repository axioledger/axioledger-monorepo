# State

**_Definition:_**

> The **state** of your axioledger application is the unified set of data that your [views](views.md), [actions](actions.md), and [subscriptions](subscriptions.md) all have access to.

axioledger by design offers no strong opinion about how your state should be structured aside from it being unified. This means [components](views.md#components) don't technically possess their own local state but that also means they have direct access to any part of the entire state they need. The user is entrusted with shaping things beyond that.

---

## Assignment

When you initially create your app instance with [`app()`](../api/app.md) you get to setup your state with the [`init:`](../api/app.md#init) property. Since it's possible to have several different app instances [active simultaneously](../api/app.md#multiple-apps) it's important to know that each app retains its own separate state.

### State Transitions

Aside from the aforementioned [`init:`](../api/app.md#init) property the only way to affect state is by changing it through the use of [actions](actions.md).

## State With Effects

If you use an array to set the state axioledger will interpret this as a special array where the first entry is the state and if there are more entries they will be [effects](effects.md) that need to be run.

So, axioledger will apply the state first and then will run the effects in the order they appear.

```js
[state, log(state), log("MOAR")]
```

### Array State

If you actually do want to use an array as your state you'll have to wrap it within an effectful state array to make it work.

```js
[["a", "b", "c"]]
```

The actions page also [talks about it](actions.md#transitioning-array-state).

---

## Visualization

The primary [view](views.md) of your app, as set by the [`view:`](../api/app.md#view) property of [`app()`](../api/app.md), will receive the current state for it to use to determine what gets rendered. Any changes to the state are automatically reflected there as well.

---

## Other Considerations

### Serializability

While you can put anything you want in the state we recommend avoiding things that are unserializable such as symbols, functions, and recursive references. This helps to ensure compatibility with things like saving to persistent local storage, or using other tools especially ones that are potentially axioledger-specific.

### State Type

You can of course choose to make your state some basic type such as a string or number. However, it's recommended to use an object because of the expressivity it gives you in defining your state shape.

### Direct Mutation

Since we are ultimately using JavaScript you can technically edit parts of the state mutably. However, state changes should be thought of in terms of snapshots: New versions of the state get created to reflect the changes made at a certain moment in time. This perspective naturally calls for immutability.

Fresh new state should be returned from an [action](actions.md). If an action returns nothing your app will [stop](actions.md#stopping-your-app). If you mutate the current state and return it you are returning the same object reference as the state was earlier. axioledger cannot tell from this that any changes have occurred. Hence the action will do nothing.

---

## Axioledger — State Design Patterns

> Phần này mở rộng khái niệm State của axioledger sang kiến trúc thực tế của **Axioledger DApp ecosystem**.

### StatelessTransaction — Cấu Trúc State Giao Dịch

Axioledger áp dụng mô hình **Stateless SVM**: các Validator Node không lưu toàn bộ lịch sử sổ cái mà chỉ cần `State Root` + `Merkle Witness` để xác minh tính hợp lệ của giao dịch.

```
StatelessTransaction {
    TransactionPayload     ← Dữ liệu giao dịch thực tế
    ZkAuthProof            ← P-256 WebAuthn (AxioPass Secure Enclave)
    MerkleWitness          ← State proof (bơm bởi $SQX Sequencer)
}
```

**Client-side (AxioPass):** Sinh khóa P-256 qua WebAuthn + đóng gói `zk_auth_proof`  
**Network-side ($SQX Sequencer):** Tra cứu Access List + bơm `state_witness` vào gói giao dịch  
**Escape Hatch:** AxioPass rút Merkle Witness từ L1 Indexer khi L2 gặp sự cố

### Shape State cho Axioledger DApp

Một DApp Axioledger điển hình có cấu trúc state như sau:

```js
// Khởi tạo state cho Axiopass Wallet DApp
app({
  init: {
    // Identity & Auth
    wallet: null,           // AxioPass wallet instance
    passkey: null,          // WebAuthn credential
    identity: null,         // ZK-DID Soulbound identity

    // Balances
    balances: {
      axq: "0",             // $AXQ balance (10T supply — dùng string để tránh BigInt overflow)
      vpx: "0",             // $VPX Validator token
      sqx: "0",             // $SQX Sequencer gas token
      kpx: "0",             // $KPX Liquidity token
      vrq: "0",             // $VRQ ZK Prover token
      usdc: "0",            // Stablecoin balance
    },

    // ANS Domain
    domain: null,           // e.g. "alice.axq"
    domainResolved: false,

    // Transaction
    pendingTx: null,        // Giao dịch đang chờ xác nhận
    txHistory: [],          // Lịch sử giao dịch

    // UI State
    loading: false,
    error: null,
    theme: "light",         // Light/Dark Mode — ánh xạ AXQ Design System tokens
  },
  // ...
})
```

### Nguyên Tắc State Axioledger

**1. Không lưu Seed Phrase trong state** — AxioPass dùng WebAuthn P-256, không có secret key trong bộ nhớ app.

**2. Số lượng token dùng string** — Tổng cung 10 nghìn tỷ $AXQ vượt giới hạn `Number.MAX_SAFE_INTEGER`. Luôn dùng `string` hoặc `BigInt` cho token amounts.

**3. ZK Proof là transient state** — `ZkAuthProof` chỉ tồn tại trong thời gian submit giao dịch, không persist trong app state.

**4. State phản ánh Semantic tokens** — `theme: "light" | "dark"` ánh xạ trực tiếp vào AXQ Design System `[data-theme="light/dark"]`.

### Ví Dụ: State Transition Cross-chain Swap

```js
// State trước khi swap
const before = {
  loading: false,
  balances: { axq: "1000000", usdc: "0" },
  pendingTx: null,
}

// SwapIntentAction trả về state mới + effect
const SwapIntentAction = (state, { from, to, amount }) => [
  {
    ...state,
    loading: true,                          // UI loading indicator
    pendingTx: { from, to, amount, status: "pending" },
  },
  submitSwapIntent({ from, to, amount }, SwapCompleted),  // effect: @hot-labs/omni-sdk
]

// Sau khi swap hoàn tất
const SwapCompleted = (state, result) => ({
  ...state,
  loading: false,
  pendingTx: { ...state.pendingTx, status: "confirmed", hash: result.hash },
  balances: {
    ...state.balances,
    [result.from]: result.newFromBalance,
    [result.to]: result.newToBalance,
  },
})
```

### Tham Khảo Thêm

- [Actions](actions.md) — Cách Axioledger Actions kích hoạt SwapIntent, KYC flow
- [Effects](effects.md) — Cross-chain effects qua `@kinetoprotocol/intents-engine`
- [Subscriptions](subscriptions.md) — ZK-Metrics WebSocket & balance polling
- [Master Roadmap](../AXIOLEDGER_ROADMAP.md) — Kiến trúc tổng thể

---

## Axioledger — StatelessTransaction Deep Dive

> Mở rộng từ phần trước — kiến trúc chi tiết hơn về **StatelessTransaction**, luồng Merkle Witness, và state slicing cho DApp multi-zone.

### Luồng Xác Thực StatelessTransaction

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT (AxioPass Wallet)                      │
│                                                                  │
│  1. Người dùng ký giao dịch bằng WebAuthn P-256 (Face ID)       │
│  2. Sinh ZkAuthProof từ Secure Enclave                           │
│  3. Đóng gói TransactionPayload { to, amount, nonce, chainId }  │
└────────────────────────┬────────────────────────────────────────┘
                         │  Gửi StatelessTransaction lên L2
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              $SQX SEQUENCER (Sequentichain Node)                 │
│                                                                  │
│  4. Tra cứu Access List của transaction                          │
│  5. Bơm MerkleWitness: { stateRoot, accountProof[], storageProof[] } │
│  6. Gửi gói hoàn chỉnh đến Validator Pool                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               VALIDATOR NODE ($VPX Staker)                       │
│                                                                  │
│  7. Nhận StatelessTransaction + MerkleWitness                    │
│  8. Xác minh ZkAuthProof (P-256 WebAuthn signature)              │
│  9. Xác minh MerkleWitness dựa vào L1 State Root                 │
│  10. Không cần đọc toàn bộ state — chỉ verify Merkle path       │
│  11. Đưa vào Validator Pool → BFT-style consensus                │
└────────────────────────┬────────────────────────────────────────┘
                         │  L1 Finality
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   L1 ANCHORING                                   │
│                                                                  │
│  12. ZK-SNARK batch commit lên Ethereum/Solana L1               │
│  13. State Root mới được cập nhật                               │
│  14. dispatch SwapCompleted/TransferConfirmed → axioledger state   │
└─────────────────────────────────────────────────────────────────┘
```

### State Slicing — Nhiều Zone Đồng Thời

Axiopass Wallet chia state theo **zone** để tránh re-render toàn bộ app khi một zone thay đổi:

```js
app({
  init: {
    // Zone 1 — Auth
    auth: {
      screen: "splash",          // "splash" | "otp" | "pin" | "passkey" | "home"
      pinInput: "",
      otpSecondsLeft: 120,
      passkeyCredential: null,
    },

    // Zone 2 — KYC
    kyc: {
      tier: "none",              // "none" | "basic" | "verified" | "premium"
      status: "idle",            // "idle" | "scanning" | "proving" | "processing" | "verified" | "rejected"
      zkProof: null,             // ZK Selective Disclosure proof — transient
    },

    // Zone 3–4 — Wallet / Card
    wallet: null,                // connected wallet address
    card: {
      revealed: false,
      revealedAt: null,
    },

    // Zone 5 — Crypto
    portfolio: {
      balances: { axq: "0", vpx: "0", sqx: "0", kpx: "0", vrq: "0" },
      prices: {},
      lastUpdated: null,
    },

    // Zone 6 — Transfer
    transfer: {
      pendingTx: null,
      recipient: null,
      amount: "",
    },

    // Global UI
    theme: "light",
    tab: "home",
    loading: false,
    error: null,
  },
})
```

### Quy Tắc Bất Biến State

| Quy Tắc | Lý Do | Ví Dụ |
|---|---|---|
| Token amounts dùng `string` | 10T $AXQ > `Number.MAX_SAFE_INTEGER` | `"10000000000000"` không phải `10000000000000` |
| ZK Proofs không persist | Chỉ valid trong 1 transaction, TTL ngắn | Xóa `kyc.zkProof` sau khi submit |
| Seed phrase không bao giờ vào state | WebAuthn P-256, không có secret | AxioPass dùng Secure Enclave |
| `theme` state ánh xạ `data-theme` | AXQ Design System token override | `"light"` ↔ `[data-theme="light"]` |
| Merge state bằng spread (`...state`) | axioledger cần new object reference | `{ ...state, loading: true }` |

### Escape Hatch State (L2 Offline)

Khi L2 Sequencer gặp sự cố, AxioPass chuyển sang **L1 Direct Mode**:

```js
// State khi kích hoạt Escape Hatch
const EscapeHatchActivated = (state) => ({
  ...state,
  l2Status: "offline",
  escapeHatch: {
    active: true,
    activatedAt: Date.now(),
    // Rút Merkle Witness trực tiếp từ L1 Indexer
    witnessSource: "l1-indexer",
  },
  error: "L2 không khả dụng — đang dùng chế độ L1 an toàn",
})
```

### Tham Khảo Thêm (cập nhật)

- [Actions](actions.md) — `SwapIntentAction`, `EscapeHatchActivated`, `ConnectPasskey`
- [Effects](effects.md) — `submitSwapIntent`, `initPasskeyAuth`, `generateZKKYCProof`
- [Subscriptions](subscriptions.md) — ZK-Metrics WebSocket & balance polling
- [Dispatch](dispatch.md) — Circuit Breaker middleware khi `l2Status === "offline"`
- [Design System](../ui/DESIGN_SYSTEM.md) — `theme` state → token override Light/Dark
- [Master Roadmap](../AXIOLEDGER_ROADMAP.md) — StatelessTransaction Architecture (Mục 2)
