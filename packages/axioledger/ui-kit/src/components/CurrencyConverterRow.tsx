/**
 * CurrencyConverterRow — AXQ Design System
 * Inventory: #166 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Inline FIAT ↔ Crypto converter row.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary   → #101426 (amount values)
//           text/secondary → #8F9BB3 (currency labels)
//           icon/secondary → #8F9BB3 (↔ convert arrow icon)
// spacing:  height 48px · gap/md (12px) between columns

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CurrencyConverterRowProps {
  /** Số tiền fiat (formatted, e.g. "$100.00") */
  fiatAmount?: string
  /** Ký hiệu tiền fiat, e.g. "USD" */
  fiatCurrency?: string
  /** Số tiền crypto tương đương */
  cryptoAmount?: string
  /** Ký hiệu crypto, e.g. "BTC" */
  cryptoSymbol?: string
  /** Tỷ giá hiển thị, e.g. "1 BTC = $43,200" */
  rateLabel?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CurrencyConverterRow: React.FC<CurrencyConverterRowProps> = (_props) => {
  return <div data-testid="axq-166" />
}

CurrencyConverterRow.displayName = "CurrencyConverterRow"
