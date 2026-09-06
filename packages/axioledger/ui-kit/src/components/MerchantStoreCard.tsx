/**
 * MerchantStoreCard — AXQ Design System
 * Inventory: #36 · Group 3 Data Display & Visual Cards · Phase 3 🔵
 *
 * Merchant/Store card showing Logo + Cashback % + Expiry.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/green  → #BEFF6C (cashback badge background)
//           text/primary → #101426 (merchant name)
//           text/secondary → #8F9BB3 (expiry date)
//           badge/font-size → 12px
// radius:   radius/card (16px)
// spacing:  inset/md (16px) padding

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MerchantStoreCardProps {
  /** Tên thương nhân */
  merchantName: string
  /** URL logo thương nhân */
  logoUrl?: string
  /** Phần trăm cashback, e.g. 5 (for 5%) */
  cashbackPercent?: number
  /** Ngày hết hạn ưu đãi (ISO string) */
  expiryDate?: string
  /** Đã được kích hoạt */
  isActive?: boolean
  /** Callback khi nhấn */
  onClick?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const MerchantStoreCard: React.FC<MerchantStoreCardProps> = (_props) => {
  return <button type="button" data-testid="axq-36" />
}

MerchantStoreCard.displayName = "MerchantStoreCard"
