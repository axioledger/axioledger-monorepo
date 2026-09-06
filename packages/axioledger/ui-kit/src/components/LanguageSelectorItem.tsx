/**
 * LanguageSelectorItem — AXQ Design System
 * Inventory: #157 · Group 15 Miscellaneous & Specialized · Phase 1–2 ⚡
 *
 * Language selection row: Flag emoji + Language name + Radio dot.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary → #101426 (language name)
//           status/info-default → #0095FF (radio dot — selected)
//           border/default → #E4E9F2 (radio circle — unselected)
//           border/subtle → #EDF1F7 (row separator)
// radius:   radius/full → 9999px (radio dot, 20×20px)
// spacing:  inset/md (16px) horizontal · 14px vertical · gap/md (12px) between flag and name
// typography: type/body (16px) language name

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LanguageSelectorItemProps {
  /** Emoji lá cờ, ví dụ: "🇻🇳" */
  flagEmoji: string
  /** Tên ngôn ngữ, ví dụ: "Tiếng Việt" */
  languageName: string
  /** Mã ngôn ngữ, ví dụ: "vi" */
  languageCode: string
  /** Đang được chọn */
  isSelected: boolean
  /** Callback khi chọn */
  onSelect: (code: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const LanguageSelectorItem: React.FC<LanguageSelectorItemProps> = (_props) => {
  return <button type="button" data-testid="axq-157" />
}

LanguageSelectorItem.displayName = "LanguageSelectorItem"
