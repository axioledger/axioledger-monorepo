/**
 * CardCVVReveal — AXQ Design System
 * Inventory: #135 · Group 13 Card Management · Phase 1–2 ⚡
 *
 * CVV reveal overlay requiring biometric authentication.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/default → #FFFFFF (overlay bg at 80% opacity, blur)
//           text/tertiary → #8F9BB3 ("Tap to reveal" hint text)
//           icon/secondary → #2E3A59 (lock.svg icon)
//           text/primary → #101426 (revealed CVV digits)
// radius:   radius/card → radius/xl → 16px (overlay)
// spacing:  centered within card area
// typography: type/h5 (24px) font-weight 700 (CVV digits)
//             type/caption (12px) (hint text)
// icons:    lock.svg bold, 24px (locked) · eye.svg linear, 20px (revealed)
// animation: fade in 0.3s (reveal) · auto-hide after 5s

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CardCVVRevealProps {
  /** CVV value (shown only when isRevealed=true) */
  cvv: string
  /** Trạng thái đang hiển thị CVV */
  isRevealed: boolean
  /** Callback khi nhấn để reveal (trigger biometric) */
  onRequestReveal: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CardCVVReveal: React.FC<CardCVVRevealProps> = (_props) => {
  return <button type="button" data-testid="axq-135" />
}

CardCVVReveal.displayName = "CardCVVReveal"
