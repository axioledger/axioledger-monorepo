/**
 * CryptoWatchlistStar — AXQ Design System
 * Inventory: #165 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Crypto watchlist toggle star button.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/yellow   → #FFF172 (filled / active star)
//           icon/tertiary  → #8F9BB3 (empty / inactive star)
// spacing:  touch target 40×40px · icon 20×20px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CryptoWatchlistStarProps {
  /** Đã thêm vào watchlist */
  isWatchlisted?: boolean
  /** Callback khi toggle */
  onToggle?: () => void
  /** Token symbol (for accessibility label) */
  tokenSymbol?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CryptoWatchlistStar: React.FC<CryptoWatchlistStarProps> = (_props) => {
  return <button type="button" data-testid="axq-165" />
}

CryptoWatchlistStar.displayName = "CryptoWatchlistStar"
