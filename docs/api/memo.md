# `memo()`

**_Definition:_**

> A wrapper function to cache your [views](../architecture/views.md) based on properties you pass into them. In AxioPass, `memo()` is critical for performance — preventing expensive re-renders of price charts, token lists, and transaction history on every L2 event tick.

**_Import & Usage:_**

```js
import { memo } from "axioledger"

// ...

memo(view, props)
```

**_Signature & Parameters:_**

```elm
memo : (View, IndexableData) -> VNode
```

| Parameters    | Type                                            | Required? |
| ------------- | ----------------------------------------------- | --------- |
| [view](#view) | [View](../architecture/views.md)                | yes :100: |
| [data](#data) | anything indexable (i.e. Array, Object, String) | no        |

| Return Value                                         | Type  |
| ---------------------------------------------------- | ----- |
| [virtual node](../architecture/views.md#virtual-dom) | VNode |

`memo()` lets you take advantage of a performance optimization technique known as [memoization](../architecture/views.md#memoization).

---

## Axioledger Memoization Patterns

AxioPass receives a continuous stream of L2 events via WebSocket (block headers, price ticks, liquidity updates). Without `memo()`, every tick would re-render the entire view tree — including heavy chart components and long transaction lists.

### Rule: Memoize on Stable Data Slices

The key principle is to pass only the data the component actually needs — not the full state. This creates a stable memo boundary that only re-renders when the relevant slice changes.

```js
// ❌ No memo — re-renders every state change including unrelated L2 ticks
const portfolioView = (state) => PortfolioCard(state.wallet)

// ✅ Memoized on wallet slice only
const portfolioView = (state) => memo(PortfolioCard, state.wallet)
```

### Price Feed Component

The Crypto screen displays live price data. The chart itself is expensive to render but only needs to update when the price data changes — not on every block event:

```js
import { h, text, memo } from "axioledger"

// Expensive component: SVG line chart with 100+ data points
const PriceChart = (priceHistory) =>
  h("svg", { class: "axq-price-chart", viewBox: "0 0 375 180" }, [
    h("polyline", {
      points: priceHistory.map((p, i) => `${i * 3},${180 - p.normalized * 180}`).join(" "),
      stroke: "var(--color-brand-teal)",
      fill: "none",
      "stroke-width": "2",
    }),
  ])

// In the Crypto screen view:
const CryptoScreen = (state) =>
  h("div", { class: "axq-screen axq-screen--crypto" }, [
    // Memoized — only re-renders when priceHistory changes, not on every block tick
    memo(PriceChart, state.crypto.priceHistory),

    // Always re-renders — live price needs to update every tick
    h("h2", { class: "axq-price-display" }, text(`$${state.crypto.currentPrice}`)),
  ])
```

### Portfolio Token List

The wallet holds up to 5 token balances ($AXQ, $VPX, $SQX, $KPX, $VRQ). Memoize the list component so it only re-renders when balances actually change:

```js
const TokenBalanceList = (tokens) =>
  h("ul", { class: "axq-token-list" },
    Object.entries(tokens).map(([symbol, amount]) =>
      h("li", { key: symbol, class: "axq-token-list__item" }, [
        h("span", { class: "axq-token-list__symbol" }, text(symbol)),
        // amount is always a string — 10T $AXQ exceeds Number.MAX_SAFE_INTEGER
        h("span", { class: "axq-token-list__amount" }, text(amount)),
      ])
    )
  )

const HomeScreen = (state) =>
  h("div", { class: "axq-screen axq-screen--home" }, [
    // Memoized — tokens slice only changes on actual balance updates
    memo(TokenBalanceList, state.wallet.tokens),

    // Not memoized — notification count updates frequently
    h("div", { class: "axq-notification-badge" }, text(state.notifications.unread)),
  ])
```

### Transaction History List

Transaction history is append-only. Using `memo()` on the list prevents full re-render when new blocks arrive that don't affect this wallet:

```js
const TxHistoryView = (txHistory) =>
  h("ul", { class: "axq-tx-list" },
    txHistory.map((tx) =>
      h("li", { key: tx.hash, class: "axq-tx-list__item" }, [
        h("span", { class: "axq-tx-list__type" }, text(tx.type)),
        h("span", { class: "axq-tx-list__amount" }, text(`${tx.amount} $AXQ`)),
        h("time",  { class: "axq-tx-list__time", datetime: tx.timestamp }, text(tx.displayTime)),
      ])
    )
  )

const HistoryScreen = (state) =>
  h("div", { class: "axq-screen" }, [
    memo(TxHistoryView, state.txHistory),
  ])
```

### Staking APY Bar Chart

The staking screen shows an APY bar chart that only changes when the APY data updates — not on every WebSocket ping:

```js
const StakingApyChart = ({ validators }) =>
  h("div", { class: "axq-bar-chart" },
    validators.map((v) =>
      h("div", {
        key: v.id,
        class: "axq-bar-chart__bar",
        style: {
          height: `${v.apyPercent * 2}px`,
          backgroundColor: v.isMine ? "var(--color-brand-teal)" : "var(--color-surface-muted)",
        },
        title: `${v.id}: ${v.apyPercent}% APY`,
      })
    )
  )

const StakingScreen = (state) =>
  h("div", { class: "axq-screen" }, [
    memo(StakingApyChart, { validators: state.staking.validators }),
    h("p", { class: "axq-staking__live-apy" }, text(`Live APY: ${state.staking.currentApy}%`)),
  ])
```

---

## Parameters

### `view`

A [view](../architecture/views.md) you want [memoized](../architecture/views.md#memoization).

### `data`

The data to pass along to the wrapped view function instead of the [state](../architecture/state.md). The wrapped view is recomputed when the data for it changes.

**Axioledger note:** When using `memo()` with token amounts, always pass the string directly — not a derived number — to avoid precision comparison issues:

```js
// ✅ Stable string comparison — memo correctly detects changes
memo(BalanceDisplay, state.wallet.axq)          // "10000000000000"

// ⚠️ May cause unexpected re-renders — string→number conversion loses precision
memo(BalanceDisplay, Number(state.wallet.axq))  // Infinity or imprecise
```

---

## Example

Here we have a list of numbers displayed in a regular view as well as a memoized version of the same view. One button changes the list which affects both views. Another button updates a counter which affects the counter's view and also the regular view of the list but not the memoized view of the list.

```js
import { h, text, app, memo } from "axioledger"

const randomHex = () => "0123456789ABCDEF"[Math.floor(Math.random() * 16)]
const randomColor = () => "#" + Array.from({ length: 6 }, randomHex).join("")

const listView = (list) =>
  h("p", {
    style: {
      backgroundColor: randomColor(),
      color: randomColor(),
    },
  }, text(list))

const MoreItems = (state) => ({ ...state, list: [...state.list, randomHex()] })
const Increment = (state) => ({ ...state, counter: state.counter + 1 })

app({
  init: {
    list: ["a", "b", "c"],
    counter: 0,
  },
  view: (state) =>
    h("main", {}, [
      h("button", { onclick: MoreItems }, text("Grow list")),
      h("button", { onclick: Increment }, text("+1 to counter")),
      h("p", {}, text(`Counter: ${state.counter}`)),
      h("p", {}, text("Regular view showing list:")),
      listView(state.list),
      h("p", {}, text("Memoized view showing list:")),
      memo(listView, state.list),
    ]),
  node: document.querySelector("main"),
})
```

---

## Other Considerations

### Performance

Using `memo()` too often will lead to [degraded performance](../architecture/views.md#performance). Only use `memo()` when you know it will improve rendering. When in doubt, benchmark!

**AxioPass memoization guidelines:**

| Component               | Use `memo()`? | Reason                                           |
| ----------------------- | ------------- | ------------------------------------------------ |
| Price chart (SVG)       | ✅ Yes        | Expensive render, changes only on price tick     |
| Token balance list      | ✅ Yes        | Changes only on balance update, not block events |
| Transaction history     | ✅ Yes        | Append-only, stable for most ticks               |
| Staking APY bar chart   | ✅ Yes        | Validator data changes infrequently              |
| Live price display      | ❌ No         | Must update every tick                           |
| Notification badge      | ❌ No         | Changes frequently                               |
| Bottom navigation bar   | ❌ No         | Active tab state changes on every navigation     |
| OTP / PIN input         | ❌ No         | Real-time keystroke feedback required            |

### Memo Data Gotcha

When axioledger checks memo data for changes it will do index-for-index comparisons between what the data currently is with how it was in the previous state. So, any indexable type like strings and arrays can be compared with one another and in certain edge cases be considered "equal" when it comes to determining if a re-render should happen.

**Axioledger example:** If you pass the `tokens` object, adding a new token key won't trigger re-render unless the object reference changes — use spread to force a new reference:

```js
// ✅ Forces memo to detect the change
const UpdateTokenBalance = (state, { symbol, amount }) => ({
  ...state,
  wallet: {
    ...state.wallet,
    tokens: { ...state.wallet.tokens, [symbol]: amount },  // new object reference
  },
})

// ❌ Mutates in place — memo won't re-render
const BrokenUpdate = (state, { symbol, amount }) => {
  state.wallet.tokens[symbol] = amount  // NEVER mutate state directly in axioledger
  return state
}
```
