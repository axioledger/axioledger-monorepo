/**
 * PopoverMenu — AXQ Design System
 * Inventory: #65 · Group 5 Modals, Drawers & Popups · Phase 3 🔵
 *
 * Popover overflow menu — triggered by 3-dot button.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    surface/raised → #FFFFFF (menu background)
//           border/subtle  → #EDF1F7 (menu border + row dividers)
//           text/primary   → #101426 (menu item labels)
//           status/error-default → #FF3D71 (destructive item)
// radius:   radius/md (8px)
// spacing:  inset/sm (8px) vertical · inset/md (16px) horizontal per item · min-width 160px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PopoverMenuItem {
  /** Unique key */
  key: string
  /** Label text */
  label: string
  /** Icon (ReactNode) */
  icon?: React.ReactNode
  /** Destructive action (red text) */
  destructive?: boolean
  /** Callback khi nhấn item */
  onClick?: () => void
}

export interface PopoverMenuProps {
  /** Danh sách menu items */
  items: PopoverMenuItem[]
  /** Menu đang hiển thị */
  visible?: boolean
  /** Callback để đóng menu */
  onDismiss?: () => void
  /** Anchor element (ReactNode) để tính toán vị trí */
  anchor?: React.ReactNode
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PopoverMenu: React.FC<PopoverMenuProps> = (_props) => {
  return <div data-testid="axq-65" />
}

PopoverMenu.displayName = "PopoverMenu"
