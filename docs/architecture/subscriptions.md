# Subscriptions

**_Definition:_**

> A **subscription** function represents a dependency your app has on some external process.

As with [effects](effects.md), subscriptions deal with impure, asynchronous interactions with the outside world in a safe, pure, and immutable way. They are a streamlined way of responding to events happening outside our application such as time or location changes. They handle resource management for us that we would otherwise need to worry about like adding and removing event listeners, closing connections, etc.

**_Signature:_**

```elm
Subscription : [SubscriberFn, Payload?]
```

**_Naming Recommendation:_**

Subscriptions are recommended to be named in `camelCase` prefixed by `on`, for instance `onEvery` or `onMouseEnter` in order to reflect their event handling character.

---

## Using Subscriptions

Subscriptions are setup and managed through the [`subscriptions:`](../api/app.md#subscriptions) property used with [`app()`](../api/app.md) when instantiating your app.

```js
import { onEvery } from "./time"

// ...

app({
  init: { delayInMilliseconds: 1000 },
  subscriptions: (state) => [
    // Dispatch `RequestResource` every `delayInMilliseconds`.
    onEvery(state.delayInMilliseconds, RequestResource),
  ],
})
```

You can control if subscriptions are active or not by using boolean values.

```js
app({
  subscriptions: (state) => [
    state.toBe && onEvery(state.delay, ThatIsTheQuestion),
    state.notToBe || onEvery(state.delay, ThatIsTheQuestion),
  ],
})
```

<!-- In William Shakespeare's play "Hamlet", Prince Hamlet gives a soliloquy in Act 3, Scene 1 where he begins with "To be, or not to be", basically questioning life. -->

### Subscriptions Array Format

axioledger expects the subscriptions array to be of a fixed size with each entry being either a boolean value or a particular subscription function that stays in the same array position. Using dynamic arrays won't work. Inlining subscription functions also won't work because they would just reset on every state change.

### Subscription Lifecycle

On every state change, axioledger will check each subscriptions array entry to see if they're active and compare that with how they were in the previous state. This comparison determines how subscriptions are handled.

| Previously Active | Currently Active | What Happens                                 |
| ----------------- | ---------------- | -------------------------------------------- |
| no                | no               | Nothing.                                     |
| no                | yes :100:        | Subscription starts up.                      |
| yes :100:         | no               | Subscription shuts down and gets cleaned up. |
| yes :100:         | yes :100:        | Subscription remains active.                 |

To restart a subscription you must first deactivate it and then, during the next state change, reactivate it.

---

## Custom Subscriptions

There may be times when an official axioledger subscription package is unavailable for our needs. For those scenarios we'll need to make our own custom subscriptions.

### Subscribers

**_Definition:_**

> A **subscriber** is a function which implements an active subscription.

**_Signature:_**

```elm
SubscriberFn : (DispatchFn, Payload?) -> CleanupFn
```

As with [effecters](effects.md#effecters), subscribers are allowed to use side-effects and can also manually [`dispatch`](dispatch.md) actions in order to inform your app of any pertinent results from their execution.

Subscribers can be given a data `payload` for their use.

Well-formed subscribers, as it is with effecters, should be as generic as possible. However, unlike with effecters, they should return a function that handles cleaning up the subscription if it gets cancelled.

### Example

Let's say we're embedding our axioledger application within a legacy vanilla JavaScript project.

Somewhere within the legacy portion of our project a custom event gets emitted:

```js
// Somewhere in our legacy app...

const triggerSpecialEvent = () => {
  dispatchEvent(new CustomEvent("secret", { detail: 42 }))
}

// ...

triggerSpecialEvent()
```

<!-- In "The Hitchhiker's Guide to the Galaxy" the number 42 is given as The Answer to the Ultimate Question of Life, The Universe, and Everything by the computer Deep Thought. -->

Our embedded axioledger application will need a custom subscription to be able to deal with custom events:

```js
// ./subs.js

const listenToEvent = (dispatch, props) => {
  const listener = (event) =>
    requestAnimationFrame(() => dispatch(props.action, event.detail))

  addEventListener(props.type, listener)
  return () => removeEventListener(props.type, listener)
}

export const listen = (type, action) => [listenToEvent, { type, action }]
```

In case you're wondering why `listenToEvent()`'s listener is using `requestAnimationFrame`, it has to do with [synchronization](actions.md#synchronization).

Now we can use our custom subscription in our axioledger application. Since it will be embedded we'll wrap our call to [`app()`](../api/app.md) within an exported function our legacy app can make use of:

```js
import { h, text, app } from "axioledger"
import { listen } from "./subs"

const Response = (state, payload) => ({ ...state, payload })

export const myApp = (node) =>
  app({
    init: () => ({ payload: null }),
    view: ({ payload }) =>
      h("main", {}, [
        payload && h("p", {}, text(`Payload received: ${JSON.stringify(payload)}`)),
      ]),
    subscriptions: () => [listen("secret", Response)],
    node: document.querySelector("main"),
  })
```

---

## Other Considerations

### Destructuring Gotcha

Since a well-formed subscriber returns a cleanup function, it's possible that the cleanup function would want to communicate back to your app that the cleanup took place.

```js
const listenToEvent = (dispatch, props) => {
  const listener = (event) =>
    requestAnimationFrame(() => dispatch(props.action, event.detail))

  addEventListener(props.type, listener)
  return () => {
    removeEventListener(props.type, listener)
    dispatch(props.action, "<done>")
  }
}
```

So, using `props` directly works well. However, if instead you tried to use destructuring then the cleanup function won't be able to communicate back to your app in all scenarios:

```js
const listenToEvent = (dispatch, { action, type }) => {
  const listener = (event) =>
    requestAnimationFrame(() => dispatch(action, event.detail))

  addEventListener(type, listener)
  return () => {
    removeEventListener(type, listener)
    dispatch(action, "cleaned-up")    // <-- uh, oh!
  }
}
```

The reason is because destructuring the `props` parameter will create local copies of the props listed. This means the cleanup function's closure will be referring to the `action` function that existed at the moment the cleanup function was created and returned, not the moment the cleanup function gets invoked. This is a subtle yet significant difference depending on how you use your actions with this type of subscriber.

The scenario in which this comes into play is if you use an anonymous function for the `action`. An example of where you may consider doing this is if you wanted a way to selectively prevent default event behavior when a subscriber responds to an event.

```js
// ./fx.js

const runPreventDefault = (dispatch, payload) => {
  payload.event.preventDefault()
  dispatch(payload.action)
}

export const preventDefault = (action, event) =>
  [runPreventDefault, { action, event }]
```

```js
// ./actions.js

import { preventDefault } from "./fx"

export const skipDefault = (action) => (state, event) => 
  [state, preventDefault(action, event)]

export const MyAction = (state) => ({ ...state })
```

```js
// ./subs.js

const subOnThatThing = (dispatch, props) => {
  // Do stuff...
}

export const onThatThing = (action, props) => [subOnThatThing, { ...props, action }]
```

```js
// ./main.js

import { onThatThing } from "./subs"
import { skipDefault } from "./actions"

app({
  subscriptions: (state) => [
    state.isActive &&
      onThatThing(skipDefault(MyAction), {
        foo: 42 + state.index,
      }),
  ],
})
```

Now when the subscription function runs per state update, the wrapped action is generated anew which results in a new function reference for the subscription's `action`. So, `subOnThatThing` must use `props` instead of destructuring to ensure the right function reference is available.

---

## Axioledger — Subscriptions trong DApp Ecosystem

> Subscriptions trong Axioledger phục vụ cho việc lắng nghe **sự kiện bên ngoài liên tục** — WebSocket blockchain, ZK-Metrics Oracle, Validator uptime, transaction confirmation.

### Các Subscription Cốt Lõi

#### 1. WebSocket Subscription — Realtime Balance & Tx Updates

```js
import { app } from "axioledger"
import { onBalanceUpdate, onTxConfirmed, onBlockProduced } from "@axioledger/wallet-connector"

app({
  init: { balances: {}, txHistory: [], latestBlock: null },

  subscriptions: (state) => [
    // Lắng nghe balance thay đổi khi có transaction mới
    state.wallet && onBalanceUpdate(state.wallet, BalancesUpdated),

    // Lắng nghe trạng thái xác nhận của pending transaction
    state.pendingTx && onTxConfirmed(state.pendingTx.hash, TxConfirmed),

    // Subscribe block mới — cập nhật block height trên UI
    onBlockProduced(NewBlockReceived),
  ],
})
```

#### 2. ZK-Metrics Oracle Subscription — Treasury Trigger

```js
// Subscribe KPI metrics realtime — dùng để trigger giải ngân Treasury DAO
const onZKMetrics = (interval, onData) => [
  (dispatch, { interval, onData }) => {
    // Native Indexer Stack (PM2 + Nginx + Rust) push dữ liệu qua WebSocket
    const ws = new WebSocket("wss://indexer.axioledger.network/metrics")

    ws.onmessage = (event) => {
      const metrics = JSON.parse(event.data)
      // Metrics: { activeWallets, volume24h, validatorUptime, tvl }
      dispatch(onData, metrics)
    }

    // Cleanup function (axioledger gọi khi unsubscribe)
    return () => ws.close()
  },
  { interval, onData },
]

app({
  subscriptions: (state) => [
    // Chỉ subscribe khi DAO đang active
    state.daoActive && onZKMetrics(5000, MetricsReceived),
  ],
})
```

#### 3. Validator Uptime Subscription (`@valiprecision/node-diagnostics`)

```js
// Subscribe uptime của Validator Node — cảnh báo Slashing nguy hiểm
const onValidatorUptime = (nodeId, onStatusChange) => [
  (dispatch, { nodeId, onStatusChange }) => {
    const monitor = validatorMonitor.subscribe(nodeId, (status) => {
      dispatch(onStatusChange, status)
      // status: { uptime: 99.8, lastBlock: 123456, slashRisk: false }
    })
    return () => monitor.unsubscribe()
  },
  { nodeId, onStatusChange },
]
```

#### 4. Cross-chain Bridge Status Subscription

```js
// Subscribe trạng thái Bridge Relay — cập nhật tiến độ cross-chain tx
const onBridgeRelay = (txHash, onUpdate) => [
  (dispatch, { txHash, onUpdate }) => {
    const relay = bridgeRelayer.watchTransaction(txHash, (update) => {
      // update: { step: "lock" | "relay" | "mint", confirmations: 12 }
      dispatch(onUpdate, update)
    })
    return () => relay.stop()
  },
  { txHash, onUpdate },
]
```

#### 5. ANS Domain Expiry Subscription

```js
// Subscribe cảnh báo tên miền .axq sắp hết hạn
const onDomainExpiry = (domain, daysBeforeExpiry, onWarning) => [
  (dispatch, payload) => {
    const check = setInterval(async () => {
      const expiry = await ansClient.getExpiry(payload.domain)
      const daysLeft = Math.floor((expiry - Date.now()) / 86400000)
      if (daysLeft <= payload.daysBeforeExpiry) {
        dispatch(payload.onWarning, { domain: payload.domain, daysLeft })
      }
    }, 3600000) // Kiểm tra mỗi giờ
    return () => clearInterval(check)
  },
  { domain, daysBeforeExpiry, onWarning },
]
```

### So Sánh Subscription vs Effect trong Axioledger

| | Subscription | Effect |
|---|---|---|
| **Khi nào dùng** | Liên tục lắng nghe sự kiện ngoài | Một lần khi action xảy ra |
| **Ví dụ Axioledger** | WebSocket balance · Validator uptime · ZK-Metrics | `submitSwapIntent` · `generateZKKYCProof` |
| **Lifecycle** | Start/stop theo state thay đổi | Chạy một lần, dispatch Action khi xong |
| **Cleanup** | Trả về unsubscribe function | Không cần cleanup |
| **Protocol layer** | `@sequentichain/network-stack` WebSocket | `@kinetoprotocol/intents-engine` HTTP/RPC |

### Tham Khảo Thêm

- [Effects](effects.md) — Dùng khi cần one-shot blockchain calls
- [Actions](actions.md) — `BalancesUpdated`, `MetricsReceived`, `TxConfirmed`
- [Master Roadmap](../AXIOLEDGER_ROADMAP.md) — ZK-Metrics Coprocessor Oracle (Mục 3.2)

---

## Axioledger — Subscriptions Nâng Cao

> Mở rộng từ phần trước — các subscription pattern phức tạp: multi-source aggregation, subscription restart strategy, và WebAuthn event detection.

### Subscription 6: WebAuthn Authenticator Event (Zone 1 — Auth)

```js
// Lắng nghe kết quả WebAuthn credential từ Authenticator
// (Passkey prompt có thể được triggered từ system level)
const onPasskeyResult = (onSuccess, onFailed) => [
  (dispatch, payload) => {
    // Intercept navigator.credentials.get() result qua custom event
    const handler = (event) => {
      requestAnimationFrame(() => {
        if (event.detail.success) {
          dispatch(payload.onSuccess, event.detail.credential)
        } else {
          dispatch(payload.onFailed, event.detail.error)
        }
      })
    }
    window.addEventListener("axiopass:credential", handler)
    return () => window.removeEventListener("axiopass:credential", handler)
  },
  { onSuccess, onFailed },
]
```

### Subscription 7: L2 Network Health Monitor

```js
// Monitor trạng thái L2 Sequencer — kích hoạt Circuit Breaker khi có sự cố
const onL2HealthCheck = (interval, onStatusChange) => [
  (dispatch, payload) => {
    const check = setInterval(async () => {
      try {
        const health = await sequencerClient.healthCheck()
        // health: { status: "online" | "degraded" | "offline", latency, blockHeight }
        requestAnimationFrame(() => dispatch(payload.onStatusChange, health))
      } catch {
        requestAnimationFrame(() => dispatch(payload.onStatusChange, { status: "offline" }))
      }
    }, payload.interval)
    return () => clearInterval(check)
  },
  { interval, onStatusChange },
]

app({
  subscriptions: (state) => [
    // Luôn monitor L2 health khi app đang chạy
    onL2HealthCheck(10000, L2StatusChanged),
  ],
})

// Action khi L2 status thay đổi
const L2StatusChanged = (state, health) => ({
  ...state,
  l2Status: health.status,
  // circuitBreakerMiddleware (dispatch.md) sẽ tự ngăn các action nguy hiểm
})
```

### Subscription 8: DAO Voting Period Countdown

```js
// Subscribe thời gian còn lại của DAO proposal đang active
const onVotingPeriod = (proposalId, onTick, onExpired) => [
  (dispatch, payload) => {
    const tick = setInterval(async () => {
      const proposal = await daoContract.getProposal(payload.proposalId)
      const timeLeft = proposal.endTime - Date.now()

      if (timeLeft <= 0) {
        requestAnimationFrame(() => dispatch(payload.onExpired, proposal))
        clearInterval(tick)
        return
      }
      requestAnimationFrame(() => dispatch(payload.onTick, { timeLeft, proposal }))
    }, 1000)
    return () => clearInterval(tick)
  },
  { proposalId, onTick, onExpired },
]
```

### Subscription 9: ANS Domain Registration Watcher

```js
// Subscribe để phát hiện khi tên miền .axq của user được đăng ký xong
// (Đăng ký ANS là async — có thể mất vài giây để confirm trên chain)
const onDomainRegistered = (pendingDomain, onConfirmed) => [
  (dispatch, payload) => {
    const poller = setInterval(async () => {
      const record = await ansClient.lookupStatus(payload.pendingDomain)
      if (record.status === "confirmed") {
        requestAnimationFrame(() => dispatch(payload.onConfirmed, record))
        clearInterval(poller)
      }
    }, 2000)  // Poll mỗi 2 giây
    return () => clearInterval(poller)
  },
  { pendingDomain, onConfirmed },
]
```

### Aggregating Multiple Subscriptions — Full DApp Setup

```js
app({
  init: walletInitState,
  view: walletView,
  node: document.getElementById("axiopass-root"),
  dispatch: composedMiddleware,

  subscriptions: (state) => [
    // ── Auth & Security ──────────────────────────────────
    // WebAuthn result listener (chỉ active khi đang xác thực)
    state.auth.screen === "passkey-verify" &&
      onPasskeyResult(PasskeyVerified, PasskeyFailed),

    // ── Network Health ───────────────────────────────────
    // L2 health monitor — luôn bật
    onL2HealthCheck(10000, L2StatusChanged),

    // ── Realtime Data ────────────────────────────────────
    // Balance update khi đã đăng nhập
    state.wallet && onBalanceUpdate(state.wallet, BalancesUpdated),

    // Tx confirmation khi có pending tx
    state.transfer.pendingTx?.hash &&
      onTxConfirmed(state.transfer.pendingTx.hash, TxConfirmed),

    // Bridge relay progress
    state.transfer.pendingTx?.type === "bridge" &&
      onBridgeRelay(state.transfer.pendingTx.lockHash, BridgeProgressUpdated),

    // ── ZK Metrics ───────────────────────────────────────
    state.tab === "dao" && onZKMetrics(5000, MetricsReceived),

    // ── DAO ──────────────────────────────────────────────
    state.activeProposalId &&
      onVotingPeriod(state.activeProposalId, VotingTick, ProposalExpired),

    // ── ANS Domain ───────────────────────────────────────
    state.pendingDomain &&
      onDomainRegistered(state.pendingDomain, DomainConfirmed),
    state.domain &&
      onDomainExpiry(state.domain, 30, DomainExpiryWarning),

    // ── Card Security ────────────────────────────────────
    state.card.revealed && onEvery(1000, CheckCVVAutoHide),

    // ── Session ──────────────────────────────────────────
    state.wallet && onEvery(30000, CheckSessionTimeout),
  ],
})
```

### Tham Khảo Thêm (cập nhật)

- [Effects](effects.md) — `lockAssetsOnL2` bắt đầu bridge flow → `onBridgeRelay` subscription tiếp nối
- [Actions](actions.md) — `L2StatusChanged`, `PasskeyVerified`, `BridgeProgressUpdated`
- [Dispatch](dispatch.md) — `circuitBreakerMiddleware` đọc `l2Status` từ state
- [Design System](../ui/DESIGN_SYSTEM.md) — Zone 8 System States · Zone 4 Card Management
- [Master Roadmap](../AXIOLEDGER_ROADMAP.md) — Mục 3.2: ZK-Metrics Oracle · Mục 8: ANS
