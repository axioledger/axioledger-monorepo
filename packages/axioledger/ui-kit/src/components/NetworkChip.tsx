/**
 * NetworkChip — AXQ Design System
 * Inventory: #52 · Group 4 Buttons, Badges & Chips · Phase 1–2 ⚡
 *
 * Blockchain network selector chip: ERC20 | TRC20 | BEP20 | Polygon | Solana
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    chip/bg → bg/secondary → #EDF1F7 (inactive)
//           chip/bg-active → bg/brand → #000000 (active)
//           chip/text → text/primary → #101426
//           chip/text-active → text/inverse → #FFFFFF
//           network brand dot: 4px, specific network color
// radius:   chip/radius → radius/full → 9999px
// spacing:  padding 8px 16px · gap/xs (4px) between dot and label
// typography: chip/font-size → type/body-sm (14px)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NetworkChipProps {
  /** Tên mạng hiển thị */
  network: string
  /** Trạng thái active. Mặc định: false */
  active?: boolean
  /** Callback khi nhấn */
  onClick?: () => void
  /** Màu dot đại diện mạng (hex) */
  networkColor?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NetworkChip: React.FC<NetworkChipProps> = (_props) => {
  return <button type="button" data-testid="axq-52" />
}

NetworkChip.displayName = "NetworkChip"
