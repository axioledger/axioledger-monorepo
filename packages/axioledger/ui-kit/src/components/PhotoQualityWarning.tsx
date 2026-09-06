/**
 * PhotoQualityWarning — AXQ Design System
 * Inventory: #112 · Group 10 eKYC & Verification · Phase 1–2 ⚡
 *
 * Tag/chip indicating photo quality issues: Blur | Glare | Angle.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/warning-default → #FFAA00 (icon color)
//           status/warning-bg → #FFFDF2 (background)
//           status/warning-text → #B86E00 (text)
// radius:   badge/radius → radius/sm → 4px
// spacing:  badge/padding-x (8px) · badge/padding-y (4px)
// typography: type/caption (12px) font-weight 500
// icons:    warning-2.svg bold, 12px

// ─── Types ────────────────────────────────────────────────────────────────────

export type PhotoQualityIssue = "blur" | "glare" | "angle" | "dark" | "cut"

export interface PhotoQualityWarningProps {
  /** Loại vấn đề chất lượng */
  issue: PhotoQualityIssue
  /** Label tùy chỉnh (ghi đè default label) */
  label?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PhotoQualityWarning: React.FC<PhotoQualityWarningProps> = (_props) => {
  return <div data-testid="axq-112" />
}

PhotoQualityWarning.displayName = "PhotoQualityWarning"
