/**
 * ChatQuickReplyChips — AXQ Design System
 * Inventory: #144 · Group 14 Messaging, Support & FAQ · Phase 3 🔵
 *
 * Chat quick reply suggestion chips.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    chip/bg        → #EDF1F7 (chip background)
//           chip/text      → #101426 (chip label)
//           border/default → #C5CEE0 (chip border — outlined style)
// radius:   radius/full (9999px)
// spacing:  inset/sm (8px) horizontal · height 36px · gap/sm (8px) between chips

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuickReply {
  /** Unique key */
  key: string
  /** Nội dung gợi ý */
  label: string
}

export interface ChatQuickReplyChipsProps {
  /** Danh sách quick replies */
  replies?: QuickReply[]
  /** Callback khi chọn reply */
  onSelect?: (reply: QuickReply) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ChatQuickReplyChips: React.FC<ChatQuickReplyChipsProps> = (_props) => {
  return <div data-testid="axq-144" />
}

ChatQuickReplyChips.displayName = "ChatQuickReplyChips"
