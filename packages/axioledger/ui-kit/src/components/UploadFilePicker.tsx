/**
 * UploadFilePicker — AXQ Design System
 * Inventory: #23 · Group 2 Inputs, Selectors & Controls · Phase 3 🔵
 *
 * File / image picker box with Default, Uploading, and Done states.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    border/default  → #C5CEE0 dashed (default box border)
//           text/tertiary   → #8F9BB3 (helper text)
//           icon/tertiary   → #8F9BB3 (upload icon)
//           status/info-bg  → #F2F8FF (uploading tint)
//           status/success-default → #00D68F (done checkmark)
// radius:   radius/input (12px) on container
// spacing:  inset/lg (24px) inner padding · min-height 120px

// ─── Types ────────────────────────────────────────────────────────────────────

export type UploadState = "default" | "uploading" | "done" | "error"

export interface UploadFilePickerProps {
  /** Trạng thái upload hiện tại. Mặc định: "default" */
  uploadState?: UploadState
  /** Tên file đã chọn */
  fileName?: string
  /** Tiến trình upload (0–1) khi uploadState="uploading" */
  progress?: number
  /** Callback khi người dùng nhấn để chọn file */
  onPick?: () => void
  /** Các loại file được chấp nhận, e.g. ["image/*", "application/pdf"] */
  accept?: string[]
  /** Dung lượng tối đa (bytes) */
  maxSize?: number
  /** Thông báo lỗi */
  errorMessage?: string
  /** Text hướng dẫn */
  helperText?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const UploadFilePicker: React.FC<UploadFilePickerProps> = (_props) => {
  return <button type="button" data-testid="axq-23" />
}

UploadFilePicker.displayName = "UploadFilePicker"
