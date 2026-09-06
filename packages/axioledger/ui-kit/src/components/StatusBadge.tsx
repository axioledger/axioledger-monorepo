/**
 * StatusBadge — AXQ Design System
 * Inventory: #47–50 · Group 4 Buttons, Badges & Chips · Phase 1–2 ⚡
 *
 * Variants: success | pending | error | info
 * Sizes:    sm (10px, compact) | md (12px, default)
 *
 * Token chain (DESIGN_SYSTEM.md §Badge & Chip):
 *   success: badge/success-bg → #F0FFF5  ·  badge/success-text → #00997A  ·  dot → #00D68F
 *   pending: badge/warning-bg → #FFFDF2  ·  badge/warning-text → #B86E00  ·  dot → #FFAA00
 *   error:   badge/error-bg   → #FFF2F2  ·  badge/error-text   → #B81D5B  ·  dot → #FF3D71
 *   info:    badge/info-bg    → #F2F8FF  ·  badge/info-text    → #0057C2  ·  dot → #0095FF
 *   radius:  badge/radius → radius/sm → 4px
 *   spacing: md: padding 4px 8px  |  sm: padding 2px 6px
 *   typography: md: type/caption 12px/500  |  sm: type/overline 10px/600
 */

import React from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant = "success" | "pending" | "error" | "info"
export type BadgeSize    = "sm" | "md"

export interface StatusBadgeProps {
  /** Loại badge — controls color scheme */
  variant: BadgeVariant
  /** Kích thước. Mặc định: "md" */
  size?: BadgeSize
  /** Label văn bản hiển thị trong badge */
  label: string
  /** Hiển thị chấm tròn bên trái. Mặc định: true */
  showDot?: boolean
  /** Override style container */
  style?: React.CSSProperties
}

// ─── Token Map ────────────────────────────────────────────────────────────────

interface BadgeTokens {
  bg:   string
  text: string
  dot:  string
}

const VARIANT_TOKENS: Record<BadgeVariant, BadgeTokens> = {
  success: {
    bg:   "#F0FFF5",  // badge/success-bg
    text: "#00997A",  // badge/success-text
    dot:  "#00D68F",  // status/success/500
  },
  pending: {
    bg:   "#FFFDF2",  // badge/warning-bg
    text: "#B86E00",  // badge/warning-text
    dot:  "#FFAA00",  // status/warning/500
  },
  error: {
    bg:   "#FFF2F2",  // badge/error-bg
    text: "#B81D5B",  // badge/error-text
    dot:  "#FF3D71",  // status/error/500
  },
  info: {
    bg:   "#F2F8FF",  // badge/info-bg
    text: "#0057C2",  // badge/info-text
    dot:  "#0095FF",  // status/info/500
  },
}

const SIZE_STYLES: Record<BadgeSize, React.CSSProperties> = {
  // type/caption → 12px/500
  md: { fontSize: "12px", fontWeight: 500, padding: "4px 8px",  gap: "5px" },
  // type/overline → 10px/600 · uppercase
  sm: { fontSize: "10px", fontWeight: 600, padding: "2px 6px",  gap: "4px", textTransform: "uppercase", letterSpacing: "0.3px" },
}

const DOT_SIZE: Record<BadgeSize, number> = { md: 6, sm: 5 }

// ─── Status label → accessible role ──────────────────────────────────────────

/** Maps variant to a sensible aria status for screen readers */
const ARIA_ROLE: Partial<Record<BadgeVariant, "status" | "alert">> = {
  error:   "alert",
  pending: "status",
}

// ─── Component ────────────────────────────────────────────────────────────────

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  size    = "md",
  label,
  showDot = true,
  style,
}) => {
  const tokens  = VARIANT_TOKENS[variant]
  const sizes   = SIZE_STYLES[size]
  const dotSize = DOT_SIZE[size]
  const role    = ARIA_ROLE[variant]

  return (
    <span
      role={role}
      aria-label={`${variant}: ${label}`}
      style={{
        display:      "inline-flex",
        alignItems:   "center",
        // badge/radius → radius/sm → 4px
        borderRadius: "var(--axq-radius-sm, 4px)",
        background:   tokens.bg,
        color:        tokens.text,
        lineHeight:   1,
        whiteSpace:   "nowrap",
        userSelect:   "none",
        ...sizes,
        ...style,
      }}
    >
      {showDot && (
        <span
          aria-hidden="true"
          style={{
            width:        `${dotSize}px`,
            height:       `${dotSize}px`,
            borderRadius: "50%",
            background:   tokens.dot,
            flexShrink:   0,
          }}
        />
      )}
      {label}
    </span>
  )
}

StatusBadge.displayName = "StatusBadge"
