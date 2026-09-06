# AxioPass DApp Tutorial

Welcome to the Axioledger development tutorial. We'll incrementally build a mini **AxioPass wallet view** — covering state, views, actions, effects, and subscriptions — using the axioledger v2 engine that powers the Axioledger DApp.

> **Prerequisites:** Basic JavaScript. No blockchain experience required.  
> **Stack:** axioledger v2.0.22 · Vanilla JS · No bundler needed for this tutorial.

---

## Setup

Create `axiopass-tutorial.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=375, initial-scale=1" />
    <title>AxioPass Tutorial</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: "Work Sans", system-ui, sans-serif;
        background: #f5f5f5;
        display: flex;
        justify-content: center;
      }
      #app {
        width: 375px;
        min-height: 100vh;
        background: #fff;
        position: relative;
      }
      .screen { padding: 24px 16px; }
      .header {
        background: #49DBC8;
        padding: 16px;
        font-size: 18px;
        font-weight: 600;
        color: #000;
      }
      .balance-card {
        background: #000;
        color: #fff;
        border-radius: 16px;
        padding: 24px;
        margin: 16px 0;
        text-align: center;
      }
      .balance-label { font-size: 12px; opacity: 0.6; margin-bottom: 4px; }
      .balance-amount { font-size: 28px; font-weight: 700; }
      .balance-usd { font-size: 14px; opacity: 0.7; margin-top: 4px; }
      .token-list { list-style: none; margin: 8px 0; }
      .token-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        font-size: 14px;
      }
      .token-symbol { font-weight: 600; }
      .btn {
        background: #49DBC8;
        color: #000;
        border: none;
        border-radius: 99px;
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        margin: 8px 0;
      }
      .btn--black { background: #000; color: #fff; }
      .warning { color: red; font-size: 12px; text-align: center; margin-top: 4px; }
      .amount-input {
        font-size: 36px;
        font-weight: 700;
        text-align: center;
        border: none;
        width: 100%;
        margin: 24px 0 8px;
        outline: none;
      }
      .toast {
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #000;
        color: #fff;
        padding: 10px 20px;
        border-radius: 99px;
        font-size: 13px;
      }
      .bottom-nav {
        position: fixed;
        bottom: 0;
        width: 375px;
        background: #fff;
        border-top: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-around;
        padding: 8px 0;
      }
      .nav-tab {
        border: none;
        background: none;
        font-size: 11px;
        padding: 4px 12px;
        cursor: pointer;
        color: #999;
      }
      .nav-tab.active { color: #49DBC8; font-weight: 600; }
      .success-screen { text-align: center; padding: 60px 16px; }
      .success-icon { font-size: 64px; margin-bottom: 16px; }
      .success-title { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
      .success-msg { color: #666; margin-bottom: 32px; }
      .live-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: #49DBC8;
        float: right;
      }
      .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #49DBC8; }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module">
/* Your code goes here */
    </script>
  </body>
</html>
```

---

## Step 1 — Hello AxioPass

```js
import { app, h, text } from "https://cdn.skypack.dev/axioledger"

app({
  view: () =>
    h("div", { class: "screen" }, [
      h("div", { class: "header" }, text("Home")),
      h("p", {}, text("Welcome to AxioPass")),
    ]),
  node: document.getElementById("app"),
})
```

You should see a teal header labeled **Home** and the welcome text below it.

---

## Step 2 — State: Wallet Balance

AxioPass stores token balances as **strings** — the 10 trillion $AXQ total supply exceeds JavaScript's safe integer limit.

```js
app({
  init: {
    screen: "home",
    wallet: {
      axq: "125000000",   // always string — not a number
      usdValue: "1250.00",
    },
  },
  view: (state) =>
    h("div", {}, [
      h("div", { class: "header" }, text("Home")),
      h("div", { class: "balance-card" }, [
        h("p",  { class: "balance-label" },  text("Total Balance")),
        h("h2", { class: "balance-amount" }, text(`${state.wallet.axq} $AXQ`)),
        h("p",  { class: "balance-usd" },    text(`≈ $${state.wallet.usdValue} USD`)),
      ]),
    ]),
  node: document.getElementById("app"),
})
```

---

## Step 3 — 5-Token Portfolio

Add the full 5-token breakdown:

```js
const TOKEN_LABELS = {
  axq: "$AXQ", vpx: "$VPX", sqx: "$SQX", kpx: "$KPX", vrq: "$VRQ",
}

// Token list view component
const TokenList = (tokens) =>
  h("ul", { class: "token-list" },
    Object.entries(tokens).map(([symbol, amount]) =>
      h("li", { key: symbol, class: "token-item" }, [
        h("span", { class: "token-symbol" }, text(TOKEN_LABELS[symbol])),
        h("span", {}, text(amount)),
      ])
    )
  )

app({
  init: {
    wallet: {
      axq: "125000000",
      vpx: "5000",
      sqx: "10000",
      kpx: "3000",
      vrq: "2000",
      usdValue: "1250.00",
    },
  },
  view: (state) =>
    h("div", {}, [
      h("div", { class: "header" }, text("Home")),
      h("div", { class: "balance-card" }, [
        h("p",  { class: "balance-label" },  text("Total Balance")),
        h("h2", { class: "balance-amount" }, text(`${state.wallet.axq} $AXQ`)),
        h("p",  { class: "balance-usd" },    text(`≈ $${state.wallet.usdValue} USD`)),
      ]),
      TokenList(state.wallet),
    ]),
  node: document.getElementById("app"),
})
```

---

## Step 4 — Actions: Send Flow

Add a **Send** button that navigates to a send screen with an amount input. Use actions for all state transitions:

```js
// Actions
const NavigateTo = (state, screen) => ({ ...state, screen })
const SetAmount  = (state, amount) => ({ ...state, sendAmount: amount })

// Helper — compare string amounts safely
const exceedsBalance = (amount, balance) => {
  if (!amount) return false
  return BigInt(amount.replace(/\D/g, "") || "0") > BigInt(balance)
}

// Send screen view
const SendScreen = (state) =>
  h("div", {}, [
    h("div", { class: "header" }, [
      text("Send $AXQ"),
      h("span", { class: "live-badge" }, [
        h("div", { class: "live-dot" }),
        text("L2 Live"),
      ]),
    ]),
    h("div", { class: "screen" }, [
      h("input", {
        class: "amount-input",
        type: "number",
        placeholder: "0",
        value: state.sendAmount || "",
        oninput: (state, event) => [SetAmount, event.target.value],
      }),
      exceedsBalance(state.sendAmount, state.wallet.axq) &&
        h("p", { class: "warning" }, text(`Exceeds ${state.wallet.axq} $AXQ`)),
      h("button", {
        class: "btn",
        onclick: [NavigateTo, "confirm"],
        disabled: !state.sendAmount || exceedsBalance(state.sendAmount, state.wallet.axq),
      }, text("Continue")),
      h("button", {
        class: "btn btn--black",
        onclick: [NavigateTo, "home"],
      }, text("Cancel")),
    ]),
  ])

// Home screen view (updated)
const HomeScreen = (state) =>
  h("div", {}, [
    h("div", { class: "header" }, text("Home")),
    h("div", { class: "balance-card" }, [
      h("p",  { class: "balance-label" },  text("Total Balance")),
      h("h2", { class: "balance-amount" }, text(`${state.wallet.axq} $AXQ`)),
      h("p",  { class: "balance-usd" },    text(`≈ $${state.wallet.usdValue} USD`)),
    ]),
    h("button", {
      class: "btn",
      onclick: [NavigateTo, "send"],
    }, text("Send $AXQ")),
  ])

// Screen router
const ScreenRouter = (state) => {
  if (state.screen === "send")    return SendScreen(state)
  if (state.screen === "success") return SuccessScreen(state)
  return HomeScreen(state)
}

app({
  init: {
    screen: "home",
    sendAmount: "",
    wallet: { axq: "125000000", vpx: "5000", sqx: "10000", kpx: "3000", vrq: "2000", usdValue: "1250.00" },
  },
  view: ScreenRouter,
  node: document.getElementById("app"),
})
```

Now clicking **Send $AXQ** navigates to the send screen. Entering an amount larger than the balance shows the inline warning.

---

## Step 5 — Effects: Broadcast Transaction

When the user confirms, dispatch a **broadcastTx** effect to simulate sending to the L2 network:

```js
// Effect: simulates broadcasting to Axioledger L2
const broadcastTx = (dispatch, { amount, to, onSuccess, onError }) => {
  // Simulate network call (replace with real RPC in production)
  setTimeout(() => {
    if (amount && BigInt(amount) > 0n) {
      dispatch(onSuccess, { txHash: "0xabc123...axq", amount })
    } else {
      dispatch(onError, { message: "Invalid amount" })
    }
  }, 1200)
}

// Action: builds the effect tuple
const ConfirmSend = (state) => [
  { ...state, screen: "loading" },
  [broadcastTx, {
    amount: state.sendAmount,
    to: "alice.axq",
    onSuccess: TxSuccess,
    onError:   TxError,
  }],
]

const TxSuccess = (state, { txHash, amount }) => ({
  ...state,
  screen: "success",
  lastTx: { hash: txHash, amount },
  wallet: {
    ...state.wallet,
    axq: (BigInt(state.wallet.axq) - BigInt(amount)).toString(),
  },
})

const TxError = (state, { message }) => ({
  ...state,
  screen: "home",
  errorMsg: message,
})
```

Add a **Confirm** screen and **Success** screen:

```js
const ConfirmScreen = (state) =>
  h("div", {}, [
    h("div", { class: "header" }, text("Confirm Send")),
    h("div", { class: "screen" }, [
      h("p", {}, text(`Sending ${state.sendAmount} $AXQ to alice.axq`)),
      h("button", { class: "btn", onclick: ConfirmSend }, text("Confirm & Send")),
      h("button", { class: "btn btn--black", onclick: [NavigateTo, "send"] }, text("Back")),
    ]),
  ])

const SuccessScreen = (state) =>
  h("div", { class: "success-screen" }, [
    h("div", { class: "success-icon" }, text("✳")),
    h("h4", { class: "success-title" }, text("Congrats!!!")),
    h("p",  { class: "success-msg"   }, text(`${state.lastTx?.amount} $AXQ sent successfully`)),
    h("button", {
      class: "btn btn--black",
      onclick: [NavigateTo, "home"],
    }, text("OK")),
  ])

// Update ScreenRouter:
const ScreenRouter = (state) => {
  if (state.screen === "send")    return SendScreen(state)
  if (state.screen === "confirm") return ConfirmScreen(state)
  if (state.screen === "success") return SuccessScreen(state)
  if (state.screen === "loading") return h("div", { class: "screen" }, [h("p", {}, text("Broadcasting to L2..."))])
  return HomeScreen(state)
}
```

---

## Step 6 — Subscriptions: Live L2 Status

Subscriptions let the app react to the outside world. Add a simulated L2 health subscription that updates a badge:

```js
// Subscriber: polls L2 health every 5 seconds
const l2HealthSubscriber = (dispatch, { action, interval }) => {
  const poll = () => {
    // Simulate RPC health check (replace with real fetch)
    const latency = Math.floor(Math.random() * 50) + 10
    dispatch(action, { connected: true, latency })
  }
  poll()
  const id = setInterval(poll, interval)
  return () => clearInterval(id)   // cleanup when subscription deactivates
}

const onL2Health = (action) => [l2HealthSubscriber, { action, interval: 5000 }]

// Action: update L2 state
const UpdateL2Status = (state, { connected, latency }) => ({
  ...state,
  l2: { connected, latency },
})

app({
  init: {
    screen: "home",
    sendAmount: "",
    l2: { connected: false, latency: null },
    wallet: { axq: "125000000", vpx: "5000", sqx: "10000", kpx: "3000", vrq: "2000", usdValue: "1250.00" },
  },
  view: ScreenRouter,
  node: document.getElementById("app"),
  subscriptions: (state) => [
    // L2 health poll — active on all main screens
    state.screen !== "splash" && onL2Health(UpdateL2Status),
  ],
})
```

The L2 status badge in the Send screen will now update every 5 seconds with a simulated latency.

---

## Step 7 — Bottom Navigation

Add the 5-tab bottom navbar (Home · Crypto · Card · Cashback · More):

```js
const NAV_TABS = [
  { key: "home",     label: "Home"     },
  { key: "crypto",   label: "Crypto"   },
  { key: "card",     label: "Card"     },
  { key: "cashback", label: "Cashback" },
  { key: "more",     label: "More"     },
]

const BottomNav = (activeTab) =>
  h("nav", { class: "bottom-nav" },
    NAV_TABS.map(({ key, label }) =>
      h("button", {
        key,
        class: { "nav-tab": true, active: activeTab === key },
        onclick: [NavigateTo, key],
      }, text(label))
    )
  )

// Main screen wrapper — shows BottomNav on all main screens
const AUTH_SCREENS = ["splash", "onboarding", "registration", "otp", "pin-setup"]

const AppShell = (state) => {
  const isAuthScreen = AUTH_SCREENS.includes(state.screen)
  return h("div", {}, [
    MainContent(state),
    !isAuthScreen && BottomNav(state.screen),
  ])
}
```

Update `view: AppShell` in your `app()` call.

---

## Conclusion

You've built a complete mini-wallet that demonstrates all 5 axioledger concepts in the Axioledger context:

| Concept | AxioPass usage |
| ------- | -------------- |
| **State** | 5-token wallet balances (always `string`), screen FSM, L2 status |
| **Views** | Screen router, zone-aware shells, AXQ token components |
| **Actions** | Navigate, SetAmount, ConfirmSend, TxSuccess, UpdateL2Status |
| **Effects** | `broadcastTx` — async L2 RPC call dispatching result actions |
| **Subscriptions** | `l2HealthSubscriber` — polling with interval + cleanup |

### Next Steps

- Read the [Architecture docs](architecture/state.md) for the full production state shape
- Explore [COMPONENT_INVENTORY.md](ui/COMPONENT_INVENTORY.md) for all 201 AxioPass components
- Check [DESIGN_SYSTEM.md](ui/DESIGN_SYSTEM.md) for the complete AXQ token system
- See [flowchart.md](architecture/flowchart.md) for the cross-chain transaction flow
- See [packages/](../packages/) for the `@axioledger/*` package ecosystem
