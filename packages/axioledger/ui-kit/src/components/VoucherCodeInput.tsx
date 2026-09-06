/**
 * VoucherCodeInput — AXQ Design System
 * Inventory: #180 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Voucher/promo code input field with apply button.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    input/border        → #C5CEE0 (input border)
//           input/bg            → #F7F9FC (input background)
//           icon/tertiary       → #8F9BB3 (ticket icon)
//           status/success-bg   → #F0FFF5 (applied success state)
//           status/success-default → #00D68F (applied checkmark)
// radius:   radius/input (12px)
// spacing:  inset/md (16px) · "Apply" button inline right side

// ─── Types ────────────────────────────────────────────────────────────────────

export type VoucherState = "idle" | "loading" | "valid" | "invalid"

export interface VoucherCodeInputProps {
  /** Giá trị code */
  value?: string
  /** Callback khi text thay đổi */
  onChangeText?: (text: string) => void
  /** Callback khi nhấn Apply */
  onApply?: (code: string) => void
  /** Trạng thái validation */
  voucherState?: VoucherState
  /** Thông báo lỗi (khi state=invalid) */
  errorMessage?: string
  /** Số tiền được giảm (khi state=valid, formatted) */
  discountAmount?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const VoucherCodeInput: React.FC<VoucherCodeInputProps> = (_props) => {
  return <div data-testid="axq-180" />
}

VoucherCodeInput.displayName = "VoucherCodeInput"
