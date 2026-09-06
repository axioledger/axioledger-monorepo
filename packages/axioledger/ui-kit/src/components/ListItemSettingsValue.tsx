/**
 * ListItemSettingsValue — AXQ Design System
 * Inventory: #69 · Group 6 Lists, Cells & Structure · Phase 1–2 ⚡
 *
 * Settings row displaying current value with arrow.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary → #101426 (label)
//           text/tertiary → #8F9BB3 (currentValue)
//           icon/secondary → #2E3A59 (arrow-right.svg)
//           border/subtle → #EDF1F7 (bottom separator)
// radius:   radius/full → 9999px (icon container)
// spacing:  inset/md (16px) horizontal · 12px vertical
// typography: type/body (16px) label · type/body-sm (14px) currentValue

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ListItemSettingsValueProps {
  /** Icon bên trái */
  icon?: React.ReactNode
  /** Màu nền icon container */
  iconBg?: string
  /** Label hiển thị */
  label: string
  /** Giá trị hiện tại hiển thị bên phải */
  currentValue: string
  /** Callback khi nhấn */
  onClick?: () => void
  /** Disable item */
  disabled?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ListItemSettingsValue: React.FC<ListItemSettingsValueProps> = (_props) => {
  return <button type="button" data-testid="axq-69" />
}

ListItemSettingsValue.displayName = "ListItemSettingsValue"
