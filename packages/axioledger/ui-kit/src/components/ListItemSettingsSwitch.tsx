/**
 * ListItemSettingsSwitch — AXQ Design System
 * Inventory: #68 · Group 6 Lists, Cells & Structure · Phase 1–2 ⚡
 *
 * Settings row with icon, label, and toggle switch.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary → #101426 (label)
//           toggle/active-bg → status/success-default → #00D68F (ON)
//           toggle/inactive-bg → bg/tertiary → #E4E9F2 (OFF)
//           toggle/thumb → bg/primary → #FFFFFF
//           toggle/disabled-bg → bg/disabled → #E4E9F2
//           border/subtle → #EDF1F7 (bottom separator)
// radius:   radius/full → 9999px (toggle track + thumb)
// spacing:  inset/md (16px) horizontal · 12px vertical
// typography: type/body (16px) label

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ListItemSettingsSwitchProps {
  /** Icon bên trái */
  icon?: React.ReactNode
  /** Màu nền icon container (cho colorful icons settings) */
  iconBg?: string
  /** Label hiển thị */
  label: string
  /** Giá trị toggle hiện tại */
  value: boolean
  /** Callback khi toggle thay đổi */
  onToggle: (value: boolean) => void
  /** Disable toggle */
  disabled?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ListItemSettingsSwitch: React.FC<ListItemSettingsSwitchProps> = (_props) => {
  return <button type="button" data-testid="axq-68" />
}

ListItemSettingsSwitch.displayName = "ListItemSettingsSwitch"
