/**
 * TokenSearchHistoryChip — AXQ Design System
 * Inventory: #163 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Recent search history chip — dismissible.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    chip/bg    → #EDF1F7 (chip background)
//           chip/text  → #101426 (chip label)
//           icon/tertiary → #8F9BB3 (× dismiss icon)
// radius:   radius/full (9999px)
// spacing:  inset/sm (8px) horizontal · height 32px · gap 4px between label and ×

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TokenSearchHistoryChipProps {
  /** Token symbol / search term */
  label: string
  /** Callback khi nhấn chip (navigate/search) */
  onClick?: () => void
  /** Callback khi nhấn × dismiss */
  onDismiss?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TokenSearchHistoryChip: React.FC<TokenSearchHistoryChipProps> = (_props) => {
  return <button type="button" data-testid="axq-163" />
}

TokenSearchHistoryChip.displayName = "TokenSearchHistoryChip"
