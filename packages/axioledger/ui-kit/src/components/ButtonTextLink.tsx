/**
 * ButtonTextLink — AXQ Design System
 * Inventory: #46 · Group 4 Buttons, Badges & Chips · Phase 3 🔵
 *
 * Text-only / Link button — Regular and Destructive variants.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/link            → #3B82D4 (regular variant)
//           status/error-default → #FF3D71 (destructive variant)
//           text/disabled        → #C5CEE0 (disabled)
// radius:   — (no background, no border)
// spacing:  inline — no padding container (fits label width)

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonTextLinkVariant = "default" | "destructive"

export interface ButtonTextLinkProps {
  /** Label text */
  label: string
  /** Variant. Mặc định: "default" */
  variant?: ButtonTextLinkVariant
  /** Callback khi nhấn */
  onClick?: () => void
  /** Vô hiệu hóa */
  disabled?: boolean
  /** Cỡ chữ. Mặc định: 14 (body-sm) */
  fontSize?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ButtonTextLink: React.FC<ButtonTextLinkProps> = (_props) => {
  return <button type="button" data-testid="axq-46" />
}

ButtonTextLink.displayName = "ButtonTextLink"
