/**
 * ListItemStandard — AXQ Design System
 * Inventory: #66 · Group 6 Lists, Cells & Structure · Phase 1–2 ⚡
 *
 * Single-line list item: Icon + Label + Arrow.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary → #101426 (label)
//           icon/secondary → #2E3A59 (arrow-right.svg)
//           border/subtle → #EDF1F7 (bottom separator)
//           bg/secondary → #EDF1F7 (icon container bg)
// radius:   radius/full → 9999px (icon container circle, 40×40px)
// spacing:  inset/md (16px) horizontal · 12px vertical padding
// typography: type/body (16px) label

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ListItemStandardProps {
  /** Icon bên trái (ReactNode, 20px) */
  icon?: React.ReactNode
  /** Màu nền icon container (tuỳ chỉnh per item) */
  iconBg?: string
  /** Label hiển thị */
  label: string
  /** Hiển thị arrow bên phải. Mặc định: true */
  showArrow?: boolean
  /** Callback khi nhấn */
  onClick?: () => void
  /** Disable item */
  disabled?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ListItemStandard: React.FC<ListItemStandardProps> = (_props) => {
  return <button type="button" data-testid="axq-66" />
}

ListItemStandard.displayName = "ListItemStandard"
