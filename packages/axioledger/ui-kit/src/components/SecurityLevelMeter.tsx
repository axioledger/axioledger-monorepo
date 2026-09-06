/**
 * SecurityLevelMeter — AXQ Design System
 * Inventory: #106 · Group 9 Onboarding, Auth & Security · Phase 3 🔵
 *
 * Password strength indicator — Weak / Medium / Strong.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/error-default   → #FF3D71 (Weak — 1 segment)
//           status/warning-default → #FFAA00 (Medium — 2 segments)
//           status/success-default → #00D68F (Strong — 3 segments)
//           bg/tertiary            → #EDF1F7 (inactive segments)
//           text/tertiary          → #8F9BB3 (label text)
// radius:   radius/full (9999px) on each segment
// spacing:  height 4px per segment · gap 4px between segments

// ─── Types ────────────────────────────────────────────────────────────────────

export type PasswordStrength = "weak" | "medium" | "strong"

export interface SecurityLevelMeterProps {
  /** Mức độ mạnh của mật khẩu */
  strength?: PasswordStrength
  /** Hiển thị label text. Mặc định: true */
  showLabel?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SecurityLevelMeter: React.FC<SecurityLevelMeterProps> = (_props) => {
  return <div data-testid="axq-106" />
}

SecurityLevelMeter.displayName = "SecurityLevelMeter"
