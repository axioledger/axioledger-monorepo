/**
 * StakingUnbondingAlert — AXQ Design System
 * Inventory: #124 · Group 11 Crypto & Web3 Specific · Phase 3 🔵
 *
 * Staking unbonding / cooldown period warning banner.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/warning-bg      → #FFFDF2 (banner background)
//           status/warning-default → #FFAA00 (icon + border accent)
//           status/warning-text    → #B86E00 (body text)
// radius:   radius/card (16px)
// spacing:  inset/md (16px) padding

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StakingUnbondingAlertProps {
  /** Token symbol, e.g. "AXQ" */
  tokenSymbol?: string
  /** Số ngày / giờ cooldown còn lại (formatted, e.g. "21 days 4 hrs") */
  cooldownRemaining?: string
  /** Số lượng token đang trong unbonding */
  unbondingAmount?: string
  /** Callback khi nhấn "Learn More" */
  onLearnMore?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const StakingUnbondingAlert: React.FC<StakingUnbondingAlertProps> = (_props) => {
  return <div data-testid="axq-124" />
}

StakingUnbondingAlert.displayName = "StakingUnbondingAlert"
