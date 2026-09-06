/**
 * TransactionGroupDivider — AXQ Design System
 * Inventory: #73 · Group 6 Lists, Cells & Structure · Phase 3 🔵
 *
 * Date section divider — "Today" / "Yesterday" / "Aug 2026".
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/tertiary  → #8F9BB3 (date label)
//           border/subtle  → #EDF1F7 (horizontal rule lines flanking label)
// typography: type/caption (12px) · font-weight 500
// spacing:  vertical 8px · horizontal inset/md (16px)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TransactionGroupDividerProps {
  /** Nhãn ngày hiển thị, e.g. "Today" | "Yesterday" | "Aug 2026" */
  label: string
  /** Số giao dịch trong nhóm (tuỳ chọn) */
  count?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TransactionGroupDivider: React.FC<TransactionGroupDividerProps> = (_props) => {
  return <div data-testid="axq-73" />
}

TransactionGroupDivider.displayName = "TransactionGroupDivider"
