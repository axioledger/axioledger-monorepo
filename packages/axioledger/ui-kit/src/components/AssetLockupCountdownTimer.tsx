/**
 * AssetLockupCountdownTimer — AXQ Design System
 * Inventory: #187 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Asset lockup / vesting countdown timer.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/warning-default → #FFAA00 (timer text when < 24h)
//           text/h4                → 34px (countdown display)
//           icon/secondary         → #8F9BB3 (lock icon)
//           text/secondary         → #8F9BB3 (unlock date label)
// spacing:  centered layout · inset/md (16px) padding

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AssetLockupCountdownTimerProps {
  /** Timestamp khi unlock (epoch ms) */
  unlockTimestamp?: number
  /** Tên asset bị lock */
  assetSymbol?: string
  /** Số lượng asset bị lock (formatted) */
  lockedAmount?: string
  /** Callback khi đếm ngược về 0 */
  onUnlock?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AssetLockupCountdownTimer: React.FC<AssetLockupCountdownTimerProps> = (_props) => {
  return <div data-testid="axq-187" />
}

AssetLockupCountdownTimer.displayName = "AssetLockupCountdownTimer"
