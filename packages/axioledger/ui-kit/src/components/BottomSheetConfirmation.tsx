/**
 * BottomSheetConfirmation — AXQ Design System
 * Inventory: #56 · Group 5 Modals, Drawers & Popups · Phase 1–2 ⚡
 *
 * Transaction summary confirmation sheet: Amount + Fee + Confirm button.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/default → #FFFFFF (sheet bg)
//           modal/overlay → rgba(16,20,38,0.6)
//           text/secondary → #2E3A59 (row labels)
//           text/primary → #101426 (row values)
//           border/subtle → #EDF1F7 (row separators)
//           button/primary-bg → bg/brand → #000000 (Confirm button)
//           text/inverse → #FFFFFF (Confirm button label)
// radius:   radius/3xl → 32px (top corners) · button/radius → 24px
// spacing:  modal/padding (32px) · card/gap (12px) between rows
// typography: type/h4 (34px) total amount · type/body-sm (14px) labels
//             type/body (16px) values

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TxConfirmationRow {
  /** Label mô tả (trái) */
  label: string
  /** Giá trị (phải) */
  value: string
  /** Highlight giá trị (dùng cho Total) */
  highlight?: boolean
}

export interface BottomSheetConfirmationProps {
  /** Trạng thái hiển thị */
  isOpen: boolean
  /** Callback đóng sheet */
  onClose: () => void
  /** Callback xác nhận giao dịch */
  onConfirm: () => void
  /** Các hàng chi tiết giao dịch */
  rows: TxConfirmationRow[]
  /** Tên người nhận */
  recipientName?: string
  /** Avatar URL người nhận */
  recipientAvatar?: string
  /** Tổng số tiền hiển thị (đã format) */
  totalAmount: string
  /** Ký hiệu tiền tệ. Mặc định: "$" */
  currency?: string
  /** Trạng thái loading nút Confirm */
  isLoading?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BottomSheetConfirmation: React.FC<BottomSheetConfirmationProps> = (_props) => {
  return <div data-testid="axq-56" />
}

BottomSheetConfirmation.displayName = "BottomSheetConfirmation"
