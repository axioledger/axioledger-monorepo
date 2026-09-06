/**
 * FAQAccordionItem — AXQ Design System
 * Inventory: #76 · Group 6 Lists, Cells & Structure · Phase 3 🔵
 *
 * FAQ accordion row — Q + expand/collapse toggle.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary   → #101426 (question text)
//           text/secondary → #8F9BB3 (answer text)
//           border/subtle  → #EDF1F7 (bottom border)
//           icon/secondary → #8F9BB3 (+ / - icon)
// spacing:  inset/md (16px) padding · gap/sm (8px) between Q and A
// typography: body (16px) question · body-sm (14px) answer

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FAQAccordionItemProps {
  /** Câu hỏi */
  question: string
  /** Câu trả lời */
  answer: string
  /** Trạng thái mở/đóng. Mặc định: false */
  isExpanded?: boolean
  /** Callback khi toggle */
  onToggle?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FAQAccordionItem: React.FC<FAQAccordionItemProps> = (_props) => {
  return <button type="button" data-testid="axq-76" />
}

FAQAccordionItem.displayName = "FAQAccordionItem"
