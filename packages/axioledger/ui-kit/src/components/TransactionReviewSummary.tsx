/**
 * TransactionReviewSummary — AXQ Design System
 * Inventory: #128 · Group 12 Transfer, Payments & Receipts · Phase 3 🔵
 *
 * Transaction review summary table — all details pre-confirm.
 * Re-tagged from Phase 1–2 to Phase 3 (Transfer flow = Roadmap Phase 3).
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    card/bg        → #FFFFFF (container background)
//           text/secondary → #8F9BB3 (row label)
//           text/primary   → #101426 (row value)
//           border/subtle  → #EDF1F7 (row dividers)
// radius:   radius/card (16px)
// spacing:  inset/md (16px) padding · 12px vertical per row

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewRow {
  /** Label bên trái */
  label: string
  /** Giá trị bên phải */
  value: string
  /** Highlight value (e.g. amount in bold) */
  isHighlight?: boolean
}

export interface TransactionReviewSummaryProps {
  /** Danh sách rows */
  rows?: ReviewRow[]
  /** Tiêu đề section */
  title?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TransactionReviewSummary: React.FC<TransactionReviewSummaryProps> = (_props) => {
  return <div data-testid="axq-128" />
}

TransactionReviewSummary.displayName = "TransactionReviewSummary"
