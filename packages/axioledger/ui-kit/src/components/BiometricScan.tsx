/**
 * BiometricScan — AXQ Design System
 * Inventory: #104–105 · Group 9 Onboarding, Auth & Security · Phase 1–2 ⚡
 *
 * Biometric scan graphic: FaceID (3d-cube-scan) | TouchID (finger-scan).
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/teal → #49DBC8 (outer ring stroke — default)
//           status/success-default → #00D68F (ring when isSuccess=true)
//           status/error-default → #FF3D71 (ring when isError=true)
//           bg/secondary → #EDF1F7 (inner icon background)
// radius:   radius/full → 9999px (ring + icon container)
// spacing:  size default 120px outer ring · inner icon 64px
//           ring stroke-width: 2px
// animation: pulse opacity 0.5→1 (scanning state)
//            shake transform (error state)
// icons:    3d-cube-scan.svg (faceId, 64px) · finger-scan.svg (touchId, 64px) — bold

// ─── Types ────────────────────────────────────────────────────────────────────

export type BiometricScanType = "faceId" | "touchId"

export interface BiometricScanProps {
  /** Loại biometric */
  type: BiometricScanType
  /** Đang quét. Kích hoạt pulse animation. */
  isScanning?: boolean
  /** Xác thực thành công. Đổi ring sang green. */
  isSuccess?: boolean
  /** Xác thực thất bại. Đổi ring sang red + shake. */
  isError?: boolean
  /** Kích thước outer ring (px). Mặc định: 120 */
  size?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BiometricScan: React.FC<BiometricScanProps> = (_props) => {
  return <div data-testid="axq-104" />
}

BiometricScan.displayName = "BiometricScan"
