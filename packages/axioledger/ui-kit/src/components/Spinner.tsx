/**
 * Spinner — AXQ Design System
 * Inventory: #100 · Group 8 Feedback, System States & Banners · Phase 1–2 ⚡
 */

import React from "react"

export type SpinnerSize = "sm" | "md" | "lg"
export type SpinnerColor = "brand" | "teal" | "white"

export interface SpinnerProps {
  size?: SpinnerSize
  color?: SpinnerColor
  /** aria-label cho screen reader */
  label?: string
}

const SIZE_PX: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 40 }
const COLOR_MAP: Record<SpinnerColor, string> = {
  brand: "var(--axq-bg-brand, #000000)",
  teal:  "var(--axq-brand-teal, #49DBC8)",
  white: "var(--axq-text-inverse, #FFFFFF)",
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "teal",
  label = "Đang tải...",
}) => {
  const px = SIZE_PX[size]
  const stroke = COLOR_MAP[color]
  const r = (px - 4) / 2
  const circ = 2 * Math.PI * r

  return (
    <span
      role="status"
      aria-label={label}
      style={{ display: "inline-flex", width: px, height: px, flexShrink: 0 }}
    >
      <style>{`@keyframes axq-spin{to{transform:rotate(360deg)}}`}</style>
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        fill="none"
        aria-hidden="true"
        style={{ animation: "axq-spin 0.7s linear infinite" }}
      >
        {/* Track */}
        <circle cx={px / 2} cy={px / 2} r={r} stroke={stroke} strokeWidth="3" opacity="0.2" />
        {/* Arc */}
        <circle
          cx={px / 2}
          cy={px / 2}
          r={r}
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * 0.75}
        />
      </svg>
    </span>
  )
}

Spinner.displayName = "Spinner"
