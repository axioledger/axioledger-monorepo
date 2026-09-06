/**
 * DocumentTypeCard — AXQ Design System
 * Inventory: #109 · Group 10 eKYC & Verification · Phase 1–2 ⚡
 *
 * KYC document type selection card: CCCD | Passport | Driver's License.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    card/bg → surface/default → #FFFFFF
//           card/border → border/subtle → #EDF1F7 (default)
//           status/info-default → #0095FF (selected border, 2px)
//           brand/teal → #49DBC8 (personalcard.svg icon color)
//           text/primary → #101426 (title)
//           text/secondary → #2E3A59 (description)
// radius:   radius/card → radius/xl → 16px
// spacing:  card/padding (24px) · gap/md (12px) between icon and text
// typography: type/h6 (20px) font-weight 600 (title)
//             type/body-sm (14px) (description)
// icons:    personalcard.svg bold, 40px

// ─── Types ────────────────────────────────────────────────────────────────────

export type DocumentType = "nationalId" | "passport" | "driverLicense"

export interface DocumentTypeCardProps {
  /** Loại giấy tờ */
  type: DocumentType
  /** Tên hiển thị */
  title: string
  /** Mô tả ngắn */
  description?: string
  /** Callback khi chọn */
  onSelect: () => void
  /** Đang được chọn */
  selected?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DocumentTypeCard: React.FC<DocumentTypeCardProps> = (_props) => {
  return <button type="button" data-testid="axq-109" />
}

DocumentTypeCard.displayName = "DocumentTypeCard"
