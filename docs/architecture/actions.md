# Actions

**_Definition:_**

> An **action** is a message used within your app that signals the valid way to change [state](state.md).

An action is implemented by a deterministic function that produces no side-effects which describes a transition between the current state and the next state and in so doing may optionally list out [effects](effects.md) to be run as well.

Actions are dispatched by either DOM events in your app, [effecters](effects.md#effecters), or [subscribers](subscriptions.md#subscribers). When dispatched, actions always implicitly receive the current state as their first argument.

**_Signature:_**

```elm
Action : (State, Payload?) -> NextState
                              | [NextState, ...Effects]
                              | OtherAction
                              | [OtherAction, Payload?]
```

**_Naming Recommendation:_**

Actions are recommended to be named in `PascalCase` to signal to the developer that they should be thought of as messages intended for use by axioledger itself. It is also recommended to use a verb (for instance `Add`) or a verb-noun phrase (`AddArticle`) for the name. The verb can be either in its imperative form, like `IncrementBy`, `ToggleVisibility`, `GetPizzas` or `SaveAddress`, or in the past tense form, for instance `GotData`, `StoppedCounting` – especially when the action is used for a "final" state transition at the end of an action-effect-chain.

---

## Simple State Transitions

The simplest possible action merely returns the current state:

```js
// Action : (State) -> SameState
const Identity = (state) => state
```

It seems useless at first but can be helpful as a placeholder for other actions while prototyping a new app or [component](views.md#components).

Probably the most common way to use an action is to assign it as an event handler for one of the nodes in your view.

```js
h("button", { onclick: Identity }, text("Do Nothing"))
```

The next simplest type of action merely sets the state.

```js
// Action : () -> ForcedState
const FeedFace = () => 0xfeedface
```

<!-- "FEEDFACE" is an example of "hexspeak", a variant of English spelling using hexadecimal digits. -->

<a name="actual-state-transition"></a>
But you'll most likely want to do actual state transitions.

```js
// Action : (State) -> NewState
const Increment = (state) => ({ ...state, value: state.value + 1 })

// ...

h("button", { onclick: Increment }, text("+"))
```

---

## Payloads

Actions can also accept an optional **payload** along with the current state.

```js
// Action : (State, Payload?) -> NewState
const AddBy = (state, amount) => ({ ...state, value: state.value + amount })
```

To give a payload to an action we'll want to use an **action descriptor**.

```js
h("button", { onclick: [AddBy, 5] }, text("+5"))
```

### Event Payloads

Actions used as event handlers receive the event object as the default payload.

If we were to use our `AddBy` action without specifying its payload:

```js
h("button", { onclick: AddBy }, text("+5"))
```

then it will receive the event object when the user clicks it and will attempt to directly "add" that to our state which would obviously be a bug.

However, if we wanted to make proper use of the event object we have a couple options:

- Rewrite `AddBy` to account for the possibility of receiving an event payload.
- Or preprocess the event object to make it work with `AddBy` as it is.

The latter option is preferred because it lets our action remain unconcerned with how its payload is sourced thereby maintaining its reusability.

Which brings us to...

---

## Wrapped Actions

Actions can return other actions. The simplest form of these basically acts like an alias.

```js
// Action : () -> OtherAction
const PlusOne = () => Increment
```

A more useful form preprocesses payloads to use with other actions. We can make an event adaptor so our primary action can use event data without coupling to the event source.

```js
// Action : (State, EventPayload) -> [OtherAction, Payload]
const AddByValue = (state, event) => [AddBy, +event.target.value]
```

We'll make use of `AddByValue` with an `input` node instead of the `button` from earlier because we want the event that gets preprocessed to have a `value` property we can extract:

```js
h("input", { value: state, oninput: AddByValue })
```

You can keep wrapping actions for as long as your sanity permits. The benefit is the ability to chain together payload adjustments.

```js
const AddBy = (state, amount) => ({ ...state, value: state.value + amount })
const AddByMore = (_, amount) => [AddBy, amount + 5]
const AddByEvenMore = (_, amount) => [AddByMore, amount + 10]

// ...

h(
  "button",
  { onclick: [AddByEvenMore, 1] },
  text("+16")
)
```

---

## Transforms

You may consider refactoring very large and/or complicated actions it into simpler, more manageable functions. If so, remember that actions are just messages and, conceptually speaking, are not composable like the functions that implement them. That being said, it can at times be advantageous to delegate some state processing to other functions. Each of these constituent functions is a **transform** and is intended for use by actions or other transforms.

```js
const Liokaiser = (state) => ({
  ...state,
  combined: true,
  leftArm: hellbat(state),
  rightArm: guyhawk(state),
  upperTorso: leozack(state),
  lowerTorso: jallguar(state),
  leftLeg: drillhorn(state),
  rightLeg: killbison(state),
})
```

<!-- In the '80s Japanese animated series "Transformers: Victory", Liokaiser is a Decepticon combiner made from the combination of the team of Leozack, Drillhorn, Guyhawk, Hellbat, Jallguar, and Killbison. -->

---

## Stopping Your App

You can cease all axioledger processes by transitioning to an `undefined` state. This can be useful if you need to do specific cleanup work for your app.

```js
// Action : () -> undefined
const Stop = () => undefined
```

Once your app stops, several things happen:

- All of the app's subscriptions stop.
- The DOM is no longer touched.
- Event handlers stop working.

A stopped app cannot be restarted.

If you encounter a scenario where your app doesn't respond when you click stuff within it, then your app might have been stopped by mistake.

---

## Other Considerations

### Transitioning Array State

An array returned from an action carries [special meaning as already mentioned earlier](effects.md#using-effects). For this reason an actual [array state](state.md#array-state) needs special consideration.

There are a couple of options available:

- Wrap the return state within an [effectful state array](state.md#state-with-effects). Mention also that init: option of app() function must also be wrapped.

  ```js
  const ArrayAction = (state) => [[...state, "one"]]
  ```

- Or you can choose a different format for the state by setting it up as an object that contains the the array so actions can work with it like they would with any other object state.

  ```js
  const ObjectAction = (state) => ({ ...state, list: [...state.list, "one"] })
  ```

### Nonstandard Usage

- Using an anonymous function for an action has the disadvantage that it has no name for debugging tools to make use of. That's significant because it's recommended that actions have names.

- If you wanted to use curried functions to implement actions then you can use named function expressions.

  ```js
  const Meet = (name) =>
    function AndGreet(state) {
      return `${state.salutation}, my name is ${name}.`
    }
  ```

- If you have some special requirements you can customize how actions are [dispatched](dispatch.md).

- Because of the way axioledger works internally, anywhere actions can be used literal values can be used instead to directly set state and possibly run effects.

  ```js
  h("button", { onclick: 55 }, text("55"))
  h("button", { onclick: [55, log] }, text("55 and log"))
  ```

  However, this conflicts with the notion that state transitions happen through the usage of actions. The valid way to achieve the same thing would be:

  ```js
  const FiftyFive = () => 55
  const FiftyFiveAndLog = () => [55, log]
  ```

  ```js
  h("button", { onclick: FiftyFive }, text("55"))
  h("button", { onclick: FiftyFiveAndLog }, text("55 and log"))
  ```

  The [`init`](../api/app.md#init) property of [`app()`](../api/app.md) is the only place where it's valid to either directly set the state or use an action to do it.

  That said, this type of usage is fascinating...

  ```js
  h("button", { onclick: state.startingOver ? "Begin" : MyCoolAction }, text("cool"))
  ```

---

## Axioledger — Actions trong DApp Ecosystem

> Phần này ánh xạ khái niệm Action của axioledger vào các luồng thực tế của **Axioledger** ($AXQ ecosystem).

### Sơ Đồ Action Flow Cross-chain

Khi người dùng thực hiện một giao dịch **Cross-chain Swap / Bridge / Payment**:

```
User Click (axioledger View)
        │
        ▼ Action: SwapIntentAction(state, payload)
        │  → State: { loading: true, pendingTx: {...} }
        │  → Effect: submitSwapIntent()  ← @kinetoprotocol/intents-engine
        │
        ▼ Effect gọi @hot-labs/omni-sdk
        │  → NEAR Intents Engine tìm route tốt nhất
        │
        ▼ dispatch SwapCompleted (từ effecter)
           → State: { loading: false, balances: {...updated} }
           → Effect: showToast("Swap thành công!")
```

### Các Action Cốt Lõi của Axioledger DApp

#### 1. Wallet & Identity Actions

```js
// Kết nối ví AxioPass (WebAuthn Passkey — zero seed phrase)
const ConnectPasskey = (state) => [
  { ...state, loading: true },
  initPasskeyAuth(PasskeyConnected),    // effect: @axioledger/wallet-connector
]

const PasskeyConnected = (state, walletInfo) => ({
  ...state,
  loading: false,
  wallet: walletInfo.address,
  domain: walletInfo.domain,            // e.g. "alice.axq"
  identity: walletInfo.zkDid,           // ZK-DID Soulbound
})

// Ngắt kết nối ví
const DisconnectWallet = (state) => ({
  ...state,
  wallet: null,
  passkey: null,
  identity: null,
  balances: { axq: "0", vpx: "0", sqx: "0", kpx: "0", vrq: "0", usdc: "0" },
})
```

#### 2. Cross-chain Swap Actions

```js
// Khởi tạo swap — trả về [NextState, Effect]
// Action : (State, Payload) -> [NextState, ...Effects]
const SwapIntentAction = (state, { from, to, amount }) => [
  {
    ...state,
    loading: true,
    pendingTx: { type: "swap", from, to, amount, status: "pending" },
  },
  submitSwapIntent({ from, to, amount }, SwapCompleted),
]

// Swap hoàn tất — pure state transition
const SwapCompleted = (state, result) => ({
  ...state,
  loading: false,
  pendingTx: { ...state.pendingTx, status: "confirmed", hash: result.txHash },
  balances: {
    ...state.balances,
    [result.from.token]: result.from.newBalance,
    [result.to.token]: result.to.newBalance,
  },
})

// Swap thất bại
const SwapFailed = (state, error) => ({
  ...state,
  loading: false,
  pendingTx: { ...state.pendingTx, status: "failed" },
  error: error.message,
})
```

#### 3. ANS Domain Actions

```js
// Phân giải tên miền .axq (< 10ms theo spec ANS SDK)
// Action : (State, Payload) -> [NextState, Effect]
const ResolveDomain = (state, domainName) => [
  { ...state, domainResolved: false },
  queryANSDomain(domainName, DomainResolved),   // effect: @axioledger/ans-sdk
]

const DomainResolved = (state, record) => ({
  ...state,
  domainResolved: true,
  resolvedAddresses: {
    svm: record.svm,       // Native SVM address
    evm: record.evm,       // 0x... EVM address
    did: record.did,       // did:axq:... ZK-DID hash
    ipfs: record.ipfs,     // Qm... IPFS CID
  },
})
```

#### 4. KYC / Identity Actions (AxioPass)

```js
// Khởi động KYC flow — ZK Selective Disclosure
const StartKYC = (state) => [
  { ...state, kyc: { status: "scanning" } },
  initZKKYC(KYCDocScanned),
]

// Liveness check hoàn tất (active liveness: chớp mắt + quay đầu)
const LivenessConfirmed = (state, proof) => [
  { ...state, kyc: { status: "proving", livenessProof: proof } },
  generateZKKYCProof(proof, KYCProofReady),    // effect: @veraciphers/zk-prover-runtime
]

// ZK Proof KYC sẵn sàng — không lộ thông tin nhạy cảm
const KYCProofReady = (state, zkProof) => ({
  ...state,
  kyc: { status: "verified" },
  identity: { ...state.identity, kycProof: zkProof },
})
```

#### 5. DAO Governance Actions

```js
// Biểu quyết đề xuất — giữ nguyên quyền biểu quyết (tránh hàm suy biến D(t))
const CastVote = (state, { proposalId, vote, weight }) => [
  { ...state, voting: { proposalId, status: "submitting" } },
  submitDAOVote({ proposalId, vote, weight }, VoteCast),
]

// Đề xuất trị trị DAO mới
const SubmitProposal = (state, proposalData) => [
  { ...state, loading: true },
  createDAOProposal(proposalData, ProposalCreated),
]
```

### Naming Convention trong Axioledger

| Pattern | Ví dụ | Mô tả |
|---|---|---|
| `VerbNoun` (imperative) | `SwapIntentAction`, `ConnectPasskey` | Action khởi đầu luồng |
| `VerbNounPast` (past tense) | `SwapCompleted`, `KYCProofReady` | Action kết thúc effect chain |
| `VerbNounFailed` | `SwapFailed`, `KYCRejected` | Action xử lý lỗi |
| `StopApp` | `DisconnectWallet` | Action dừng hoặc reset |

### Tham Khảo Thêm

- [Effects](effects.md) — `submitSwapIntent`, `initPasskeyAuth`, `generateZKKYCProof`
- [State](state.md) — `StatelessTransaction`, shape state Axioledger
- [Master Roadmap](../AXIOLEDGER_ROADMAP.md) — Data flow toàn hệ thống

---

## Axioledger — Action Patterns Nâng Cao

> Mở rộng từ phần trước — các pattern phức tạp hơn: action chaining, error recovery, và AxioPass biometric flow.

### AxioPass Full Authentication Flow

Luồng xác thực đầy đủ từ Splash → Home, dùng Action chain + Effect:

```js
// Bước 1: App khởi động — kiểm tra phiên đã lưu
const AppStarted = (state) => [
  { ...state, auth: { ...state.auth, screen: "splash" } },
  checkExistingSession(SessionFound, SessionNotFound),
]

// Bước 2a: Có phiên → yêu cầu xác thực lại bằng Passkey
const SessionFound = (state, session) => [
  { ...state, auth: { ...state.auth, screen: "passkey-verify" } },
  initPasskeyAuth(PasskeyVerified),
]

// Bước 2b: Chưa có phiên → Onboarding / Register
const SessionNotFound = (state) => ({
  ...state,
  auth: { ...state.auth, screen: "onboarding" },
})

// Bước 3: Passkey verified → Load wallet data
const PasskeyVerified = (state, credential) => [
  {
    ...state,
    wallet: credential.address,
    auth: { ...state.auth, screen: "home", passkeyCredential: credential },
  },
  loadWalletData(credential.address, WalletDataLoaded),
]

// Bước 4: Wallet data ready → App hoàn toàn ready
const WalletDataLoaded = (state, { balances, domain, portfolio }) => ({
  ...state,
  portfolio: { ...state.portfolio, balances },
  domain,
  auth: { ...state.auth, screen: "home" },
  loading: false,
})
```

### Error Recovery Actions — Graceful Degradation

```js
// Action chain có error recovery
const SwapIntentWithRetry = (state, payload) => [
  { ...state, loading: true, retryCount: 0 },
  submitSwapIntent(payload, SwapCompleted, SwapRetry),
]

// Tự động retry tối đa 3 lần với exponential backoff
const SwapRetry = (state, error) => {
  if (state.retryCount >= 3) {
    // Hết lần retry — hiện lỗi cho user
    return [
      { ...state, loading: false, error: error.message, retryCount: 0 },
      showErrorToast(error.message),
    ]
  }
  const delay = Math.pow(2, state.retryCount) * 1000  // 1s, 2s, 4s
  return [
    { ...state, retryCount: state.retryCount + 1 },
    retryAfterDelay(delay, SwapIntentWithRetry, state.transfer),
  ]
}
```

### Cross-Chain Bridge Action Flow

```js
// Khởi tạo bridge: Axioledger L2 → Ethereum L1
const InitiateBridge = (state, { token, amount, targetChain }) => [
  {
    ...state,
    loading: true,
    transfer: {
      pendingTx: {
        type: "bridge",
        token, amount, targetChain,
        status: "locking",     // "locking" | "relaying" | "minting" | "confirmed"
      },
    },
  },
  lockAssetsOnL2({ token, amount, targetChain }, BridgeLocked),
]

const BridgeLocked = (state, lockReceipt) => [
  {
    ...state,
    transfer: {
      pendingTx: { ...state.transfer.pendingTx, status: "relaying", lockHash: lockReceipt.hash },
    },
  },
  // Subscribe bridge relay để theo dõi tiến trình
  // (xem Subscriptions — onBridgeRelay)
]

const BridgeMinted = (state, mintReceipt) => ({
  ...state,
  loading: false,
  transfer: {
    pendingTx: { ...state.transfer.pendingTx, status: "confirmed", mintHash: mintReceipt.hash },
  },
})
```

### Naming Convention Mở Rộng

| Pattern | Ví dụ | Khi nào dùng |
|---|---|---|
| `VerbNoun` | `ConnectPasskey`, `InitiateBridge` | Bắt đầu async flow |
| `NounVerbedPast` | `PasskeyVerified`, `WalletDataLoaded` | Callback sau effect |
| `VerbNounWithSuffix` | `SwapIntentWithRetry` | Wrapper có retry logic |
| `NounVerbFailed` | `SwapFailed`, `BridgeFailed`, `KYCRejected` | Error terminal state |
| `Noun + Activated/Deactivated` | `EscapeHatchActivated` | Toggle system state |

### Tham Khảo Thêm (cập nhật)

- [State](state.md) — `auth.screen` FSM, zone-sliced state shape
- [Effects](effects.md) — `lockAssetsOnL2`, `loadWalletData`, `retryAfterDelay`
- [Subscriptions](subscriptions.md) — `onBridgeRelay` sau `BridgeLocked`
- [Dispatch](dispatch.md) — `zkAuthGuard` bảo vệ `InitiateBridge`, `SwapIntentWithRetry`
- [Design System](../ui/DESIGN_SYSTEM.md) — Zone 5 Crypto · Zone 6 Transfer screens
