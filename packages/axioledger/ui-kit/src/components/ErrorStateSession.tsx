/**
 * ErrorStateSession — AXQ Design System
 * Inventory: #96 · Group 8 Feedback, System States & Banners · Phase 1–2 ⚡
 *
 * Session expired error state screen.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg/primary → #FFFFFF (screen bg)
//           status/warning-default → #FFAA00 (security-time.svg icon color)
//           text/primary → #101426 (title)
//           text/secondary → #2E3A59 (message)
//           button/primary-bg → #000000 (Log In Again button)
//           text/inverse → #FFFFFF (button label)
// radius:   button/radius → 24px
// spacing:  inset/xl (32px) · gap/xl (24px)
// typography: type/h5 (24px) font-weight 600 (title) · type/body (16px) message
// icons:    security-time.svg bold, 80px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ErrorStateSessionProps {
  /** Tiêu đề. Mặc định: "Session Expired" */
  title?: string
  /** Mô tả. Mặc định: "Your session has expired. Please log in again." */
  message?: string
  /** Callback đăng nhập lại */
  onLoginAgain: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ErrorStateSession: React.FC<ErrorStateSessionProps> = (_props) => {
  return <div data-testid="axq-96" />
}

ErrorStateSession.displayName = "ErrorStateSession"
