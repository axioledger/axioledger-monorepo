/**
 * SystemHealthDots — AXQ Design System
 * Inventory: #201 · Group 15 Miscellaneous & Specialized · Phase 3 🔵
 *
 * System health status indicator dots — Server / Network / API.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/success-default → #00D68F (operational dot)
//           status/warning-default → #FFAA00 (degraded dot)
//           status/error-default   → #FF3D71 (outage dot)
//           text/caption           → 12px (service label)
//           text/tertiary          → #8F9BB3 (labels)
// spacing:  dot 8×8px · gap/xs (4px) between dot and label · gap/md (12px) between services

// ─── Types ────────────────────────────────────────────────────────────────────

export type ServiceStatus = "operational" | "degraded" | "outage"

export interface ServiceHealthItem {
  /** Tên dịch vụ */
  name: string
  /** Trạng thái */
  status: ServiceStatus
}

export interface SystemHealthDotsProps {
  /** Danh sách dịch vụ */
  services?: ServiceHealthItem[]
  /** Layout: inline (row) hoặc stack (column). Mặc định: "inline" */
  layout?: "inline" | "stack"
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SystemHealthDots: React.FC<SystemHealthDotsProps> = (_props) => {
  return <div data-testid="axq-201" />
}

SystemHealthDots.displayName = "SystemHealthDots"
