/**
 * BottomSheetNetworkSelect — AXQ Design System
 * Inventory: #58 · Group 5 Modals, Drawers & Popups · Phase 1–2 ⚡
 *
 * Blockchain network selection list inside a bottom sheet.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/default → #FFFFFF (sheet bg)
//           text/primary → #101426 (network name)
//           border/subtle → #EDF1F7 (row separators)
//           status/info-default → #0095FF (selected radio dot)
//           modal/overlay → rgba(16,20,38,0.6)
// radius:   radius/3xl → 32px (top corners)
// spacing:  modal/padding (32px) · inset/md (16px) per row · gap/md (12px)
// typography: type/body (16px) network name

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NetworkSelectOption {
  /** Уникальный ID мережі */
  id: string
  /** Назва мережі */
  name: string
  /** Icon мережі */
  icon?: React.ReactNode
}

export interface BottomSheetNetworkSelectProps {
  /** Trạng thái hiển thị */
  isOpen: boolean
  /** Callback đóng sheet */
  onClose: () => void
  /** Danh sách mạng */
  networks: NetworkSelectOption[]
  /** ID mạng đang được chọn */
  selectedNetworkId?: string
  /** Callback khi chọn mạng */
  onSelect: (networkId: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BottomSheetNetworkSelect: React.FC<BottomSheetNetworkSelectProps> = (_props) => {
  return <div data-testid="axq-58" />
}

BottomSheetNetworkSelect.displayName = "BottomSheetNetworkSelect"
