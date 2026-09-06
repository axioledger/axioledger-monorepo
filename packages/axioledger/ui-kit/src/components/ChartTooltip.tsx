/**
 * ChartTooltip — AXQ Design System
 * Inventory: #83 · Group 7 Charts & Financial Analytics · Phase 3 🔵
 *
 * Chart tooltip callout box — shows exact value on tap.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg/inverse    → #101426 (tooltip background)
//           text/inverse  → #FFFFFF (value text)
//           text/caption  → 12px font-size
// radius:   radius/md (8px)
// spacing:  inset/sm (8px) vertical · inset/md (16px) horizontal · arrow 6px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChartTooltipProps {
  /** Giá trị hiển thị (formatted string) */
  value: string
  /** Nhãn phụ, e.g. timestamp "Aug 12, 14:30" */
  label?: string
  /** Vị trí hiển thị (tooltip arrow direction) */
  placement?: "top" | "bottom"
  /** Hiển thị tooltip */
  visible?: boolean
  /** Vị trí ngang tương đối (0–1) */
  xRatio?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ChartTooltip: React.FC<ChartTooltipProps> = (_props) => {
  return <div data-testid="axq-83" />
}

ChartTooltip.displayName = "ChartTooltip"
