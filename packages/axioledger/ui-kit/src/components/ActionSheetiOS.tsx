/**
 * ActionSheetiOS — AXQ Design System
 * Inventory: #63 · Group 5 Modals, Drawers & Popups · Phase 1–2 ⚡
 *
 * iOS-style action sheet with option list and Cancel button.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/default → #FFFFFF (sheet bg)
//           modal/overlay → rgba(16,20,38,0.6)
//           text/primary → #101426 (options)
//           text/link → #0057C2 (cancel)
//           status/error-default → #FF3D71 (destructive option)
//           border/subtle → #EDF1F7 (row dividers)
// radius:   radius/3xl → 32px (top corners)
// spacing:  inset/md (16px) per row · modal/gap (16px)
// typography: type/body (16px) option labels

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActionSheetOption {
  /** Label hiển thị */
  label: string
  /** Callback khi chọn */
  onClick: () => void
  /** Tô đỏ option destructive */
  destructive?: boolean
  /** Icon tuỳ chọn */
  icon?: React.ReactNode
}

export interface ActionSheetiOSProps {
  /** Trạng thái hiển thị */
  isOpen: boolean
  /** Callback đóng sheet */
  onClose: () => void
  /** Danh sách options */
  options: ActionSheetOption[]
  /** Label nút Cancel. Mặc định: "Cancel" */
  cancelLabel?: string
  /** Tiêu đề sheet (tuỳ chọn) */
  title?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ActionSheetiOS: React.FC<ActionSheetiOSProps> = (_props) => {
  return <div data-testid="axq-63" />
}

ActionSheetiOS.displayName = "ActionSheetiOS"
