/**
 * DigitalReceiptRow — AXQ Design System
 * Inventory: #130 · Group 12 Transfer, Payments & Receipts · Phase 1–2 ⚡
 *
 * Transaction receipt detail row: label (left) + value (right).
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/secondary → #2E3A59 (label)
//           text/primary → #101426 (value)
//           border/subtle → #EDF1F7 (bottom separator)
// spacing:  inset/md (16px) horizontal · 12px vertical
// typography: type/body-sm (14px) label · type/body (16px) value

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DigitalReceiptRowProps {
  /** Label mô tả bên trái */
  label: string
  /** Giá trị bên phải */
  value: string
  /** Tô nổi value (cho Total row) */
  highlight?: boolean
  /** Ẩn separator dưới */
  isLast?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DigitalReceiptRow: React.FC<DigitalReceiptRowProps> = (_props) => {
  return <div data-testid="axq-130" />
}

DigitalReceiptRow.displayName = "DigitalReceiptRow"
