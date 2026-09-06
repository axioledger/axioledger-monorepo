/**
 * BottomSheetBiometric — AXQ Design System
 * Inventory: #57 · Group 5 Modals, Drawers & Popups · Phase 1–2 ⚡
 *
 * Biometric authentication prompt sheet: FaceID / TouchID.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/default → #FFFFFF (sheet bg)
//           brand/teal → #49DBC8 (biometric icon color)
//           text/primary → #101426 (title)
//           text/secondary → #2E3A59 (subtitle)
//           modal/overlay → rgba(16,20,38,0.6)
// radius:   radius/3xl → 32px (top corners)
// spacing:  modal/padding (32px)
// typography: type/h5 (24px) font-weight 600 (title)
//             type/body (16px) (subtitle)
// icons:    finger-scan.svg (touchId, 80px) · 3d-cube-scan.svg (faceId, 80px)

// ─── Types ────────────────────────────────────────────────────────────────────

export type BiometricType = "faceId" | "touchId"

export interface BottomSheetBiometricProps {
  /** Trạng thái hiển thị */
  isOpen: boolean
  /** Callback đóng sheet */
  onClose: () => void
  /** Callback bắt đầu xác thực */
  onAuthenticate: () => Promise<void>
  /** Loại biometric. Mặc định: "faceId" */
  type: BiometricType
  /** Tiêu đề custom */
  title?: string
  /** Mô tả custom */
  subtitle?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BottomSheetBiometric: React.FC<BottomSheetBiometricProps> = (_props) => {
  return <div data-testid="axq-57" />
}

BottomSheetBiometric.displayName = "BottomSheetBiometric"
