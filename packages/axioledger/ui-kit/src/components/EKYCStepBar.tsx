/**
 * EKYCStepBar — AXQ Design System
 * Inventory: #113 · Group 10 eKYC & Verification · Phase 1–2 ⚡
 *
 * 3-step eKYC process progress bar.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/info-default → #0095FF (active step dot + connector)
//           status/info-bg → #F2F8FF (inactive step dot)
//           text/primary → #101426 (active step label)
//           text/tertiary → #8F9BB3 (inactive step labels)
// radius:   radius/full → 9999px (step dots, 24px)
// spacing:  dot 24×24px · connector line 1px · gap/md (12px) between label and dot
// typography: type/caption (12px) step labels

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EKYCStepBarProps {
  /** Danh sách label cho từng bước */
  steps: string[]
  /** Bước hiện tại (0-based) */
  currentStep: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const EKYCStepBar: React.FC<EKYCStepBarProps> = (_props) => {
  return <div data-testid="axq-113" />
}

EKYCStepBar.displayName = "EKYCStepBar"
