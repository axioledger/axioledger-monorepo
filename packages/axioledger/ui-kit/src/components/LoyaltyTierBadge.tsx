/**
 * LoyaltyTierBadge — AXQ Design System
 * Inventory: #31 · Group 3 Data Display & Visual Cards · Phase 3 🔵
 *
 * Tier badge/card — Silver / Gold / Platinum / Diamond.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/yellow   → #FFF172 (Gold tier accent)
//           brand/purple   → #AF96FB (Platinum tier accent)
//           brand/pink     → #FD9FDD (Diamond tier accent)
//           greyscale/300  → #C5CEE0 (Silver tier accent)
//           text/primary   → #101426 (tier label)
// radius:   radius/card (16px) on full card · radius/full for badge pill
// spacing:  inset/sm (8px) padding for badge · inset/md (16px) for card

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoyaltyTier = "silver" | "gold" | "platinum" | "diamond"

export interface LoyaltyTierBadgeProps {
  /** Cấp độ thành viên */
  tier: LoyaltyTier
  /** Hiển thị dưới dạng card đầy đủ (true) hay badge nhỏ (false). Mặc định: false */
  asCard?: boolean
  /** Tên người dùng (chỉ dùng cho asCard=true) */
  userName?: string
  /** Điểm tích lũy */
  points?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const LoyaltyTierBadge: React.FC<LoyaltyTierBadgeProps> = (_props) => {
  return <div data-testid="axq-31" />
}

LoyaltyTierBadge.displayName = "LoyaltyTierBadge"
