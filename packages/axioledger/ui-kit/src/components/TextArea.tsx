/**
 * TextArea — AXQ Design System
 * Inventory: #14 · Group 2 Inputs, Selectors & Controls · Phase 3 🔵
 *
 * Multiline text input with character count.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    input/border        → #C5CEE0 (default border)
//           input/border-focus  → #0095FF (focus border)
//           input/bg            → #F7F9FC (background)
//           text/primary        → #101426 (input text)
//           text/tertiary       → #8F9BB3 (placeholder + char count)
// radius:   radius/input (12px)
// spacing:  inset/md (16px) padding

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TextAreaProps {
  /** Giá trị hiện tại */
  value?: string
  /** Placeholder text */
  placeholder?: string
  /** Callback khi text thay đổi */
  onChangeText?: (text: string) => void
  /** Số ký tự tối đa (hiển thị character count) */
  maxLength?: number
  /** Số dòng tối thiểu. Mặc định: 4 */
  minRows?: number
  /** Trạng thái lỗi */
  error?: boolean
  /** Thông báo lỗi */
  errorMessage?: string
  /** Vô hiệu hóa input */
  disabled?: boolean
  /** Label hiển thị trên input */
  label?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TextArea: React.FC<TextAreaProps> = (_props) => {
  return <div data-testid="axq-14" />
}

TextArea.displayName = "TextArea"
