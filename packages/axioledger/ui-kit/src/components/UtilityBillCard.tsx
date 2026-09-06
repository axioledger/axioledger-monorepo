/**
 * UtilityBillCard — AXQ Design System
 * Inventory: #37 · Group 3 Data Display & Visual Cards · Phase 1–2 ⚡
 *
 * Upcoming utility bill card: Merchant + Amount + Pay button.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/warning-bg → #FFFDF2 (card bg — "due soon" state)
//           card/bg → surface/default → #FFFFFF (default state)
//           status/warning-default → #FFAA00 (due date accent, warning-2.svg)
//           text/primary → #101426 (merchant name, amount)
//           text/secondary → #2E3A59 (due date label)
//           button/primary-bg → #000000 (Pay button)
//           text/inverse → #FFFFFF (Pay button label)
// radius:   radius/card → radius/xl → 16px · button/radius → 24px
// spacing:  card/padding (24px) · gap/md (12px)
// typography: type/h6 (20px) font-weight 600 (merchant) · type/h5 (24px) amount
//             type/body-sm (14px) due date

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UtilityBillCardProps {
  /** Logo merchant (ReactNode) */
  merchantLogo?: React.ReactNode
  /** Tên merchant */
  merchantName: string
  /** Số tiền còn nợ (đã format) */
  amount: string
  /** Ngày đến hạn (đã format) */
  dueDate: string
  /** True nếu sắp đến hạn (đổi bg sang warning) */
  isDueSoon?: boolean
  /** Callback khi nhấn Pay */
  onPay: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const UtilityBillCard: React.FC<UtilityBillCardProps> = (_props) => {
  return <div data-testid="axq-37" />
}

UtilityBillCard.displayName = "UtilityBillCard"
