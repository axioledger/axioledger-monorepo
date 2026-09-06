/**
 * AddressBookRow — AXQ Design System
 * Inventory: #39 · Group 3 Data Display & Visual Cards · Phase 3 🔵
 *
 * Address book row item — Crypto address + Tag + Network badge.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary   → #101426 (alias / label name)
//           badge/info-bg  → #F2F8FF (network badge background)
//           badge/info-text → #0057C2 (network badge text)
//           text/tertiary  → #8F9BB3 (truncated address)
// radius:   radius/full (9999px) on network badge
// spacing:  inset/md (16px) horizontal · 12px vertical

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AddressBookRowProps {
  /** Tên alias / label */
  alias: string
  /** Địa chỉ ví (sẽ bị truncate) */
  address: string
  /** Mạng blockchain, e.g. "ERC-20" | "TRC-20" */
  network?: string
  /** Avatar / icon (ReactNode hoặc URL) */
  avatar?: string
  /** Callback khi nhấn row */
  onClick?: () => void
  /** Callback khi nhấn nút copy address */
  onCopy?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AddressBookRow: React.FC<AddressBookRowProps> = (_props) => {
  return <button type="button" data-testid="axq-39" />
}

AddressBookRow.displayName = "AddressBookRow"
