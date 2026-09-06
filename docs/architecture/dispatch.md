# Dispatch

**_Definition:_**

> The **dispatch** function controls axioledger's core dispatching process which executes [actions](actions.md), applies state transitions, runs [effects](effects.md), and starts/stops [subscriptions](subscriptions.md) that need it.

You can augment the dispatcher to tap into the dispatching process for debugging/instrumentation purposes. Such augmentation is loosely comparable to middleware used in other frameworks.

**_Signature:_**

```elm
DispatchFn : (Action, Payload?) -> void
```

---

## Dispatch Initializer

The dispatch initializer accepts the default dispatch as its sole argument and must give back a dispatch in return. axioledger's default dispatch initializer is equivalent to:

```js
const boring = (dispatch) => dispatch
```

In your own initializer you'll likely want to return a variant of the regular dispatch.

---

## Augmented Dispatching

A dispatch function accepts as its first argument an [action](actions.md) or anything an action can return, and its second argument is the default [payload](actions.md#payloads) if there is one. The payload will be used if the first argument is an action function.

The action will then be carried out and its resulting state transition will be applied and then any effects it requested to be run will be run.

```js
// DispatchFn : (Action, Payload?) -> void
const dispatch = (action, payload) => {
  // Do your custom work here.
  // ...

  // Hand dispatch over to built-in dispatch.
  dispatch(action, payload)
}
```

## Dispatch recursion

Dispatch is implemented in a recursive fashion, such that if the action dispatched does not represent the next state (or next state with effects), it will use the dispatched action and payload to resolve the next thing to dispatch. 

A call to `dispatch([ActionFn, payload])` will recurse `dispatch(ActionFn, payload)`, which will recurse to `dispatch(ActionFn(currentState, payload))`. 

---

## Example 1 - Log actions

Let's say you need to debug the order in which actions are dispatched. An augmented dispatch that logs each action could help with that, rather than having to add `console.log` to every action.

```js
const logActionsMiddleware = dispatch => (action, payload) => {

  if (typeof action === 'function') {
    console.log('DISPATCH: ', action.name || action)
  }

  //pass on to original dispatch
  dispatch(action, payload)
}
```

---

## Example 2 - Log state

To log each state transformation, we first create a general state middleware and then use it to create an augmented dispatch for state logging:

```js
const stateMiddleware = fn => dispatch => (action, payload) => {
  if (Array.isArray(action) && typeof action[0] !== 'function') {
    action = [fn(action[0]), ...action.slice(1)]
  } else if (!Array.isArray(action) && typeof action !== 'function') {
    action = fn(action)
  }
  dispatch(action, payload)
}

const logStateMiddleware = stateMiddleware(state => { 
  console.log('STATE:', state)
  return state
})
```

---

## Example 3 - Immutable state

When learning axioledger and during developemt it can sometimes be useful to guarantee states are not mutated by mistake, let's use `stateMiddleware` above to create an augmented dispatch for state immutability:

```js
// a proxy prohibiting mutation
const immutableProxy = o => {
  if (o===null || typeof o !== 'object') return o
  return new Proxy(o, {
    get(obj, prop) {
      return immutableProxy(obj[prop])
    },
    set(obj, prop) {
      throw new Error(`Can not set prop ${prop} on immutable object`)
    }
  })
}

export const immutableMiddleware = stateMiddleware(state => immutableProxy(state))
```


## Usage

The [`app()`](../api/app.md) function will check to see if you have a dispatch initializer assigned to the [`dispatch:`](../api/app.md#dispatch) property while instantiating your application. If so, your app will use it instead of the default one.

The only time the dispatch initializer gets used is once during the instantiation of your app.

Only one dispatch initializer can be defined per app. Consequently, only one dispatch can be defined per app.

Extending the example from above, the dispatch initializer would be used like this:

```js
import { mwLogState } from "./middleware.js"

app({
  // ...
  dispatch: logActionsMiddleware
})
```

And if you wanted to use all custom dispatches together, you can chain them like this:

```js
import { logActionsMiddleware, logStateMiddleware, immutableMiddleware } from "./middleware.js"

app({
  // ...
  dispatch: dispatch => logStateMiddleware(logActionsMiddleware(immutableMiddleware(dispatch)))
})
```


---

## Other Considerations

- [`app()`](../api/app.md) returns the dispatch function to allow [dispatching externally](../api/app.md#instrumentation).

- If you're feeling truly adventurous and/or know what you're doing you can choose to have your dispatch initializer return a completely custom dispatch from the ground up. For what purpose? You tell me! However, a completely custom dispatch won't have access to some important internal framework functions, so it's unlikely to be something useful without building off of the original dispatch.

---

## Axioledger — Dispatch Middleware Patterns

> Phần này mở rộng Dispatch của axioledger sang các pattern thực tế của Axioledger DApp — telemetry, security monitoring, và ZK proof instrumentation.

### Middleware 1: Axioledger Telemetry Middleware

Log mọi Action dispatch lên ZK-Metrics Indexer (để tính KPI On-chain active users):

```js
// axioledgerTelemetry — gửi anonymized action metrics lên ZK-Metrics Oracle
// Chỉ ghi tên action, KHÔNG ghi payload (bảo vệ privacy người dùng)
const axioledgerTelemetry = (dispatch) => (action, payload) => {
  if (typeof action === "function" && action.name) {
    // Chỉ track action name — anonymized, không chứa PII
    metricsCollector.track({
      event: action.name,
      timestamp: Date.now(),
      // ZK-Proof xác nhận action này là real user (chống bot)
    })
  }
  dispatch(action, payload)
}
```

### Middleware 2: Circuit Breaker — Bảo Vệ Khi L2 Gặp Sự Cố

```js
// circuitBreakerMiddleware — tạm dừng dispatch khi L2 Sequencer gặp vấn đề
// Kích hoạt Escape Hatch (L1 Fallback) tự động
let l2Status = "online" // "online" | "degraded" | "offline"

const circuitBreakerMiddleware = (dispatch) => (action, payload) => {
  // Nếu L2 offline, chỉ cho phép các action an toàn (read-only, L1 fallback)
  if (l2Status === "offline") {
    const safeActions = ["ActivateEscapeHatch", "ViewBalance", "Stop"]
    if (!safeActions.includes(action?.name)) {
      dispatch(ShowL2OfflineWarning)
      return
    }
  }
  dispatch(action, payload)
}
```

### Middleware 3: ZK Auth Guard

```js
// zkAuthGuard — yêu cầu ZK Auth Proof trước các action nhạy cảm
const PROTECTED_ACTIONS = ["SwapIntentAction", "BridgeAssets", "WithdrawFunds", "CastVote"]

const zkAuthGuard = (dispatch) => (action, payload) => {
  if (typeof action === "function" && PROTECTED_ACTIONS.includes(action.name)) {
    // Kiểm tra ZK Auth Proof còn hiệu lực (TTL: 5 phút)
    if (!zkSession.isValid()) {
      // Yêu cầu xác thực lại qua AxioPass (Passkey / Face ID)
      dispatch(RequireReAuthentication, { pendingAction: action, pendingPayload: payload })
      return
    }
  }
  dispatch(action, payload)
}
```

### Middleware 4: Immutable State Guard (Dev Mode)

```js
// Dùng khi phát triển — đảm bảo state không bị mutate trực tiếp
const immutableStateGuard = (dispatch) => (action, payload) => {
  if (process.env.NODE_ENV === "development") {
    if (Array.isArray(action) && typeof action[0] !== "function") {
      action = [deepFreeze(action[0]), ...action.slice(1)]
    } else if (!Array.isArray(action) && typeof action !== "function") {
      action = deepFreeze(action)
    }
  }
  dispatch(action, payload)
}
```

### Kết Hợp Tất Cả Middleware

```js
import { app } from "axioledger"

app({
  init: walletInitState,
  view: walletView,
  node: document.getElementById("axiopass-root"),
  subscriptions: walletSubscriptions,

  // Chuỗi middleware: telemetry → zkAuthGuard → circuitBreaker → immutableGuard
  dispatch: (dispatch) =>
    axioledgerTelemetry(
      zkAuthGuard(
        circuitBreakerMiddleware(
          immutableStateGuard(dispatch)
        )
      )
    ),
})
```

### Tham Khảo Thêm

- [Actions](actions.md) — Các action được bảo vệ bởi `zkAuthGuard`
- [Effects](effects.md) — `initPasskeyAuth` được gọi khi `RequireReAuthentication`
- [Master Roadmap](../AXIOLEDGER_ROADMAP.md) — Mục 12: Bảo Mật & Kiểm Toán

---

## Axioledger — Dispatch Middleware Nâng Cao

> Mở rộng từ phần trước — logging nâng cao, performance tracing, và anti-pattern guards.

### Middleware 5: Performance Tracer — Đo Thời Gian Action

```js
// Đo thời gian mỗi action dispatch để phát hiện slow actions (> 16ms = drop frame)
const performanceTracer = (dispatch) => (action, payload) => {
  if (typeof action !== "function") {
    dispatch(action, payload)
    return
  }
  const actionName = action.name || "anonymous"
  const start = performance.now()

  const tracedDispatch = (a, p) => {
    const duration = performance.now() - start
    if (duration > 16) {
      // Action chậm hơn 1 frame (16ms) — có thể gây jank
      console.warn(`[AXQ Perf] Slow action: ${actionName} (${duration.toFixed(2)}ms)`)
    }
    dispatch(a, p)
  }
  tracedDispatch(action, payload)
}
```

### Middleware 6: Anti-Pattern Guard — Phát Hiện State Mutation

```js
// Phát hiện nếu action trả về cùng object reference (mutation bug)
const stateMutationGuard = (dispatch) => (action, payload) => {
  if (typeof action !== "function" || process.env.NODE_ENV !== "development") {
    dispatch(action, payload)
    return
  }
  // Wrap action để intercept return value
  const guardedAction = (state, p) => {
    const result = action(state, p)
    // Kiểm tra: nếu result === state (same reference), đây là mutation bug!
    const nextState = Array.isArray(result) ? result[0] : result
    if (nextState !== null && nextState !== undefined && nextState === state) {
      console.error(
        `[AXQ Guard] Action "${action.name}" trả về cùng state reference! ` +
        `Dùng { ...state, ... } để tạo object mới.`
      )
    }
    return result
  }
  Object.defineProperty(guardedAction, "name", { value: action.name })
  dispatch(guardedAction, payload)
}
```

### Middleware 7: KYC Gate Guard

```js
// Một số tính năng yêu cầu KYC verified — guard tại dispatch level
const KYC_REQUIRED_ACTIONS = [
  "InitiateBridge",
  "SwapIntentAction",
  "SubmitInternationalTransfer",
  "UnlockPremiumCard",
]

const kycGateGuard = (dispatch) => (action, payload) => {
  if (
    typeof action === "function" &&
    KYC_REQUIRED_ACTIONS.includes(action.name)
  ) {
    // Lấy state từ app — cần app instance
    const currentState = appInstance.getState()
    if (currentState.kyc.tier === "none") {
      dispatch(RequireKYC, {
        pendingAction: action,
        pendingPayload: payload,
        requiredTier: "basic",
      })
      return
    }
    if (action.name === "UnlockPremiumCard" && currentState.kyc.tier !== "premium") {
      dispatch(RequireKYCUpgrade, { targetTier: "premium" })
      return
    }
  }
  dispatch(action, payload)
}
```

### Middleware Composition — Production Setup

```js
import { app } from "axioledger"

// Composing middlewares (innermost = chạy cuối, outermost = chạy đầu tiên)
const composeMiddleware = (...middlewares) =>
  (dispatch) => middlewares.reduceRight((d, mw) => mw(d), dispatch)

app({
  init: walletInitState,
  view: walletView,
  node: document.getElementById("axiopass-root"),
  subscriptions: walletSubscriptions,

  dispatch: composeMiddleware(
    // Chạy đầu tiên (outermost) — logging tổng thể
    axioledgerTelemetry,

    // Security guards
    zkAuthGuard,
    kycGateGuard,

    // Network guards
    circuitBreakerMiddleware,

    // Dev tools (chỉ bật trong development)
    ...(process.env.NODE_ENV === "development"
      ? [performanceTracer, stateMutationGuard, immutableStateGuard]
      : []
    ),
  ),
})
```

### Middleware Execution Order

```
User click → onSwapButton
    ↓
[1] axioledgerTelemetry     → ghi log action name (anonymized)
    ↓
[2] zkAuthGuard             → kiểm tra ZK session TTL (5 phút)
    ↓
[3] kycGateGuard            → kiểm tra KYC tier
    ↓
[4] circuitBreakerMiddleware → kiểm tra L2 status
    ↓
[5] performanceTracer (dev) → bắt đầu đo thời gian
    ↓
[6] stateMutationGuard (dev)→ wrap action để detect mutation
    ↓
[7] immutableStateGuard (dev)→ freeze state object
    ↓
    axioledger core dispatch
    ↓
    State transition + Effects
```

### Tham Khảo Thêm (cập nhật)

- [Actions](actions.md) — `RequireKYC`, `RequireReAuthentication` được dispatch bởi guards
- [State](state.md) — `l2Status`, `kyc.tier` được đọc bởi guards
- [Subscriptions](subscriptions.md) — `onL2HealthCheck` cập nhật `l2Status` cho Circuit Breaker
- [Design System](../ui/DESIGN_SYSTEM.md) — Zone 2 KYC screens · Zone 8 Error states
- [Master Roadmap](../AXIOLEDGER_ROADMAP.md) — Mục 12: Bảo Mật & Kiểm Toán
