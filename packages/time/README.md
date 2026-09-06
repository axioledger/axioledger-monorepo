# @axioledger/time

> Subscribe to intervals, get the time now.

## Installation

```console
npm install @axioledger/time
```

```js
import { onEvery, now } from "@axioledger/time"
```

Or without a build step:

```html
<script type="module">
  import { onEvery, now } from "https://unpkg.com/@axioledger/time?module"
</script>
```

## License

[MIT](../../LICENSE.md)

---

## Axioledger — Time Subscriptions trong AxioPass & ZK-Metrics

> `@axioledger/time` được dùng rộng rãi trong Axioledger để: **session timeout**, **auto-blur CVV**, **ZK-Metrics polling**, **price feed refresh**, và **countdown timers** cho OTP.

### Ứng Dụng trong AxioPass

#### 1. Session Timeout Auto-Logout (Zone 8 — Security)

Tự động đăng xuất sau 5 phút không hoạt động — bảo vệ tài sản crypto người dùng:

```js
import { app, h, text } from "axioledger"
import { onEvery } from "@axioledger/time"

const SESSION_TIMEOUT_MS = 5 * 60 * 1000  // 5 phút

// Action: cập nhật last activity timestamp
const RecordActivity = (state) => ({
  ...state,
  lastActivityAt: Date.now(),
})

// Action: kiểm tra session timeout mỗi 30 giây
const CheckSessionTimeout = (state) => {
  const idleTime = Date.now() - state.lastActivityAt
  if (idleTime >= SESSION_TIMEOUT_MS && state.wallet) {
    // Session expired — auto logout
    return [
      { ...state, wallet: null, screen: "login" },
      showSessionExpiredModal(),  // effect: hiện modal Zone 8
    ]
  }
  return state
}

app({
  init: { wallet: null, lastActivityAt: Date.now() },
  subscriptions: (state) => [
    // Kiểm tra mỗi 30 giây khi đã đăng nhập
    state.wallet && onEvery(30000, CheckSessionTimeout),
  ],
})
```

#### 2. Auto-Blur CVV Sau 10 Giây (Zone 4 — Card Management)

```js
import { onEvery } from "@axioledger/time"
import { blur } from "@axioledger/dom"

// Action: bắt đầu đếm ngược ẩn thông tin thẻ
const StartCVVRevealTimer = (state) => ({
  ...state,
  cardRevealed: true,
  cvvRevealedAt: Date.now(),
})

// Action: kiểm tra mỗi giây xem đã hết 10s chưa
const CheckCVVAutoHide = (state) => {
  const elapsed = Date.now() - state.cvvRevealedAt
  if (state.cardRevealed && elapsed >= 10000) {
    return [
      { ...state, cardRevealed: false, cvvRevealedAt: null },
      blur("#card-cvv-display"),    // @axioledger/dom: blur sensitive field
      blur("#card-number-display"),
    ]
  }
  return state
}

app({
  subscriptions: (state) => [
    state.cardRevealed && onEvery(1000, CheckCVVAutoHide),
  ],
})
```

#### 3. OTP Countdown Timer (Zone 1 — Authentication)

```js
// Countdown hiển thị thời gian còn lại để nhập OTP (120 giây)
const OTP_EXPIRY_SECONDS = 120

const TickOTPCountdown = (state) => {
  if (state.otpSecondsLeft <= 0) {
    return [
      { ...state, otpExpired: true, otpSecondsLeft: 0 },
      showOTPExpiredAlert(),  // effect: hiện Alert "OTP đã hết hạn"
    ]
  }
  return { ...state, otpSecondsLeft: state.otpSecondsLeft - 1 }
}

app({
  init: { screen: "otp", otpSecondsLeft: OTP_EXPIRY_SECONDS, otpExpired: false },
  subscriptions: (state) => [
    state.screen === "otp" && !state.otpExpired &&
      onEvery(1000, TickOTPCountdown),
  ],
})
```

#### 4. ZK-Metrics Price Feed Refresh (ZK-Metrics Oracle)

```js
// Cập nhật giá token và metrics mỗi 5 giây
// Dữ liệu từ Native Indexer Stack (PM2 + Nginx + Rust)
const RefreshPriceFeed = (state) => [
  state,
  fetchTokenPrices(PricesUpdated),    // effect: query ZK-Metrics Oracle
]

// Refresh TVL và volume 24h mỗi 60 giây (dashboard)
const RefreshDashboardMetrics = (state) => [
  state,
  fetchDashboardMetrics(MetricsUpdated),
]

app({
  subscriptions: (state) => [
    // Cập nhật giá realtime khi đang xem Portfolio
    state.screen === "portfolio" && onEvery(5000, RefreshPriceFeed),

    // Refresh metrics dashboard mỗi phút
    state.screen === "home" && onEvery(60000, RefreshDashboardMetrics),
  ],
})
```

#### 5. Staking Rewards Countdown (Zone 5 — Crypto)

```js
// Hiển thị thời gian còn lại để nhận Staking Rewards
const UpdateStakingCountdown = (state) => ({
  ...state,
  stakingCountdowns: state.stakingPositions.map(position => ({
    ...position,
    timeUntilReward: position.nextRewardAt - Date.now(),
    timeUntilUnlock: position.unlockAt - Date.now(),
  })),
})

app({
  subscriptions: (state) => [
    // Cập nhật countdown mỗi giây khi user đang xem Staking
    state.screen === "staking" && onEvery(1000, UpdateStakingCountdown),
  ],
})
```

### Time Subscription Catalog — Axiopass Wallet

| Subscription | Interval | Trigger Condition | Mô tả |
|---|---|---|---|
| `CheckSessionTimeout` | 30s | `state.wallet !== null` | Auto-logout sau 5 phút idle |
| `CheckCVVAutoHide` | 1s | `state.cardRevealed` | Auto-blur CVV sau 10s |
| `TickOTPCountdown` | 1s | `screen === "otp"` | Đếm ngược hết hạn OTP |
| `RefreshPriceFeed` | 5s | `screen === "portfolio"` | Cập nhật giá 5 token |
| `RefreshDashboardMetrics` | 60s | `screen === "home"` | Refresh TVL, volume |
| `UpdateStakingCountdown` | 1s | `screen === "staking"` | Countdown staking reward |
| `CheckDomainExpiry` | 3600s | `state.domain !== null` | Cảnh báo .axq sắp hết hạn |

### Tham Khảo Thêm

- [`@axioledger/dom`](../dom) — `blur()` dùng kèm với `onEvery` để auto-blur CVV
- [`@axioledger/events`](../events) — `onWindow("visibilitychange")` để detect background
- [Architecture: Subscriptions](../../docs/architecture/subscriptions.md) — ZK-Metrics WebSocket subscription
- [Master Roadmap](../../docs/AXIOLEDGER_ROADMAP.md) — Mục 3.2: ZK-Metrics Coprocessor Oracle

---

## Axioledger — Time Patterns Nâng Cao

> Mở rộng từ phần trước — ZK-Metrics polling chiến lược, adaptive interval, và scheduled task pattern.

### 6. Adaptive Polling — Giảm Frequency khi Idle

```js
import { onEvery } from "@axioledger/time"

// Giảm tần suất poll khi user không tương tác để tiết kiệm bandwidth
// Khi active: poll mỗi 5s | Khi idle 2 phút: poll mỗi 30s
const ACTIVE_POLL_INTERVAL = 5000   // 5 giây
const IDLE_POLL_INTERVAL = 30000    // 30 giây
const IDLE_THRESHOLD_MS = 120000    // 2 phút

const GetPollInterval = (state) =>
  (Date.now() - state.lastActivityAt) > IDLE_THRESHOLD_MS
    ? IDLE_POLL_INTERVAL
    : ACTIVE_POLL_INTERVAL

// Adaptive price feed — chậm hơn khi idle
const AdaptiveRefreshPriceFeed = (state) => [
  state,
  fetchTokenPrices(PricesUpdated),
]

app({
  subscriptions: (state) => [
    // Interval thay đổi theo hoạt động — NOTE: axioledger restart sub khi interval thay đổi
    state.screen === "portfolio" &&
      onEvery(GetPollInterval(state), AdaptiveRefreshPriceFeed),
  ],
})
```

### 7. ZK-Metrics Polling với Circuit Breaker

```js
import { onEvery } from "@axioledger/time"

// Poll ZK-Metrics nhưng dừng khi L2 offline
const PollZKMetricsIfOnline = (state) => {
  if (state.l2Status === "offline") return state  // Skip khi offline
  return [state, fetchZKMetrics(ZKMetricsReceived)]
}

// Subscription catalog cho ZK-Metrics polling
app({
  subscriptions: (state) => [
    // KPI dashboard — chỉ poll khi tab DAO đang active
    state.tab === "dao" && state.l2Status !== "offline" &&
      onEvery(5000, PollZKMetricsIfOnline),

    // TVL và validator stats — ít quan trọng hơn, poll mỗi 60s
    state.tab === "home" && onEvery(60000, RefreshDashboardMetrics),

    // Validator uptime riêng — mỗi 30s
    state.wallet && onEvery(30000, RefreshValidatorStats),
  ],
})
```

### 8. Scheduled Transaction (DCA — Dollar Cost Averaging)

```js
import { onEvery } from "@axioledger/time"
import { now } from "@axioledger/time"

// DCA Strategy — tự động mua $AXQ định kỳ
const CHECK_DCA_INTERVAL = 60000  // Check mỗi phút

const CheckDCASchedule = (state) => {
  if (!state.dca || !state.dca.enabled) return state

  const now = Date.now()
  const nextExecution = state.dca.lastExecutedAt + state.dca.intervalMs

  if (now >= nextExecution) {
    // Đến giờ thực hiện DCA
    return [
      { ...state, dca: { ...state.dca, lastExecutedAt: now } },
      submitSwapIntent(
        { from: "usdc", to: "axq", amount: state.dca.amount },
        DCAExecuted
      ),
    ]
  }
  return state
}

const DCAExecuted = (state, result) => ({
  ...state,
  dca: {
    ...state.dca,
    totalInvested: (parseFloat(state.dca.totalInvested) + parseFloat(state.dca.amount)).toString(),
    executionHistory: [...state.dca.executionHistory, result],
  },
})

app({
  subscriptions: (state) => [
    state.dca?.enabled && onEvery(CHECK_DCA_INTERVAL, CheckDCASchedule),
  ],
})
```

### 9. Progressive Loading Timer — Skeleton → Content

```js
import { onEvery } from "@axioledger/time"

// Hiển thị skeleton loading với timeout — nếu quá lâu → hiện error
const LOADING_TIMEOUT_MS = 10000  // 10 giây max loading

const CheckLoadingTimeout = (state) => {
  if (!state.loading) return state  // Đã load xong — không cần kiểm tra

  const elapsed = Date.now() - state.loadingStartedAt
  if (elapsed >= LOADING_TIMEOUT_MS) {
    return [
      {
        ...state,
        loading: false,
        error: "Tải dữ liệu quá lâu. Kiểm tra kết nối mạng.",
      },
    ]
  }
  return state
}

// Action bắt đầu load với timeout guard
const StartLoadingWithTimeout = (state, loadEffect) => [
  { ...state, loading: true, loadingStartedAt: Date.now() },
  loadEffect,
]

app({
  subscriptions: (state) => [
    state.loading && onEvery(1000, CheckLoadingTimeout),
  ],
})
```

### Time Subscription Catalog (cập nhật đầy đủ)

| Subscription | Interval | Trigger Condition | L2 Guard | Mô tả |
|---|---|---|---|---|
| `CheckSessionTimeout` | 30s | `wallet !== null` | — | Auto-logout 5 phút idle |
| `CheckCVVAutoHide` | 1s | `card.revealed` | — | Auto-blur CVV |
| `TickOTPCountdown` | 1s | `screen === "otp"` | — | Đếm ngược OTP |
| `AdaptiveRefreshPriceFeed` | 5s / 30s | `screen === "portfolio"` | `l2Status` | Giá 5 token |
| `RefreshDashboardMetrics` | 60s | `screen === "home"` | — | TVL, volume |
| `UpdateStakingCountdown` | 1s | `screen === "staking"` | — | Countdown reward |
| `CheckDomainExpiry` | 3600s | `domain !== null` | — | .axq sắp hết hạn |
| `PollZKMetricsIfOnline` | 5s | `tab === "dao"` | ✓ `l2Status` | ZK-Metrics KPI |
| `RefreshValidatorStats` | 30s | `wallet !== null` | ✓ | Validator uptime |
| `CheckDCASchedule` | 60s | `dca.enabled` | ✓ | Auto DCA |
| `CheckLoadingTimeout` | 1s | `loading === true` | — | Loading guard 10s |

### Tham Khảo Thêm (cập nhật)

- [`@axioledger/dom`](../dom) — `blur()` dùng kết hợp với `onEvery` auto-blur CVV
- [`@axioledger/events`](../events) — `RecordActivity` để reset idle timer
- [Architecture: Subscriptions](../../docs/architecture/subscriptions.md) — `onL2HealthCheck` → guard cho polls
- [Architecture: Effects](../../docs/architecture/effects.md) — `submitSwapIntent` trong DCA schedule
- [Design System](../../docs/ui/DESIGN_SYSTEM.md) — `Skeleton` component · Loading states
- [Master Roadmap](../../docs/AXIOLEDGER_ROADMAP.md) — Mục 3.2: ZK-Metrics Coprocessor Oracle
