/**
 * TransactionFeeBreakdown — AXQ Design System
 * Inventory: #164 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Transaction fee breakdown table — network fee, service fee, total.
 * Re-tagged from Phase 1–2 to Phase 3 (fee display tied to Transfer/Swap flows).
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/secondary → #8F9BB3 (label text)
//           text/primary   → #101426 (value text)
//           border/subtle  → #EDF1F7 (row dividers)
//           text/h6        → 20px (total row)
// spacing:  inset/md (16px) horizontal · 12px vertical per row

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FeeRow {
  /** Label */
  label: string
  /** Formatted amount, e.g. "$0.42" */
  amount: string
  /** Hiển thị in đậm (total row) */
  isBold?: boolean
}

export interface TransactionFeeBreakdownProps {
  /** Các dòng phí */
  rows?: FeeRow[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TransactionFeeBreakdown: React.FC<TransactionFeeBreakdownProps> = (_props) => {
  return <div data-testid="axq-164" />
}

TransactionFeeBreakdown.displayName = "TransactionFeeBreakdown"
