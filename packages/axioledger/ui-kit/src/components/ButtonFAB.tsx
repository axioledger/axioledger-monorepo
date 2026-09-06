/**
 * ButtonFAB — AXQ Design System
 * Inventory: #43 · Group 4 Buttons, Badges & Chips · Phase 3 🔵
 *
 * Floating Action Button — 56px circle.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg/brand     → #000000 (FAB background)
//           icon/inverse → #FFFFFF (icon color)
// radius:   radius/full (9999px) — circular button
// spacing:  size 56×56px · icon 24×24px centered
// shadow:   elevation 4 (Android) / shadowOffset {0,4} (iOS)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ButtonFABProps {
  /** Icon bên trong FAB (ReactNode) */
  icon?: React.ReactNode
  /** Callback khi nhấn */
  onClick?: () => void
  /** Vô hiệu hóa button */
  disabled?: boolean
  /** Kích thước (mini = 40px, standard = 56px). Mặc định: "standard" */
  size?: "mini" | "standard"
  /** Accessibility label */
  accessibilityLabel?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ButtonFAB: React.FC<ButtonFABProps> = (_props) => {
  return <button type="button" data-testid="axq-43" />
}

ButtonFAB.displayName = "ButtonFAB"
