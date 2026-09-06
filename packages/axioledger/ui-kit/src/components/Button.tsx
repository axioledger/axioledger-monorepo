/**
 * Button component — AXQ Design System
 *
 * Variants: primary | secondary | ghost | destructive
 * Sizes: sm | md | lg
 * States: loading (spinner), disabled, fullWidth
 * Supports leftIcon, rightIcon, accessible aria attributes.
 */

import React, { type ButtonHTMLAttributes, type ReactNode } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive"
export type ButtonSize    = "sm" | "md" | "lg"

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Nội dung hiển thị trong button */
  children: ReactNode
  /** Kiểu hiển thị. Mặc định: "primary" */
  variant?: ButtonVariant
  /** Kích thước button. Mặc định: "md" */
  size?: ButtonSize
  /** Hiển thị spinner và disable tương tác khi đang loading */
  loading?: boolean
  /** Mở rộng 100% chiều rộng container */
  fullWidth?: boolean
  /** Icon bên trái label */
  leftIcon?: ReactNode
  /** Icon bên phải label */
  rightIcon?: ReactNode
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  // button/primary-bg → bg/brand → #000000  (DESIGN_SYSTEM.md §Button Fill Colors)
  primary: {
    background: "var(--axq-bg-brand, #000000)",
    color:      "var(--axq-text-inverse, #FFFFFF)",
    border:     "none",
  },
  // button/ghost-bg + button/ghost-border  (DESIGN_SYSTEM.md §Button Text & Border)
  secondary: {
    background: "transparent",
    color:      "var(--axq-text-primary, #101426)",
    border:     "1px solid var(--axq-border-default, #E4E9F2)",
  },
  ghost: {
    background: "transparent",
    color:      "var(--axq-text-primary, #101426)",
    border:     "none",
  },
  // button/filled/bg/error → status/error → #FF3D71  (DESIGN_SYSTEM.md §Button Fill Colors)
  destructive: {
    background: "var(--axq-status-error, #FF3D71)",
    color:      "var(--axq-text-inverse, #FFFFFF)",
    border:     "none",
  },
}

// button/radius → radius/button → radius/2xl → 24px  (DESIGN_SYSTEM.md §Button Layout)
const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "6px 14px",  fontSize: "12px", borderRadius: "24px", gap: "6px"  },
  md: { padding: "8px 16px",  fontSize: "16px", borderRadius: "24px", gap: "8px"  },
  lg: { padding: "14px 77px", fontSize: "16px", borderRadius: "24px", gap: "8px"  },
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner = () => (
  <span
    aria-hidden="true"
    style={{
      display:     "inline-block",
      width:       "14px",
      height:      "14px",
      border:      "2px solid currentColor",
      borderTopColor: "transparent",
      borderRadius:   "50%",
      animation:   "axq-spin 0.6s linear infinite",
    }}
  />
)

// ─── Component ────────────────────────────────────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant   = "primary",
      size      = "md",
      loading   = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      style,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    const computedStyle: React.CSSProperties = {
      display:        "inline-flex",
      alignItems:     "center",
      justifyContent: "center",
      fontFamily:     "inherit",
      fontWeight:     600,
      cursor:         isDisabled ? "not-allowed" : "pointer",
      opacity:        isDisabled ? 0.5 : 1,
      transition:     "opacity 0.15s, transform 0.1s",
      width:          fullWidth ? "100%" : undefined,
      whiteSpace:     "nowrap",
      userSelect:     "none",
      ...VARIANT_STYLES[variant],
      ...SIZE_STYLES[size],
      ...style,
    }

    return (
      <>
        {/* Keyframe injection — happens once, harmless in SSR */}
        <style>{`@keyframes axq-spin { to { transform: rotate(360deg); } }`}</style>
        <button
          ref={ref}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          aria-busy={loading}
          style={computedStyle}
          {...rest}
        >
          {loading ? <Spinner /> : leftIcon}
          {children}
          {!loading && rightIcon}
        </button>
      </>
    )
  }
)

Button.displayName = "Button"
