# Effects

_**Definition:**_

> An **effect** is a representation used by actions to interact with some external process.

As with [subscriptions](subscriptions.md), effects are used to deal with impure asynchronous interactions with the outside world in a safe, pure, and immutable way. Creating an HTTP request, giving focus to a DOM element, saving data to local storage, sending data over a WebSocket, and so on, are all examples of effects at a conceptual level.

**_Signature:_**

```elm
Effect : EffecterFn | [EffecterFn, Payload]
```

**_Naming Recommendation:_**

Effects are recommended to be named in `camelCase` using a verb (for instance `log`) or verb-noun phrase (like `saveAsPDF`) in its imperative form for the name.

## Using Effects

An action can associate its state transition with a list of one or more [effects](#effects) to run alongside the transition. It does this by returning an array containing the [state with effects](state.md#state-with-effects) where the first entry is the next state while the remaining entries are the effects to run.

```js
import { log } from "./fx"

// Action : (State) -> [NextState, ...Effects]
const SayHi = (state) => [
  { ...state, value: state.value + 1 },
  log("hi"),
  log("there"),
]

// ...

h("button", { onclick: SayHi }, text("Say Hi"))
```

Actions can of course receive payloads and use effects simultaneously.

```js
// Action : (State, Payload) -> [NextState, ...Effects]
const SayBye = (state, amount) => [
  { ...state, value: state.value + amount },
  log("bye"),
]

// ...

h("button", { onclick: [SayBye, 1] }, text("Bye"))
```

## Excluding Effects

If you don't include any effects in the return array then only the state transition happens.

Here, `OnlyIncrement` both behaves and is used similarly to `Increment` [shown here](actions.md#actual-state-transition):

```js
// Action : (State) -> [NextState]
const OnlyIncrement = (state) => [{ ...state, value: state.value + 1 }]

// ...

h("button", { onclick: OnlyIncrement }, text("+"))
```

Such a single-element array may seem redundant at first but it can come into play if you have an action that conditionally runs effects.

For example, compare this:

```js
const DoIt = (state) => {
  let transition = { ...state, value: "MacGuffin" }
  if (state.eating) {
    transition = [transition, log("eating")]
  }
  if (state.drinking) {
    transition = Array.isArray(transition)
      ? [...transition, log("drinking")]
      : [transition, log("drinking")]
  }
  return transition
}
```

<!-- In fiction, a MacGuffin is something that's necessary to the plot and the motivation of the characters but unimportant in itself. -->

with this:

```js
const DoItBetter = (state) => {
  let transition = [{ ...state, value: "MacGuffin" }]
  if (state.eating) {
    transition = [...transition, log("eating")]
  }
  if (state.drinking) {
    transition = [...transition, log("drinking")]
  }
  return transition
}
```

Admittedly, these examples are a bit contrived but the latter is less complex.

However, for these examples in particular we can do even better by taking advantage of the fact that any "effects" that are actually falsy values are ignored.

```js
const DoItBest = (state) => [
  { ...state, value: "MacGuffin" },
  state.eating && log("eating"),
  state.drinking && log("drinking"),
]
```

## Defining Effects

Syntactically speaking, an effect takes the form of a tuple containing its [effecter](#effecters) and any associated data.

Technically, an effect can be used directly but using a function that creates the effect is recommended because it offers flexibility with how the tuple is created while looking a little cleaner overall.

```js
const massFx = (data) => [runNormandy, data]
```

<!-- `massFx` is a play on the title of the videogame series "Mass Effect". The SSV Normandy SR-1 is the spaceship the player travels in throughout the series. -->

## Effecters

**_Definition:_**

> An **effecter** is the function that actually carries out an effect.

**_Signature:_**

```elm
EffecterFn : (DispatchFn, Payload?) -> void
```

As with [subscribers](subscriptions.md#subscribers), effecters are allowed to use side-effects and can also manually [`dispatch`](dispatch.md) actions in order to inform your app of any pertinent results from their execution.

It's important to know that effecters are more than just a way to wrap any arbitrary impure code. Their purpose is to be a generalized bridge between your app's business logic and the impure code that needs to exist. By keeping the effecters as generic as we can, we form a clean, manageable separation between what is requested to be done from how that request is done.

To demonstrate this approach take this ill-formed effecter for example:

```js
// This effecter is ill-formed.
const runHarvest = (dispatch, _payload) => {
  const tiberium = document.getElementById("tiberium")
  dispatch((state) => ({ ...state, tiberium }))
}
```

<!-- In the videogame series "Command & Conquer", Tiberium is a toxic alien crystalline substance that can be harvested for its energy. -->

Sure it runs, but it's also coupled to our app's state and the element ID being referenced is also hard-coded.

Let's address this by first decoupling our callback action from the effecter by leveraging our ability to give the effecter a payload:

```js
const runHarvest = (dispatch, payload) => 
  dispatch(payload.action, document.getElementById("tiberium"))
```

Let's further utilize our payload by using it to pass in data our effecter needs to work:

```js
const runHarvest = (dispatch, payload) => 
  dispatch(payload.action, document.getElementById(payload.id))
```

Finally, we should rename the effecter to reflect its generic nature:

```js
const runGetElement = (dispatch, payload) => 
  dispatch(payload.action, document.getElementById(payload.id))
```

A well-formed effecter is as generic as it can be.

### Synchronization

Effecters which run some asynchronous operation and wish to report the results of it back to your app will need to ensure that the timing of their communication dispatch happens in alignment with axioledger's repaint cycle. This is important to ensure the state is set correctly.

axioledger's repaint cycle stays synchronized with the browser's natural repaint cycle, so asynchronous effecters must do the same. The preferred way to do this is with [`requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). If for some reason that method is unavailable, the fallback is [`setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout).

Let's see an example of an ill-formed asynchronous effecter:

```js
// This effecter is ill-formed.
const runBrotherhood = async (dispatch, payload) => {
  const response = await fetch(payload.lookForKaneHere)
  const kaneLives = response.json()
  requestAnimationFrame(() => {
    dispatch((state) => ({
      ...state,
      message: kaneLives ? "One vision! One purpose!" : "",
    }))
  })
}
```

<!-- In the videogame series "Command & Conquer", Kane is the leader of the Brotherhood of Nod and has cheated death at least once. One of his catchphrases is "One vision! One purpose!" -->

Now let's see a more well-formed asynchronous effecter:

```js
const runSimpleFetch = async (dispatch, payload) => {
  const response = await fetch(payload.url)
  requestAnimationFrame(() => dispatch(payload.action, response.json()))
}
```

### Custom Events

The ideal scenario to use custom effects is when your axioledger application needs to communicate with a legacy app via custom events.

We can have our axioledger application use a custom effect for triggering custom events.

```js
// ./fx.js

const runEmit = (_dispatch, payload) => 
  dispatchEvent(new CustomEvent(payload.type, { detail: payload.detail }))

export const emit = (type, detail) => [runEmit, { type, detail }]
```

```js
import { h, text, app } from "axioledger"
import { emit } from "./fx"

app({
  view: () =>
    h("main", {}, [
      h(
        "button",
        {
          onclick: (state) => [
            state, 
            emit("outgoing", { message: "hello" })
          ],
        },
        text("Send greetings")
      ),
    ]),
  node: document.querySelector("main"),
})
```

---

## Axioledger — Effects trong DApp Ecosystem

> Phần này định nghĩa các **Effecters** thực tế của Axioledger — các side effects impure tương tác với blockchain, ZK prover, và cross-chain protocols.

### Danh Mục Effects Cốt Lõi

#### 1. Cross-chain Swap Effect (`@kinetoprotocol/intents-engine`)

```js
// submitSwapIntent — effecter gọi @hot-labs/omni-sdk
// Effect : [EffecterFn, Payload]
const submitSwapIntent = (payload, onSuccess, onFail) => [
  async (dispatch, { from, to, amount, onSuccess, onFail }) => {
    try {
      // Gọi NEAR Intents Engine qua @kinetoprotocol/intents-engine
      const result = await intentsEngine.swap({
        fromToken: from,
        toToken: to,
        amount,
        // Tự động tìm route tốt nhất (SOR - Smart Order Router)
        slippageTolerance: 0.005,  // 0.5%
      })
      dispatch(onSuccess, result)
    } catch (err) {
      dispatch(onFail ?? SwapFailed, err)
    }
  },
  { from, to, amount, onSuccess, onFail },
]
```

#### 2. AxioPass Passkey Auth Effect (`@axioledger/wallet-connector`)

```js
// initPasskeyAuth — WebAuthn P-256 + Secure Enclave, zero seed phrase
const initPasskeyAuth = (onSuccess) => [
  async (dispatch, { onSuccess }) => {
    // navigator.credentials.create() → Secure Enclave (Face ID / Touch ID)
    const credential = await walletConnector.authenticatePasskey()
    // Sinh ZK Auth Proof từ P-256 signature
    const zkProof = await walletConnector.generateZKAuthProof(credential)
    dispatch(onSuccess, { address: credential.address, zkProof, domain: credential.domain })
  },
  { onSuccess },
]
```

#### 3. ZK KYC Proof Effect (`@veraciphers/zk-prover-runtime`)

```js
// generateZKKYCProof — Halo2/PlonKy2, mục tiêu < 1s trên mobile
const generateZKKYCProof = (livenessData, onReady) => [
  async (dispatch, { livenessData, onReady }) => {
    // Off-chain proof generation — ZK Selective Disclosure
    // Không lộ thông tin nhạy cảm (tên, ngày sinh, địa chỉ)
    const zkProof = await zkProverRuntime.generateKYCProof({
      livenessHash: livenessData.hash,
      documentHash: livenessData.docHash,
      // Chỉ chứng minh "đã KYC" mà không lộ identity cụ thể
    })
    dispatch(onReady, zkProof)
  },
  { livenessData, onReady },
]
```

#### 4. ANS Domain Resolution Effect (`@axioledger/ans-sdk`)

```js
// queryANSDomain — phân giải tên miền .axq < 10ms
const queryANSDomain = (domainName, onResolved) => [
  async (dispatch, { domainName, onResolved }) => {
    const record = await ansClient.resolve(domainName)
    // record: { svm, evm, did, ipfs }
    dispatch(onResolved, record)
  },
  { domainName, onResolved },
]
```

#### 5. ZK-Metrics Oracle Effect (`@sequentichain/async-task-runner`)

```js
// pollZKMetrics — đọc KPI On-chain real-time, trigger giải ngân Treasury
const pollZKMetrics = (onDataReceived) => [
  async (dispatch, { onDataReceived }) => {
    // Native Indexer Stack: PM2 + Nginx + Node.js + Elixir + Rust
    const metrics = await zkMetricsOracle.getLatest({
      activeWallets: true,
      volumeLast24h: true,
      validatorUptime: true,
    })
    dispatch(onDataReceived, metrics)
  },
  { onDataReceived },
]
```

#### 6. DAO Vote Effect (`Axio-Tribunal`)

```js
// submitDAOVote — MACI Anti-Collusion, encrypted vote
const submitDAOVote = ({ proposalId, vote, weight }, onVoteCast) => [
  async (dispatch, payload) => {
    // Mã hóa phiếu bầu qua MACI circuit (chống hối lộ)
    const encryptedVote = await maciCircuit.encryptVote(payload.vote, payload.weight)
    const receipt = await daoContract.castVote(payload.proposalId, encryptedVote)
    dispatch(payload.onVoteCast, receipt)
  },
  { proposalId, vote, weight, onVoteCast },
]
```

### Effect Chain — Cross-chain Payment Full Flow

```
submitSwapIntent()               ← @hot-labs/omni-sdk via @kinetoprotocol/intents-engine
    → Route found (SOR)
    → initPasskeyAuth()          ← @axioledger/wallet-connector
        → WebAuthn P-256 sign
        → generateZKAuthProof()  ← @veraciphers/zk-prover-runtime (< 1s mobile)
    → broadcastStatelessTx()     ← @sequentichain/async-task-runner (AF_XDP Zero-Copy)
        → Validator nodes verify (Merkle Witness only)
        → ZK-SNARK batch commit  ← @sequentichain/gpu-executor
    → L1 finality confirmed
    → dispatch SwapCompleted()
```

### Nguyên Tắc Effects trong Axioledger

| Nguyên Tắc | Lý Do |
|---|---|
| **Effects không nhận state** | Chỉ nhận payload riêng. State immutable trong axioledger. |
| **Mọi blockchain call đều là Effect** | `submitSwapIntent`, `broadcastTx`, `queryBalance` — không bao giờ ở trong View hay Action. |
| **ZK Proof generation là Effect** | Async, impure (phụ thuộc phần cứng GPU/FPGA). |
| **WebAuthn là Effect** | Phụ thuộc `navigator.credentials` — Web Platform API. |
| **Paymaster tự động là Effect** | dApp trả phí gas thay user — side effect tài chính. |

### Tham Khảo Thêm

- [Actions](actions.md) — `SwapIntentAction`, `ConnectPasskey`, `StartKYC`
- [Subscriptions](subscriptions.md) — ZK-Metrics WebSocket realtime (vs polling Effect)
- [Master Roadmap](../AXIOLEDGER_ROADMAP.md) — Luồng dữ liệu 6 bước toàn hệ thống

---

## Axioledger — Effects Nâng Cao

> Mở rộng từ phần trước — các effecters phức tạp hơn: L2 broadcast, session management, retry logic, và Paymaster.

### Effect 7: L2 Broadcast — StatelessTransaction (`@sequentichain/async-task-runner`)

```js
// broadcastStatelessTx — gửi giao dịch đã được $SQX Sequencer bơm MerkleWitness
// Sử dụng AF_XDP Zero-Copy networking để đạt throughput cao
const broadcastStatelessTx = (signedTx, onConfirmed, onFailed) => [
  async (dispatch, payload) => {
    try {
      // AF_XDP Zero-Copy — bypass kernel networking stack
      const receipt = await sequencerClient.broadcastRaw({
        tx: payload.signedTx,
        priorityFee: "auto",    // Paymaster tự động trả gas
        maxRetries: 3,
      })
      // Chờ L2 finality (< 2s theo spec)
      const confirmed = await sequencerClient.waitForFinality(receipt.hash, {
        timeout: 5000,
        confirmations: 1,
      })
      requestAnimationFrame(() => dispatch(payload.onConfirmed, confirmed))
    } catch (err) {
      requestAnimationFrame(() => dispatch(payload.onFailed ?? TxFailed, err))
    }
  },
  { signedTx, onConfirmed, onFailed },
]
```

### Effect 8: Paymaster Effect — User không trả gas

```js
// paymasterSponsorTx — dApp trả gas thay cho user (ERC-4337 Account Abstraction)
// Axioledger tự sponsor gas cho mọi giao dịch trong ecosystem
const paymasterSponsorTx = (txData, onSponsored) => [
  async (dispatch, payload) => {
    // Kiểm tra eligibility (ví dụ: user có đủ $AXQ để sponsor không)
    const eligible = await paymasterContract.checkEligibility(payload.txData)
    if (!eligible) {
      dispatch(FallbackToUserPaysGas, payload.txData)
      return
    }
    // Ký sponsorship proof từ Paymaster
    const sponsoredTx = await paymasterContract.sponsorTransaction(payload.txData)
    requestAnimationFrame(() => dispatch(payload.onSponsored, sponsoredTx))
  },
  { txData, onSponsored },
]
```

### Effect 9: Session Management Effect

```js
// saveSession — lưu phiên đăng nhập vào IndexedDB (encrypted)
const saveSession = (sessionData) => [
  async (dispatch, payload) => {
    // Mã hóa session data bằng Secure Enclave key
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: payload.sessionData.iv },
      payload.sessionData.key,
      JSON.stringify({ address: payload.sessionData.address, expiresAt: Date.now() + 86400000 })
    )
    await indexedDB.open("axiopass").transaction("sessions").put(encrypted)
    // Không cần dispatch — fire-and-forget
  },
  { sessionData },
]

// checkExistingSession — đọc phiên đã lưu khi app khởi động
const checkExistingSession = (onFound, onNotFound) => [
  async (dispatch, payload) => {
    const session = await indexedDB.open("axiopass").transaction("sessions").get("current")
    if (session && session.expiresAt > Date.now()) {
      requestAnimationFrame(() => dispatch(payload.onFound, session))
    } else {
      requestAnimationFrame(() => dispatch(payload.onNotFound))
    }
  },
  { onFound, onNotFound },
]
```

### Effect 10: Lock Assets on L2 (Bridge)

```js
// lockAssetsOnL2 — khóa tài sản trên Axioledger L2 trước khi bridge sang L1
const lockAssetsOnL2 = ({ token, amount, targetChain }, onLocked) => [
  async (dispatch, payload) => {
    // Gọi Bridge Contract trên Axioledger L2
    const receipt = await bridgeContract.lock({
      token: payload.token,
      amount: BigInt(payload.amount),  // dùng BigInt cho token amounts
      targetChain: payload.targetChain,
      recipient: walletState.address,
    })
    requestAnimationFrame(() => dispatch(payload.onLocked, receipt))
  },
  { token, amount, targetChain, onLocked },
]
```

### Effect Composition Pattern

Đôi khi cần chạy nhiều effects tuần tự (bắt buộc phải dispatch qua chain action):

```js
// Không thể dùng Promise.all trong effecter — mỗi effect là independent
// Thay vào đó: dùng action chain để tuần tự hóa

// Cách đúng: Action A → Effect 1 → dispatch Action B → Effect 2
const StartFullOnboarding = (state) => [
  { ...state, onboarding: { step: 1 } },
  registerUser(state.phone, UserRegistered),        // Effect 1
]

const UserRegistered = (state, user) => [
  { ...state, onboarding: { step: 2 }, userId: user.id },
  sendOTP(user.phone, OTPSent),                     // Effect 2
]

const OTPSent = (state) => ({
  ...state,
  auth: { ...state.auth, screen: "otp" },
  onboarding: { step: 3 },
})
```

### Bảng Tổng Hợp Effects Axioledger

| Effect | Package | Async | dispatch về Action |
|---|---|---|---|
| `submitSwapIntent` | `@kinetoprotocol/intents-engine` | ✓ | `SwapCompleted` / `SwapFailed` |
| `initPasskeyAuth` | `@axioledger/wallet-connector` | ✓ | `PasskeyConnected` / `PasskeyFailed` |
| `generateZKKYCProof` | `@veraciphers/zk-prover-runtime` | ✓ | `KYCProofReady` |
| `queryANSDomain` | `@axioledger/ans-sdk` | ✓ | `DomainResolved` |
| `pollZKMetrics` | `@sequentichain/async-task-runner` | ✓ | `MetricsReceived` |
| `submitDAOVote` | `Axio-Tribunal` | ✓ | `VoteCast` |
| `broadcastStatelessTx` | `@sequentichain/async-task-runner` | ✓ | `TxConfirmed` / `TxFailed` |
| `paymasterSponsorTx` | `@axioledger/paymaster` | ✓ | `TxSponsored` |
| `saveSession` | IndexedDB (browser) | ✓ | — (fire-and-forget) |
| `checkExistingSession` | IndexedDB (browser) | ✓ | `SessionFound` / `SessionNotFound` |
| `lockAssetsOnL2` | Bridge Contract | ✓ | `BridgeLocked` |

### Tham Khảo Thêm (cập nhật)

- [Actions](actions.md) — `AppStarted`, `PasskeyVerified`, `InitiateBridge`, `SwapIntentWithRetry`
- [Subscriptions](subscriptions.md) — `onBridgeRelay` — theo dõi tiến trình bridge sau `lockAssetsOnL2`
- [Dispatch](dispatch.md) — `circuitBreakerMiddleware` dừng `broadcastStatelessTx` khi L2 offline
- [Design System](../ui/DESIGN_SYSTEM.md) — Zone 1 Auth · Zone 6 Transfer loading states
- [Master Roadmap](../AXIOLEDGER_ROADMAP.md) — Mục 4: Sequentichain · Mục 5: KinetoProtocol
