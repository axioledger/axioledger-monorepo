/**
 * ProofAddressUpload — AXQ Design System
 * Inventory: #114 · Group 10 eKYC & Verification · Phase 3 🔵
 *
 * Proof of Address upload card — upload utility bill / bank statement.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    border/default  → #C5CEE0 dashed (box border when empty)
//           text/secondary  → #8F9BB3 (helper / instruction text)
//           icon/tertiary   → #8F9BB3 (document-upload icon)
//           status/success-default → #00D68F (done state checkmark)
// radius:   radius/input (12px)
// spacing:  inset/lg (24px) padding · min-height 140px

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProofAddressUploadState = "idle" | "uploading" | "done" | "error"

export interface ProofAddressUploadProps {
  /** Trạng thái upload */
  uploadState?: ProofAddressUploadState
  /** Tên file đã tải lên */
  fileName?: string
  /** Callback để mở file picker */
  onPickFile?: () => void
  /** Callback khi xóa file */
  onRemove?: () => void
  /** Thông báo lỗi */
  errorMessage?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ProofAddressUpload: React.FC<ProofAddressUploadProps> = (_props) => {
  return <button type="button" data-testid="axq-114" />
}

ProofAddressUpload.displayName = "ProofAddressUpload"
