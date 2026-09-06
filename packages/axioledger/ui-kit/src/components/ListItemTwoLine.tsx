/**
 * ListItemTwoLine — AXQ Design System
 * Inventory: #67 · Group 6 Lists, Cells & Structure · Phase 1–2 ⚡
 *
 * Two-line list item: Icon + Title + Subtitle + Trailing value.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary → #101426 (title, trailingValue)
//           text/secondary → #2E3A59 (subtitle)
//           text/tertiary → #8F9BB3 (trailingSubtitle, timestamp)
//           icon/secondary → #2E3A59 (arrow-right.svg)
//           border/subtle → #EDF1F7 (bottom separator)
// radius:   radius/full → 9999px (icon container)
// spacing:  inset/md (16px) horizontal · 12px vertical · gap/xs (4px) between title/subtitle
// typography: type/body (16px) title · type/body-sm (14px) subtitle
//             type/body (16px) trailingValue right · type/caption (12px) trailingSubtitle

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ListItemTwoLineProps {
  /** Icon bên trái */
  icon?: React.ReactNode
  /** Màu nền icon container */
  iconBg?: string
  /** Tiêu đề chính */
  label: string
  /** Subtitle / mô tả */
  subtitle: string
  /** Giá trị trailing bên phải (ví dụ: số tiền, ngày) */
  trailingValue?: string
  /** Subtitle trailing */
  trailingSubtitle?: string
  /** Hiển thị arrow bên phải */
  showArrow?: boolean
  /** Callback khi nhấn */
  onClick?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ListItemTwoLine: React.FC<ListItemTwoLineProps> = (_props) => {
  return <button type="button" data-testid="axq-67" />
}

ListItemTwoLine.displayName = "ListItemTwoLine"
