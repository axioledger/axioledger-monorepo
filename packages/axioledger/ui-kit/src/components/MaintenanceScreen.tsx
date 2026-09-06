/**
 * MaintenanceScreen — AXQ Design System
 * Inventory: #175 · Group 15 Miscellaneous & Specialized · Phase 1–2 ⚡
 *
 * Full-screen system maintenance / downtime screen.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg/primary → #FFFFFF (full screen bg)
//           text/primary → #101426 (title)
//           text/secondary → #2E3A59 (message + estimated time)
//           text/link → #0057C2 (contact support link)
// radius:   — (full screen)
// spacing:  inset/xl (32px) · gap/xl (24px)
// typography: type/h4 (34px) font-weight 700 (title) · type/body (16px) message
//             type/body-sm (14px) estimated time

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MaintenanceScreenProps {
  /** Tiêu đề. Mặc định: "Under Maintenance" */
  title?: string
  /** Mô tả. Mặc định: "We're making improvements. Back soon!" */
  message?: string
  /** Thời gian dự kiến xong, ví dụ: "2 hours" */
  estimatedTime?: string
  /** Callback liên hệ support */
  onContactSupport?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = (_props) => {
  return <div data-testid="axq-175" />
}

MaintenanceScreen.displayName = "MaintenanceScreen"
