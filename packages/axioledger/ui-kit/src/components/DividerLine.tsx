/**
 * DividerLine — AXQ Design System
 * Inventory: #149 · Group 15 Miscellaneous & Specialized · Phase 1–2 ⚡
 */

import React from "react"

export interface DividerLineProps {
  marginVertical?: number
  color?: string
}

export const DividerLine: React.FC<DividerLineProps> = ({
  marginVertical = 0,
  color,
}) => (
  <hr
    aria-hidden="true"
    style={{
      border: "none",
      borderTop: `1px solid ${color ?? "var(--axq-border-subtle, #EDF1F7)"}`,
      margin: `${marginVertical}px 0`,
      width: "100%",
    }}
  />
)

DividerLine.displayName = "DividerLine"
