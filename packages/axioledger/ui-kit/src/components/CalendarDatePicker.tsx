/**
 * CalendarDatePicker — AXQ Design System
 * Inventory: #151 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Inline calendar date picker.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/default         → #FFFFFF (calendar background)
//           status/info-default     → #0095FF (selected date circle)
//           text/inverse            → #FFFFFF (selected date text)
//           text/primary            → #101426 (day number)
//           text/tertiary           → #8F9BB3 (day-of-week headers)
//           status/error-default    → #FF3D71 (today indicator dot)
// radius:   radius/full (9999px) on date selection circle
// spacing:  cell 40×40px · gap/sm (8px) between columns

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalendarDatePickerProps {
  /** Ngày đang được chọn (ISO string) */
  selectedDate?: string
  /** Ngày tối thiểu có thể chọn (ISO string) */
  minDate?: string
  /** Ngày tối đa có thể chọn (ISO string) */
  maxDate?: string
  /** Callback khi chọn ngày */
  onSelectDate?: (date: string) => void
  /** Chế độ chọn range (2 ngày). Mặc định: false */
  rangeMode?: boolean
  /** Ngày bắt đầu range (ISO string) */
  rangeStart?: string
  /** Ngày kết thúc range (ISO string) */
  rangeEnd?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = (_props) => {
  return <div data-testid="axq-151" />
}

CalendarDatePicker.displayName = "CalendarDatePicker"
