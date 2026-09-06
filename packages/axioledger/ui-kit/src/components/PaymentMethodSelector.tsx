/**
 * PaymentMethodSelector — AXQ Design System
 * Inventory: #126 · Group 12 Transfer, Payments & Receipts · Phase 1–2 ⚡
 *
 * Payment method selection row: Wallet | Crypto | Debit card.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    card/bg → surface/default → #FFFFFF
//           card/border → border/subtle → #EDF1F7
//           status/info-default → #0095FF (selected: left border 3px + radio dot)
//           text/primary → #101426 (method label)
//           text/secondary → #2E3A59 (method subtitle / balance)
// radius:   radius/card → radius/xl → 16px
// spacing:  card/padding (24px) per row · gap/md (12px) between icon and text
// typography: type/body (16px) label · type/body-sm (14px) subtitle

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaymentMethod {
  /** ID duy nhất */
  id: string
  /** Tên phương thức */
  label: string
  /** Thông tin phụ (ví dụ: số dư) */
  subtitle?: string
  /** Icon */
  icon: React.ReactNode
  /** Số dư hiển thị */
  balance?: string
}

export interface PaymentMethodSelectorProps {
  /** Danh sách phương thức thanh toán */
  methods: PaymentMethod[]
  /** ID phương thức đang chọn */
  selectedId?: string
  /** Callback khi chọn phương thức */
  onSelect: (id: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = (_props) => {
  return <div data-testid="axq-126" />
}

PaymentMethodSelector.displayName = "PaymentMethodSelector"
