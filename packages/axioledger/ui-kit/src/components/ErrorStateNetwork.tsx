/**
 * ErrorStateNetwork — AXQ Design System
 * Inventory: #94 · Group 8 Feedback, System States & Banners · Phase 1–2 ⚡
 *
 * Network / offline error state screen.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg/primary → #FFFFFF (screen bg)
//           status/error-default → #FF3D71 (wifi-slash icon color)
//           text/primary → #101426 (title)
//           text/secondary → #2E3A59 (message)
//           button/primary-bg → #000000 (Retry button)
//           text/inverse → #FFFFFF (Retry label)
// radius:   button/radius → 24px
// spacing:  inset/xl (32px) · gap/xl (24px) between elements
// typography: type/h5 (24px) font-weight 600 (title)
//             type/body (16px) (message)
// icons:    wifi.svg with slash, 80px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ErrorStateNetworkProps {
  /** Tiêu đề lỗi. Mặc định: "No Connection" */
  title?: string
  /** Mô tả. Mặc định: "Check your internet connection and try again." */
  message?: string
  /** Callback thử lại */
  onRetry?: () => void
  /** Label nút retry. Mặc định: "Try Again" */
  retryLabel?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ErrorStateNetwork: React.FC<ErrorStateNetworkProps> = (_props) => {
  return <div data-testid="axq-94" />
}

ErrorStateNetwork.displayName = "ErrorStateNetwork"
