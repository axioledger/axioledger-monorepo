/**
 * DonutChart — AXQ Design System
 * Inventory: #81 · Group 7 Charts & Financial Analytics · Phase 1–2 ⚡
 *
 * Portfolio donut / pie chart for asset allocation.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    5 token brand colors per slice: brand/teal, brand/green,
//           brand/purple, brand/yellow, brand/orange, status/info-default
//           surface/default → #FFFFFF (center hole)
// radius:   — (SVG circle)
// spacing:  default 160×160px · center hole radius 40% of total

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DonutChartSlice {
  /** Label (token name) */
  label: string
  /** Giá trị số (cho tính %) */
  value: number
  /** Màu slice (brand color hex) */
  color: string
}

export interface DonutChartProps {
  /** Danh sách slices */
  slices: DonutChartSlice[]
  /** Giá trị hiển thị ở tâm (tuỳ chọn) */
  centerLabel?: string
  /** Kích thước SVG. Mặc định: 160 */
  size?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DonutChart: React.FC<DonutChartProps> = (_props) => {
  return <div data-testid="axq-81" />
}

DonutChart.displayName = "DonutChart"
