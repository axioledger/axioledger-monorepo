/**
 * ChatBubbleSupport — AXQ Design System
 * Inventory: #142 · Group 14 Messaging, Support & FAQ · Phase 3 🔵
 *
 * Chat bubble — Support / Bot received message (left-aligned).
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg/secondary  → #EDF1F7 (bubble background)
//           text/primary  → #101426 (message text)
// radius:   radius/2xl (24px) all corners · bottom-left = 4px (tail)
// spacing:  inset/md (16px) horizontal · 10px vertical · max-width 75% screen

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatBubbleSupportProps {
  /** Nội dung tin nhắn */
  message: string
  /** Thời gian nhận (formatted, e.g. "14:33") */
  time?: string
  /** Avatar URL của agent / bot */
  agentAvatarUrl?: string
  /** Tên agent */
  agentName?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ChatBubbleSupport: React.FC<ChatBubbleSupportProps> = (_props) => {
  return <div data-testid="axq-142" />
}

ChatBubbleSupport.displayName = "ChatBubbleSupport"
