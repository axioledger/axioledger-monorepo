/**
 * PINPad component — AXQ Design System
 *
 * 6-digit PIN input với numeric keypad 0–9 + delete.
 * Dots hiển thị thay vì số thực.
 * Shake animation khi lỗi.
 * Props: onComplete, onError, maxLength, disabled
 */

import React, { useState, useCallback, useEffect } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PINPadProps {
  /** Callback khi nhập đủ PIN. Nhận chuỗi PIN */
  onComplete: (pin: string) => void
  /** Callback khi có lỗi (vd: xác thực sai) */
  onError?: (message: string) => void
  /** Số chữ số. Mặc định: 6 */
  maxLength?: number
  /** Disable toàn bộ keypad */
  disabled?: boolean
  /** Trigger shake animation từ bên ngoài (khi PIN sai) */
  shake?: boolean
}

// ─── Layout keypad ────────────────────────────────────────────────────────────

const KEYPAD_LAYOUT = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "⌫"],
] as const

// ─── Component ────────────────────────────────────────────────────────────────

export const PINPad: React.FC<PINPadProps> = ({
  onComplete,
  onError,
  maxLength = 6,
  disabled  = false,
  shake     = false,
}) => {
  const [pin,      setPin]      = useState<string>("")
  const [shaking,  setShaking]  = useState(false)

  // Trigger shake từ prop bên ngoài
  useEffect(() => {
    if (shake) {
      setShaking(true)
      const t = setTimeout(() => setShaking(false), 500)
      return () => clearTimeout(t)
    }
  }, [shake])

  const handleKey = useCallback(
    (key: string) => {
      if (disabled) return

      if (key === "⌫") {
        setPin((prev) => prev.slice(0, -1))
        return
      }

      if (pin.length >= maxLength) return

      const next = pin + key
      setPin(next)

      if (next.length === maxLength) {
        onComplete(next)
        // Reset PIN sau khi gọi onComplete (delay nhỏ để UX mượt hơn)
        setTimeout(() => setPin(""), 300)
      }
    },
    [pin, maxLength, disabled, onComplete]
  )

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) handleKey(e.key)
      else if (e.key === "Backspace") handleKey("⌫")
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handleKey])

  return (
    <>
      <style>{`
        @keyframes axq-shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>

      <div
        role="application"
        aria-label="PIN pad"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}
      >
        {/* Dot indicators */}
        <div
          style={{
            display:   "flex",
            gap:       "16px",
            animation: shaking ? "axq-shake 0.5s ease" : "none",
          }}
          aria-live="polite"
          aria-label={`${pin.length} chữ số đã nhập`}
        >
          {Array.from({ length: maxLength }, (_, i) => (
            <div
              key={i}
              style={{
                width:        "14px",
                height:       "14px",
                borderRadius: "50%",
                background:   i < pin.length
                  ? "var(--color-brand-teal, #49DBC8)"
                  : "var(--border-default, #E8EAF0)",
                border:       `2px solid ${i < pin.length ? "var(--color-brand-teal, #49DBC8)" : "var(--border-default, #E8EAF0)"}`,
                transition:   "background 0.15s, border-color 0.15s",
              }}
            />
          ))}
        </div>

        {/* Numeric keypad */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(3, 72px)",
            gap:                 "12px",
          }}
        >
          {KEYPAD_LAYOUT.flat().map((key, idx) => {
            if (key === "") return <div key={idx} />

            const isDelete  = key === "⌫"
            const isDisabled = disabled || (key !== "⌫" && pin.length >= maxLength)

            return (
              <button
                key={idx}
                onClick={() => handleKey(key)}
                disabled={isDisabled}
                aria-label={isDelete ? "Xoá ký tự cuối" : key}
                style={{
                  width:        "72px",
                  height:       "72px",
                  borderRadius: "50%",
                  border:       "none",
                  background:   "var(--bg-secondary, #F4F5F8)",
                  color:        isDisabled ? "var(--text-disabled, #A3A9B5)" : "var(--text-primary, #101426)",
                  fontSize:     isDelete ? "22px" : "24px",
                  fontWeight:   600,
                  cursor:       isDisabled ? "not-allowed" : "pointer",
                  transition:   "background 0.1s, transform 0.1s",
                  fontFamily:   "inherit",
                  display:      "flex",
                  alignItems:   "center",
                  justifyContent: "center",
                }}
              >
                {key}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

PINPad.displayName = "PINPad"
