/**
 * FiatOnRampCard — AXQ Design System
 * Inventory: #199 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Fiat on-ramp provider card — MoonPay / Banxa / Transak.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    card/bg         → #FFFFFF (card background)
//           border/default  → #C5CEE0 (card border)
//           text/primary    → #101426 (provider name)
//           text/secondary  → #8F9BB3 (fee + processing time)
//           brand/teal      → #49DBC8 (select CTA border)
// radius:   radius/card (16px)
// spacing:  inset/md (16px) padding

// ─── Types ────────────────────────────────────────────────────────────────────

export type OnRampProvider = "moonpay" | "banxa" | "transak" | "other"

export interface FiatOnRampCardProps {
  /** Nhà cung cấp */
  provider: OnRampProvider
  /** Tên hiển thị */
  providerName: string
  /** URL logo */
  logoUrl?: string
  /** Phí dịch vụ (formatted, e.g. "~1.5%") */
  fee?: string
  /** Thời gian xử lý, e.g. "Instant" | "1–3 min" */
  processingTime?: string
  /** Đây là provider được đề xuất */
  isRecommended?: boolean
  /** Callback khi chọn */
  onSelect?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FiatOnRampCard: React.FC<FiatOnRampCardProps> = (_props) => {
  return <button type="button" data-testid="axq-199" />
}

FiatOnRampCard.displayName = "FiatOnRampCard"
