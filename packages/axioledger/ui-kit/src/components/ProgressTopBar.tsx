/**
 * ProgressTopBar — AXQ Design System
 * Inventory: #12 · Group 1 Navigation & Bars · Phase 1–2 ⚡
 */

import React from "react"

export interface ProgressTopBarProps {
  totalSteps: number
  currentStep: number
}

export const ProgressTopBar: React.FC<ProgressTopBarProps> = ({ totalSteps, currentStep }) => {
  const pct = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100))
  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Bước ${currentStep} / ${totalSteps}`}
      style={{
        width: "100%", height: "4px",
        borderRadius: "var(--axq-radius-full, 9999px)",
        backgroundColor: "var(--axq-bg-tertiary, #E4E9F2)",
        overflow: "hidden",
      }}
    >
      <div style={{
        height: "100%",
        width: `${pct}%`,
        borderRadius: "var(--axq-radius-full, 9999px)",
        backgroundColor: "var(--axq-status-info-default, #0095FF)",
        transition: "width 0.3s ease",
      }} />
    </div>
  )
}

ProgressTopBar.displayName = "ProgressTopBar"
