/**
 * TaxResidencyDeclaration — AXQ Design System
 * Inventory: #115 · Group 10 eKYC & Verification · Phase 3 🔵
 *
 * FATCA/CRS Tax Residency Declaration form box.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    card/bg        → #FFFFFF (container background)
//           text/primary   → #101426 (question text)
//           text/secondary → #8F9BB3 (instruction text)
//           border/default → #C5CEE0 (card border)
// radius:   radius/card (16px)
// spacing:  inset/lg (24px) padding · gap/md (12px) between fields
// Note: composes CheckboxStandard (#17) and TextInput (#10) internally

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TaxResidencyCountry {
  /** Quốc gia */
  country: string
  /** Mã số thuế (TIN) */
  taxId?: string
}

export interface TaxResidencyDeclarationProps {
  /** Danh sách quốc gia cư trú thuế */
  residencies?: TaxResidencyCountry[]
  /** Khai báo là US Person */
  isUSPerson?: boolean
  /** Callback khi dữ liệu thay đổi */
  onChange?: (data: { residencies: TaxResidencyCountry[]; isUSPerson: boolean }) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TaxResidencyDeclaration: React.FC<TaxResidencyDeclarationProps> = (_props) => {
  return <div data-testid="axq-115" />
}

TaxResidencyDeclaration.displayName = "TaxResidencyDeclaration"
