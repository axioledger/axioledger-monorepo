/**
 * VirtualCardSnapshot — AXQ Design System
 * Inventory: #26 · Group 3 Data Display & Visual Cards · Phase 3 🔵
 *
 * Small minicard shown in a list context.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/green    → #BEFF6C (card background, default)
//           text/primary   → #101426 (card number, name)
//           bg/secondary   → #EDF1F7 (inactive/empty card bg)
// radius:   radius/xl (16px)
// spacing:  width ~160px · height ~96px (minicard ratio)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VirtualCardSnapshotProps {
  /** Bốn chữ số cuối của thẻ */
  lastFour?: string
  /** Màu nền thẻ (hex). Mặc định: brand/green */
  backgroundColor?: string
  /** Nhãn thẻ, e.g. "Virtual Card" */
  label?: string
  /** Callback khi nhấn vào thẻ */
  onClick?: () => void
  /** Trạng thái frozen */
  isFrozen?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const VirtualCardSnapshot: React.FC<VirtualCardSnapshotProps> = (_props) => {
  return <button type="button" data-testid="axq-26" />
}

VirtualCardSnapshot.displayName = "VirtualCardSnapshot"
