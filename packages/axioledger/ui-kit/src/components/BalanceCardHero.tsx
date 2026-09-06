/**
 * BalanceCardHero — AXQ Design System
 * Inventory: #24 · Group 3 Data Display & Visual Cards · Phase 1–2 ⚡
 *
 * Hero balance card: balance display + hide toggle + quick action row.
 *
 * Token chain (DESIGN_SYSTEM.md §Card, §Button):
 *   card/bg           → surface/default → #FFFFFF
 *   card/border       → border/subtle   → #EDF1F7
 *   card/radius       → radius/xl       → 16px
 *   card/padding      → inset/lg        → 24px
 *   text/primary      → greyscale/900   → #101426  (balance value)
 *   text/secondary    → greyscale/500   → #2E3A59  (label)
 *   text/tertiary     → greyscale/400   → #8F9BB3  (hidden placeholder)
 *   bg/brand          → black           → #000000  (action icon circle bg)
 *   icon/inverse      → white           → #FFFFFF  (action icons)
 *   type/h2           → 60px / 700      (balance display, large)
 *   type/body-sm      → 14px / 400      (label, currency hint)
 *   type/caption      → 12px / 500      (quick action label)
 */

import React, { useState } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuickAction {
  /** Nhãn hành động (Top up / Transfer / Payments …) */
  label: string
  /** Icon ReactNode, 20×20px */
  icon: React.ReactNode
  /** Callback khi nhấn */
  onClick: () => void
}

export interface BalanceCardHeroProps {
  /**
   * Số dư đã format (ví dụ: "2,500.70").
   * Component tự thêm ký hiệu tiền tệ.
   */
  balance: string
  /**
   * Phần thập phân để hiển thị nhỏ hơn bên phải (ví dụ: "70" → "$2,500.70").
   * Nếu balance đã chứa dấu chấm thì để trống.
   */
  balanceDecimal?: string
  /** Ký hiệu tiền tệ. Mặc định: "$" */
  currencySymbol?: string
  /**
   * Ẩn số dư thay bằng "••••••".
   * Khi undefined, component tự quản lý trạng thái nội bộ.
   */
  isHidden?: boolean
  /** Callback khi người dùng nhấn toggle ẩn/hiện */
  onToggleHide?: () => void
  /** Danh sách quick actions. Tối đa 4. */
  quickActions?: QuickAction[]
  /** Override style container ngoài cùng */
  style?: React.CSSProperties
}

// ─── Eye Icons (inline SVG — không phụ thuộc thư viện ngoài) ─────────────────

const EyeIcon = ({ hidden }: { hidden: boolean }) =>
  hidden ? (
    // eye-slash: balance is currently hidden, click to reveal
    <svg
      width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    // eye: balance is visible, click to hide
    <svg
      width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )

// ─── Component ────────────────────────────────────────────────────────────────

export const BalanceCardHero = React.forwardRef<HTMLDivElement, BalanceCardHeroProps>(
  (
    {
      balance,
      balanceDecimal,
      currencySymbol = "$",
      isHidden: isHiddenProp,
      onToggleHide,
      quickActions = [],
      style,
    },
    ref
  ) => {
    // Support both controlled (isHidden prop) and uncontrolled modes
    const [internalHidden, setInternalHidden] = useState(false)
    const isControlled = isHiddenProp !== undefined
    const isHidden = isControlled ? isHiddenProp : internalHidden

    const handleToggle = () => {
      if (!isControlled) setInternalHidden((h) => !h)
      onToggleHide?.()
    }

    // Cap quick actions at 4 to preserve layout
    const actions = quickActions.slice(0, 4)

    return (
      <div
        ref={ref}
        // card/bg → surface/default; card/radius → 16px; card/border → #EDF1F7
        style={{
          background:   "var(--axq-surface-default, #FFFFFF)",
          borderRadius: "var(--axq-radius-xl, 16px)",
          border:       "1px solid var(--axq-border-default, #EDF1F7)",
          padding:      "24px",
          display:      "flex",
          flexDirection:"column",
          gap:          "24px",
          ...style,
        }}
      >
        {/* ── Balance Row ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {/* Label */}
          <span
            // text/secondary → #2E3A59; type/body-sm → 14px
            style={{
              fontSize:   "var(--axq-font-size-body-sm, 14px)",
              fontWeight: "var(--axq-font-weight-regular, 400)" as React.CSSProperties["fontWeight"],
              color:      "var(--axq-text-secondary, #2E3A59)",
              lineHeight: 1.4,
            }}
          >
            Total Balance
          </span>

          {/* Balance amount + toggle button */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isHidden ? (
              // Hidden: show bullet placeholder
              <span
                aria-label="Balance hidden"
                // text/tertiary → #8F9BB3; type/h2 → 60px/700
                style={{
                  fontSize:   "clamp(36px, 8vw, 60px)",
                  fontWeight: 700,
                  color:      "var(--axq-text-primary, #101426)",
                  letterSpacing: "-1px",
                  lineHeight: 1.1,
                  userSelect: "none",
                }}
              >
                {currencySymbol}••••••
              </span>
            ) : (
              // Visible: split integer + decimal for different sizing
              <span
                aria-label={`Balance: ${currencySymbol}${balance}${balanceDecimal ? "." + balanceDecimal : ""}`}
                style={{
                  fontSize:   "clamp(36px, 8vw, 60px)",
                  fontWeight: 700,
                  // text/primary → #101426
                  color:      "var(--axq-text-primary, #101426)",
                  letterSpacing: "-1px",
                  lineHeight: 1.1,
                  userSelect: "none",
                }}
              >
                {currencySymbol}{balance}
                {balanceDecimal && (
                  <sup
                    style={{
                      fontSize:      "0.45em",
                      verticalAlign: "super",
                      fontWeight:    600,
                      letterSpacing: "0",
                      // text/secondary for decimal
                      color:         "var(--axq-text-secondary, #2E3A59)",
                    }}
                  >
                    .{balanceDecimal}
                  </sup>
                )}
              </span>
            )}

            {/* Eye toggle button */}
            <button
              type="button"
              onClick={handleToggle}
              aria-label={isHidden ? "Show balance" : "Hide balance"}
              aria-pressed={isHidden}
              style={{
                background:  "transparent",
                border:      "none",
                padding:     "4px",
                cursor:      "pointer",
                // icon/secondary → #2E3A59
                color:       "var(--axq-text-secondary, #2E3A59)",
                display:     "flex",
                alignItems:  "center",
                borderRadius:"4px",
                flexShrink:  0,
                transition:  "opacity 0.15s",
              }}
            >
              <EyeIcon hidden={isHidden} />
            </button>
          </div>
        </div>

        {/* ── Quick Actions Row ── */}
        {actions.length > 0 && (
          <div
            role="group"
            aria-label="Quick actions"
            style={{
              display:       "flex",
              gap:           "8px",
              justifyContent: actions.length >= 4 ? "space-between" : "flex-start",
            }}
          >
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                aria-label={action.label}
                style={{
                  display:        "flex",
                  flexDirection:  "column",
                  alignItems:     "center",
                  gap:            "8px",
                  background:     "transparent",
                  border:         "none",
                  cursor:         "pointer",
                  padding:        0,
                  flex:           actions.length >= 4 ? 1 : "none",
                  minWidth:       "56px",
                }}
              >
                {/* Action icon circle: bg/brand → #000 · icon/inverse → #FFF */}
                <span
                  aria-hidden="true"
                  style={{
                    width:        "48px",
                    height:       "48px",
                    borderRadius: "50%",
                    background:   "var(--axq-primitive-black, #000000)",
                    color:        "var(--axq-text-inverse, #FFFFFF)",
                    display:      "flex",
                    alignItems:   "center",
                    justifyContent:"center",
                    flexShrink:   0,
                    transition:   "transform 0.12s",
                  }}
                >
                  {action.icon}
                </span>
                {/* Action label: type/caption → 12px/500 · text/secondary */}
                <span
                  style={{
                    fontSize:   "var(--axq-font-size-caption, 12px)",
                    fontWeight: "var(--axq-font-weight-medium, 500)" as React.CSSProperties["fontWeight"],
                    color:      "var(--axq-text-secondary, #2E3A59)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)

BalanceCardHero.displayName = "BalanceCardHero"
