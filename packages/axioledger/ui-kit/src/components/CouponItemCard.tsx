/**
 * CouponItemCard — AXQ Design System
 * Inventory: #181 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Coupon/offer card — Claimed and Unclaimed states.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/pink             → #FD9FDD (unclaimed card background)
//           status/success-default → #00D68F (claimed badge)
//           badge/success-bg       → #F0FFF5 (claimed badge bg)
//           text/primary           → #101426 (title / discount text)
//           text/secondary         → #8F9BB3 (merchant + expiry)
// radius:   radius/card (16px)
// spacing:  inset/md (16px) · notched divider style (dashed border at middle)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CouponItemCardProps {
  /** Tên ưu đãi */
  title: string
  /** Tên thương nhân */
  merchantName?: string
  /** Ngày hết hạn (formatted) */
  expiryDate?: string
  /** Mã giảm giá / nội dung ưu đãi */
  discountLabel?: string
  /** Đã sử dụng */
  isClaimed?: boolean
  /** Callback khi nhấn claim */
  onClaim?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CouponItemCard: React.FC<CouponItemCardProps> = (_props) => {
  return <button type="button" data-testid="axq-181" />
}

CouponItemCard.displayName = "CouponItemCard"
