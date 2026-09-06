/**
 * LineChartInteractive — AXQ Design System
 * Inventory: #79 · Group 7 Charts & Financial Analytics · Phase 1–2 ⚡
 *
 * Interactive price line chart with crosshair tooltip.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/teal → #49DBC8 (chart line stroke, stroke-width 2)
//           surface/raised → #FFFFFF (tooltip background)
//           text/primary → #101426 (tooltip value)
//           border/strong → #8F9BB3 (crosshair line, dashed)
//           text/tertiary → #8F9BB3 (y-axis labels)
//           bg/secondary → #EDF1F7 (chart background)
// radius:   radius/md → 8px (tooltip box)
// spacing:  tooltip padding 8px 12px
// typography: type/caption (12px) axis labels + tooltip

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LineChartDataPoint {
  /** Label trục X (ví dụ: "Jan", "10:00") */
  x: string
  /** Giá trị trục Y */
  y: number
}

export interface LineChartInteractiveProps {
  /** Data points */
  data: LineChartDataPoint[]
  /** Timeframe đang chọn */
  timeframe: "1D" | "1W" | "1M" | "1Y" | "ALL"
  /** Callback khi đổi timeframe */
  onTimeframeChange: (timeframe: string) => void
  /** Ký hiệu tiền tệ cho tooltip */
  currency?: string
  /** Callback khi nhấn một điểm dữ liệu */
  onPointPress?: (point: LineChartDataPoint) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const LineChartInteractive: React.FC<LineChartInteractiveProps> = (_props) => {
  return <div data-testid="axq-79" />
}

LineChartInteractive.displayName = "LineChartInteractive"
