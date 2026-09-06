/**
 * CashbackProgressCard — AXQ Design System
 * Inventory: #30 · Group 3 Data Display & Visual Cards · Phase 1–2 ⚡
 *
 * Cashback / Rewards progress card: Points earned + Amount + Progress bar.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    card/bg → surface/default → #FFFFFF
//           card/border → border/subtle → #EDF1F7
//           status/success-default → #00D68F (progress bar fill + accent)
//           bg/tertiary → #E4E9F2 (progress bar track)
//           text/primary → #101426 (points value)
//           text/secondary → #2E3A59 (label)
//           text/tertiary → #8F9BB3 (goal label)
// radius:   radius/card → radius/xl → 16px (card)
//           radius/full → 9999px (progress bar)
// spacing:  card/padding (24px) · gap/md (12px)
// typography: type/h5 (24px) font-weight 700 (points value)
//             type/body-sm (14px) labels

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CashbackProgressCardProps {
  /** Số điểm hiện tại */
  points: number
  /** Mục tiêu điểm */
  pointsGoal: number
  /** Số tiền cashback đã kiếm được (đã format) */
  amountEarned: string
  /** Kỳ hiện tại (ví dụ: "This Month") */
  periodLabel?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CashbackProgressCard: React.FC<CashbackProgressCardProps> = (_props) => {
  return <div data-testid="axq-30" />
}

CashbackProgressCard.displayName = "CashbackProgressCard"
