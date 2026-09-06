/**
 * TermsCheckboxContainer — AXQ Design System
 * Inventory: #156 · Group 15 Miscellaneous & Specialized · Phase 1–2 ⚡
 *
 * Scrollable Terms & Conditions container with checkbox at bottom.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/sunken → bg/secondary → #EDF1F7 (scroll area bg)
//           text/primary → #101426 (body text)
//           text/link → #0057C2 (T&C hyperlinks)
//           status/info-default → #0095FF (checkbox checked state)
//           border/default → #E4E9F2 (checkbox unchecked border)
// radius:   radius/card → radius/xl → 16px (scroll container)
//           radius/sm → 4px (checkbox)
// spacing:  inset/md (16px) scroll area padding · gap/md (12px) between scroll and checkbox
// typography: type/body-sm (14px) T&C text · type/body (16px) checkbox label

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TermsCheckboxContainerProps {
  /** Nội dung Terms & Conditions (text hoặc ReactNode) */
  content: React.ReactNode
  /** Trạng thái checkbox đồng ý */
  agreed: boolean
  /** Callback khi toggle checkbox */
  onToggleAgreed: (value: boolean) => void
  /** Label checkbox. Mặc định: "I agree to the Terms & Conditions" */
  checkboxLabel?: string
  /** Chiều cao vùng scroll (px). Mặc định: 200 */
  scrollHeight?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TermsCheckboxContainer: React.FC<TermsCheckboxContainerProps> = (_props) => {
  return <div data-testid="axq-156" />
}

TermsCheckboxContainer.displayName = "TermsCheckboxContainer"
