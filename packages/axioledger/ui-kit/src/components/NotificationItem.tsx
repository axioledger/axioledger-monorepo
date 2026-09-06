/**
 * NotificationItem — AXQ Design System
 * Inventory: #74–75 · Group 6 Lists, Cells & Structure · Phase 1–2 ⚡
 *
 * Notification list item: unread (blue dot) and read (muted) states.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color (unread): status/info-default → #0095FF (8px dot)
//                 text/primary → #101426 (title)
//                 text/secondary → #2E3A59 (message)
//                 text/tertiary → #8F9BB3 (timestamp)
// color (read):   no dot
//                 text/secondary → #2E3A59 (title)
//                 text/tertiary → #8F9BB3 (message + timestamp)
// border/subtle → #EDF1F7 (bottom separator)
// spacing:  inset/md (16px) horizontal · 12px vertical · gap/md (12px)
// typography: type/body (16px) title · type/body-sm (14px) message
//             type/caption (12px) timestamp

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NotificationItemProps {
  /** Tiêu đề thông báo */
  title: string
  /** Nội dung thông báo */
  message: string
  /** Thời gian đã format */
  timestamp: string
  /** Đã đọc hay chưa */
  isRead: boolean
  /** Icon (brand logo, 40×40px circle) */
  icon?: React.ReactNode
  /** Callback khi nhấn */
  onClick?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NotificationItem: React.FC<NotificationItemProps> = (_props) => {
  return <button type="button" data-testid="axq-74" />
}

NotificationItem.displayName = "NotificationItem"
