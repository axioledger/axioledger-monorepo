/**
 * DigitalReceiptHeader — AXQ Design System
 * Inventory: #129 · Group 12 Transfer, Payments & Receipts · Phase 1–2 ⚡
 *
 * Transaction receipt header: success tick + brand green background.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/success-default → #00D68F (tick circle)
//           brand/green → #BEFF6C (header background)
//           text/primary → #101426 (title text)
// radius:   radius/full → 9999px (tick circle, 64px)
// spacing:  height ~160px · tick centered vertically
// typography: type/h5 (24px) font-weight 600 (success title)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DigitalReceiptHeaderProps {
  /** Tiêu đề header. Mặc định: "Transaction Successful" */
  title?: string
  /** Logo merchant (tuỳ chọn, override default tick) */
  merchantLogo?: React.ReactNode
  /** Số tiền tổng hiển thị */
  totalAmount?: string
  /** Ký hiệu tiền tệ */
  currency?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DigitalReceiptHeader: React.FC<DigitalReceiptHeaderProps> = (_props) => {
  return <div data-testid="axq-129" />
}

DigitalReceiptHeader.displayName = "DigitalReceiptHeader"
