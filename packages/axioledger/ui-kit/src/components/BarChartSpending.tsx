/**
 * BarChartSpending — AXQ Design System
 * Inventory: #82 · Group 7 Charts & Financial Analytics · Phase 3 🔵
 *
 * Monthly spending bar chart.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/teal    → #49DBC8 (primary bar fill)
//           brand/purple  → #AF96FB (secondary/comparison bar fill)
//           bg/secondary  → #EDF1F7 (bar background track)
//           text/tertiary → #8F9BB3 (axis labels)
// radius:   radius/sm (4px) on bar tops
// spacing:  bar width ~24px · gap 8px between bars

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SpendingBarDataPoint {
  /** Label tháng, e.g. "Jan" */
  label: string
  /** Giá trị kỳ này */
  value: number
  /** Giá trị kỳ trước để so sánh (optional) */
  compareValue?: number
}

export interface BarChartSpendingProps {
  /** Dữ liệu monthly */
  data?: SpendingBarDataPoint[]
  /** Chiều cao chart. Mặc định: 200 */
  height?: number
  /** Đơn vị tiền tệ. Mặc định: "USD" */
  currency?: string
  /** Đang tải */
  isLoading?: boolean
  /** Callback khi nhấn cột */
  onBarPress?: (point: SpendingBarDataPoint) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BarChartSpending: React.FC<BarChartSpendingProps> = (_props) => {
  return <div data-testid="axq-82" />
}

BarChartSpending.displayName = "BarChartSpending"
