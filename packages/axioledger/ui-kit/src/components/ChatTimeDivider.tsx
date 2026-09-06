/**
 * ChatTimeDivider — AXQ Design System
 * Inventory: #143 · Group 14 Messaging, Support & FAQ · Phase 3 🔵
 *
 * Chat time / date divider line.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/tertiary  → #8F9BB3 (time label)
//           border/subtle  → #EDF1F7 (flanking lines)
// typography: type/caption (12px) · centered
// spacing:  vertical 12px margin · horizontal inset/lg (24px)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatTimeDividerProps {
  /** Label hiển thị, e.g. "Today 14:30" | "Yesterday" | "Aug 12, 2025" */
  label: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ChatTimeDivider: React.FC<ChatTimeDividerProps> = (_props) => {
  return <div data-testid="axq-143" />
}

ChatTimeDivider.displayName = "ChatTimeDivider"
