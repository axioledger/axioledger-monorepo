/**
 * ContactAvatarCard — AXQ Design System
 * Inventory: #38 · Group 3 Data Display & Visual Cards · Phase 1–2 ⚡
 *
 * Quick transfer contact circle: Avatar + Name label.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    avatar/bg-default → bg/secondary → #EDF1F7 (fallback avatar bg)
//           avatar/text-default → text/secondary → #2E3A59 (initials)
//           text/secondary → #2E3A59 (name label below)
// radius:   avatar/radius → radius/full → 9999px
// spacing:  avatar/size-md → 40×40px · gap/xs (4px) between avatar and name
// typography: type/caption (12px) name label (centered)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContactAvatarCardProps {
  /** Tên liên hệ */
  name: string
  /** URL ảnh đại diện */
  avatarUrl?: string
  /** Chữ viết tắt thay thế ảnh */
  initials?: string
  /** Callback khi nhấn */
  onClick: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ContactAvatarCard: React.FC<ContactAvatarCardProps> = (_props) => {
  return <button type="button" data-testid="axq-38" />
}

ContactAvatarCard.displayName = "ContactAvatarCard"
