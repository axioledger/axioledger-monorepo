/**
 * PasskeyIntegrationBox — AXQ Design System
 * Inventory: #103 · Group 9 Onboarding, Auth & Security · Phase 1–2 ⚡
 *
 * Passkey activation card for WebAuthn / iCloud Keychain.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    card/bg → surface/default → #FFFFFF
//           card/border → border/subtle → #EDF1F7
//           brand/teal → #49DBC8 (key.svg icon color)
//           text/primary → #101426 (title)
//           text/secondary → #2E3A59 (subtitle)
//           button/primary-bg → #000000 (Activate button)
//           text/inverse → #FFFFFF (Activate button label)
//           status/success-default → #00D68F (activated state icon)
// radius:   radius/card → radius/xl → 16px · button/radius → 24px
// spacing:  card/padding (24px)
// typography: type/h6 (20px) font-weight 600 (title) · type/body-sm (14px) subtitle
// icons:    key.svg bold, 40px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PasskeyIntegrationBoxProps {
  /** Callback khi nhấn Activate */
  onActivate: () => void
  /** Trạng thái đã kích hoạt */
  isActivated?: boolean
  /** Trạng thái loading */
  isLoading?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PasskeyIntegrationBox: React.FC<PasskeyIntegrationBoxProps> = (_props) => {
  return <div data-testid="axq-103" />
}

PasskeyIntegrationBox.displayName = "PasskeyIntegrationBox"
