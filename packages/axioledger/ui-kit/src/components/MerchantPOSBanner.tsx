/**
 * MerchantPOSBanner — AXQ Design System
 * Inventory: #178 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Merchant POS payment confirmation banner.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/teal   → #49DBC8 (banner background)
//           text/inverse → #FFFFFF (label + amount)
// radius:   radius/card (16px)
// spacing:  inset/md (16px) padding

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MerchantPOSBannerProps {
  /** Tên thương nhân */
  merchantName?: string
  /** Logo URL thương nhân */
  merchantLogoUrl?: string
  /** Số tiền thanh toán (formatted) */
  amount?: string
  /** Thông tin thêm, e.g. thiết bị POS */
  deviceInfo?: string
  /** Callback khi confirm thanh toán */
  onConfirm?: () => void
  /** Callback khi từ chối */
  onDecline?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const MerchantPOSBanner: React.FC<MerchantPOSBannerProps> = (_props) => {
  return <div data-testid="axq-178" />
}

MerchantPOSBanner.displayName = "MerchantPOSBanner"
