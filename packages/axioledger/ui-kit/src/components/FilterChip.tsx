/**
 * FilterChip — AXQ Design System
 * Inventory: #51 · Group 4 Buttons, Badges & Chips · Phase 1–2 ⚡
 *
 * Pill-shaped filter chip — inactive / active toggle.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// active:   bg → brand/teal (#49DBC8) · border → #101426 · text → #101426
// inactive: bg → surface/default (#FFFFFF) · border → border/default (#C5CEE0) · text → text/secondary (#8F9BB3)
// disabled: opacity 0.4
// radius:   radius/full (9999px)
// spacing:  8px 16px (vertical/horizontal padding)
// typography: type/body-sm (14px) · weight 600

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterChipProps {
  /** Nhãn hiển thị */
  label: string
  /** Trạng thái đang chọn */
  active?: boolean
  /** Callback khi toggle */
  onToggle?: (active: boolean) => void
  /** Vô hiệu hóa chip */
  disabled?: boolean
  /** Icon SVG tùy chọn hiển thị bên trái nhãn */
  icon?: React.ReactNode
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  active = false,
  onToggle,
  disabled = false,
  icon,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onToggle?.(!active)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 16px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        fontFamily: "inherit",
        fontSize: "0.875rem",
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: "nowrap",
        borderRadius: "var(--axq-radius-full, 9999px)",
        border: `2px solid ${active
          ? "var(--axq-bg-primary, #101426)"
          : "var(--axq-border-default, #C5CEE0)"}`,
        backgroundColor: active
          ? "var(--axq-brand-teal, #49DBC8)"
          : "var(--axq-surface-default, #FFFFFF)",
        color: active
          ? "var(--axq-text-primary, #101426)"
          : "var(--axq-text-secondary, #8F9BB3)",
        transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",
      }}
    >
      {icon && (
        <span aria-hidden="true" style={{ display: "flex", alignItems: "center", width: "14px", height: "14px" }}>
          {icon}
        </span>
      )}
      {label}
    </button>
  )
}

FilterChip.displayName = "FilterChip"
