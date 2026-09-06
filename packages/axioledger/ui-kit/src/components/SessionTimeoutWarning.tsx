/**
 * SessionTimeoutWarning — AXQ Design System
 * Inventory: #177 · Group 15 Miscellaneous & Specialized · Phase 1–2 ⚡
 *
 * Session timeout countdown popup with Continue / Logout actions.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/default → #FFFFFF (modal bg)
//           modal/overlay → rgba(16,20,38,0.6)
//           brand/teal → #49DBC8 (security-time.svg icon color)
//           status/warning-default → #FFAA00 (countdown number — urgent state <10s)
//           text/primary → #101426 (countdown number — normal state, title)
//           text/secondary → #2E3A59 (message)
//           button/primary-bg → #000000 (Continue button)
//           text/inverse → #FFFFFF (Continue label)
//           status/error-default → #FF3D71 (Logout button text)
// radius:   modal/radius → radius/2xl → 24px · button/radius → 24px
// spacing:  modal/padding (32px) · modal/gap (16px) · gap/md (12px) between buttons
// typography: type/h4 (34px) font-weight 700 (countdown seconds)
//             type/h5 (24px) font-weight 600 (title)
//             type/body (16px) (message)
// icons:    security-time.svg bold, 64px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionTimeoutWarningProps {
  /** Số giây còn lại trước khi auto-logout */
  secondsRemaining: number
  /** Callback gia hạn phiên */
  onContinue: () => void
  /** Callback đăng xuất ngay */
  onLogout: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = (_props) => {
  return <div data-testid="axq-177" />
}

SessionTimeoutWarning.displayName = "SessionTimeoutWarning"
