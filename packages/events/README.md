# @axioledger/events

> Subscribe to mouse, keyboard, window, and frame events.

## Installation

```console
npm install @axioledger/events
```

```js
import { onKey, onMouse, onFrame } from "@axioledger/events"
```

Or without a build step:

```html
<script type="module">
  import { onKey, onMouse } from "https://unpkg.com/@axioledger/events?module"
</script>
```

## License

[MIT](../../LICENSE.md)

---

## Axioledger — Event Subscriptions trong AxioPass Wallet

> `@axioledger/events` được sử dụng trong **AxioPass Wallet** để xử lý các sự kiện bàn phím cho PIN Pad, phím tắt giao dịch, và phát hiện jailbreak / screenshot attempt.

### Ứng Dụng trong AxioPass

#### 1. PIN Numpad Keyboard Handler (Zone 1 — Authentication)

```js
import { app, h, text } from "axioledger"
import { onKey } from "@axioledger/events"

// Action: nhập số PIN từ bàn phím vật lý
const PINKeyPressed = (state, event) => {
  const digit = event.key
  if (!/^[0-9]$/.test(digit)) return state
  if (state.pinInput.length >= 6) return state

  const newPin = state.pinInput + digit
  return newPin.length === 6
    ? [{ ...state, pinInput: newPin }, validatePIN(newPin, PINValidated)]
    : { ...state, pinInput: newPin }
}

// Action: xóa digit cuối (Backspace)
const PINBackspace = (state) => ({
  ...state,
  pinInput: state.pinInput.slice(0, -1),
})

app({
  init: { pinInput: "", screen: "pin-entry" },

  subscriptions: (state) => [
    // Lắng nghe phím số khi đang nhập PIN
    state.screen === "pin-entry" && onKey("keydown", PINKeyPressed),

    // Backspace để xóa
    state.screen === "pin-entry" && onKey("keydown", {
      key: "Backspace",
      action: PINBackspace,
    }),
  ],
})
```

#### 2. Quick Action Keyboard Shortcuts (Home Screen)

```js
// Phím tắt: S = Send, R = Receive, W = Swap
const QuickActionShortcut = (state, event) => {
  if (!state.wallet) return state  // Chỉ hoạt động khi đã đăng nhập
  switch (event.key.toUpperCase()) {
    case "S": return [state, navigateTo("send")]
    case "R": return [state, navigateTo("receive")]
    case "W": return [state, navigateTo("swap")]
    default: return state
  }
}

app({
  subscriptions: (state) => [
    state.screen === "home" && onKey("keydown", QuickActionShortcut),
  ],
})
```

#### 3. Security: Detect Screenshot Attempt (Zone 8 — System States)

```js
import { onWindow } from "@axioledger/events"

// Phát hiện visibility change (user chụp màn hình / switch app)
const VisibilityChanged = (state) => {
  if (document.hidden) {
    // App đi vào background — ẩn thông tin nhạy cảm
    return [
      { ...state, sensitiveDataVisible: false },
      blurSensitiveFields(),
    ]
  }
  return state
}

app({
  subscriptions: (state) => [
    // Lắng nghe visibility change để bảo vệ dữ liệu nhạy cảm
    onWindow("visibilitychange", VisibilityChanged),

    // Phát hiện resize bất thường (có thể là screen recording)
    onWindow("resize", CheckAbnormalResize),
  ],
})
```

#### 4. Frame Animation Loop — Loading Animations

```js
import { onFrame } from "@axioledger/events"

// Animate ZK-Proof generation progress
const UpdateProofProgress = (state, timestamp) => {
  if (!state.generatingProof) return state
  const elapsed = timestamp - state.proofStartTime
  const progress = Math.min(elapsed / 1000, 1)  // 1s target mobile proof

  return progress >= 1
    ? [{ ...state, generatingProof: false, proofProgress: 1 }]
    : { ...state, proofProgress: progress }
}

app({
  subscriptions: (state) => [
    // Animate trong khi đang generate ZK-Proof (< 1s mobile target)
    state.generatingProof && onFrame(UpdateProofProgress),
  ],
})
```

### Event — Action Mapping cho Axiopass Zones

| Zone | Event | Action | Mô tả |
|---|---|---|---|
| Zone 1 Auth | `keydown` 0-9 | `PINKeyPressed` | Nhập PIN 6 digit |
| Zone 1 Auth | `keydown` Backspace | `PINBackspace` | Xóa digit cuối |
| Zone 1 Auth | `keydown` Enter | `SubmitPIN` | Xác nhận PIN |
| Zone 3 Home | `keydown` S/R/W | `QuickActionShortcut` | Shortcut Send/Receive/Swap |
| Zone 6 Transfer | `keydown` Escape | `CancelTransaction` | Hủy giao dịch đang nhập |
| Zone 8 Security | `visibilitychange` | `VisibilityChanged` | Ẩn data khi background |
| ZK Proving | `frame` | `UpdateProofProgress` | Animate proof generation |

### Tham Khảo Thêm

- [`@axioledger/dom`](../dom) — `focus()` auto-focus OTP input khi màn hình xuất hiện
- [`@axioledger/time`](../time) — `onEvery` cho session timeout, auto-blur CVV
- [Architecture: Subscriptions](../../docs/architecture/subscriptions.md) — Các subscription pattern Axioledger
- [Design System](../../docs/ui/design-system-roadmap.md) — Zone 1 Auth screens, Zone 8 System States

---

## Axioledger — Events & WebAuthn Nâng Cao

> Mở rộng từ phần trước — WebAuthn event interception, deep-link handling, và hardware key events.

### 5. WebAuthn Passkey Events — Interception Layer

```js
import { app } from "axioledger"

// Custom subscription để bắt kết quả WebAuthn credential
// (navigator.credentials.get() là async — cần bridge sang axioledger event system)
const onWebAuthnResult = (onSuccess, onError) => [
  (dispatch, payload) => {
    // Bridge: WebAuthn kết quả được emit qua custom event từ wrapper module
    const successHandler = (event) => {
      requestAnimationFrame(() => dispatch(payload.onSuccess, {
        credential: event.detail.credential,
        publicKey: event.detail.publicKey,
        zkProof: event.detail.zkProof,    // ZK Auth Proof từ @axioledger/wallet-connector
      }))
    }
    const errorHandler = (event) => {
      requestAnimationFrame(() => dispatch(payload.onError, {
        code: event.detail.code,          // "NotAllowedError" | "SecurityError" | "AbortError"
        message: event.detail.message,
        canRetry: event.detail.code !== "SecurityError",
      }))
    }
    window.addEventListener("axiopass:webauthn:success", successHandler)
    window.addEventListener("axiopass:webauthn:error", errorHandler)
    return () => {
      window.removeEventListener("axiopass:webauthn:success", successHandler)
      window.removeEventListener("axiopass:webauthn:error", errorHandler)
    }
  },
  { onSuccess, onError },
]
```

### 6. Deep Link Handler (Universal Links / App Links)

```js
// Handle deep links: axiopass://send?to=alice.axq&amount=100
// Hoặc web: https://app.axioledger.io?action=send&to=...
const onDeepLink = (onLinkReceived) => [
  (dispatch, payload) => {
    const handleLink = () => {
      const params = new URLSearchParams(window.location.search)
      const action = params.get("action")
      const to = params.get("to")
      const amount = params.get("amount")
      const referral = params.get("ref")

      if (action || to || referral) {
        requestAnimationFrame(() => dispatch(payload.onLinkReceived, {
          action, to, amount, referral,
        }))
      }
    }
    // Check on mount
    handleLink()
    // Check on popstate (back/forward navigation)
    window.addEventListener("popstate", handleLink)
    return () => window.removeEventListener("popstate", handleLink)
  },
  { onLinkReceived },
]

// Action xử lý deep link khi app mở
const DeepLinkReceived = (state, link) => {
  if (link.action === "send" && link.to) {
    return { ...state, transfer: { ...state.transfer, recipient: { address: link.to } }, tab: "pay" }
  }
  if (link.referral) {
    return { ...state, referralCode: link.referral }
  }
  return state
}
```

### 7. Hardware Security Key (FIDO2) Events

```js
// Lắng nghe kết quả từ Hardware Security Key (YubiKey / Titan Key)
// Axiopass hỗ trợ hardware key như một tùy chọn MFA thứ 3 (sau Passkey và PIN)
const onHardwareKeyResult = (onAuthenticated) => [
  (dispatch, payload) => {
    const handler = (event) => {
      if (event.detail.type === "security-key") {
        requestAnimationFrame(() => dispatch(payload.onAuthenticated, {
          keyType: "hardware",
          attestation: event.detail.attestation,
        }))
      }
    }
    window.addEventListener("axiopass:mfa:result", handler)
    return () => window.removeEventListener("axiopass:mfa:result", handler)
  },
  { onAuthenticated },
]
```

### 8. Swipe Gesture (Zone 1 — Onboarding Carousel)

```js
import { onMouse } from "@axioledger/events"

// Swipe gesture detector cho Onboarding slides
let touchStartX = 0

const OnboardingSwipeStart = (state, event) => {
  touchStartX = event.touches?.[0]?.clientX ?? event.clientX
  return state
}

const OnboardingSwipeEnd = (state, event) => {
  const endX = event.changedTouches?.[0]?.clientX ?? event.clientX
  const delta = endX - touchStartX
  const MIN_SWIPE = 50

  if (Math.abs(delta) < MIN_SWIPE) return state

  const currentSlide = state.auth.onboardingSlide ?? 0
  const maxSlide = 2  // 3 slides: 0, 1, 2

  if (delta < 0 && currentSlide < maxSlide) {
    // Swipe left → next slide
    return { ...state, auth: { ...state.auth, onboardingSlide: currentSlide + 1 } }
  }
  if (delta > 0 && currentSlide > 0) {
    // Swipe right → prev slide
    return { ...state, auth: { ...state.auth, onboardingSlide: currentSlide - 1 } }
  }
  return state
}

app({
  subscriptions: (state) => [
    state.auth.screen === "onboarding" && onMouse("mousedown", OnboardingSwipeStart),
    state.auth.screen === "onboarding" && onMouse("mouseup", OnboardingSwipeEnd),
  ],
})
```

### Event → Action Mapping (cập nhật)

| Zone | Event Source | Event/Subscription | Action | Mô tả |
|---|---|---|---|---|
| Zone 1 Auth | Keyboard | `onKey("keydown")` | `PINKeyPressed` / `PINBackspace` | PIN numpad |
| Zone 1 Auth | WebAuthn | `onWebAuthnResult` | `PasskeyVerified` / `PasskeyFailed` | Passkey auth |
| Zone 1 Onboarding | Mouse/Touch | `onMouse` | `OnboardingSwipeStart/End` | Swipe slide |
| Zone 1 Deep Link | URL params | `onDeepLink` | `DeepLinkReceived` | Universal Link |
| Zone 3 Home | Keyboard | `onKey("keydown")` | `QuickActionShortcut` | S/R/W shortcuts |
| Zone 6 Transfer | Keyboard | `onKey("keydown")` | `CancelTransaction` | Escape |
| Zone 8 Security | Window | `onWindow("visibilitychange")` | `VisibilityChanged` | Hide data |
| Zone 8 MFA | Custom event | `onHardwareKeyResult` | `HardwareKeyAuthenticated` | YubiKey |
| KYC/Auth | `onFrame` | `onFrame` | `UpdateProofProgress` | ZK animation |

### Tham Khảo Thêm (cập nhật)

- [`@axioledger/dom`](../dom) — `trapFocusInModal` dùng kết hợp WebAuthn modal
- [`@axioledger/time`](../time) — `onEvery` cho session timeout sau idle
- [Architecture: Subscriptions](../../docs/architecture/subscriptions.md) — `onWebAuthnResult`, `onL2HealthCheck`
- [Architecture: Effects](../../docs/architecture/effects.md) — `initPasskeyAuth` trigger WebAuthn
- [Design System](../../docs/ui/DESIGN_SYSTEM.md) — Zone 1 Auth screens · Zone 8 System States
