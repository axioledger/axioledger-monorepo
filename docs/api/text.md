# `text()`

**_Definition:_**

> A function that creates a [virtual DOM node (VNode)](../architecture/views.md#virtual-dom) out of a given value. In AxioPass, `text()` is used for all token labels, balance displays, transaction amounts, and status strings — with strict string-safety rules for the 10T $AXQ supply.

**_Import & Usage:_**

You'll normally use it with [`h()`](./h.md).

```js
import { text } from "axioledger"

// ...

h("p", {}, text(content))
```

**_Signature & Parameters:_**

```elm
text : (String | Number) -> VNode
```

| Parameter           | Type                                                  | Required?      | Notes                                   |
| ------------------- | ----------------------------------------------------- | -------------- | --------------------------------------- |
| [content](#content) | any (sort of), but meaningfully only String or Number | yes :100:      |                                         |
| node                | DOM element                                           | prohibited :x: | This is for internal axioledger use only! |

| Return Value                                              | Type  |
| --------------------------------------------------------- | ----- |
| [virtual text node](../architecture/views.md#virtual-dom) | VNode |

You would use `text()` to insert regular text content into your views.

```js
h("p", {}, text("You must construct additional pylons."))
```

Of course, this may include anything relevant from the [current state](../architecture/state.md).

```js
h("p", {}, text(state.message))
```

`text()` exists as the way of defining text nodes such that axioledger's implementation is kept simpler than it otherwise would have been.

---

## Axioledger Text Patterns

### Token Amount Display — String Safety Rule

> **Critical:** All $AXQ token amounts **must** be stored and rendered as `string`. The total supply of **10,000,000,000,000 $AXQ** (10 trillion) exceeds `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991). Converting to `Number` will silently corrupt the value.

```js
// ✅ Safe — render from string state directly
h("h2", { class: "axq-balance__amount" }, text(`${state.wallet.axq} $AXQ`))

// ✅ Safe — display with formatting
h("span", {}, text(formatTokenAmount(state.wallet.axq)))  // formatTokenAmount returns string

// ❌ UNSAFE — loses precision for large amounts
h("span", {}, text(Number(state.wallet.axq).toLocaleString()))
```

### Balance Display Patterns

The AxioPass Home screen shows the primary wallet balance in a large centered display:

```js
// Home screen balance card
const BalanceCard = ({ axq, usdValue }) =>
  h("div", { class: "axq-balance-card" }, [
    h("p",  { class: "axq-balance-card__label" }, text("Total Balance")),
    h("h2", { class: "axq-balance-card__amount" }, text(`${axq} $AXQ`)),
    h("p",  { class: "axq-balance-card__usd"    }, text(`≈ $${usdValue} USD`)),
  ])
```

### Exceeds-Balance Warning

The amount entry screen shows an inline red warning below the amount when it exceeds the wallet balance. The warning text is rendered using `text()` conditionally:

```js
const AmountDisplay = ({ amount, balance, currency }) =>
  h("div", { class: "axq-amount-display" }, [
    h("h2", { class: "axq-amount-display__value" }, text(`${amount} ${currency}`)),
    // Inline warning — rendered only when amount exceeds balance
    exceedsBalance(amount, balance) &&
      h("p", { class: "axq-amount-display__warning", style: { color: "red" } },
        text(`Exceeds $${balance}`)
      ),
  ])
```

### 5-Token Label System

AxioPass displays 5 distinct tokens. Each has a standardized label format:

```js
const TOKEN_LABELS = {
  axq: "$AXQ",   // Primary governance + payment token
  vpx: "$VPX",   // Validator staking reward token
  sqx: "$SQX",   // L2 Sequencer gas token
  kpx: "$KPX",   // Kinetoprotocol liquidity token
  vrq: "$VRQ",   // ZK Veraciphers prover fee token
}

// Token balance row
const TokenRow = ({ tokenKey, amount }) =>
  h("div", { class: "axq-token-row" }, [
    h("span", { class: "axq-token-row__label" }, text(TOKEN_LABELS[tokenKey])),
    h("span", { class: "axq-token-row__amount" }, text(amount)),  // amount is string
  ])
```

### OTP & PIN Display

AxioPass uses **6-digit OTP** (not 4) and **6-dot PIN** (not 4) for security. The display nodes use `text()` for digit echo:

```js
// OTP digit echo — shows "*" for entered digits, "_" for empty
const OtpDisplay = ({ digits }) =>
  h("div", { class: "axq-otp-display" },
    Array.from({ length: 6 }, (_, i) =>
      h("span", {
        key: String(i),
        class: ["axq-otp-display__slot", digits[i] && "axq-otp-display__slot--filled"],
      }, text(digits[i] ? "*" : "_"))
    )
  )

// PIN dot display — 6 filled/empty circles
const PinDots = ({ filledCount }) =>
  h("div", { class: "axq-pin-dots" },
    Array.from({ length: 6 }, (_, i) =>
      h("div", {
        key: String(i),
        class: ["axq-pin-dot", i < filledCount && "axq-pin-dot--filled"],
      })
    )
  )
```

### Screen Title & Navigation Text

Each AxioPass screen has a header title. The title text corresponds to the zone:

```js
const SCREEN_TITLES = {
  home:       "Home",
  crypto:     "Crypto",
  card:       "My Card",
  cashback:   "Cashback",
  profile:    "Profile",
  settings:   "Settings",
  faq:        "FAQ",
  language:   "App Language",
  appearance: "Appearance",
  swap:       "Swap",
  transfer:   "Transfer",
  notifications: "Notifications",
}

const ScreenHeader = ({ screen }) =>
  h("h1", { class: "axq-screen-header__title" }, text(SCREEN_TITLES[screen] || screen))
```

### Transaction Type Labels

Transaction history items use text labels derived from on-chain event types:

```js
const TX_TYPE_LABELS = {
  "transfer_out": "Sent",
  "transfer_in":  "Received",
  "swap":         "Swap",
  "stake":        "Staked",
  "unstake":      "Unstaked",
  "bridge_lock":  "Bridge Lock",
  "bridge_claim": "Bridge Claim",
  "paymaster":    "Sponsored Tx",
}

const TxTypeLabel = ({ type }) =>
  h("span", { class: `axq-tx-label axq-tx-label--${type}` },
    text(TX_TYPE_LABELS[type] || type)
  )
```

### ZK-Status Text

ZK proof status and L2 connection state are shown as text badges:

```js
const L2StatusBadge = ({ connected, latency }) =>
  h("div", { class: ["axq-l2-badge", connected ? "axq-l2-badge--live" : "axq-l2-badge--offline"] }, [
    h("span", { class: "axq-l2-badge__dot" }),
    h("span", { class: "axq-l2-badge__label" },
      text(connected ? `L2 Live · ${latency}ms` : "L2 Offline")
    ),
  ])
```

---

## Parameters

### `content`

While `content` can technically be anything, what will actually be used for the content of the VDOM element will be the stringified version of `content`. So, using actual strings and numbers makes a lot of sense but using arrays will probably be formatted in a way you don't want and objects won't work well at all.

**Axioledger rule:** For token amounts, always pass `string` — never `Number`. For display labels and static strings, `text("literal")` is safe. For dynamic data from state, access the string field directly:

```js
// ✅ State string field — already a string
text(state.wallet.axq)

// ✅ Template literal with string field
text(`Balance: ${state.wallet.axq} $AXQ`)

// ✅ Static label
text("Confirm Transaction")

// ❌ Never convert token amounts to Number for display
text(parseFloat(state.wallet.axq).toFixed(2))   // loses precision
```
