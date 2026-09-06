/**
 * BankAccountItem — AXQ Design System
 * Inventory: #32 · Group 3 Data Display & Visual Cards · Phase 3 🔵
 *
 * Linked bank account row/card item.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary   → #101426 (bank name + account number)
//           text/tertiary  → #8F9BB3 (account type label)
//           card/border    → #E4E9F2 (card border)
//           bg/primary     → #FFFFFF (card background)
// radius:   radius/card (16px)
// spacing:  inset/md (16px) padding

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BankAccountItemProps {
  /** Tên ngân hàng */
  bankName: string
  /** Bốn chữ số cuối tài khoản */
  lastFour: string
  /** Loại tài khoản, e.g. "Checking" | "Savings" */
  accountType?: string
  /** URL logo ngân hàng */
  logoUrl?: string
  /** Đây là tài khoản mặc định */
  isDefault?: boolean
  /** Callback khi nhấn */
  onClick?: () => void
  /** Callback menu overflow (3 dots) */
  onMorePress?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BankAccountItem: React.FC<BankAccountItemProps> = (_props) => {
  return <button type="button" data-testid="axq-32" />
}

BankAccountItem.displayName = "BankAccountItem"
