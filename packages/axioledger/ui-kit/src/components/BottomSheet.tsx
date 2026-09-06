/**
 * BottomSheet — AXQ Design System
 * Inventory: #55 · Group 5 Modals, Drawers & Popups · Phase 1–2 ⚡
 *
 * Draggable bottom sheet with pull handle and overlay.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/default → #FFFFFF (sheet background)
//           modal/overlay → rgba(16,20,38,0.6) (backdrop)
//           border/strong → #8F9BB3 (drag handle)
//           text/primary → #101426 (title)
// radius:   radius/3xl → 32px (top-left + top-right corners only)
// spacing:  modal/padding (32px) · modal/gap (16px)
//           drag handle: 4px height · 36px width · centered
// typography: type/h5 (24px) font-weight 600 (title)

// ─── Types ────────────────────────────────────────────────────────────────────

export type BottomSheetSnapPoint = "auto" | "half" | "full"

export interface BottomSheetProps {
  /** Trạng thái hiển thị */
  isOpen: boolean
  /** Callback khi đóng sheet */
  onClose: () => void
  /** Tiêu đề (tuỳ chọn) */
  title?: string
  /** Nội dung bên trong sheet */
  children?: React.ReactNode
  /** Cho phép kéo để đóng. Mặc định: true */
  draggable?: boolean
  /** Chiều cao snap. Mặc định: "auto" */
  snapPoint?: BottomSheetSnapPoint
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BottomSheet: React.FC<BottomSheetProps> = (_props) => {
  return <div data-testid="axq-55" />
}

BottomSheet.displayName = "BottomSheet"
