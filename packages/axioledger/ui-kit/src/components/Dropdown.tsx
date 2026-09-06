/**
 * Dropdown — AXQ Design System
 * Inventory: #16 · Group 2 Inputs, Selectors & Controls · Phase 1–2 ⚡
 *
 * Select / dropdown with closed, open, and selected states.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    input/border → border/default → #E4E9F2 (closed border)
//           input/bg → surface/default → #FFFFFF
//           input/text → text/primary → #101426 (selected value)
//           input/placeholder → text/tertiary → #8F9BB3 (placeholder)
//           icon/tertiary → #8F9BB3 (arrow-down.svg chevron)
//           surface/raised → #FFFFFF (dropdown panel bg)
//           border/default → #E4E9F2 (dropdown panel border)
//           bg/secondary → #EDF1F7 (option hover)
//           bg/brand → #000000 (option selected bg)
//           text/inverse → #FFFFFF (option selected text)
//           input/border-error → #FF3D71 (error state)
//           input/border-disabled → #E4E9F2 (disabled)
//           bg/disabled → #E4E9F2 (disabled background)
// radius:   input/radius → radius/lg → 12px (trigger)
//           radius/dropdown → radius/md → 8px (panel)
// spacing:  input/padding-x (16px) · input/padding-y (8px)
// typography: type/body (16px) · type/caption (12px) label

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DropdownOption {
  /** Giá trị nội bộ của option */
  value: string
  /** Label hiển thị cho người dùng */
  label: string
  /** Icon tuỳ chọn bên trái label */
  icon?: React.ReactNode
}

export interface DropdownProps {
  /** Danh sách options */
  options: DropdownOption[]
  /** Giá trị đang được chọn */
  value?: string
  /** Callback khi chọn option mới */
  onChange: (value: string) => void
  /** Placeholder khi chưa chọn */
  placeholder?: string
  /** Label hiển thị phía trên */
  label?: string
  /** Thông báo lỗi */
  errorMessage?: string
  /** Disable dropdown */
  disabled?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Dropdown: React.FC<DropdownProps> = (_props) => {
  return <div data-testid="axq-16" />
}

Dropdown.displayName = "Dropdown"
