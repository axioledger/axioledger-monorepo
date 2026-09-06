/**
 * Skeleton — AXQ Design System
 * Inventory: #97–99 · Group 8 Feedback, System States & Banners · Phase 1–2 ⚡
 */

import React from "react"

export type SkeletonVariant = "line" | "card" | "avatar"

export interface SkeletonProps {
  variant?: SkeletonVariant
  width?: number | string
  height?: number
  /** Số dòng (chỉ cho variant="line") */
  lines?: number
}

const RADIUS: Record<SkeletonVariant, string> = {
  line:   "var(--axq-radius-sm, 4px)",
  card:   "var(--axq-radius-card, 16px)",
  avatar: "var(--axq-radius-full, 9999px)",
}
const DEFAULT_H: Record<SkeletonVariant, number> = { line: 14, card: 160, avatar: 40 }

const SingleBone: React.FC<{ w: number | string; h: number; radius: string }> = ({ w, h, radius }) => (
  <>
    <style>{`@keyframes axq-shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}`}</style>
    <div
      aria-hidden="true"
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background: "var(--axq-bg-tertiary, #E4E9F2)",
        backgroundImage: "linear-gradient(90deg,var(--axq-bg-tertiary,#E4E9F2) 25%,rgba(255,255,255,0.4) 50%,var(--axq-bg-tertiary,#E4E9F2) 75%)",
        backgroundSize: "800px 100%",
        animation: "axq-shimmer 1.5s linear infinite",
      }}
    />
  </>
)

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "line",
  width = "100%",
  height,
  lines = 1,
}) => {
  const h = height ?? DEFAULT_H[variant]
  const radius = RADIUS[variant]

  if (variant === "line" && lines > 1) {
    return (
      <div role="status" aria-label="Đang tải..." style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {Array.from({ length: lines }).map((_, i) => (
          <SingleBone
            key={i}
            w={i === lines - 1 ? "70%" : width}
            h={h}
            radius={radius}
          />
        ))}
      </div>
    )
  }

  return (
    <div role="status" aria-label="Đang tải...">
      <SingleBone w={width} h={h} radius={radius} />
    </div>
  )
}

Skeleton.displayName = "Skeleton"
