/**
 * ButtonSocialLogin — AXQ Design System
 * Inventory: #45 · Group 4 Buttons, Badges & Chips · Phase 3 🔵
 *
 * Social login buttons — Apple / Google / Facebook / Passkey.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/default → #FFFFFF (button background)
//           border/default  → #C5CEE0 (button border)
//           text/primary    → #101426 (button label)
//           — Provider brand colors used only inside provider logo, not for button bg
// radius:   radius/button (24px)
// spacing:  height 56px · inset/md (16px) horizontal

// ─── Types ────────────────────────────────────────────────────────────────────

export type SocialProvider = "apple" | "google" | "facebook" | "passkey"

export interface ButtonSocialLoginProps {
  /** Nhà cung cấp xác thực */
  provider: SocialProvider
  /** Callback khi nhấn */
  onClick?: () => void
  /** Vô hiệu hóa button */
  disabled?: boolean
  /** Đang tải (loading spinner) */
  isLoading?: boolean
  /** Override label text (mặc định: "Continue with {Provider}") */
  label?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ButtonSocialLogin: React.FC<ButtonSocialLoginProps> = (_props) => {
  return <button type="button" data-testid="axq-45" />
}

ButtonSocialLogin.displayName = "ButtonSocialLogin"
