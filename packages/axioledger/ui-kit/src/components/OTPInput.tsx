/**
 * OTPInput — AXQ Design System
 * Inventory: #15 · Group 2 Inputs, Selectors & Controls · Phase 1–2 ⚡
 *
 * 4–6 cell OTP input grid with focus, filled, and error states.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    border/default → #E4E9F2 (cell default border)
//           border/focus → #0095FF (cell focused border)
//           border/strong → #8F9BB3 (cell filled border)
//           bg/secondary → #EDF1F7 (cell filled background)
//           text/primary → #101426 (digit text)
//           input/border-error → #FF3D71 (error state border)
// radius:   radius/md → 8px (each cell)
// spacing:  cell 48×48px · gap/sm (8px) between cells
// typography: type/h5 (24px) font-weight 600 (digits)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OTPInputProps {
  /** Số ô OTP. Mặc định: 6 */
  length?: number
  /** Callback khi nhập đủ OTP */
  onComplete: (otp: string) => void
  /** Kích hoạt shake animation và error border khi nhập sai */
  hasError?: boolean
  /** Tự động focus ô đầu tiên khi mount. Mặc định: false */
  autoFocus?: boolean
  /** Disable toàn bộ input */
  disabled?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const OTPInput: React.FC<OTPInputProps> = (_props) => {
  return <div data-testid="axq-15" />
}

OTPInput.displayName = "OTPInput"
