/**
 * RadioButtonGroup — AXQ Design System
 * Inventory: #18 · Group 2 Inputs, Selectors & Controls · Phase 3 🔵
 *
 * Radio button group with Unselected, Selected, and Disabled states.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/info-default → #0095FF (selected dot + outer ring)
//           border/default      → #C5CEE0 (unselected outer ring)
//           text/primary        → #101426 (option label)
//           text/disabled       → #C5CEE0 (disabled label)
// radius:   radius/full (9999px) — radio is circular
// spacing:  gap/md (12px) between options

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RadioOption {
  /** Giá trị duy nhất của option */
  value: string
  /** Nhãn hiển thị */
  label: string
  /** Vô hiệu hóa option cụ thể này */
  disabled?: boolean
}

export interface RadioButtonGroupProps {
  /** Danh sách options */
  options: RadioOption[]
  /** Giá trị đang được chọn */
  value?: string
  /** Callback khi lựa chọn thay đổi */
  onChange?: (value: string) => void
  /** Vô hiệu hóa toàn bộ group */
  disabled?: boolean
  /** Layout: vertical (mặc định) hoặc horizontal */
  direction?: "vertical" | "horizontal"
}

// ─── Component ────────────────────────────────────────────────────────────────

export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = (_props) => {
  return <div data-testid="axq-18" />
}

RadioButtonGroup.displayName = "RadioButtonGroup"
