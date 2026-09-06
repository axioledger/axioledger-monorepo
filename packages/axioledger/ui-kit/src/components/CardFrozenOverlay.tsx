/**
 * CardFrozenOverlay — AXQ Design System
 * Inventory: #136 · Group 13 Card Management · Phase 1–2 ⚡
 *
 * Freeze state overlay on top of CardVisual.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    greyscale/300 → #C5CEE0 at 60% opacity (overlay tint)
//           text/disabled → #C5CEE0 (frozen label + icon)
//           text/link → #0057C2 (Unfreeze button)
// radius:   radius/card → radius/xl → 16px (matches CardVisual)
// spacing:  centered overlay fills entire card (340×200px)
// typography: type/h6 (20px) "Card Frozen" label
//             type/body-sm (14px) (Unfreeze button text)
// icons:    lock.svg bold, 40px (centered)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CardFrozenOverlayProps {
  /** Trạng thái đang bị khóa */
  isFrozen: boolean
  /** Callback khi nhấn Unfreeze */
  onUnfreeze?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CardFrozenOverlay: React.FC<CardFrozenOverlayProps> = (_props) => {
  return <div data-testid="axq-136" />
}

CardFrozenOverlay.displayName = "CardFrozenOverlay"
