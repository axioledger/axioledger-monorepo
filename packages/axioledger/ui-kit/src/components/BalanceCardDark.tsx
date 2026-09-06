/**
 * BalanceCardDark — AXQ Design System
 * Inventory: #25 · Group 3 Data Display & Visual Cards · Phase 3 🔵
 *
 * VIP/Crypto dark variant balance card with gradient/dark background.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    greyscale/800  → #151A30 (card background)
//           text/inverse   → #FFFFFF (balance + label text)
//           brand/teal     → #49DBC8 (accent highlight)
//           text/h2        → 60px (balance amount)
// radius:   radius/card (16px)
// spacing:  inset/lg (24px) padding

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BalanceCardDarkProps {
  /** Tổng số dư (formatted string, e.g. "$12,340.00") */
  balance: string
  /** Ẩn số dư. Mặc định: false */
  isHidden?: boolean
  /** Callback toggle ẩn/hiện số dư */
  onToggleVisibility?: () => void
  /** Subtitle label, e.g. "Crypto Portfolio" */
  label?: string
  /** Thay đổi 24h (formatted, e.g. "+3.9%") */
  change24h?: string
  /** Dương (true) hay âm (false) để tô màu */
  isPositive?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BalanceCardDark: React.FC<BalanceCardDarkProps> = (_props) => {
  return <div data-testid="axq-25" />
}

BalanceCardDark.displayName = "BalanceCardDark"
