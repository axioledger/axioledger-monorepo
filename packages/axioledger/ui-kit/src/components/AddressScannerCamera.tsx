/**
 * AddressScannerCamera — AXQ Design System
 * Inventory: #168 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Address scanner camera view — OCR scan of crypto addresses.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/teal   → #49DBC8 (scanning frame border)
//           text/inverse → #FFFFFF (instruction text)
//           bg/inverse   → rgba(0,0,0,0.6) (overlay mask)
// spacing:  frame 300×80px · inset/lg (24px) from screen edges

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AddressScannerCameraProps {
  /** Callback khi scan thành công (địa chỉ đã nhận dạng) */
  onAddressDetected?: (address: string) => void
  /** Callback khi đóng scanner */
  onClose?: () => void
  /** Đang quét */
  isScanning?: boolean
  /** Text hướng dẫn */
  instructionText?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AddressScannerCamera: React.FC<AddressScannerCameraProps> = (_props) => {
  return <div data-testid="axq-168" />
}

AddressScannerCamera.displayName = "AddressScannerCamera"
