/**
 * KYCLevelProgress — AXQ Design System
 * Inventory: #160 · Group 15 Miscellaneous & Specialized · Phase 1–2 ⚡
 *
 * KYC verification tier progress: Level 1 → 2 → 3.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/info-default → #0095FF (active step dot + connector fill)
//           bg/tertiary → #E4E9F2 (inactive step dot + connector)
//           status/success-default → #00D68F (completed step dot)
//           text/primary → #101426 (active step label)
//           text/tertiary → #8F9BB3 (inactive step labels)
// radius:   radius/full → 9999px (step dots, 24px)
// spacing:  dots 24×24px · connector lines 2px height · gap/lg (16px) between elements
// typography: type/caption (12px) step labels · type/body-sm (14px) tier name

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KYCLevelProgressProps {
  /** Level hiện tại (1-based). Mặc định: 1 */
  currentLevel: 1 | 2 | 3
  /** Tổng số levels. Mặc định: 3 */
  maxLevel?: number
  /** Labels cho từng level. Mặc định: ["Basic", "Verified", "Premium"] */
  levelLabels?: string[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export const KYCLevelProgress: React.FC<KYCLevelProgressProps> = (_props) => {
  return <div data-testid="axq-160" />
}

KYCLevelProgress.displayName = "KYCLevelProgress"
