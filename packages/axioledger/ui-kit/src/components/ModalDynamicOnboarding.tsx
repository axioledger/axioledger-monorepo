/**
 * ModalDynamicOnboarding — AXQ Design System
 * Inventory: #62 · Group 5 Modals, Drawers & Popups · Phase 3 🔵
 *
 * Dynamic onboarding tooltip/modal — Feature hint overlay.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg/brand      → #000000 (modal background)
//           text/inverse  → #FFFFFF (title + body text)
//           brand/teal    → #49DBC8 (accent / CTA button)
// radius:   radius/2xl (24px)
// spacing:  inset/lg (24px) padding · max-width 320px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModalDynamicOnboardingProps {
  /** Tiêu đề feature hint */
  title: string
  /** Mô tả chi tiết */
  description?: string
  /** Nhãn nút CTA. Mặc định: "Got it" */
  ctaLabel?: string
  /** Callback khi nhấn CTA */
  onCTA?: () => void
  /** Callback khi nhấn bỏ qua */
  onDismiss?: () => void
  /** Hiển thị modal */
  visible?: boolean
  /** Vị trí mũi tên chỉ vào element (top | bottom | left | right) */
  arrowPosition?: "top" | "bottom" | "left" | "right"
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ModalDynamicOnboarding: React.FC<ModalDynamicOnboardingProps> = (_props) => {
  return <div data-testid="axq-62" />
}

ModalDynamicOnboarding.displayName = "ModalDynamicOnboarding"
