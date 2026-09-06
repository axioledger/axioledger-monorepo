/**
 * SubHeader — AXQ Design System
 * Inventory: #6 · Group 1 Navigation & Bars · Phase 1–2 ⚡
 */

import React from "react"

export interface SubHeaderProps {
  title: string
  actionLabel?: string
  onAction?: () => void
}

export const SubHeader: React.FC<SubHeaderProps> = ({ title, actionLabel, onAction }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--axq-text-primary, #101426)" }}>
      {title}
    </span>
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          fontSize: "0.875rem", fontWeight: 500, fontFamily: "inherit",
          color: "var(--axq-text-link, #0057C2)",
          flexShrink: 0,
        }}
      >
        {actionLabel}
      </button>
    )}
  </div>
)

SubHeader.displayName = "SubHeader"
