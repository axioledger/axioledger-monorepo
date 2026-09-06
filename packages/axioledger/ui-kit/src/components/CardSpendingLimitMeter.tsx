/**
 * CardSpendingLimitMeter — AXQ Design System
 * Inventory: #138 · Group 13 Card Management · Phase 3 🔵
 *
 * Card spending limit progress meter — e.g. $3500 / $5000.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/info-default → #0095FF (filled track)
//           bg/tertiary         → #EDF1F7 (empty track)
//           text/caption        → 12px (limit labels)
//           text/primary        → #101426 (spent amount)
//           status/warning-default → #FFAA00 (>80% fill warning)
// radius:   radius/full (9999px) on track
// spacing:  height 6px track · inset/md (16px) padding

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CardSpendingLimitMeterProps {
  /** Số tiền đã chi trong kỳ (cents) */
  spentAmount: number
  /** Giới hạn chi tiêu (cents) */
  limitAmount: number
  /** Nhãn kỳ, e.g. "Monthly Limit" */
  periodLabel?: string
  /** Đơn vị tiền tệ. Mặc định: "USD" */
  currency?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CardSpendingLimitMeter: React.FC<CardSpendingLimitMeterProps> = (_props) => {
  return <div data-testid="axq-138" />
}

CardSpendingLimitMeter.displayName = "CardSpendingLimitMeter"
