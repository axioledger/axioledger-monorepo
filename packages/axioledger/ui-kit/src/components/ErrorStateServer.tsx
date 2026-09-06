/**
 * ErrorStateServer — AXQ Design System
 * Inventory: #95 · Group 8 Feedback, System States & Banners · Phase 1–2 ⚡
 *
 * 500 server error state screen.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/error-bg → #FFF2F2 (screen bg tint)
//           status/error-default → #FF3D71 (illustration accent)
//           text/primary → #101426 (title)
//           text/secondary → #2E3A59 (message + support link)
//           text/link → #0057C2 (support link)
//           button/primary-bg → #000000 (Retry button)
//           text/inverse → #FFFFFF (Retry label)
// radius:   button/radius → 24px
// spacing:  inset/xl (32px) · gap/xl (24px)
// typography: type/h5 (24px) font-weight 600 (title) · type/body (16px) message

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ErrorStateServerProps {
  /** Tiêu đề. Mặc định: "Something Went Wrong" */
  title?: string
  /** Mô tả. Mặc định: "Our servers encountered an error. Please try again later." */
  message?: string
  /** Callback thử lại */
  onRetry?: () => void
  /** Callback liên hệ support */
  onContactSupport?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ErrorStateServer: React.FC<ErrorStateServerProps> = (_props) => {
  return <div data-testid="axq-95" />
}

ErrorStateServer.displayName = "ErrorStateServer"
