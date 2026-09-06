/**
 * GasFeeSpeedSelector — AXQ Design System
 * Inventory: #119 · Group 11 Crypto & Web3 Specific · Phase 3 🔵
 *
 * Gas fee speed selector — Slow / Market / Fast.
 * Dùng <fieldset>/<input type="radio"> ẩn để đảm bảo WCAG 2.1 AA:
 * - Screen reader đọc đúng role="radiogroup"
 * - Điều hướng bàn phím native (phím mũi tên)
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    card/bg              → #FFFFFF (option card bg)
//           border/default       → #C5CEE0 (inactive option border)
//           status/info-default  → #0095FF (selected option border + bg tint)
//           text/primary         → #101426
//           text/secondary       → #8F9BB3 (ETA + gwei label)
// radius:   radius/card (16px)
// spacing:  inset/md (16px) · gap/sm (8px)

// ─── Types ────────────────────────────────────────────────────────────────────

export type GasSpeed = "slow" | "market" | "fast"

export interface GasFeeOption {
  /** Tốc độ */
  speed: GasSpeed
  /** Phí ước tính (formatted, e.g. "$0.42") */
  estimatedFee?: string
  /** Thời gian ước tính, e.g. "~3 min" */
  estimatedTime?: string
  /** Gwei value */
  gwei?: number
}

export interface GasFeeSpeedSelectorProps {
  /** Danh sách options */
  options?: GasFeeOption[]
  /** Tốc độ đang chọn. Mặc định: "market" */
  selected?: GasSpeed
  /** Callback khi chọn */
  onSelect?: (speed: GasSpeed) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SPEED_META: Record<GasSpeed, { label: string; icon: string }> = {
  slow:   { label: "Chậm",       icon: "🐢" },
  market: { label: "Thị trường", icon: "⚡" },
  fast:   { label: "Nhanh",      icon: "🚀" },
}

const DEFAULT_OPTIONS: GasFeeOption[] = [
  { speed: "slow",   estimatedFee: undefined, estimatedTime: undefined, gwei: undefined },
  { speed: "market", estimatedFee: undefined, estimatedTime: undefined, gwei: undefined },
  { speed: "fast",   estimatedFee: undefined, estimatedTime: undefined, gwei: undefined },
]

// ─── Component ────────────────────────────────────────────────────────────────

export const GasFeeSpeedSelector: React.FC<GasFeeSpeedSelectorProps> = ({
  options = DEFAULT_OPTIONS,
  selected = "market",
  onSelect,
}) => {
  return (
    <fieldset
      style={{
        border: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <legend
        style={{
          marginBottom: "8px",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--axq-text-secondary, #8F9BB3)",
        }}
      >
        Tốc độ giao dịch (Gas Fee)
      </legend>

      {options.map((opt) => {
        const isSelected = selected === opt.speed
        const meta = SPEED_META[opt.speed]

        return (
          <label
            key={opt.speed}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              cursor: "pointer",
              backgroundColor: isSelected
                ? "var(--axq-status-info-light, #EBF5FF)"
                : "var(--axq-card-bg, #FFFFFF)",
              border: `2px solid ${isSelected
                ? "var(--axq-status-info-default, #0095FF)"
                : "var(--axq-border-default, #C5CEE0)"}`,
              borderRadius: "var(--axq-radius-card, 16px)",
              transition: "border-color 0.15s ease, background-color 0.15s ease",
            }}
          >
            {/* Native radio — ẩn bằng clip, giữ nguyên cho a11y */}
            <input
              type="radio"
              name="axq-gas-speed"
              value={opt.speed}
              checked={isSelected}
              onChange={() => onSelect?.(opt.speed)}
              style={{
                position: "absolute",
                opacity: 0,
                width: 1,
                height: 1,
                margin: -1,
                overflow: "hidden",
                clip: "rect(0,0,0,0)",
                whiteSpace: "nowrap",
              }}
            />

            {/* Left: icon + label + ETA */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span aria-hidden="true" style={{ fontSize: "1.25rem", lineHeight: 1 }}>
                {meta.icon}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "var(--axq-text-primary, #101426)",
                  }}
                >
                  {meta.label}
                </span>
                {opt.estimatedTime && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--axq-text-secondary, #8F9BB3)",
                    }}
                  >
                    {opt.estimatedTime}
                  </span>
                )}
              </div>
            </div>

            {/* Right: fee + gwei */}
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "2px" }}>
              {opt.estimatedFee && (
                <span
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "var(--axq-text-primary, #101426)",
                  }}
                >
                  {opt.estimatedFee}
                </span>
              )}
              {opt.gwei !== undefined && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--axq-text-secondary, #8F9BB3)",
                  }}
                >
                  {opt.gwei} Gwei
                </span>
              )}
            </div>
          </label>
        )
      })}
    </fieldset>
  )
}

GasFeeSpeedSelector.displayName = "GasFeeSpeedSelector"
