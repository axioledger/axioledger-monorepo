/**
 * ReceiptActionBar — AXQ Design System
 * Inventory: #131 · Group 12 Transfer, Payments & Receipts · Phase 3 🔵
 *
 * Receipt action bar — Share PDF / Save Image / Repeat transaction.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/link      → #3B82D4 (icon-text buttons)
//           icon/secondary → #8F9BB3 (action icons)
//           border/subtle  → #EDF1F7 (top border)
// spacing:  gap/xl (32px) between actions · height 64px · inset/md (16px) horizontal

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReceiptActionBarProps {
  /** Callback Share PDF */
  onSharePDF?: () => void
  /** Callback Save Image */
  onSaveImage?: () => void
  /** Callback Repeat transaction */
  onRepeat?: () => void
  /** Ẩn nút Repeat (khi loại tx không hỗ trợ) */
  hideRepeat?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ReceiptActionBar: React.FC<ReceiptActionBarProps> = (_props) => {
  return <div data-testid="axq-131" />
}

ReceiptActionBar.displayName = "ReceiptActionBar"
