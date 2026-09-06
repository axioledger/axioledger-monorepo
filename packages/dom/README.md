# @axioledger/dom

> Inspect the DOM, focus and blur.

## Installation

```console
npm install @axioledger/dom
```

```js
import { focus, blur } from "@axioledger/dom"
```

Or without a build step—import it right in your browser.

```html
<script type="module">
  import { focus, blur } from "https://unpkg.com/@axioledger/dom"
</script>
```

## License

[MIT](../../LICENSE.md)

---

## Axioledger — DOM Patterns trong AxioPass Wallet

> `@axioledger/dom` được sử dụng trong **AxioPass Wallet** để quản lý focus/blur cho các trường nhập OTP, PIN, và các form nhập liệu tài chính quan trọng.

### Ứng Dụng trong AxioPass

#### 1. Auto-Focus OTP Input (Zone 1 — Authentication)

Khi màn hình OTP Input xuất hiện, tự động focus vào ô nhập liệu đầu tiên để cải thiện UX:

```js
import { app, h, text } from "axioledger"
import { focus } from "@axioledger/dom"

// Action khởi tạo OTP screen — tự động focus
const ShowOTPScreen = (state) => [
  { ...state, screen: "otp", otpValue: "" },
  focus("#otp-input-0"),    // effect: auto-focus vào ô OTP đầu tiên
]

// View: 6-digit OTP input (AxioPass authentication flow)
const OTPInputView = (state) =>
  h("div", { class: "axq-otp-container" }, [
    h("p", { class: "axq-text--h6" }, text("Nhập mã OTP 6 chữ số")),
    h("div", { class: "axq-otp-grid" },
      [0,1,2,3,4,5].map(i =>
        h("input", {
          id: `otp-input-${i}`,
          class: "axq-otp-digit",
          type: "tel",
          maxlength: 1,
          oninput: [OTPDigitInput, i],
          // style theo AXQ Design System: input/border, input/radius
          style: {
            borderRadius: "var(--axq-radius-input)",  // 12px
            border: "1px solid var(--axq-border-default)",
          },
        })
      )
    ),
  ])
```

#### 2. Blur Sensitive Fields After Timeout (Security — Zone 8)

AxioPass tự động blur các trường hiển thị CVV / số thẻ sau 10 giây:

```js
import { blur } from "@axioledger/dom"
import { onEvery } from "@axioledger/time"

// Action: hiện thông tin thẻ nhạy cảm (sau Face ID auth)
const RevealCardDetails = (state) => [
  { ...state, cardRevealed: true, revealedAt: Date.now() },
  // Auto-blur sẽ được handle qua subscription onEvery
]

// Action: ẩn lại thông tin thẻ
const HideCardDetails = (state) => [
  { ...state, cardRevealed: false },
  blur("#card-number-display"),   // blur element để ngăn screenshot
  blur("#card-cvv-display"),
]

app({
  subscriptions: (state) => [
    // Tự động ẩn sau 10 giây kể từ lúc reveal
    state.cardRevealed &&
      onEvery(10000, HideCardDetails),
  ],
})
```

#### 3. Focus Management cho Passkey Authentication

```js
import { focus } from "@axioledger/dom"

// Khi màn hình Passkey Setup xuất hiện, focus vào nút chính
const ShowPasskeySetup = (state) => [
  { ...state, screen: "passkey-setup" },
  focus("#passkey-cta-button"),
]

// View: Passkey Setup Screen (Zone 1 — Authentication)
const PasskeySetupView = (state) =>
  h("div", { class: "axq-screen" }, [
    h("h2", { class: "axq-text--h4" },
      text("Thiết Lập AxioPass Biometric")
    ),
    h("p", { class: "axq-text--body axq-text--secondary" },
      text("Dùng Face ID / Touch ID — không cần Seed Phrase")
    ),
    h("button", {
      id: "passkey-cta-button",
      class: "axq-btn axq-btn--primary",
      onclick: [InitPasskeyAuth],
      style: { borderRadius: "var(--axq-radius-button)" },  // 24px pill
    }, text("KÍCH HOẠT PASSKEY")),
  ])
```

### Tham Khảo Thêm

- [`@axioledger/time`](../time) — `onEvery` để auto-blur sau timeout
- [`@axioledger/events`](../events) — `onKey` để handle PIN numpad keypress
- [Architecture: Actions](../../docs/architecture/actions.md) — `ConnectPasskey`, `RevealCardDetails`
- [Design System](../../docs/ui/design-system-roadmap.md) — Input tokens, Button tokens

---

## Axioledger — DOM Patterns Nâng Cao

> Mở rộng từ phần trước — focus trapping trong Modal, DOM inspection để kiểm tra screenshot safety, và scroll management.

### 4. Focus Trap trong Modal (Zone 6 — Tx Auth)

Khi Modal xác thực giao dịch xuất hiện, cần trap focus bên trong để ngăn user tab ra ngoài:

```js
import { focus, blur } from "@axioledger/dom"

// Effect: trap focus trong modal
const trapFocusInModal = (modalId) => [
  (dispatch, { modalId }) => {
    const modal = document.getElementById(modalId)
    if (!modal) return

    const focusable = modal.querySelectorAll(
      'button, input, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    // Focus vào phần tử đầu tiên
    first?.focus()

    // Trap: khi Tab ở phần tử cuối → quay về đầu
    const trapHandler = (e) => {
      if (e.key !== "Tab") return
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault()
        ;(e.shiftKey ? last : first)?.focus()
      }
    }
    modal.addEventListener("keydown", trapHandler)
    return () => modal.removeEventListener("keydown", trapHandler)
  },
  { modalId },
]

// Action: mở modal xác thực giao dịch với focus trap
const OpenTxAuthModal = (state) => [
  { ...state, transfer: { ...state.transfer, showAuthModal: true } },
  trapFocusInModal("tx-auth-modal"),
]
```

### 5. Scroll-to-Top khi Chuyển Screen

```js
import { blur } from "@axioledger/dom"

// Effect: scroll về đầu trang khi chuyển sang screen mới
const scrollToTop = () => [
  (_dispatch) => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" })
    })
  },
]

// Action: chuyển tab — scroll về đầu
const SetTab = (state, tab) => [
  { ...state, tab },
  scrollToTop(),
]
```

### 6. Inspect DOM Element — KYC Camera Frame

```js
// Effect: kiểm tra camera element sẵn sàng trước khi bắt đầu scan
const inspectCameraReady = (elementId, onReady, onNotReady) => [
  (dispatch, payload) => {
    const el = document.getElementById(payload.elementId)
    if (el && el.readyState >= 2) {  // HAVE_CURRENT_DATA
      requestAnimationFrame(() => dispatch(payload.onReady, {
        width: el.videoWidth,
        height: el.videoHeight,
      }))
    } else {
      requestAnimationFrame(() => dispatch(payload.onNotReady))
    }
  },
  { elementId, onReady, onNotReady },
]

// Action: bắt đầu KYC Scan (Zone 2)
const StartKYCScan = (state, docType) => [
  { ...state, kyc: { ...state.kyc, status: "scanning", docType } },
  focus("#kyc-camera-frame"),          // Focus về camera frame
  inspectCameraReady("kyc-video", CameraReady, CameraNotReady),
]
```

### DOM Patterns Catalog — AxioPass

| Pattern | Effect/Sub | Zone | Mô tả |
|---|---|---|---|
| `focus("#otp-input-0")` | Effect | Zone 1 | Auto-focus OTP slot đầu tiên |
| `focus("#passkey-cta-button")` | Effect | Zone 1 | Focus nút Passkey setup |
| `blur("#card-cvv-display")` | Effect | Zone 4 | Blur CVV sau 10s |
| `blur("#card-number-display")` | Effect | Zone 4 | Blur số thẻ sau 10s |
| `trapFocusInModal("tx-auth-modal")` | Effect | Zone 6 | Trap focus khi auth |
| `scrollToTop()` | Effect | Global | Scroll lên đầu khi đổi tab |
| `inspectCameraReady(...)` | Effect | Zone 2 | Kiểm tra camera trước KYC scan |

### Tham Khảo Thêm (cập nhật)

- [`@axioledger/time`](../time) — `onEvery(1000, CheckCVVAutoHide)` + `blur()` phối hợp auto-blur
- [`@axioledger/events`](../events) — `onKey("Tab")` dùng kết hợp với focus trap
- [Architecture: Effects](../../docs/architecture/effects.md) — Effect pattern `trapFocusInModal`
- [Architecture: Views](../../docs/architecture/views.md) — `AXQInputField` component với focus ring
- [Design System](../../docs/ui/DESIGN_SYSTEM.md) — `input/border-focus: #0095FF`
