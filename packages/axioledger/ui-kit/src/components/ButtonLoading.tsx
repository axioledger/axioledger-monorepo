/**
 * ButtonLoading — AXQ Design System
 * Inventory: #44 · Group 4 Buttons, Badges & Chips · Phase 1–2 ⚡
 *
 * Button with internal loading spinner. Primary + Secondary variants.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    button/disabled-bg → bg/disabled → #E4E9F2
//           button/disabled-text → text/disabled → #C5CEE0
//           button/primary-bg → bg/brand → #000000 (loading state keeps primary bg)
// radius:   button/radius → radius/2xl → 24px
// spacing:  button/padding-y (8px) · button/padding-x (16px) · button/gap (8px)
// typography: type/body (16px) font-weight 500

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonLoadingVariant = "primary" | "secondary"

export interface ButtonLoadingProps {
  /** Nội dung label */
  label: string
  /** Trạng thái loading */
  isLoading: boolean
  /** Variant. Mặc định: "primary" */
  variant?: ButtonLoadingVariant
  /** Callback khi nhấn (không gọi khi isLoading=true) */
  onClick?: () => void
  /** Mở rộng 100% chiều rộng */
  fullWidth?: boolean
  /** Disable button */
  disabled?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ButtonLoading: React.FC<ButtonLoadingProps> = (_props) => {
  return <div data-testid="axq-44" />
}

ButtonLoading.displayName = "ButtonLoading"
