/**
 * CashbackHistoryRow — AXQ Design System
 * Inventory: #179 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Cashback history category row item.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/green  → #BEFF6C (cashback amount badge)
//           text/primary → #101426 (merchant / category name)
//           text/tertiary → #8F9BB3 (date + transaction info)
//           border/subtle → #EDF1F7 (row bottom border)
// spacing:  inset/md (16px) horizontal · 12px vertical

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CashbackHistoryRowProps {
  /** Tên danh mục / thương nhân */
  categoryName: string
  /** Icon danh mục (ReactNode hoặc URL) */
  categoryIcon?: string
  /** Số tiền cashback (formatted, e.g. "+$1.25") */
  cashbackAmount?: string
  /** Ngày nhận cashback (formatted) */
  date?: string
  /** Tên giao dịch gốc */
  transactionName?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CashbackHistoryRow: React.FC<CashbackHistoryRowProps> = (_props) => {
  return <div data-testid="axq-179" />
}

CashbackHistoryRow.displayName = "CashbackHistoryRow"
