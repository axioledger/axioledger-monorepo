/**
 * ChatBubbleUser — AXQ Design System
 * Inventory: #141 · Group 14 Messaging, Support & FAQ · Phase 3 🔵
 *
 * Chat bubble — User sent message (right-aligned).
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg/brand      → #000000 (bubble background)
//           text/inverse  → #FFFFFF (message text)
// radius:   radius/2xl (24px) all corners · bottom-right = 4px (tail)
// spacing:  inset/md (16px) horizontal · 10px vertical · max-width 75% screen

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatBubbleUserProps {
  /** Nội dung tin nhắn */
  message: string
  /** Thời gian gửi (formatted, e.g. "14:32") */
  time?: string
  /** Trạng thái gửi */
  status?: "sending" | "sent" | "delivered" | "read"
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ChatBubbleUser: React.FC<ChatBubbleUserProps> = (_props) => {
  return <div data-testid="axq-141" />
}

ChatBubbleUser.displayName = "ChatBubbleUser"
