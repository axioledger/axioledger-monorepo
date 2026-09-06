/**
 * SegmentedControlBar — AXQ Design System
 * Inventory: #11 · Group 1 Navigation & Bars · Phase 1–2 ⚡
 */

import React from "react"

export interface SegmentedControlBarProps {
  options?: string[]
  selected: string
  onSelect: (option: string) => void
}

const DEFAULT_OPTIONS = ["1D", "1W", "1M", "1Y", "ALL"]

export const SegmentedControlBar: React.FC<SegmentedControlBarProps> = ({
  options = DEFAULT_OPTIONS,
  selected,
  onSelect,
}) => (
  <div
    role="tablist"
    style={{
      display: "flex",
      gap: "4px",
      padding: "4px",
      backgroundColor: "var(--axq-bg-secondary, #EDF1F7)",
      borderRadius: "var(--axq-radius-full, 9999px)",
    }}
  >
    {options.map((opt) => {
      const isActive = opt === selected
      return (
        <button
          key={opt}
          role="tab"
          type="button"
          aria-selected={isActive}
          onClick={() => onSelect(opt)}
          style={{
            flex: 1,
            padding: "8px 12px",
            fontSize: "0.875rem",
            fontWeight: isActive ? 700 : 500,
            fontFamily: "inherit",
            cursor: "pointer",
            border: "none",
            borderRadius: "var(--axq-radius-full, 9999px)",
            backgroundColor: isActive ? "var(--axq-bg-brand, #000000)" : "transparent",
            color: isActive ? "var(--axq-text-inverse, #FFFFFF)" : "var(--axq-text-primary, #101426)",
            transition: "background-color 0.15s ease, color 0.15s ease",
          }}
        >
          {opt}
        </button>
      )
    })}
  </div>
)

SegmentedControlBar.displayName = "SegmentedControlBar"
