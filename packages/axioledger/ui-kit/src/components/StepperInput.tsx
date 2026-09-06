/**
 * StepperInput — AXQ Design System
 * Inventory: #21 · Group 2 Inputs, Selectors & Controls · Phase 3 🔵
 *
 * Numeric stepper with +/− buttons and value display.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    button/ghost-border → #C5CEE0 (+/- button border)
//           text/primary        → #101426 (value text)
//           bg/secondary        → #EDF1F7 (button background)
//           text/disabled       → #C5CEE0 (disabled state)
// radius:   radius/md (8px) on buttons
// spacing:  height 40px · gap/sm (8px) between elements

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StepperInputProps {
  /** Giá trị hiện tại */
  value?: number
  /** Giá trị tối thiểu */
  min?: number
  /** Giá trị tối đa */
  max?: number
  /** Bước nhảy. Mặc định: 1 */
  step?: number
  /** Callback khi giá trị thay đổi */
  onValueChange?: (value: number) => void
  /** Vô hiệu hóa stepper */
  disabled?: boolean
  /** Label hiển thị phía trên */
  label?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const StepperInput: React.FC<StepperInputProps> = (_props) => {
  return <div data-testid="axq-21" />
}

StepperInput.displayName = "StepperInput"
