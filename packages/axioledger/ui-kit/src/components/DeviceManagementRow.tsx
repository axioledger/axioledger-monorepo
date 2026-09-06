/**
 * DeviceManagementRow — AXQ Design System
 * Inventory: #77 · Group 6 Lists, Cells & Structure · Phase 3 🔵
 *
 * Device management row — Device name + Location + Logout button.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary        → #101426 (device name)
//           text/tertiary       → #8F9BB3 (location + last seen)
//           status/error-default → #FF3D71 (logout button text)
//           border/subtle       → #EDF1F7 (row bottom border)
// spacing:  inset/md (16px) horizontal · 14px vertical

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DeviceManagementRowProps {
  /** Tên thiết bị */
  deviceName: string
  /** Loại thiết bị, e.g. "iPhone 15 Pro" */
  deviceType?: string
  /** Vị trí địa lý, e.g. "Ho Chi Minh City, VN" */
  location?: string
  /** Thời gian đăng nhập lần cuối (ISO string) */
  lastSeen?: string
  /** Thiết bị hiện tại */
  isCurrent?: boolean
  /** Callback khi nhấn Logout */
  onLogout?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DeviceManagementRow: React.FC<DeviceManagementRowProps> = (_props) => {
  return <div data-testid="axq-77" />
}

DeviceManagementRow.displayName = "DeviceManagementRow"
