/**
 * AddressBookTagSelector — AXQ Design System
 * Inventory: #197 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Tag selector chips for address book entries — "Exchange" / "Cold wallet" / "Friend" / custom.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    chip/bg        → #EDF1F7 (inactive chip)
//           chip/bg-active → #000000 (active chip)
//           text/inverse   → #FFFFFF (active chip label)
//           chip/text      → #101426 (inactive chip label)
// radius:   radius/full (9999px)
// spacing:  height 32px · inset/sm (8px) horizontal · gap/sm (8px) between chips

// ─── Types ────────────────────────────────────────────────────────────────────

export type AddressBookTag = "exchange" | "coldWallet" | "friend" | "defi" | "custom"

export interface AddressBookTagSelectorProps {
  /** Tags đang được chọn */
  selectedTags?: AddressBookTag[]
  /** Callback khi toggle tag */
  onToggleTag?: (tag: AddressBookTag) => void
  /** Cho phép chọn nhiều tags. Mặc định: true */
  multiSelect?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AddressBookTagSelector: React.FC<AddressBookTagSelectorProps> = (_props) => {
  return <div data-testid="axq-197" />
}

AddressBookTagSelector.displayName = "AddressBookTagSelector"
