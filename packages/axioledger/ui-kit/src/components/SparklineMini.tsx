/**
 * SparklineMini — AXQ Design System
 * Inventory: #78 · Group 7 Charts & Financial Analytics · Phase 1–2 ⚡
 *
 * Inline mini sparkline chart. No axes, no labels.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/green → #BEFF6C (stroke when trend="up")
//           status/error-default → #FF3D71 (stroke when trend="down")
// radius:   — (SVG path, no border-radius)
// spacing:  default 80×32px inline
// stroke-width: 1.5

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SparklineMiniProps {
  /** Array giá trị số theo thứ tự thời gian */
  data: number[]
  /** Hướng xu hướng: "up" (green) | "down" (red) */
  trend: "up" | "down"
  /** Chiều rộng container. Mặc định: 80 */
  width?: number
  /** Chiều cao container. Mặc định: 32 */
  height?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SparklineMini: React.FC<SparklineMiniProps> = (_props) => {
  return <div data-testid="axq-78" />
}

SparklineMini.displayName = "SparklineMini"
