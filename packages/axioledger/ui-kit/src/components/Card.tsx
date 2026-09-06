/**
 * Card component — AXQ Design System
 *
 * Variants: default | elevated | outlined | glass
 * Sub-components: Card.Header, Card.Body, Card.Footer
 * Props: header, footer, padding, onClick (clickable card)
 */

import React, { type HTMLAttributes, type ReactNode } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type CardVariant = "default" | "elevated" | "outlined" | "glass"
export type CardPadding = "none" | "sm" | "md" | "lg"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Kiểu hiển thị card. Mặc định: "default" */
  variant?: CardVariant
  /** Khoảng đệm bên trong. Mặc định: "md" */
  padding?: CardPadding
  /** Nội dung header của card */
  header?: ReactNode
  /** Nội dung footer của card */
  footer?: ReactNode
  children?: ReactNode
  /** Khi có onClick, card sẽ có cursor pointer và hover effect */
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<CardVariant, React.CSSProperties> = {
  default: {
    background: "var(--bg-secondary, #F4F5F8)",
    border:     "1px solid var(--border-default, #E8EAF0)",
    boxShadow:  "none",
  },
  elevated: {
    background: "var(--surface-raised, #ffffff)",
    border:     "none",
    boxShadow:  "0 4px 16px rgba(16,20,38,0.08)",
  },
  outlined: {
    background: "transparent",
    border:     "1px solid var(--border-default, #E8EAF0)",
    boxShadow:  "none",
  },
  glass: {
    background: "rgba(255,255,255,0.06)",
    border:     "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    boxShadow:  "0 4px 24px rgba(0,0,0,0.15)",
  },
}

const PADDING_VALUES: Record<CardPadding, string> = {
  none: "0",
  sm:   "12px",
  md:   "20px",
  lg:   "28px",
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant  = "default",
      padding  = "md",
      header,
      footer,
      children,
      onClick,
      style,
      ...rest
    },
    ref
  ) => {
    const isClickable = !!onClick

    return (
      <div
        ref={ref}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={isClickable ? (e) => { if (e.key === "Enter" || e.key === " ") onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>) } : undefined}
        style={{
          borderRadius: "var(--radius-xl, 12px)",
          overflow:     "hidden",
          cursor:       isClickable ? "pointer" : "default",
          transition:   "transform 0.15s, box-shadow 0.15s",
          ...VARIANT_STYLES[variant],
          ...style,
        }}
        {...rest}
      >
        {header && (
          <div style={{ padding: PADDING_VALUES[padding], borderBottom: "1px solid var(--border-default, #E8EAF0)" }}>
            {header}
          </div>
        )}
        <div style={{ padding: PADDING_VALUES[padding] }}>
          {children}
        </div>
        {footer && (
          <div style={{ padding: PADDING_VALUES[padding], borderTop: "1px solid var(--border-default, #E8EAF0)" }}>
            {footer}
          </div>
        )}
      </div>
    )
  }
)

Card.displayName = "Card"

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Header độc lập — dùng trong Card.Header */
const CardHeader = ({ children, style, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div style={{ fontWeight: 600, fontSize: "17px", ...style }} {...rest}>
    {children}
  </div>
)
CardHeader.displayName = "Card.Header"

const CardBody = ({ children, style, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div style={{ fontSize: "15px", lineHeight: 1.6, ...style }} {...rest}>
    {children}
  </div>
)
CardBody.displayName = "Card.Body"

const CardFooter = ({ children, style, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", ...style }} {...rest}>
    {children}
  </div>
)
CardFooter.displayName = "Card.Footer"

// Gắn sub-components vào Card
const CardWithSubs = Object.assign(Card, {
  Header: CardHeader,
  Body:   CardBody,
  Footer: CardFooter,
})

export { CardWithSubs as CardComposite }
