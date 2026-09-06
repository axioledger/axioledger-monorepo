/**
 * QuickTransferContacts — AXQ Design System
 * Inventory: #127 · Group 12 Transfer, Payments & Receipts · Phase 1–2 ⚡
 *
 * Horizontal scrollable list of recent transfer contacts.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    avatar/bg-default → bg/secondary → #EDF1F7 (fallback avatar bg)
//           avatar/text-default → text/secondary → #2E3A59 (initials)
//           text/secondary → #2E3A59 (name label below avatar)
// radius:   avatar/radius → radius/full → 9999px
// spacing:  avatar/size-md → 40×40px · type/caption (12px) name
//           gap/lg (16px) horizontal between contacts
// typography: type/caption (12px) name labels (centered below avatar)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuickContact {
  /** ID duy nhất */
  id: string
  /** Tên hiển thị */
  name: string
  /** URL ảnh đại diện */
  avatarUrl?: string
  /** Chữ viết tắt thay thế avatar */
  initials?: string
}

export interface QuickTransferContactsProps {
  /** Danh sách contacts gần đây */
  contacts: QuickContact[]
  /** Callback khi chọn một contact */
  onSelect: (contact: QuickContact) => void
  /** Số contacts tối đa hiển thị trước khi scroll. Mặc định: 6 */
  maxVisible?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const QuickTransferContacts: React.FC<QuickTransferContactsProps> = (_props) => {
  return <div data-testid="axq-127" />
}

QuickTransferContacts.displayName = "QuickTransferContacts"
