/**
 * InAppBanner — AXQ Design System
 * Inventory: #87–90 · Group 8 Feedback, System States & Banners · Phase 1–2 ⚡
 *
 * In-app banner: info | warning | critical | promo
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color (by variant):
//   info:     status/info-bg → #F2F8FF · status/info-default (#0095FF) icon
//             status/info-text → #0057C2 title/message
//   warning:  status/warning-bg → #FFFDF2 · warning-2.svg icon (#FFAA00)
//             status/warning-text → #B86E00
//   critical: status/error-bg → #FFF2F2 · shield-cross.svg (#FF3D71)
//             status/error-text → #B81D5B
//   promo:    brand/pink → #FD9FDD bg · text/primary → #101426
// radius:   radius/card → radius/xl → 16px
// spacing:  inset/md (16px) padding
// typography: type/body-sm (14px) message · type/body (16px) title

// ─── Types ────────────────────────────────────────────────────────────────────

export type BannerVariant = "info" | "warning" | "critical" | "promo"

export interface InAppBannerProps {
  /** Loại banner */
  variant: BannerVariant
  /** Tiêu đề */
  title: string
  /** Nội dung mô tả */
  message?: string
  /** Label nút CTA */
  ctaLabel?: string
  /** Callback CTA */
  onCta?: () => void
  /** Callback dismiss */
  onDismiss?: () => void
  /** Có thể dismiss không. Mặc định: true */
  dismissible?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const InAppBanner: React.FC<InAppBannerProps> = (_props) => {
  return <div data-testid="axq-87" />
}

InAppBanner.displayName = "InAppBanner"
