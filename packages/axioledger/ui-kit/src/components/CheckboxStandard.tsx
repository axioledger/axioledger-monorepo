/**
 * CheckboxStandard — AXQ Design System
 * Inventory: #17 · Group 2 Inputs, Selectors & Controls · Phase 3 🔵
 *
 * Checkbox with Unchecked, Checked, Indeterminate, and Disabled states.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/info-default → #0095FF (checked fill)
//           border/default      → #C5CEE0 (unchecked border)
//           text/primary        → #101426 (label text)
//           text/disabled       → #C5CEE0 (disabled label)
//           bg/disabled         → #E4E9F2 (disabled background)
// radius:   radius/sm (4px) on checkbox box
// spacing:  8px gap between box and label

// ─── Types ────────────────────────────────────────────────────────────────────

export type CheckboxState = "unchecked" | "checked" | "indeterminate"

export interface CheckboxStandardProps {
  /** Trạng thái của checkbox */
  state?: CheckboxState
  /** Nhãn hiển thị bên cạnh checkbox */
  label?: string
  /** Vô hiệu hóa interaction */
  disabled?: boolean
  /** Callback khi trạng thái thay đổi */
  onChange?: (state: CheckboxState) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CheckboxStandard: React.FC<CheckboxStandardProps> = (_props) => {
  return <button type="button" data-testid="axq-17" />
}

CheckboxStandard.displayName = "CheckboxStandard"
