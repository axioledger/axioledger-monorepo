/**
 * PaginationDots — AXQ Design System
 * Inventory: #102 · Group 9 Onboarding, Auth & Security · Phase 1–2 ⚡
 *
 * Onboarding step pagination dots indicator.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg/brand → #000000 (active dot)
//           bg/tertiary → #E4E9F2 (inactive dots)
// radius:   radius/full → 9999px (all dots)
// spacing:  gap/sm (8px) between dots
//           active: 24×8px pill; inactive: 6×6px circle
// animation: width transition 0.2s ease (active expands)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaginationDotsProps {
  /** Tổng số bước */
  total: number
  /** Bước hiện tại (0-based) */
  current: number
  /** Callback khi nhấn dot */
  onDotPress?: (index: number) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PaginationDots: React.FC<PaginationDotsProps> = (_props) => {
  return <div data-testid="axq-102" />
}

PaginationDots.displayName = "PaginationDots"
