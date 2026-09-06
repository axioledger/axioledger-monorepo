/**
 * GasTrackerWidget — AXQ Design System
 * Inventory: #162 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * Live gas tracker widget — realtime gwei display.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/secondary → #8F9BB3 monospace (gwei value)
//           brand/teal     → #49DBC8 (live indicator dot)
//           type/caption   → 12px font-size
// spacing:  inline compact · height 24px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GasTrackerWidgetProps {
  /** Giá trị gwei hiện tại */
  gweiValue?: number
  /** Mạng blockchain, e.g. "Ethereum" */
  network?: string
  /** Đang fetch dữ liệu mới */
  isRefreshing?: boolean
  /** Callback khi tap để refresh */
  onRefresh?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const GasTrackerWidget: React.FC<GasTrackerWidgetProps> = (_props) => {
  return <div data-testid="axq-162" />
}

GasTrackerWidget.displayName = "GasTrackerWidget"
