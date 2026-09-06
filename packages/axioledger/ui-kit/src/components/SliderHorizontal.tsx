/**
 * SliderHorizontal — AXQ Design System
 * Inventory: #19 · Group 2 Inputs, Selectors & Controls · Phase 3 🔵
 *
 * Single-thumb horizontal slider.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg/brand     → #000000 (filled track + active thumb)
//           bg/tertiary  → #EDF1F7 (empty track)
//           text/primary → #101426 (value label)
// radius:   radius/full (9999px) on track and thumb
// spacing:  height 4px track · thumb 20px circle

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SliderHorizontalProps {
  /** Giá trị tối thiểu. Mặc định: 0 */
  min?: number
  /** Giá trị tối đa. Mặc định: 100 */
  max?: number
  /** Giá trị hiện tại */
  value?: number
  /** Bước nhảy. Mặc định: 1 */
  step?: number
  /** Callback khi giá trị thay đổi */
  onValueChange?: (value: number) => void
  /** Hiển thị giá trị hiện tại. Mặc định: false */
  showValue?: boolean
  /** Vô hiệu hóa slider */
  disabled?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SliderHorizontal: React.FC<SliderHorizontalProps> = (_props) => {
  return <div data-testid="axq-19" />
}

SliderHorizontal.displayName = "SliderHorizontal"
