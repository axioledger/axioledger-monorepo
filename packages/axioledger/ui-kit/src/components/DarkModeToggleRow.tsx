/**
 * DarkModeToggleRow — AXQ Design System
 * Inventory: #158 · Group 15 Miscellaneous & Specialized · Phase 1–2 ⚡
 *
 * 3-option appearance selector: System ✦ | ☀ Light | ☾ Dark.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    chip/bg → bg/secondary → #EDF1F7 (inactive segments)
//           chip/bg-active → bg/brand → #000000 (active segment)
//           chip/text → text/primary → #101426 (inactive label)
//           chip/text-active → text/inverse → #FFFFFF (active label)
// radius:   chip/radius → radius/full → 9999px (each segment + container)
// spacing:  full-width container · each segment flex:1 · padding 8px 12px
// typography: chip/font-size → type/body-sm (14px)

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppearanceMode = "system" | "light" | "dark"

export interface DarkModeToggleRowProps {
  /** Chế độ đang chọn. Mặc định: "system" */
  mode: AppearanceMode
  /** Callback khi đổi chế độ */
  onModeChange: (mode: AppearanceMode) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DarkModeToggleRow: React.FC<DarkModeToggleRowProps> = (_props) => {
  return <div data-testid="axq-158" />
}

DarkModeToggleRow.displayName = "DarkModeToggleRow"
