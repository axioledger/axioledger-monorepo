/**
 * DevicePermissionCard — AXQ Design System
 * Inventory: #108 · Group 9 Onboarding, Auth & Security · Phase 1–2 ⚡
 *
 * Device permission request card: Camera | Notification | Location | Contacts.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    card/bg → surface/default → #FFFFFF
//           card/border → border/subtle → #EDF1F7
//           brand/teal → #49DBC8 (permission type icon, 48px)
//           text/primary → #101426 (title)
//           text/secondary → #2E3A59 (description)
//           button/primary-bg → #000000 (Allow button)
//           text/inverse → #FFFFFF (Allow label)
//           text/link → #0057C2 (Skip text button)
// radius:   radius/card → radius/xl → 16px · button/radius → 24px
// spacing:  card/padding (24px) · gap/xl (24px) between sections
// typography: type/h5 (24px) font-weight 600 (title) · type/body (16px) description

// ─── Types ────────────────────────────────────────────────────────────────────

export type PermissionType = "camera" | "notification" | "location" | "contacts"

export interface DevicePermissionCardProps {
  /** Loại quyền cần yêu cầu */
  permissionType: PermissionType
  /** Tiêu đề */
  title: string
  /** Mô tả */
  description: string
  /** Callback khi cho phép */
  onAllow: () => void
  /** Callback khi bỏ qua (tuỳ chọn) */
  onSkip?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DevicePermissionCard: React.FC<DevicePermissionCardProps> = (_props) => {
  return <div data-testid="axq-108" />
}

DevicePermissionCard.displayName = "DevicePermissionCard"
