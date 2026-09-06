/**
 * SlippageToleranceSetting — AXQ Design System
 * Inventory: #118 · Group 11 Crypto & Web3 Specific · Phase 3 🔵
 *
 * Slippage tolerance setting — 0.1% / 0.5% / 1% / Custom.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    chip/bg        → #EDF1F7 (inactive chip)
//           chip/bg-active → #000000 (active chip)
//           text/inverse   → #FFFFFF (active chip text)
//           chip/text      → #101426 (inactive chip text)
//           input/border   → #C5CEE0 (custom input border)
// radius:   radius/full (9999px) on preset chips · radius/input (12px) custom input

// ─── Types ────────────────────────────────────────────────────────────────────

export type SlippagePreset = "0.1" | "0.5" | "1.0"

export interface SlippageToleranceSettingProps {
  /** Giá trị đang chọn (string, e.g. "0.5" hoặc custom) */
  value?: string
  /** Callback khi giá trị thay đổi */
  onValueChange?: (value: string) => void
  /** Preset đang active */
  activePreset?: SlippagePreset
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SlippageToleranceSetting: React.FC<SlippageToleranceSettingProps> = (_props) => {
  return <div data-testid="axq-118" />
}

SlippageToleranceSetting.displayName = "SlippageToleranceSetting"
