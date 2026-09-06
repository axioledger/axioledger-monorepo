/**
 * SwapRateLockCountdown — AXQ Design System
 * Inventory: #117 · Group 11 Crypto & Web3 Specific · Phase 3 🔵
 *
 * Swap rate lock countdown — 15s refresh timer.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/secondary         → #8F9BB3 (rate text normal state)
//           status/warning-default → #FFAA00 (countdown < 5s warning)
//           icon/secondary         → #8F9BB3 (clock icon normal)
// typography: type/caption (12px)
// spacing:  inline row · height 24px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SwapRateLockCountdownProps {
  /** Số giây còn lại (0–15). Mặc định: 15 */
  secondsRemaining?: number
  /** Tỷ giá hiện tại (formatted, e.g. "1 ETH = 2679.62 USDT") */
  rateLabel?: string
  /** Callback khi đếm về 0 (rate cần refresh) */
  onExpire?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SwapRateLockCountdown: React.FC<SwapRateLockCountdownProps> = (_props) => {
  return <div data-testid="axq-117" />
}

SwapRateLockCountdown.displayName = "SwapRateLockCountdown"
