/**
 * PillTagActiveFilter — AXQ Design System
 * Inventory: #171 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Active filter count pill — "Filters (3)".
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg/brand     → #000000 (pill background when active)
//           text/inverse → #FFFFFF (pill label)
//           bg/secondary → #EDF1F7 (pill background when count = 0)
//           text/primary → #101426 (pill label when count = 0)
// radius:   radius/full (9999px)
// spacing:  inset/sm (8px) horizontal · height 32px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PillTagActiveFilterProps {
  /** Số filter đang hoạt động */
  activeCount?: number
  /** Label text. Mặc định: "Filters" */
  label?: string
  /** Callback khi nhấn để mở filter sheet */
  onClick?: () => void
  /** Callback khi nhấn × để reset all */
  onReset?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PillTagActiveFilter: React.FC<PillTagActiveFilterProps> = (_props) => {
  return <button type="button" data-testid="axq-171" />
}

PillTagActiveFilter.displayName = "PillTagActiveFilter"
