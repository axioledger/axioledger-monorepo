/**
 * AvatarGroupStack — AXQ Design System
 * Inventory: #149 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Overlapping avatar group stack.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    border/default → #C5CEE0 (ring border between overlapping avatars)
//           bg/secondary   → #EDF1F7 (overflow count bubble background)
//           text/secondary → #8F9BB3 (overflow count text "+N")
// spacing:  overlap -8px · avatar size 32px (default)
// radius:   radius/full (9999px) per avatar

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AvatarInfo {
  /** Avatar URL */
  url?: string
  /** Fallback initials */
  initials?: string
}

export interface AvatarGroupStackProps {
  /** Danh sách avatars */
  avatars?: AvatarInfo[]
  /** Số lượng hiển thị tối đa trước khi collapse. Mặc định: 4 */
  maxVisible?: number
  /** Kích thước avatar (px). Mặc định: 32 */
  size?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AvatarGroupStack: React.FC<AvatarGroupStackProps> = (_props) => {
  return <div data-testid="axq-149" />
}

AvatarGroupStack.displayName = "AvatarGroupStack"
