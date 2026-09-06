<h1 title="The name of the `h()` function is short for **hyperscript** which is named after the original hyperscript function from [HyperScript](https://github.com/hyperhype/hyperscript)."><code>h()</code></h1>

**_Definition:_**

> A function that creates [virtual DOM nodes (VNodes)](../architecture/views.md#virtual-dom) which are used for defining [views](../architecture/views.md). In the **AXQ Design System**, `h()` is the primitive factory for every AxioPass UI component — from token-styled buttons to screen shells.

**_Import & Usage:_**

```js
import { h } from "axioledger"

// ...

h(tag, props, children)
```

**_Signature & Parameters:_**

```elm
h : (String, Object, VNode? | [...VNodes]?) -> VNode
```

| Parameters            | Type                     | Required? |
| --------------------- | ------------------------ | --------- |
| [tag](#tag)           | String                   | yes :100: |
| [props](#props)       | Object                   | yes :100: |
| [children](#children) | VNode or array of VNodes | no        |

| Return Value                                         | Type  |
| ---------------------------------------------------- | ----- |
| [virtual node](../architecture/views.md#virtual-dom) | VNode |

`h()` effectively represents the page elements used in your app. Because it's just JavaScript we can easily render whichever elements we see fit in a dynamical manner.

---

## AXQ Design System — Component Patterns

The AXQ Design System uses a **3-layer token model**: Primitive → Semantic → Component. All `h()` calls in AxioPass consume design tokens via CSS custom properties — never raw hex values.

### Brand Colors (Primitive Tokens → CSS Variables)

| Token Name              | CSS Variable              | Value       | Usage                        |
| ----------------------- | ------------------------- | ----------- | ---------------------------- |
| `color.brand.teal`      | `--color-brand-teal`      | `#49DBC8`   | Primary CTA, Home/Crypto nav |
| `color.brand.black`     | `--color-brand-black`     | `#000000`   | Text, nav active, pill bg    |
| `color.brand.green`     | `--color-brand-green`     | `#BEFF6C`   | Cashback zone accent         |
| `color.brand.purple`    | `--color-brand-purple`    | `#AF96FB`   | Card zone accent             |
| `color.brand.pink`      | `--color-brand-pink`      | `#FD9FDD`   | Alert / highlight accent     |
| `color.surface.default` | `--color-surface-default` | `#FFFFFF`   | Card backgrounds             |
| `color.surface.muted`   | `--color-surface-muted`   | `#F5F5F5`   | Screen backgrounds           |

> **Kit color name mapping:** Cashie kit "Blue" = teal (`#49DBC8`), "Greeny" = green (`#BEFF6C`), "Magenta" = pink (`#FD9FDD`), "Violet" = purple (`#AF96FB`).

### Primary Button — Token Usage

```js
// AXQ Primary Button using design tokens
const PrimaryButton = ({ label, onclick }) =>
  h("button", {
    class: "axq-btn axq-btn--primary",
    style: {
      backgroundColor: "var(--color-brand-teal)",
      color: "var(--color-brand-black)",
      borderRadius: "var(--radius-pill)",
      padding: "var(--space-3) var(--space-6)",
      fontFamily: "var(--font-family-base)",   // Work Sans
      fontWeight: "var(--font-weight-semibold)",
    },
    onclick,
  }, text(label))
```

### Zone-Aware Screen Shell

Each of the 5 AxioPass zones has a distinct header background color. The screen shell uses `h()` with dynamic class binding:

```js
const ScreenShell = ({ zone, title, children }) =>
  h("div", { class: ["axq-screen", `axq-screen--${zone}`] }, [
    h("header", {
      class: "axq-screen__header",
      style: { backgroundColor: `var(--color-zone-${zone})` },
    }, [
      h("h1", { class: "axq-screen__title" }, text(title)),
    ]),
    h("main", { class: "axq-screen__content" }, children),
  ])

// Usage:
ScreenShell({ zone: "crypto", title: "My Portfolio", children: [...] })
ScreenShell({ zone: "card",   title: "My Card",      children: [...] })
```

### Icon Usage — Bold vs Linear

AxioPass ships **1898 SVG icons** in `docs/asset/icon/` (979 bold + 919 linear). Use `h("img")` or inline SVG for icons:

```js
// Bold icon — for active/selected states
const BoldIcon = ({ name, size = 24 }) =>
  h("img", {
    src: `/docs/asset/icon/bold/${name}.svg`,
    width: size,
    height: size,
    class: "axq-icon axq-icon--bold",
    "aria-hidden": "true",
  })

// Linear icon — for default/inactive states
const LinearIcon = ({ name, size = 24 }) =>
  h("img", {
    src: `/docs/asset/icon/linear/${name}.svg`,
    width: size,
    height: size,
    class: "axq-icon axq-icon--linear",
    "aria-hidden": "true",
  })

// Bottom nav tab — bold when active, linear when inactive
const NavTab = ({ label, icon, active, onclick }) =>
  h("button", { class: { "axq-nav-tab": true, "is-active": active }, onclick }, [
    active ? BoldIcon({ name: icon }) : LinearIcon({ name: icon }),
    h("span", { class: "axq-nav-tab__label" }, text(label)),
  ])
```

---

## Parameters

### `tag`

Name of the node. For example, `div`, `h1`, `button`, etc. Essentially any [HTML element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) or [SVG element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element) or [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

### `props`

HTML or SVG properties ("props") for the DOM element are defined using an object where the keys are the property names and the values are the corresponding property values.

```js
h("input", {
  type: "checkbox",
  id: "picard",
  checked: state.engaging,
})
```

Hyphenated props will need to be quoted in order to use them. The quotes are necessary to abide by JavaScript syntax restrictions.

```js
h("q", { "data-zoq-fot-pik": "Frungy" }, text("The Sport of Kings!"))
```

Certain properties are treated in a special way by axioledger.

#### `class:`

The [classes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) to use with the VNode. The `class` prop can be given in various formats:

- As a string representing a class name.

  ```js
  h("div", { class: "axq-card" })
  ```

- As an object where the keys are the names of the classes while the values are booleans for toggling the classes.

  ```js
  // AXQ pattern — conditional state classes
  h("div", {
    class: {
      "axq-card": true,
      "axq-card--flipped": state.card.isFlipped,
      "axq-card--virtual": state.card.type === "virtual",
    }
  })
  ```

- As an array containing any combination of the above.

  ```js
  // AXQ pattern — zone + status + modifier
  h("div", {
    class: [
      "axq-screen",
      `axq-screen--${state.activeZone}`,
      state.l2.connected && "axq-screen--live",
    ]
  })
  ```

#### `style:`

The [inline CSS styles](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/style) to use with the VNode.

**AXQ pattern** — use CSS variables, never raw hex values:

```js
// ✅ Correct — token-based styling
h("div", {
  style: {
    backgroundColor: "var(--color-brand-teal)",
    borderRadius: "var(--radius-card)",
    padding: "var(--space-4)",
  },
})

// ❌ Avoid — bypasses the design token system
h("div", {
  style: {
    backgroundColor: "#49DBC8",
    borderRadius: "16px",
    padding: "16px",
  },
})
```

#### `key:`

A unique string per VNode that helps axioledger track if VNodes are changed, added, or removed in situations where it's unable to do so, such as in arrays.

**AXQ pattern** — use transaction hash as key for tx history list:

```js
const TxHistoryList = (transactions) =>
  h(
    "ul",
    { class: "axq-tx-list" },
    transactions.map((tx) =>
      h("li", { key: tx.hash, class: "axq-tx-item" }, [
        h("span", { class: "axq-tx-item__type" }, text(tx.type)),
        h("span", { class: "axq-tx-item__amount" }, text(`${tx.amount} $AXQ`)),
      ])
    )
  )
```

#### Event Listeners

Props that represent event listeners, such as [`onclick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event), [`onchange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event), [`oninput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event), etc. are where you would assign [actions](../architecture/actions.md) to VNodes.

**AXQ pattern** — numeric keypad (3×4 phone layout):

```js
// AxioPass numeric keypad — 3×4 grid, bottom-center 0, bottom-right ⌫
const KEYPAD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "⌫"],
]

const NumericKeypad = ({ onDigit, onBackspace }) =>
  h("div", { class: "axq-keypad" },
    KEYPAD_ROWS.flatMap((row) =>
      row.map((key) =>
        h("button", {
          class: "axq-keypad__key",
          onclick: key === "⌫" ? onBackspace : [onDigit, key],
        }, text(key))
      )
    )
  )
```

Synthetic events can be added in the same way as long as their name starts with "on":

```js
// AxioPass WebAuthn biometric trigger (custom event from native bridge)
h("button", { onbiometricresult: HandleBiometric }, text("Authenticate"))
```

### `children`

The children of the VNode are other VNodes which are directly nested within it.

`children` can either be given as a single child VNode:

```js
h("p", { class: "axq-balance__label" }, text("Total Balance"))
```

or as an array of child VNodes:

```js
// AXQ Portfolio Balance Card
h("div", { class: "axq-balance-card" }, [
  h("p", { class: "axq-balance-card__label" }, text("Total Balance")),
  h("h2", { class: "axq-balance-card__amount" }, text(`${state.wallet.axq} $AXQ`)),
  h("p", { class: "axq-balance-card__usd" }, text(`≈ $${state.wallet.usdValue}`)),
])
```

---

## AXQ Component Factory Pattern

For complex recurring components, AxioPass wraps `h()` in typed factory functions that enforce design tokens:

```js
// Token-typed component factory
const TokenBadge = ({ symbol, amount, variant = "default" }) =>
  h("div", { class: ["axq-token-badge", `axq-token-badge--${variant}`] }, [
    h("img", {
      src: `/assets/tokens/${symbol.toLowerCase()}.svg`,
      class: "axq-token-badge__icon",
      width: 20, height: 20,
    }),
    h("span", { class: "axq-token-badge__symbol" }, text(symbol)),
    h("span", { class: "axq-token-badge__amount" }, text(amount)),  // amount is string
  ])

// Usage: TokenBadge({ symbol: "$AXQ", amount: state.wallet.axq, variant: "primary" })
// Usage: TokenBadge({ symbol: "$KPX", amount: state.wallet.kpx, variant: "secondary" })
```

### Success Screen Pattern

The AxioPass success screen uses a brand `*` asterisk illustration, "Congrats!!!" heading, and "OK" black pill:

```js
const SuccessScreen = ({ message, onConfirm }) =>
  h("div", { class: "axq-screen axq-screen--success" }, [
    h("div", { class: "axq-success__illustration" }, text("✳")),  // brand asterisk
    h("h4", { class: "axq-success__title" }, text("Congrats!!!")),
    h("p",  { class: "axq-success__message" }, text(message)),
    h("button", {
      class: "axq-btn axq-btn--pill axq-btn--black",
      onclick: onConfirm,
    }, text("OK")),
  ])
```

---

## Other Considerations

### JSX Support

axioledger doesn't support [JSX](https://reactjs.org/docs/introducing-jsx.html) out-of-the-box. That said you can use this custom JSX function to be able to use it.

```js
import { h, text } from "axioledger"

const jsxify = (h) => (type, props, ...children) =>
  typeof type === "function"
    ? type(props, children)
    : h(
        type,
        props || {},
        [].concat(...children).map((x) =>
          typeof x === "string" || typeof x === "number" ? text(x) : x
        )
      )

const jsx = jsxify(h) /** @jsx jsx */
```

### AXQ Token Amount Safety

Never pass token amounts as `Number` — always use `string` to avoid precision loss with the 10T $AXQ total supply:

```js
// ✅ Safe — string amounts
h("span", { class: "axq-amount" }, text(`${state.wallet.axq} $AXQ`))

// ❌ Unsafe — number may lose precision
h("span", { class: "axq-amount" }, text(Number(state.wallet.axq) + " $AXQ"))
```
