/**
 * CryptoMiniPortfolioCard — AXQ Design System
 * Inventory: #29 · Group 3 Data Display & Visual Cards · Phase 3 🔵
 *
 * Compact portfolio card showing sparkline and total value.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/teal     → #49DBC8 (sparkline stroke)
//           text/h5        → 24px (total value)
//           card/bg        → #FFFFFF (card background)
//           text/secondary → #8F9BB3 (label text)
// radius:   radius/card (16px)
// spacing:  inset/md (16px) · height ~120px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CryptoMiniPortfolioCardProps {
  /** Tổng giá trị danh mục (formatted) */
  totalValue: string
  /** Thay đổi 24h (formatted, e.g. "+3.9%") */
  change24h?: string
  /** Dữ liệu sparkline (mảng giá trị số) */
  sparklineData?: number[]
  /** Đang tải dữ liệu */
  isLoading?: boolean
  /** Callback khi nhấn vào card */
  onClick?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CryptoMiniPortfolioCard: React.FC<CryptoMiniPortfolioCardProps> = (_props) => {
  return <div data-testid="axq-29" />
}

CryptoMiniPortfolioCard.displayName = "CryptoMiniPortfolioCard"
