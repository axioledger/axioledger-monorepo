/**
 * ChartLegendItem — AXQ Design System
 * Inventory: #84 · Group 7 Charts & Financial Analytics · Phase 3 🔵
 *
 * Chart legend item — color dot + label.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    (dot color passed via prop — uses brand color tokens)
//           text/secondary → #8F9BB3 (label text)
//           type/caption   → 12px
// spacing:  dot 8×8px · gap/xs (4px) between dot and label

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChartLegendItemProps {
  /** Nhãn của series */
  label: string
  /** Màu dot (hex) — dùng brand color tokens */
  color: string
  /** Giá trị hiển thị kèm nhãn (optional) */
  value?: string
  /** Mờ item (khi bị ẩn series) */
  dimmed?: boolean
  /** Callback khi nhấn để toggle series */
  onToggle?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ChartLegendItem: React.FC<ChartLegendItemProps> = (_props) => {
  return <div data-testid="axq-84" />
}

ChartLegendItem.displayName = "ChartLegendItem"
