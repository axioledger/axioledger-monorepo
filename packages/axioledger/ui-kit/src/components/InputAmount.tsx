/**
 * InputAmount — AXQ Design System
 * Inventory: #12 · Group 2 Inputs, Selectors & Controls · Phase 1–2 ⚡
 *
 * Large center-aligned amount input with currency symbol and Max button.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary → #101426 (value)
//           text/tertiary → #8F9BB3 (currency prefix, placeholder)
//           text/link → #0057C2 ("Max" button)
//           status/error-default → #FF3D71 (inline "Exceeds" error text)
// radius:   — (transparent, no border)
// spacing:  full-width · text-align center
// typography: type/h2 (60px) font-weight 700 (value display)
//             type/h5 (24px) (currency prefix)
//             type/body-sm (14px) (Max button, error text)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputAmountProps {
  /** Giá trị hiện tại (chuỗi số) */
  value: string
  /** Callback khi giá trị thay đổi */
  onValueChange: (value: string) => void
  /** Ký hiệu tiền tệ. Mặc định: "$" */
  currencySymbol?: string
  /** Số dư tối đa cho phép */
  maxBalance?: number
  /** Callback khi giá trị vượt maxBalance */
  onExceedMax?: () => void
  /** Callback khi nhấn nút "Max" */
  onMax?: () => void
  /** Disable input */
  disabled?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const InputAmount: React.FC<InputAmountProps> = (_props) => {
  return <div data-testid="axq-12" />
}

InputAmount.displayName = "InputAmount"
