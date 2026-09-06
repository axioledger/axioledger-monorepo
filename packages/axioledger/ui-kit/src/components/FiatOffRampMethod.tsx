/**
 * FiatOffRampMethod — AXQ Design System
 * Inventory: #200 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Fiat off-ramp withdrawal method row — Bank wire / instant withdrawal.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary   → #101426 (bank name)
//           text/secondary → #8F9BB3 (processing time + fee)
//           icon/secondary → #8F9BB3 (bank icon)
//           border/subtle  → #EDF1F7 (row bottom border)
// spacing:  inset/md (16px) horizontal · 14px vertical

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FiatOffRampMethodProps {
  /** Tên ngân hàng / phương thức */
  methodName: string
  /** Logo URL */
  logoUrl?: string
  /** Phí rút tiền (formatted, e.g. "Free" | "$0.25") */
  withdrawalFee?: string
  /** Thời gian xử lý, e.g. "1–3 business days" | "Instant" */
  processingTime?: string
  /** Đây là phương thức mặc định */
  isDefault?: boolean
  /** Callback khi chọn */
  onSelect?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FiatOffRampMethod: React.FC<FiatOffRampMethodProps> = (_props) => {
  return <button type="button" data-testid="axq-200" />
}

FiatOffRampMethod.displayName = "FiatOffRampMethod"
