/**
 * Input component — AXQ Design System
 *
 * Types: text | password | number | search
 * States: error, success, disabled
 * Props: label, helperText, errorMessage, leftAddon, rightAddon
 * Supports controlled and uncontrolled mode.
 */

import React, {
  useState,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type ChangeEvent,
} from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type InputType   = "text" | "password" | "number" | "search"
export type InputState  = "default" | "error" | "success" | "disabled"

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Loại input */
  type?: InputType
  /** Label hiển thị phía trên input */
  label?: string
  /** Văn bản gợi ý bên dưới input */
  helperText?: string
  /** Thông báo lỗi (ghi đè helperText, chuyển state thành error) */
  errorMessage?: string
  /** Trạng thái validation thành công */
  success?: boolean
  /** Addon hiển thị bên trái (icon hoặc text) */
  leftAddon?: ReactNode
  /** Addon hiển thị bên phải (icon hoặc text) */
  rightAddon?: ReactNode
  /** Callback khi giá trị thay đổi (trả về string thay vì event) */
  onValueChange?: (value: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type           = "text",
      label,
      helperText,
      errorMessage,
      success        = false,
      leftAddon,
      rightAddon,
      disabled       = false,
      onValueChange,
      onChange,
      style,
      ...rest
    },
    ref
  ) => {
    const id = useId()
    const hasError = !!errorMessage

    // input/border-error → status/error-default → #FF3D71  (DESIGN_SYSTEM.md §Input)
    // input/border (success implied) → status/success-default → #00D68F
    // input/border default → border/default → #E4E9F2
    const borderColor = hasError
      ? "#FF3D71"
      : success
      ? "#00D68F"
      : "var(--axq-border-default, #E4E9F2)"

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onValueChange?.(e.target.value)
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {label && (
          <label
            htmlFor={rest.id ?? id}
            style={{
              fontSize:   "14px",
              fontWeight: 500,
              // input/label → text/secondary → #2E3A59 ; disabled → text/disabled → #C5CEE0
              color:      disabled ? "var(--axq-text-disabled, #C5CEE0)" : "var(--axq-text-secondary, #2E3A59)",
            }}
          >
            {label}
          </label>
        )}

        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          {leftAddon && (
            <span style={addonStyle("left")}>{leftAddon}</span>
          )}

          <input
            ref={ref}
            id={rest.id ?? id}
            type={type}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            onChange={handleChange}
            style={{
              width:        "100%",
              padding:      `10px ${rightAddon ? "40px" : "14px"} 10px ${leftAddon ? "40px" : "14px"}`,
              border:       `1px solid ${borderColor}`,
              // input/radius → radius/input → radius/lg → 12px  (DESIGN_SYSTEM.md §Input)
              borderRadius: "12px",
              // type/body → 16px  (DESIGN_SYSTEM.md §Typography)
              fontSize:     "16px",
              // input/bg → surface/default → #FFFFFF ; input/bg-disabled → bg/disabled → #E4E9F2
              background:   disabled ? "var(--axq-bg-disabled, #E4E9F2)" : "var(--axq-surface-default, #FFFFFF)",
              // input/text → text/primary → #101426 ; input/text-disabled → text/disabled → #C5CEE0
              color:        disabled ? "var(--axq-text-disabled, #C5CEE0)" : "var(--axq-text-primary, #101426)",
              outline:      "none",
              fontFamily:   "inherit",
              cursor:       disabled ? "not-allowed" : "text",
              ...style,
            }}
            {...rest}
          />

          {rightAddon && (
            <span style={addonStyle("right")}>{rightAddon}</span>
          )}
        </div>

        {hasError && (
          <p
            id={`${id}-error`}
            role="alert"
            // input/error-text → status/error-text → #B81D5B  (DESIGN_SYSTEM.md §Input)
            style={{ fontSize: "12px", color: "var(--axq-status-error-text, #B81D5B)", margin: 0 }}
          >
            {errorMessage}
          </p>
        )}

        {!hasError && helperText && (
          <p
            id={`${id}-helper`}
            // input/helper-text → text/tertiary → #8F9BB3  (DESIGN_SYSTEM.md §Input)
            style={{ fontSize: "12px", color: "var(--axq-text-tertiary, #8F9BB3)", margin: 0 }}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

// ─── Helper ───────────────────────────────────────────────────────────────────

function addonStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position:  "absolute",
    [side]:    "12px",
    top:       "50%",
    transform: "translateY(-50%)",
    color:     "var(--text-secondary, #5A6070)",
    display:   "flex",
    alignItems: "center",
    pointerEvents: "none",
  }
}
