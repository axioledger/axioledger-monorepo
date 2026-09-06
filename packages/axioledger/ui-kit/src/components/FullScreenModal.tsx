/**
 * FullScreenModal — AXQ Design System
 * Inventory: #64 · Group 5 Modals, Drawers & Popups · Phase 1–2 ⚡
 *
 * Full-screen scrollable modal for Terms & Conditions / Privacy Policy.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg/primary → #FFFFFF (full screen bg)
//           text/primary → #101426 (heading)
//           text/secondary → #2E3A59 (body text)
// radius:   — (full screen, no radius)
// spacing:  inset/lg (24px) horizontal padding · inset/md (16px) top
// typography: type/h5 (24px) title · type/body (16px) content

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FullScreenModalProps {
  /** Trạng thái hiển thị */
  isOpen: boolean
  /** Callback đóng modal */
  onClose: () => void
  /** Tiêu đề header */
  title: string
  /** Nội dung scrollable */
  children?: React.ReactNode
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FullScreenModal: React.FC<FullScreenModalProps> = (_props) => {
  return <div data-testid="axq-64" />
}

FullScreenModal.displayName = "FullScreenModal"
