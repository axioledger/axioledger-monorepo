/**
 * QRCodeScanner — AXQ Design System
 * Inventory: #132 · Group 12 Transfer, Payments & Receipts · Phase 1–2 ⚡
 *
 * QR code scanner viewfinder with teal corner markers.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/teal → #49DBC8 (corner L-shapes, 3px stroke)
//           rgba(0,0,0,0.7) (dimmed area outside frame)
//           text/inverse → #FFFFFF (guide text)
//           brand/teal animated scan line top→bottom
// radius:   radius/sm → 4px (corner pieces only, not full frame)
// spacing:  frame 240×240px centered · guide text below frame, 16px gap
// animation: scan line moves top→bottom 2s loop linear
// icons:    scan-barcode.svg center overlay (optional indicator)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QRCodeScannerProps {
  /** Callback khi decode thành công */
  onScan: (data: string) => void
  /** Callback khi có lỗi camera */
  onError?: (error: Error) => void
  /** Text hướng dẫn bên dưới frame. Mặc định: "Align QR code within frame" */
  guideText?: string
  /** Tiêu đề header bên trên */
  title?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const QRCodeScanner: React.FC<QRCodeScannerProps> = (_props) => {
  return <div data-testid="axq-132" />
}

QRCodeScanner.displayName = "QRCodeScanner"
