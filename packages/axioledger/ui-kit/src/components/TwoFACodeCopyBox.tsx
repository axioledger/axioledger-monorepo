/**
 * TwoFACodeCopyBox — AXQ Design System
 * Inventory: #107 · Group 9 Onboarding, Auth & Security · Phase 3 🔵
 *
 * Emergency 2FA backup code display box with copy action.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/sunken → #F7F9FC (box background)
//           text/primary   → #101426 monospace (code text)
//           icon/secondary → #8F9BB3 (copy icon)
//           status/success-default → #00D68F (copy confirmation flash)
// radius:   radius/input (12px)
// spacing:  inset/md (16px) padding · letter-spacing wide for monospace codes

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TwoFACodeCopyBoxProps {
  /** Mã backup (mảng string, mỗi phần tử là 1 code) */
  codes?: string[]
  /** Callback khi nhấn Copy All */
  onCopyAll?: () => void
  /** Đã copy (để flash confirm) */
  isCopied?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TwoFACodeCopyBox: React.FC<TwoFACodeCopyBoxProps> = (_props) => {
  return <div data-testid="axq-107" />
}

TwoFACodeCopyBox.displayName = "TwoFACodeCopyBox"
