/**
 * TopNavBarCryptoDetail — AXQ Design System
 * Inventory: #5 · Group 1 Navigation & Bars · Phase 3 🔵
 *
 * Top Navigation Bar for crypto detail screen — Ticker + Favorite star + Share.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary    → #101426 (ticker text)
//           text/h5         → 24px font-size (ticker)
//           icon/secondary  → #8F9BB3 (inactive favorite star)
//           brand/yellow    → #FFF172 (active favorite star)
//           surface/default → #FFFFFF (background)
// spacing:  inset/md (16px) horizontal · height 56px
// typography: type/h5 (24px) weight 600

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TopNavBarCryptoDetailProps {
  /** Ticker symbol, e.g. "BTC / USDT" */
  ticker: string
  /** Đã thêm vào watchlist */
  isFavorite?: boolean
  /** Callback toggle favorite */
  onToggleFavorite?: () => void
  /** Callback nút Share */
  onShare?: () => void
  /** Callback nút Back */
  onBack?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TopNavBarCryptoDetail: React.FC<TopNavBarCryptoDetailProps> = (_props) => {
  return <div data-testid="axq-5" />
}

TopNavBarCryptoDetail.displayName = "TopNavBarCryptoDetail"
