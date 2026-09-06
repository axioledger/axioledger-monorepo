/**
 * InputPassword — AXQ Design System
 * Inventory: #11 · Group 2 Inputs, Selectors & Controls · Phase 1–2 ⚡
 *
 * Password input with show/hide toggle. Extends Input tokens.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    input/* (inherits from Input component)
//           icon/tertiary → #8F9BB3 (eye / eye-slash icon)
//           input/border-error → #FF3D71 (error state)
// radius:   input/radius → radius/lg → 12px
// spacing:  input/padding-x (16px) · input/padding-y (8px)
// typography: type/body (16px)
// icons:    eye.svg (show) · eye-slash.svg (hide) — bold style

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputPasswordProps {
  /** Giá trị password */
  value?: string
  /** Placeholder text */
  placeholder?: string
  /** Label hiển thị phía trên input */
  label?: string
  /** Thông báo lỗi — kích hoạt error state */
  errorMessage?: string
  /** Văn bản gợi ý bên dưới */
  helperText?: string
  /** Hiển thị mật khẩu. Mặc định: false */
  showPassword?: boolean
  /** Callback toggle show/hide */
  onToggleShow?: () => void
  /** Callback giá trị thay đổi */
  onValueChange?: (value: string) => void
  /** Disable input */
  disabled?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const InputPassword: React.FC<InputPasswordProps> = (_props) => {
  return <div data-testid="axq-11" />
}

InputPassword.displayName = "InputPassword"
