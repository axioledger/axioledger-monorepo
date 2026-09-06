/**
 * QuickAmountChips — AXQ Design System
 * Inventory: #54 · Group 4 Buttons, Badges & Chips · Phase 1–2 ⚡
 *
 * Row of quick-select amount chips: e.g. $5 | $25 | $50 | $100
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    chip/bg → bg/secondary → #EDF1F7 (default)
//           chip/bg-active → bg/brand → #000000 (selected)
//           chip/text → text/primary → #101426 (default)
//           chip/text-active → text/inverse → #FFFFFF (selected)
// radius:   chip/radius → radius/full → 9999px
// spacing:  padding 8px 16px per chip · gap/sm (8px) between chips
// typography: chip/font-size → type/body-sm (14px)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuickAmountChipsProps {
  /** Danh sách giá trị số để hiển thị */
  amounts: number[]
  /** Ký hiệu tiền tệ. Mặc định: "$" */
  currency?: string
  /** Callback khi chọn một giá trị */
  onSelect: (amount: number) => void
  /** Giá trị đang được chọn */
  selectedAmount?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const QuickAmountChips: React.FC<QuickAmountChipsProps> = (_props) => {
  return <div data-testid="axq-54" />
}

QuickAmountChips.displayName = "QuickAmountChips"
