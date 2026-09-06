/**
 * ReferralCodeShareBox — AXQ Design System
 * Inventory: #159 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Referral code display + copy + social share box.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/sunken → #F7F9FC (code box background)
//           text/primary   → #101426 (referral code text)
//           icon/secondary → #8F9BB3 (copy icon)
//           brand/teal     → #49DBC8 (CTA share button)
// radius:   radius/input (12px)
// spacing:  inset/md (16px) padding

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReferralCodeShareBoxProps {
  /** Mã giới thiệu */
  referralCode: string
  /** Callback khi nhấn Copy */
  onCopy?: () => void
  /** Callback khi nhấn Share (native share sheet) */
  onShare?: () => void
  /** Đã copy */
  isCopied?: boolean
  /** Số người đã sử dụng mã */
  usageCount?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ReferralCodeShareBox: React.FC<ReferralCodeShareBoxProps> = (_props) => {
  return <div data-testid="axq-159" />
}

ReferralCodeShareBox.displayName = "ReferralCodeShareBox"
