/**
 * InputSearchBar — AXQ Design System
 * Inventory: #13 · Group 2 Inputs, Selectors & Controls · Phase 1–2 ⚡
 *
 * Search bar with clear button.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    input/bg → surface/default → #FFFFFF
//           input/placeholder → text/tertiary → #8F9BB3
//           input/border → border/default → #E4E9F2
//           input/border-focus → border/focus → #0095FF
//           icon/tertiary → #8F9BB3 (search icon + clear icon)
//           text/primary → #101426 (typed text)
// radius:   input/radius → radius/lg → 12px
// spacing:  input/padding-x (16px) · input/padding-y (8px)
// typography: type/body (16px)
// icons:    search-normal.svg (left) · close-circle.svg (right, when value present)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputSearchBarProps {
  /** Giá trị hiện tại */
  value?: string
  /** Placeholder text. Mặc định: "Search..." */
  placeholder?: string
  /** Callback khi giá trị thay đổi */
  onValueChange?: (value: string) => void
  /** Callback khi clear */
  onClear?: () => void
  /** Callback khi submit / search */
  onSearch?: (value: string) => void
  /** Disable input */
  disabled?: boolean
  /** Tự động focus khi mount. Mặc định: false */
  autoFocus?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const InputSearchBar: React.FC<InputSearchBarProps> = (_props) => {
  return <div data-testid="axq-13" />
}

InputSearchBar.displayName = "InputSearchBar"
