/**
 * QRCodePresentationCard — AXQ Design System
 * Inventory: #40 · Group 3 Data Display & Visual Cards · Phase 1–2 ⚡
 *
 * QR code display card: QR + Address + Copy button.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/default → #FFFFFF (card bg)
//           card/border → border/subtle → #EDF1F7
//           bg/brand → #000000 (QR modules)
//           text/tertiary → #8F9BB3 (address display, monospace)
//           icon/secondary → #2E3A59 (copy.svg icon)
//           text/link → #0057C2 (Copy label)
// radius:   radius/card → radius/xl → 16px
// spacing:  card/padding (24px) · gap/xl (24px) between QR and address
// typography: type/caption (12px) address text (monospace)
//             type/body-sm (14px) Copy label

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QRCodePresentationCardProps {
  /** Địa chỉ ví / dữ liệu QR */
  address: string
  /** Tên mạng hiển thị */
  networkName?: string
  /** Callback copy address */
  onCopy?: () => void
  /** Kích thước QR. Mặc định: 160 */
  qrSize?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const QRCodePresentationCard: React.FC<QRCodePresentationCardProps> = (_props) => {
  return <div data-testid="axq-40" />
}

QRCodePresentationCard.displayName = "QRCodePresentationCard"
