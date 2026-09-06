/**
 * PercentageQuickChips — AXQ Design System
 * Inventory: #53 · Group 4 Buttons, Badges & Chips · Phase 3 🔵
 *
 * Percentage quick-pick chips — 25% / 50% / 75% / 100%.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    chip/bg        → #EDF1F7 (inactive chip background)
//           chip/bg-active → #000000 (active chip background)
//           chip/text      → #101426 (inactive label)
//           text/inverse   → #FFFFFF (active label)
// radius:   radius/full (9999px)
// spacing:  inset/sm (8px) horizontal · height 32px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PercentageQuickChipsProps {
  /** Giá trị đang được chọn (25 | 50 | 75 | 100 | undefined) */
  selectedPercent?: 25 | 50 | 75 | 100
  /** Callback khi chọn % */
  onSelect?: (percent: 25 | 50 | 75 | 100) => void
  /** Các % có thể chọn. Mặc định: [25, 50, 75, 100] */
  options?: Array<25 | 50 | 75 | 100>
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PercentageQuickChips: React.FC<PercentageQuickChipsProps> = (_props) => {
  return <div data-testid="axq-53" />
}

PercentageQuickChips.displayName = "PercentageQuickChips"
