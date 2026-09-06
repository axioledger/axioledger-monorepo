/**
 * ContractAddressCopy — AXQ Design System
 * Inventory: #123 · Group 11 Crypto & Web3 Specific · Phase 3 🔵
 *
 * Smart contract address display + copy + explorer link widget.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/sunken → #F7F9FC (container background)
//           text/tertiary  → #8F9BB3 monospace (truncated address)
//           icon/secondary → #8F9BB3 (copy icon)
//           status/info-default → #0095FF (explorer link)
// radius:   radius/input (12px)
// spacing:  inset/md (16px) horizontal · 12px vertical

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContractAddressCopyProps {
  /** Địa chỉ contract đầy đủ */
  address: string
  /** Nhãn, e.g. "Contract Address" */
  label?: string
  /** Callback khi nhấn Copy */
  onCopy?: () => void
  /** Callback khi nhấn Open in Explorer */
  onOpenExplorer?: () => void
  /** Đã copy (để flash confirm) */
  isCopied?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ContractAddressCopy: React.FC<ContractAddressCopyProps> = (_props) => {
  return <div data-testid="axq-123" />
}

ContractAddressCopy.displayName = "ContractAddressCopy"
