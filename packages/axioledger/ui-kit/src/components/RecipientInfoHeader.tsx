/**
 * RecipientInfoHeader — AXQ Design System
 * Inventory: #125 · Group 12 Transfer, Payments & Receipts · Phase 1–2 ⚡
 *
 * Transfer screen recipient header: Avatar + Name + Account/Wallet address.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    avatar/bg-default → bg/secondary → #EDF1F7 (fallback avatar bg)
//           avatar/text-default → text/secondary → #2E3A59 (initials)
//           text/primary → #101426 (name)
//           text/secondary → #2E3A59 (account / address)
// radius:   avatar/radius → radius/full → 9999px
// spacing:  avatar/size-lg → 56px · gap/md (12px) between avatar and text
//           inset/lg (24px) bottom padding
// typography: type/h5 (24px) font-weight 600 (name) · type/body-sm (14px) account

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RecipientInfoHeaderProps {
  /** Tên người nhận */
  name: string
  /** Số tài khoản hoặc địa chỉ ví */
  accountOrAddress: string
  /** URL ảnh đại diện */
  avatarUrl?: string
  /** Chữ viết tắt thay thế avatar */
  initials?: string
  /** Tên mạng (dùng cho crypto transfer) */
  network?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const RecipientInfoHeader: React.FC<RecipientInfoHeaderProps> = (_props) => {
  return <div data-testid="axq-125" />
}

RecipientInfoHeader.displayName = "RecipientInfoHeader"
