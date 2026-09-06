/**
 * BadgeIconSmall — AXQ Design System
 * Inventory: #150 · Group 15 Miscellaneous & Specialized · Phase 1–2 ⚡
 */

import React from "react"

export interface BadgeIconSmallProps {
  count?: number
  dotOnly?: boolean
}

export const BadgeIconSmall: React.FC<BadgeIconSmallProps> = ({
  count = 0,
  dotOnly = false,
}) => {
  if (!dotOnly && count === 0) return null

  const showCount = !dotOnly && count > 0
  const label = showCount ? `${Math.min(count, 99)}` : undefined

  return (
    <span
      aria-label={showCount ? `${count} thông báo` : "Có thông báo mới"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: showCount ? "16px" : "8px",
        height: showCount ? "16px" : "8px",
        padding: showCount ? "0 4px" : "0",
        borderRadius: "var(--axq-radius-full, 9999px)",
        backgroundColor: "var(--axq-status-error-default, #FF3D71)",
        color: "var(--axq-text-inverse, #FFFFFF)",
        fontSize: "0.625rem",
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {showCount && label}
    </span>
  )
}

BadgeIconSmall.displayName = "BadgeIconSmall"
