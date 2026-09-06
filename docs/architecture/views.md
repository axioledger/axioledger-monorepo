# Views

**_Definition:_**

> A **view** is a declarative description of what should get rendered and is usually influenced by the current [state](state.md).

A view is implemented as a pure function that accepts the current state and returns a [virtual DOM node (VNode)](#virtual-dom). When [state transitions](state.md#state-transitions) happen your views are automatically updated accordingly.

**_Signature:_**

```elm
View : (State) -> VNode
```

---

## Describing Views

The [`h()`](../api/h.md), [`text()`](../api/text.md), and [`memo()`](../api/memo.md) functions are the building blocks of your views.

[`h()`](../api/h.md) not only describes what HTML elements are being used but also what [actions](actions.md) are wired up if any.

```js
const view = (state) =>
  h(
    "button",
    {
      class: { "calling-acid-burn": state.beingFramed },
      onclick: FindThatDisk,
    },
    text("It's in that place where I put that thing that time.")
  )
```

<!-- In the 1995 movie "Hackers", the hacker "The Phantom Freak" calls his friend "Acid Burn" from jail as he's being framed for a crime he didn't commit. -->

[`text()`](../api/text.md) just creates text nodes so the views it can create on its own are necessarily simplistic.

```js
const view = () => text("Go home and be a family man!")
```

<!-- In the videogame "Street Fighter II: The World Warrior", the fighter known as Guile says this taunt to his opponent after defeating them. -->

[`memo()`](../api/memo.md) is designed to be used with other functions that produce VNodes, so it doesn't really describe a view by itself.

```js
const view = (state) => memo(scenicView, state.vacationSpot)
```

<!-- Just a play-on-words between how "view" is used in axioledger and everyday language. -->

---

## Components

Views are naturally composable so they can be as simple or complicated as you need. Simpler apps probably just need a single view but in more complicated apps there could be plenty of subviews.

**_Definition:_**

> A **component** in axioledger can either be a subview or some other function that generates VNodes.

**_Signature:_**

```elm
Component : (GlobalState | PartialState) -> VNode | [...VNodes]
```



You would typically make components for widgets that provide the building block elements of your app's UI. Components for larger UI segments such as dashboards or pages would make use of these widgets.

In the following example, `coinsDisplay` is a component in the form of a subview while `questionBlock` is a component in the form of some function that returns a VNode. Notice the former cares directly about the state while the latter doesn't:

```js
// Component : (GlobalState) -> VNode
const coinsDisplay = (state) =>
  h("div", { class: "coins-display" }, text(state.coins))

// Component : (PartialState) -> VNode
const questionBlock = (opened) =>
  opened
    ? h("button", { class: "question-block opened" }, text("?"))
    : h(
        "button",
        {
          class: "question-block",
          onclick: [
            HitBlockFromBottom,
            { revealItem: "beanstalk" },
          ],
        },
        text("?")
      )

// Component : (GlobalState) -> VNode
const level = (state) =>
  h("div", { class: "level" }, [
    coinsDisplay(state),
    questionBlock(state.onlyQuestionBlockOpened),
  ])
```

<!-- In the videogame "Super Mario Bros." coins are important for earning extra lives and the question blocks often contain useful contents. -->

**_Naming Recommendation:_**

Components are recommended to be named in `camelCase` using a noun that concisely describes the (purpose of the) composed group of contained elements best, for instance `articleHeader` or `questionBlock`.

### Components Returning Multiple VNodes

Components are allowed to return an array of VNodes. However, to make use of such components in a list of other siblings, you'll need to spread their result.

```js
// Component : () -> [...VNodes]
const finishingMoveOptions = () => [
  h("button", { onclick: FinishHim }, text("Fatality")),
  h("button", { onclick: FinishHimAsAnAnimal }, text("Animality")),
  h("button", { onclick: TurnHimIntoABaby }, text("Babality")),
  h("button", { onclick: BefriendHim }, text("Friendship")),
]

const view = () => h("div", {}, [
  h("em", {}, text("Finish them:")),
  ...finishingMoveOptions(),
])
```

<!-- In the "Mortal Kombat" videogame series there are multiple ways to finish off your opponent. The opportunity to do so occurs at the end of a match once the match announcer exclaims "Finish Him!" -->

---

## Using Views

### Top-Level View

Every axioledger application has a base view that encompasses all others. This is the **top-level view** that's defined by the [`view:`](../api/app.md#view) property when using [`app()`](../api/app.md). axioledger automatically calls this view and gives it the current state when the state is initially set or anytime it's updated.

```js
app({
  // ...
  view: (state) =>
    h("main", {}, [
      earthrealm(state),
      edenia(state),
    ]),
})
```

<!-- "Earthrealm" and "Edenia" are two of several realms in the "Mortal Kombat" videogame series. -->

### Conditional Rendering

Elements of a view can be shown or hidden conditionally.

```js
const view = (state) =>
  h("div", {}, [
    state.flying && h("div", {}, text("Flying")),
    state.notSwimming || h("div", {}, text("Swimming")),
  ])
```

### Recycling

axioledger supports hydration of views out of the box. This means that if the mount node you specify is already populated with DOM elements, axioledger will recycle and use these existing elements instead of throwing them away and creating them again. You can use this for doing SSR or pre-rendering of your applications, which will give you SEO and performance benefits.

---

## Virtual DOM

**_Definition:_** 

> The **virtual DOM**, or **VDOM** for short, is an in-memory representation of the [DOM](https://dom.spec.whatwg.org/) elements that exist on the current page.

axioledger uses it to determine how to efficiently update the actual DOM. The virtual DOM is a tree data structure where each of its nodes represent a particular VDOM element that may or may not get rendered.

We've already seen how [`h()`](../api/h.md), [`text()`](../api/text.md), and [`memo()`](../api/memo.md) all return different types of VNodes.

### Patching the DOM

When axioledger is ready to update the DOM it will do so starting at the element that corresponds to the root VNode of the [top-level view](#top-level-view). axioledger checks if there were changes made to that VNode representing that element. If so, the element gets rerendered the process repeats recursively for every child of that VNode.

### Keys

Sometimes axioledger needs help determining how certain elements have changed. This is generally the case for VNodes that are rendered based on arrays in the state. This is because array items may have shifted around a lot during a state change, so when they get rendered the VNodes that currently represent them might be completely different than before.

Since axioledger can't know for sure it must assume everything had changed requiring a full render every time.

For an example, look at the [`key:`](../api/h.md#key) documentation for [`h()`](../api/h.md).

### Memoization

The optimization technique known as **memoization**, is where the result of a calculation is stored somewhere to be used again in the future without incurring the cost of calculating again.

Memoization in axioledger concerns how VNodes are rendered and is implemented using [`memo()`](../api/memo.md). When memoized views are rerendered the "state" they receive is actually the props defined for the view when the memoization was setup.

Immutability in axioledger guarantees that if two things are referentially equal, they must be identical. This makes it safe for axioledger to only re-compute your memoized components when values passed through their props change.

For an example, look at the documentation for [`memo()`](../api/memo.md#example).

#### Performance

Memoization exists to help improve rendering performance but it's not a panacea. If it was used with nodes that need to update on every state change, the cost of checking if the memoization's props had changed before carrying out the rendering would be a net loss of performance over time.

Memoization was designed for nodes that don't need to update at all or just occasionally.

As always when it comes to optimizations, be sure to measure the performance of your app to make sure you're getting true benefits and adjust if necessary.

---

## Axioledger — Views & AXQ Design System

> Views trong Axioledger được render bằng axioledger `h()` + `text()`, tuân theo **AXQ Design System** 3 lớp token (Primitive → Semantic → Component). Font: **Work Sans**.

### Kết Nối AXQ Design System với Views

```js
import { h, text } from "axioledger"

// AXQ Component tokens ánh xạ vào CSS variables
// --axq-bg-brand: #000000 (button primary)
// --axq-text-inverse: #FFFFFF (button text)
// --axq-radius-button: 24px (button/radius → radius/2xl)

// Component: AXQ Button — Primary
const AXQButton = ({ label, onclick, variant = "primary", disabled = false }) =>
  h("button", {
    class: {
      "axq-btn": true,
      [`axq-btn--${variant}`]: true,  // filled | ghost | outlined
      "axq-btn--disabled": disabled,
    },
    onclick: disabled ? null : onclick,
    "aria-disabled": disabled,
    style: {
      // Trực tiếp dùng Component tokens từ AXQ Design System
      borderRadius: "var(--axq-radius-button)",   // 24px — radius/2xl
      padding: "var(--axq-btn-padding-y) var(--axq-btn-padding-x)",
    },
  }, text(label))
```

### View Components Axiopass Wallet

#### 1. Balance Hero Component (Home Screen)

```js
// Balance hero — sử dụng H2 typography token (60px, Work Sans)
const BalanceHero = ({ balances, hideBalance, onToggleHide }) =>
  h("div", { class: "axq-balance-hero" }, [
    h("span", { class: "axq-text--caption axq-text--secondary" },
      text("TỔNG TÀI SẢN")
    ),
    h("h2", {
      class: "axq-text--h2",        // type/h2 — 60px, weight 700
      onclick: onToggleHide,
    },
      text(hideBalance ? "••••••" : `${balances.axq} AXQ`)
    ),
    h("span", { class: "axq-badge axq-badge--success" },
      text("+ 2.4%")
    ),
  ])
```

#### 2. Token Status Badge (5-Token Display)

```js
// Badge component — dùng badge Component tokens từ AXQ DS
const TokenBadge = ({ token, amount, change }) =>
  h("div", {
    class: `axq-badge axq-badge--${change >= 0 ? "success" : "error"}`,
    // badge/info-bg, badge/success-bg... từ status tokens
  }, [
    h("span", { class: "axq-text--caption" }, text(token)),
    h("span", { class: "axq-text--body-sm axq-text--primary" }, text(amount)),
  ])

// Hiển thị tất cả 5 token
const FiveTokenDisplay = (state) =>
  h("div", { class: "axq-grid axq-grid--5col" }, [
    TokenBadge({ token: "$AXQ", amount: state.balances.axq, change: 2.4 }),
    TokenBadge({ token: "$VPX", amount: state.balances.vpx, change: 0.8 }),
    TokenBadge({ token: "$SQX", amount: state.balances.sqx, change: -0.3 }),
    TokenBadge({ token: "$KPX", amount: state.balances.kpx, change: 5.1 }),
    TokenBadge({ token: "$VRQ", amount: state.balances.vrq, change: 1.2 }),
  ])
```

#### 3. AxioPass KYC Status Card

```js
// Card component — card/bg: surface/default, card/radius: 16px
const KYCStatusCard = ({ kyc }) =>
  h("div", {
    class: "axq-card",
    style: {
      borderRadius: "var(--axq-radius-card)",  // 16px
      padding: "var(--axq-inset-lg)",           // 24px
    },
  }, [
    h("div", { class: "axq-text--h6" }, text("Trạng Thái KYC")),
    h("div", {
      class: `axq-badge axq-badge--${
        kyc.status === "verified" ? "success" :
        kyc.status === "scanning" ? "info" :
        kyc.status === "rejected" ? "error" : "warning"
      }`,
    }, text(kyc.status.toUpperCase())),
  ])
```

#### 4. Dark Mode Toggle (Semantic Color Override)

```js
// Toggle theme — chuyển đổi Light/Dark mode
// Chỉ cần đổi data-theme → toàn bộ Component tokens tự cập nhật qua Semantic layer
const ThemeToggle = (state) => [
  h("button", {
    class: "axq-toggle",
    onclick: ToggleTheme,
    "aria-label": `Switch to ${state.theme === "light" ? "dark" : "light"} mode`,
  }, text(state.theme === "light" ? "🌙" : "☀️")),
]

const ToggleTheme = (state) => {
  const newTheme = state.theme === "light" ? "dark" : "light"
  // Side effect: thay đổi data-theme trên root element
  document.documentElement.setAttribute("data-theme", newTheme)
  return { ...state, theme: newTheme }
}
```

### AXQ Design System — Token Reference cho Views

| UI Element | Component Token | Semantic Alias | Hex |
|---|---|---|---|
| Button Primary BG | `button/primary-bg` | `bg/brand` | `#000000` |
| Button Primary Text | `button/primary-text` | `text/inverse` | `#FFFFFF` |
| Button Radius | `button/radius` | `radius/button` | `24px` |
| Card Background | `card/bg` | `surface/default` | `#FFFFFF` |
| Card Radius | `card/radius` | `radius/card` | `16px` |
| Input Border Focus | `input/border-focus` | `border/focus` | `#0095FF` |
| Badge Info BG | `badge/info-bg` | `status/info-bg` | `#F2F8FF` |
| Toggle Active | `toggle/active-bg` | `status/success-default` | `#00D68F` |
| Navbar BG | `navbar/bg` | `surface/default` | `#FFFFFF` |

### Tham Khảo Thêm

- [Design System](../ui/DESIGN_SYSTEM.md) — Toàn bộ token system + Axiopass 65+ screens
- [Actions](actions.md) — `ToggleTheme`, `SwapIntentAction` được wire vào Views
- [Master Roadmap](../AXIOLEDGER_ROADMAP.md) — Mục 7: Design System Foundation

---

## Axioledger — Views Nâng Cao & AXQ UI Kit

> Mở rộng từ phần trước — memoization chiến lược, conditional rendering theo auth state, và full view composition Axiopass.

### Screen Router — Conditional Rendering theo Auth State

```js
import { h, memo } from "axioledger"

// Top-level view route theo auth.screen FSM
const RootView = (state) => {
  // Render screen tương ứng với auth flow state
  switch (state.auth.screen) {
    case "splash":        return memo(SplashView,   state)
    case "onboarding":    return memo(OnboardingView, state)
    case "otp":           return memo(OTPView,       state)
    case "pin-entry":     return memo(PINEntryView,  state)
    case "pin-create":    return memo(PINCreateView, state)
    case "passkey-setup": return memo(PasskeySetupView, state)
    case "passkey-verify":return memo(PasskeyVerifyView, state)
    case "home":          return HomeRouter(state)  // Không memo — update thường
    default:              return memo(SplashView,   state)
  }
}

// Home router — chọn tab
const HomeRouter = (state) =>
  h("div", { class: "axq-app", "data-theme": state.theme }, [
    // Main content area — thay đổi theo tab
    state.tab === "home"    && memo(HomeScreen,       state.portfolio),
    state.tab === "crypto"  && memo(CryptoScreen,     state.portfolio),
    state.tab === "pay"     && memo(TransferHubScreen, state.transfer),
    state.tab === "card"    && memo(CardScreen,       state.card),
    state.tab === "profile" && memo(ProfileScreen,    state.wallet),

    // Bottom navbar — luôn hiển thị khi ở home
    BottomNavbar(state),
  ])
```

### Memoization Strategy cho AXQ Charts

```js
import { memo } from "axioledger"

// Portfolio Pie Chart — chỉ re-render khi balances thay đổi
// Dùng memo() để tránh re-compute chart mỗi 5 giây (price feed)
const MemoizedPortfolioPieChart = (state) =>
  memo(PortfolioPieChart, {
    balances: state.portfolio.balances,
    total: Object.values(state.portfolio.balances)
      .reduce((sum, v) => sum + parseFloat(v), 0),
  })
  // memo props: chỉ re-render nếu balances object thay đổi reference
  // Khi price update (state.portfolio.prices thay đổi) — chart KHÔNG re-render
  // Khi balance update (state.portfolio.balances thay đổi) — chart RE-RENDER

// Validator Gauge — chỉ re-render khi uptime thay đổi
const MemoizedValidatorGauge = ({ nodeId, uptime }) =>
  memo(ValidatorUptimeGauge, { nodeId, uptime })
```

### Accessibility — AXQ WCAG 2.1 AA Compliance

```js
// AXQ Button với đầy đủ ARIA attributes
const AXQButtonA11y = ({ label, onclick, variant = "primary", disabled = false, ariaLabel }) =>
  h("button", {
    class: { "axq-btn": true, [`axq-btn--${variant}`]: true, "axq-btn--disabled": disabled },
    onclick: disabled ? null : onclick,
    disabled,
    "aria-disabled": disabled,
    "aria-label": ariaLabel || label,
    // AXQ Design System: minimum 44×44px touch target (WCAG 2.1 AA)
    style: {
      minHeight: "44px",
      minWidth: "44px",
      borderRadius: "var(--axq-radius-button)",
    },
  }, text(label))

// Input với label liên kết đúng chuẩn
const AXQInputField = ({ id, label, value, oninput, error, helperText }) =>
  h("div", { class: "axq-form-field" }, [
    h("label", {
      for: id,
      class: "axq-text--caption axq-text--secondary",
      style: { display: "block", marginBottom: "4px" },
    }, text(label)),
    h("input", {
      id,
      class: { "axq-input": true, "axq-input--error": !!error },
      value,
      oninput,
      "aria-describedby": error ? `${id}-error` : helperText ? `${id}-helper` : undefined,
      "aria-invalid": !!error,
      style: {
        borderRadius: "var(--axq-radius-input)",   // 12px
        border: `1px solid ${error ? "var(--axq-status-error-default)" : "var(--axq-border-default)"}`,
        padding: "var(--axq-inset-sm) var(--axq-inset-md)",
      },
    }),
    error && h("span", {
      id: `${id}-error`,
      class: "axq-text--caption",
      style: { color: "var(--axq-status-error-text)", marginTop: "4px" },
      role: "alert",
    }, text(error)),
    !error && helperText && h("span", {
      id: `${id}-helper`,
      class: "axq-text--caption axq-text--tertiary",
    }, text(helperText)),
  ])
```

### Empty State Component — AXQ Pattern

```js
// EmptyState — dùng cho Zone 8: Empty History, Empty Portfolio, Empty Cards
const EmptyState = ({ illustration, title, description, ctaLabel, ctaAction }) =>
  h("div", {
    class: "axq-empty-state",
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--axq-gap-lg)",         // 16px
      padding: "var(--axq-inset-2xl)",  // 48px
    },
  }, [
    // SVG Illustration
    illustration && h("div", { class: "axq-empty-state__illustration" }, [illustration]),

    h("div", { class: "axq-empty-state__text", style: { textAlign: "center" } }, [
      h("h3", { class: "axq-text--h6" }, text(title)),
      description && h("p", {
        class: "axq-text--body axq-text--secondary",
        style: { marginTop: "var(--axq-gap-sm)" },  // 8px
      }, text(description)),
    ]),

    ctaLabel && h("button", {
      class: "axq-btn axq-btn--primary",
      onclick: ctaAction,
      style: { borderRadius: "var(--axq-radius-button)" },
    }, text(ctaLabel)),
  ])
```

### AXQ Design System — Mapping đầy đủ Views → Tokens

| View / Component | Component Token | Semantic | Hex | Ghi chú |
|---|---|---|---|---|
| `AXQButton` bg | `button/primary-bg` | `bg/brand` | `#000000` | Brand black |
| `AXQButton` text | `button/primary-text` | `text/inverse` | `#FFFFFF` | |
| `AXQButton` corner | `button/radius` | `radius/button` | 24px | Pill shape |
| `AXQButton` info | `button/filled/bg/info` | `status/info` | `#0095FF` | |
| `AXQInputField` border | `input/border` | `border/default` | `#E4E9F2` | |
| `AXQInputField` focus | `input/border-focus` | `border/focus` | `#0095FF` | |
| `AXQInputField` error | `input/border-error` | `status/error-default` | `#FF3D71` | |
| `EmptyState` bg | `card/bg` | `surface/default` | `#FFFFFF` | |
| `BottomNavbar` height | `navbar/height` | `spacing/3xl` | 64px | |
| `KYCStatusCard` padding | `card/padding` | `inset/lg` | 24px | |
| `ThemeToggle` dark bg | Semantic override | `bg/primary` dark | `#121318` | |

### Tham Khảo Thêm (cập nhật)

- [Design System](../ui/DESIGN_SYSTEM.md) — Toàn bộ token system + 65+ screens Axiopass
- [Actions](actions.md) — `ToggleTheme`, `SetTab`, `RequireKYC` wire vào Views
- [Dispatch](dispatch.md) — `kycGateGuard` bảo vệ button actions
- [Subscriptions](subscriptions.md) — `onL2HealthCheck` hiển thị offline banner trong View
- [Master Roadmap](../AXIOLEDGER_ROADMAP.md) — Mục 7: Design System Foundation
