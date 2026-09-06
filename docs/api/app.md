# `app()`

Initializes and mounts a axioledger application. In the **Axioledger DApp**, `app()` bootstraps the entire AxioPass wallet UI — wiring together the 5-zone screen router, auth state, and real-time blockchain subscriptions.

```elm
app : ({ Init, View, Node, Subscriptions?, Dispatch? }) -> DispatchFn
```

| Prop                             | Type                                                                        | Required?                        |
| -------------------------------- | --------------------------------------------------------------------------- | -------------------------------- |
| [init:](#init)                   | <ul><li>[State](../architecture/state.md)</li><li>[[State](../architecture/state.md), ...[Effect](../architecture/effects.md)[]]</li><li>[Action](../architecture/actions.md)</li><li>[[Action](../architecture/actions.md), any]</li></ul> | No                               |
| [view:](#view)                   | [View](../architecture/views.md)                                            | No                               |
| [node:](#node)                   | DOM element                                                                 | **Yes when `view:` is present.** |
| [subscriptions:](#subscriptions) | Function                                                                    | No                               |
| [dispatch:](#dispatch)           | [Dispatch Initializer](../architecture/dispatch.md#dispatch-initializer)    | No                               |

| Return Value                            | Type     |
| --------------------------------------- | -------- |
| [dispatch](../architecture/dispatch.md) | Function |

```js
import { app, h, text } from "axioledger"

app({
  init: { message: "Hello World!" },
  view: (state) => h("p", {}, text(state.message)),
  node: document.getElementById("app"),
})
```

---

## Axioledger DApp Bootstrap

The AxioPass wallet is mounted with a full init sequence: session restore, KYC gate check, and WebSocket subscription activation.

```js
import { app } from "axioledger"
import { ScreenRouter } from "./views/router"
import { RestoreSession, InitWalletAction } from "./actions/auth"
import { loadSession, connectWebSocket } from "./effects"
import { axioledgerMiddleware } from "./dispatch/middleware"
import { buildSubscriptions } from "./subscriptions"

const dispatch = app({
  init: [
    {
      screen: "splash",
      auth: { status: "idle" },
      wallet: { balance: "0", tokens: {} },
      l2: { connected: false },
    },
    loadSession(RestoreSession),        // restore WebAuthn session
    connectWebSocket("wss://rpc.axioledger.io"),
  ],
  view: ScreenRouter,
  node: document.getElementById("axiopass-root"),
  subscriptions: buildSubscriptions,
  dispatch: axioledgerMiddleware,
})

export { dispatch }
```

### 5-Zone Screen Router

AxioPass routes across 5 bottom-nav zones. Each zone has its own state slice and brand color:

| Zone       | Brand Color | State Slice      | Key Screens                        |
| ---------- | ----------- | ---------------- | ---------------------------------- |
| Home       | `#49DBC8`   | `state.home`     | Dashboard, Add Balance, Services   |
| Crypto     | `#49DBC8`   | `state.crypto`   | Portfolio, Swap, Trade, Wallet Detail |
| Card       | `#AF96FB`   | `state.card`     | Virtual Card, Flip, Pay Debt       |
| Cashback   | `#BEFF6C`   | `state.cashback` | Rewards, History                   |
| More       | `#F5F5F5`   | `state.more`     | Profile, Settings, FAQ, Language   |

---

## `init:`

_(default value: `{}`)_

Initializes the app by either setting the initial value of the [state](../architecture/state.md) or taking an [action](../architecture/actions.md). It takes place before the first view render and subscriptions registration.

### Forms of `init:`

- `init: state`

  Sets the initial state directly.

  ```js
  app({
    init: { counter: 0 },
    // ...
  })
  ```

- `init: [state, ...effects]`

  Sets the initial state and then runs the given list of [effects](../architecture/effects.md).

  ```js
  app({
    init: [
      { loading: true },
      log("Loading..."),
      load("myUrl?init", DoneAction),
    ],
    // ...
  })
  ```

  **Axioledger pattern** — init with session restore and WebSocket:

  ```js
  app({
    init: [
      {
        screen: "splash",
        auth: { status: "idle", passkey: null },
        wallet: {
          address: null,
          balance: "0",         // always string — 10T $AXQ exceeds Number.MAX_SAFE_INTEGER
          axq: "0",
          vpx: "0",
          sqx: "0",
          kpx: "0",
          vrq: "0",
        },
        txHistory: [],
        notifications: [],
        l2: { connected: false, latency: null },
      },
      loadSession(RestoreSession),
      connectWebSocket("wss://rpc.axioledger.io"),
    ],
    // ...
  })
  ```

- `init: Action`

  Runs the given [Action](../architecture/actions.md).

  ```js
  const Reset = (_state) => ({ counter: 0 })

  app({
    init: Reset,
    // ...
  })
  ```

- `init: [Action, payload]`

  Runs the given [Action](../architecture/actions.md) with a payload.

  ```js
  const SetCounter = (_state, n) => ({ counter: n })

  app({
    init: [SetCounter, 10],
    // ...
  })
  ```

  **Axioledger pattern** — init from deep link payload:

  ```js
  // app receives deep link: axiopass://pay?to=alice.axq&amount=1000
  app({
    init: [InitFromDeepLink, { to: "alice.axq", amount: "1000" }],
    // ...
  })
  ```

---

## `view:`

The [top-level view](../architecture/views.md#top-level-view) for the app. In AxioPass, the top-level view is the **ScreenRouter** — a finite-state-machine that reads `state.screen` and renders the current zone.

```js
app({
  view: (state) => h("main", {}, [
    outworld(state),
    netherrealm(state),
  ]),
})
```

**Axioledger ScreenRouter pattern:**

```js
import { h } from "axioledger"
import { HomeScreen, CryptoScreen, CardScreen, CashbackScreen, MoreScreen } from "./screens"
import { BottomNav } from "./components/BottomNav"
import { SplashScreen, OnboardingScreen, OTPScreen, PINScreen } from "./screens/auth"

const AUTH_SCREENS = ["splash", "onboarding-1", "onboarding-2", "registration", "otp", "pin-setup"]

export const ScreenRouter = (state) => {
  if (AUTH_SCREENS.includes(state.screen)) {
    return AuthRouter(state)
  }

  return h("div", { class: "axiopass-shell" }, [
    MainRouter(state),
    h(BottomNav, { active: state.activeTab }),
  ])
}
```

---

## `node:`

The DOM element to render the virtual DOM over (the **mount node**). In AxioPass iOS WebView, this is the single root element:

```html
<div id="axiopass-root"></div>
```

```js
app({
  node: document.getElementById("axiopass-root"),
  // ...
})
```

---

## `subscriptions:`

AxioPass uses subscriptions to maintain real-time blockchain state. Every time state changes, the subscription list is recalculated — activating or deactivating listeners as needed.

```js
import { onWebSocket, onVisibilityChange, onDeepLink } from "@axioledger/events"
import { L2HealthPoll, DaoVotingCountdown } from "./subscriptions"

app({
  subscriptions: (state) => [
    // WebSocket active only when authenticated
    state.auth.status === "authenticated" &&
      onWebSocket("wss://rpc.axioledger.io", ReceiveL2Event),

    // L2 health poll — always active after login
    state.auth.status === "authenticated" &&
      L2HealthPoll(state.l2.endpoint),

    // DAO countdown — only on governance screen
    state.screen === "governance" &&
      DaoVotingCountdown(state.dao.proposalDeadline),

    // Deep link listener — always active
    onDeepLink(HandleDeepLink),

    // Page visibility — pause polling when backgrounded
    onVisibilityChange(HandleVisibility),
  ],
})
```

---

## `dispatch:`

A [dispatch initializer](../architecture/dispatch.md#dispatch-initializer) that wraps the default dispatch function. AxioPass uses a composed middleware stack:

```js
import { composeMiddleware, kycGateMiddleware, perfTracer, stateMutationGuard } from "./dispatch"

app({
  dispatch: composeMiddleware(
    kycGateMiddleware,      // block sensitive actions if KYC not verified
    perfTracer,             // log dispatch timing for ZK-Metrics
    stateMutationGuard,     // freeze state objects in development
  ),
  // ...
})
```

See [`dispatch.md`](../architecture/dispatch.md) for the full middleware catalog.

---

## Return Value

`app()` returns the [dispatch](../architecture/dispatch.md) function your app uses. In AxioPass, the returned dispatch is exported for use by native bridge calls (iOS ↔ WebView):

```js
const dispatch = app({ ... })

// iOS native bridge can dispatch actions via JS interop:
window.__axiopass_dispatch = dispatch

// External call from Swift:
// window.__axiopass_dispatch(["NavigateTo", { screen: "scan-qr" }])
```

Calling the dispatch function with no arguments frees the app's resources and runs every active subscription's cleanup function.

---

## Other Considerations

- You can embed your axioledger application within another already existing axioledger application or an app that was built with some other framework.

- Multiple axioledger applications can coexist on the page simultaneously. They each have their own state and behave independently relative to each other. They can communicate with each other using subscriptions and effects (i.e. using events).

- **Axioledger note:** Token balance values (`balance`, `axq`, `vpx`, `sqx`, `kpx`, `vrq`) must always be stored and passed as **`string`** — the total supply of 10,000,000,000,000 $AXQ exceeds `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991). Use BigInt or string-based arithmetic libraries for all calculations.
