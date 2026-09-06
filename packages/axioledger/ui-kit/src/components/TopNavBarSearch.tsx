/**
 * TopNavBarSearch — AXQ Design System
 * Inventory: #3 · Group 1 Navigation & Bars · Phase 3 🔵
 *
 * Top Navigation Bar with inline search field.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    input/border    → #C5CEE0 (search box border)
//           input/bg        → #F7F9FC (search box background)
//           text/tertiary   → #8F9BB3 (placeholder text)
//           bg/secondary    → #EDF1F7 (bar background)
//           icon/tertiary   → #8F9BB3 (search icon)
// spacing:  inset/md (16px) horizontal · height 56px
// radius:   radius/full (9999px) on search input

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TopNavBarSearchProps {
  /** Giá trị tìm kiếm hiện tại */
  value?: string
  /** Placeholder text. Mặc định: "Search…" */
  placeholder?: string
  /** Callback khi text thay đổi */
  onChangeText?: (text: string) => void
  /** Callback khi nhấn nút clear */
  onClear?: () => void
  /** Callback khi nhấn nút Back */
  onBack?: () => void
  /** Hiển thị nút Back. Mặc định: true */
  showBack?: boolean
  /** Tự động focus khi mount. Mặc định: false */
  autoFocus?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TopNavBarSearch: React.FC<TopNavBarSearchProps> = (_props) => {
  return <div data-testid="axq-3" />
}

TopNavBarSearch.displayName = "TopNavBarSearch"
