/**
 * ForceUpdateModal — AXQ Design System
 * Inventory: #174 · Group 15 Miscellaneous & Specialized · Phase 1–2 ⚡
 *
 * Mandatory app update blocking modal.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/default → #FFFFFF (modal bg)
//           modal/overlay → rgba(16,20,38,0.6) (non-dismissible)
//           status/warning-default → #FFAA00 (update icon / warning accent)
//           text/primary → #101426 (title)
//           text/secondary → #2E3A59 (message)
//           button/primary-bg → #000000 (Update Now button)
//           text/inverse → #FFFFFF (button label)
// radius:   modal/radius → radius/2xl → 24px · button/radius → 24px
// spacing:  modal/padding (32px) · modal/gap (16px)
// typography: type/h5 (24px) font-weight 600 (title) · type/body (16px) message
// note:     This modal is NON-DISMISSIBLE — no close/cancel button

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ForceUpdateModalProps {
  /** Trạng thái hiển thị (luôn true khi cần force update) */
  isVisible: boolean
  /** Phiên bản mới */
  newVersion?: string
  /** Ghi chú cập nhật */
  releaseNotes?: string
  /** Callback dẫn đến App Store / Play Store */
  onUpdate: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ForceUpdateModal: React.FC<ForceUpdateModalProps> = (_props) => {
  return <div data-testid="axq-174" />
}

ForceUpdateModal.displayName = "ForceUpdateModal"
