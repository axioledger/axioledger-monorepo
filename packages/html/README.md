# @axioledger/html

> Write HTML with plain functions.

axioledger's built-in `h()` function is intentionally primitive to give you the freedom to write views any way you like it. If you prefer a functional approach over templating solutions like JSX or template literals, here is a collection of functions—one for [each HTML tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)—to make your views faster to write and easier to read.

Here's the first example to get you started. [Try it in your browser](https://codepen.io/jorgebucaran/pen/MrBgMy?editors=1000).

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import { app } from "https://unpkg.com/axioledger"
      import {
        main,
        h1,
        button,
        text,
      } from "https://unpkg.com/@axioledger/html?module"

      const Subtract = (state) => ({ ...state, count: state.count - 1 })
      const Add = (state) => ({ ...state, count: state.count + 1 })

      app({
        init: (count = 0) => ({ count }),
        view: (state) =>
          main([
            h1(text(state.count)),
            button({ onclick: Subtract }, text("-")),
            button({ onclick: Add }, text("+")),
          ]),
        node: document.getElementById("app"),
      })
    </script>
  </head>
  <body>
    <main id="app"></main>
  </body>
</html>
```

> Looking for [@axioledger/svg](../svg) instead?

## Installation

```console
npm install @axioledger/html
```

Then with a module bundler like [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org) import it in your application and get right down to business.

```js
import { a, form, input } from "@axioledger/html"
```

Don't want to set up a build step? Import it in a `<script>` tag as a module.

```html
<script type="module">
  import { a, form, input } from "https://unpkg.com/@axioledger/html?module"
</script>
```

## License

[MIT](../../LICENSE.md)

---

## Axioledger — HTML Components với AXQ Design System

> `@axioledger/html` cung cấp các hàm HTML ngữ nghĩa, giúp xây dựng views **AxioPass Wallet** và **Axioledger DApp** nhanh hơn, dễ đọc hơn, tuân thủ AXQ Design System tokens.

### Axiopass Wallet — HTML Components

```js
import { app, text } from "axioledger"
import { main, header, nav, section, div, h1, h2, p, button, input, form, span, a } from "@axioledger/html"
```

#### 1. Navigation Bar (Zone 3 — Home · Navbar Component)

```js
// Navbar dùng navbar/* tokens từ AXQ Design System
// navbar/bg: surface/default | navbar/height: 64px | navbar/label-size: 12px (caption)
const BottomNavbar = (state) =>
  nav({
    class: "axq-navbar",
    style: {
      background: "var(--axq-surface-default)",
      borderTop: "1px solid var(--axq-border-subtle)",
      height: "var(--axq-navbar-height)",  // 64px
    },
  }, [
    NavItem({ icon: "🏠", label: "Home",    active: state.tab === "home",    onclick: [SetTab, "home"] }),
    NavItem({ icon: "₿",  label: "Crypto",  active: state.tab === "crypto",  onclick: [SetTab, "crypto"] }),
    NavItem({ icon: "💸", label: "Pay",     active: state.tab === "pay",     onclick: [SetTab, "pay"] }),
    NavItem({ icon: "💳", label: "Card",    active: state.tab === "card",    onclick: [SetTab, "card"] }),
    NavItem({ icon: "👤", label: "Profile", active: state.tab === "profile", onclick: [SetTab, "profile"] }),
  ])

const NavItem = ({ icon, label, active, onclick }) =>
  div({
    class: { "axq-navbar__item": true, "axq-navbar__item--active": active },
    onclick,
  }, [
    span({ class: "axq-navbar__icon" }, text(icon)),
    span({
      class: `axq-text--overline ${active ? "axq-text--brand" : "axq-text--secondary"}`,
      // navbar/label-size: 12px (type/caption)
    }, text(label.toUpperCase())),
  ])
```

#### 2. KYC Form (Zone 2 — KYC & Compliance)

```js
// Form nhập liệu KYC — FATCA / Tax ID
// Dùng input/* tokens: input/border, input/border-focus, input/radius (12px), input/label-size (12px)
const KYCForm = (state) =>
  form({ class: "axq-form", onsubmit: SubmitKYCForm }, [
    div({ class: "axq-form-field" }, [
      span({ class: "axq-text--caption axq-text--secondary" }, text("Quốc tịch *")),
      input({
        type: "text",
        class: "axq-input",
        placeholder: "Chọn quốc gia...",
        value: state.kyc.nationality,
        oninput: [UpdateKYCField, "nationality"],
        style: {
          borderRadius: "var(--axq-radius-input)",   // 12px
          border: "1px solid var(--axq-border-default)",
        },
      }),
    ]),
    div({ class: "axq-form-field" }, [
      span({ class: "axq-text--caption axq-text--secondary" }, text("Tax ID (TIN)")),
      input({
        type: "text",
        class: "axq-input",
        placeholder: "Nhập mã số thuế...",
        value: state.kyc.tin,
        oninput: [UpdateKYCField, "tin"],
      }),
    ]),
    button({
      type: "submit",
      class: "axq-btn axq-btn--primary",
      disabled: !state.kyc.nationality,
      style: { borderRadius: "var(--axq-radius-button)" },  // 24px pill
    }, text("TIẾP TỤC")),
  ])
```

#### 3. Transfer Hub Screen (Zone 6 — Transfer & Payments)

```js
// Layout màn hình Transfer Hub
const TransferHubView = (state) =>
  main({ class: "axq-screen" }, [
    header({ class: "axq-header" }, [
      h1({ class: "axq-text--h5" }, text("Chuyển Tiền")),
    ]),
    section({ class: "axq-transfer-options" }, [
      TransferCard({ type: "internal",      label: "Nội bộ AXQ",         icon: "⚡" }),
      TransferCard({ type: "bank",          label: "Ngân hàng",          icon: "🏦" }),
      TransferCard({ type: "international", label: "Quốc tế (SWIFT)",    icon: "🌍" }),
      TransferCard({ type: "crypto",        label: "Crypto On-chain",    icon: "₿" }),
    ]),
  ])

const TransferCard = ({ type, label, icon }) =>
  div({
    class: "axq-card axq-card--clickable",
    onclick: [NavigateToTransfer, type],
    style: {
      borderRadius: "var(--axq-radius-card)",  // 16px
      padding: "var(--axq-inset-lg)",          // 24px
      border: "1px solid var(--axq-border-subtle)",
    },
  }, [
    span({ class: "axq-text--h5" }, text(icon)),
    p({ class: "axq-text--body axq-text--primary" }, text(label)),
  ])
```

#### 4. Token Dashboard (5-Token Grid)

```js
// Grid hiển thị 5 token balances
const TokenDashboard = (state) =>
  section({ class: "axq-token-grid" }, [
    h2({ class: "axq-text--h6 axq-text--secondary" }, text("Portfolio")),
    div({ class: "axq-grid" }, [
      { sym: "$AXQ", balance: state.balances.axq, color: "#000000" },
      { sym: "$VPX", balance: state.balances.vpx, color: "#0095FF" },
      { sym: "$SQX", balance: state.balances.sqx, color: "#00D68F" },
      { sym: "$KPX", balance: state.balances.kpx, color: "#FFAA00" },
      { sym: "$VRQ", balance: state.balances.vrq, color: "#FF3D71" },
    ].map(({ sym, balance, color }) =>
      div({ class: "axq-token-row" }, [
        span({ class: "axq-badge", style: { background: color + "22" } }, text(sym)),
        span({ class: "axq-text--body-sm axq-text--primary" }, text(balance)),
      ])
    )),
  ])
```

### AXQ HTML Elements → Design System Mapping

| HTML Function | AXQ Token Áp dụng | Mô tả |
|---|---|---|
| `button` | `button/radius` (24px) · `button/primary-bg` | CTA buttons |
| `input` | `input/radius` (12px) · `input/border-focus` | Form fields |
| `nav` | `navbar/bg` · `navbar/height` | Bottom navigation |
| `div.card` | `card/radius` (16px) · `card/padding` | Content cards |
| `span.badge` | `badge/font-size` (12px) · `badge/radius` | Status labels |
| `h1–h6` | `type/h1`–`type/h6` (Work Sans) | Headings |
| `p` | `type/body` / `type/body-sm` | Body text |
| `span.caption` | `type/caption` (12px) | Labels, helpers |

### Tham Khảo Thêm

- [`@axioledger/svg`](../svg) — AXQ brand icons, token charts
- [Architecture: Views](../../docs/architecture/views.md) — AXQ Design System trong Views
- [Design System](../../docs/ui/design-system-roadmap.md) — Token system + 65+ screens
- [Master Roadmap](../../docs/AXIOLEDGER_ROADMAP.md) — Axiopass UI Product Roadmap

---

## Axioledger — HTML Components Nâng Cao

> Mở rộng từ phần trước — modal sheet, toast notification, PIN pad, và multi-step form pattern.

### 5. Transaction Receipt Screen (Zone 6 — Success State)

```js
import { div, section, h1, h2, p, button, span, article } from "@axioledger/html"

// Receipt screen — hiển thị sau khi transaction thành công
// Dùng card/bg, card/radius tokens + AXQ brand colors
const TxReceiptView = (state) =>
  section({
    class: "axq-screen axq-screen--receipt",
    style: { background: "var(--axq-bg-primary)" },
  }, [
    // Success icon (từ @axioledger/svg)
    div({ class: "axq-receipt__icon", style: { textAlign: "center", padding: "var(--axq-inset-2xl)" } }, [
      // CheckmarkIcon từ packages/svg
    ]),

    // Receipt card
    article({
      class: "axq-card",
      style: {
        borderRadius: "var(--axq-radius-card)",  // 16px
        padding: "var(--axq-inset-lg)",          // 24px
        margin: "0 var(--axq-inset-md)",
        border: "1px solid var(--axq-border-subtle)",
      },
    }, [
      // Amount
      div({ class: "axq-receipt__row" }, [
        span({ class: "axq-text--caption axq-text--tertiary" }, text("Số tiền")),
        span({ class: "axq-text--h5 axq-text--primary" },
          text(`${state.transfer.pendingTx?.amount} ${state.transfer.pendingTx?.token}`)
        ),
      ]),

      // Recipient
      div({ class: "axq-receipt__row" }, [
        span({ class: "axq-text--caption axq-text--tertiary" }, text("Người nhận")),
        span({ class: "axq-text--body-sm axq-text--primary" },
          text(state.transfer.recipient?.name || state.transfer.recipient?.address)
        ),
      ]),

      // Tx Hash
      div({ class: "axq-receipt__row" }, [
        span({ class: "axq-text--caption axq-text--tertiary" }, text("Mã giao dịch")),
        span({ class: "axq-text--caption axq-text--link" },
          text(state.transfer.pendingTx?.hash?.slice(0, 12) + "...")
        ),
      ]),
    ]),

    // CTA buttons
    div({ class: "axq-receipt__actions" }, [
      button({
        class: "axq-btn axq-btn--primary",
        onclick: ShareReceipt,
        style: { borderRadius: "var(--axq-radius-button)" },
      }, text("CHIA SẺ BIÊN NHẬN")),
      button({
        class: "axq-btn axq-btn--ghost",
        onclick: NewTransaction,
        style: { borderRadius: "var(--axq-radius-button)" },
      }, text("GIAO DỊCH MỚI")),
    ]),
  ])
```

### 6. PINPad Component (Zone 1 — Authentication)

```js
import { div, button, p, span } from "@axioledger/html"

// PIN Pad — 6-dot display + numpad grid
// Dùng chip/* tokens cho dot indicators
const PINPadView = (state) =>
  div({ class: "axq-pinpad" }, [
    // 6-dot PIN indicator
    div({ class: "axq-pinpad__dots" },
      [0,1,2,3,4,5].map(i =>
        span({
          class: {
            "axq-pinpad__dot": true,
            "axq-pinpad__dot--filled": i < state.auth.pinInput.length,
          },
          style: {
            width: "12px", height: "12px",
            borderRadius: "var(--axq-radius-full)",   // 9999px pill
            background: i < state.auth.pinInput.length
              ? "var(--axq-bg-brand)"        // #000000 filled
              : "var(--axq-border-default)",  // #E4E9F2 empty
          },
        })
      )
    ),

    // Numpad 3x4 grid
    div({ class: "axq-pinpad__grid" }, [
      ...[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map(key =>
        key === ""
          ? div({ class: "axq-pinpad__key axq-pinpad__key--empty" })
          : button({
              class: "axq-pinpad__key",
              onclick: key === "⌫" ? PINBackspace : [PINKeyTapped, String(key)],
              style: {
                borderRadius: "var(--axq-radius-full)",  // Circular keys
                background: "var(--axq-bg-secondary)",
                border: "none",
              },
            }, text(String(key)))
      ),
    ]),
  ])
```

### 7. Toast Notification Component

```js
import { div, span } from "@axioledger/html"

// Toast — auto-dismiss, dùng status tokens từ AXQ Design System
const ToastView = ({ toasts }) =>
  div({ class: "axq-toast-container" },
    toasts.map(toast =>
      div({
        key: toast.id,
        class: `axq-toast axq-toast--${toast.type}`,  // success | error | info | warning
        style: {
          background: `var(--axq-status-${toast.type}-bg)`,
          borderLeft: `4px solid var(--axq-status-${toast.type}-default)`,
          borderRadius: "var(--axq-radius-md)",        // 8px
          padding: "var(--axq-inset-sm) var(--axq-inset-md)",
        },
        role: "alert",
        "aria-live": "polite",
      }, [
        span({ class: `axq-text--body-sm axq-text--${toast.type === "error" ? "error" : "primary"}` },
          text(toast.message)
        ),
      ])
    )
  )
```

### AXQ HTML → Design System Token Mapping (cập nhật)

| HTML Component | AXQ Tokens Dùng | Zone |
|---|---|---|
| `TxReceiptView` | `card/radius` (16px) · `card/padding` (24px) · `border/subtle` | Zone 6 |
| `PINPadView` dots | `radius/full` · `bg/brand` · `border/default` | Zone 1 |
| `PINPadView` keys | `bg/secondary` · `radius/full` | Zone 1 |
| `ToastView` | `status/*/bg` · `status/*/default` · `radius/md` | Global |
| `BottomNavbar` | `surface/default` · `border/subtle` · `navbar/height` | Global |
| `KYCForm` | `input/radius` (12px) · `input/border` · `border/focus` | Zone 2 |
| `TransferCard` | `card/radius` (16px) · `inset/lg` · `border/subtle` | Zone 6 |

### Tham Khảo Thêm (cập nhật)

- [`@axioledger/svg`](../svg) — `CheckmarkIcon` dùng trong `TxReceiptView`
- [`@axioledger/dom`](../dom) — `focus()` để auto-focus PIN pad khi màn hình xuất hiện
- [Architecture: Views](../../docs/architecture/views.md) — `EmptyState`, `AXQButtonA11y` patterns
- [Design System](../../docs/ui/DESIGN_SYSTEM.md) — Badge · Toast · Modal component tokens
