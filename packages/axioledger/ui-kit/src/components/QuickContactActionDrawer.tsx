/**
 * QuickContactActionDrawer — AXQ Design System
 * Inventory: #172 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Swipe-to-reveal quick contact actions — Transfer / Request / Block.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/teal           → #49DBC8 (Transfer action bg)
//           status/info-default  → #0095FF (Request action bg)
//           status/error-default → #FF3D71 (Block action bg)
//           text/inverse         → #FFFFFF (action icons + labels)
// spacing:  action width 72px · full row height

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContactAction {
  /** Action type */
  type: "transfer" | "request" | "block"
  /** Callback khi nhấn */
  onClick?: () => void
}

export interface QuickContactActionDrawerProps {
  /** Danh sách actions khi swipe left */
  actions?: ContactAction[]
  /** Content (list item) bên trong drawer */
  children?: React.ReactNode
}

// ─── Component ────────────────────────────────────────────────────────────────

export const QuickContactActionDrawer: React.FC<QuickContactActionDrawerProps> = (_props) => {
  return <div data-testid="axq-172" />
}

QuickContactActionDrawer.displayName = "QuickContactActionDrawer"
