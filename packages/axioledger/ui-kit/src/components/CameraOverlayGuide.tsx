/**
 * CameraOverlayGuide — AXQ Design System
 * Inventory: #110–111 · Group 10 eKYC & Verification · Phase 1–2 ⚡
 *
 * Camera overlay guide frame for ID card (rectangle) and liveness face (oval).
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    brand/teal → #49DBC8 (guide frame corners/oval stroke, 3px)
//           rgba(0,0,0,0.6) (dimmed overlay outside frame)
//           text/inverse → #FFFFFF (guidance text)
//           status/warning-default → #FFAA00 (quality warning text)
// radius:
//   idCard: radius/sm → 4px (corner L-shapes only)
//   face:   radius/full → 9999px (full oval)
// spacing:  guide frame centered · guidance text below frame
// typography: type/body (16px) guidance text
// icons:    frame.svg corner markers (idCard) · 3d-cube-scan.svg (face)
// animation: animated pulse ring (face variant scanning state)

// ─── Types ────────────────────────────────────────────────────────────────────

export type CameraOverlayType = "idCard" | "face"

export interface CameraOverlayGuideProps {
  /** Loại overlay. "idCard" = rectangle, "face" = oval */
  type: CameraOverlayType
  /** Text hướng dẫn hiển thị dưới frame */
  guideText?: string
  /** Đang quét (kích hoạt animation) */
  isScanning?: boolean
  /** Cảnh báo chất lượng ảnh */
  qualityWarning?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CameraOverlayGuide: React.FC<CameraOverlayGuideProps> = (_props) => {
  return <div data-testid="axq-110" />
}

CameraOverlayGuide.displayName = "CameraOverlayGuide"
