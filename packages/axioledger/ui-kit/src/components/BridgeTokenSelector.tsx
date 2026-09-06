/**
 * BridgeTokenSelector — AXQ Design System
 * Inventory: #189 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Bridge token network selector — source and target network chips.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    chip/bg          → #EDF1F7 (network chip background)
//           chip/bg-active   → #000000 (selected chip background)
//           text/inverse     → #FFFFFF (selected chip text)
//           icon/secondary   → #8F9BB3 (→ arrow icon between chips)
// radius:   radius/full (9999px)
// spacing:  height 40px · gap/md (12px) between elements

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BridgeNetwork {
  /** Network ID, e.g. "ethereum" | "polygon" | "bnb" */
  id: string
  /** Network label */
  label: string
  /** Logo URL */
  logoUrl?: string
}

export interface BridgeTokenSelectorProps {
  /** Danh sách networks */
  networks?: BridgeNetwork[]
  /** Network nguồn đang chọn */
  sourceNetwork?: string
  /** Network đích đang chọn */
  destinationNetwork?: string
  /** Callback khi đổi source network */
  onSelectSource?: (networkId: string) => void
  /** Callback khi đổi destination network */
  onSelectDestination?: (networkId: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BridgeTokenSelector: React.FC<BridgeTokenSelectorProps> = (_props) => {
  return <div data-testid="axq-189" />
}

BridgeTokenSelector.displayName = "BridgeTokenSelector"
