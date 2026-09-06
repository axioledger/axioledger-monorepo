/**
 * OnboardingSlide — AXQ Design System
 * Inventory: #101 · Group 9 Onboarding, Auth & Security · Phase 1–2 ⚡
 *
 * Onboarding carousel slide: Illustration + Title + Subtitle.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg: brand/purple → #AF96FB (default) or brand/pink → #FD9FDD
//           text/primary or text/inverse (depending on bg darkness)
//           text/secondary (subtitle)
// radius:   — (full screen)
// spacing:  inset/xl (32px) horizontal · 48px top padding
//           illustration height 240px centered
// typography: type/h4 (34px) font-weight 700 (title)
//             type/body (16px) (subtitle)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OnboardingSlideProps {
  /** Illustration content */
  illustration: React.ReactNode
  /** Tiêu đề slide */
  title: string
  /** Mô tả slide */
  subtitle: string
  /** Màu nền (hex). Mặc định: brand/purple #AF96FB */
  bgColor?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const OnboardingSlide: React.FC<OnboardingSlideProps> = (_props) => {
  return <div data-testid="axq-101" />
}

OnboardingSlide.displayName = "OnboardingSlide"
