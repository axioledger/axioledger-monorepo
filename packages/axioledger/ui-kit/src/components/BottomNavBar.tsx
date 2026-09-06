/**
 * BottomNavBar — AXQ Design System
 * Inventory: Group 1 Navigation & Bars · Phase 1–2 ⚡
 *
 * 5-tab navigation bar — Home · Crypto · Card · Cashback · More
 * Confirmed layout from Profile.png (COMPONENT_INVENTORY.md §1)
 *
 * Token chain (DESIGN_SYSTEM.md §Navbar):
 *   navbar/bg            → surface/default → #FFFFFF
 *   navbar/border-top    → border/subtle   → #EDF1F7  (1px top border)
 *   navbar/height        → 64px
 *   navbar/icon-active   → #000000  (bg/brand → black)
 *   navbar/icon-inactive → #8F9BB3  (icon/secondary → greyscale/400)
 *   navbar/label-active  → #101426  (text/primary → greyscale/900)
 *   navbar/label-inactive→ #8F9BB3  (text/tertiary → greyscale/400)
 *   type/caption → 12px/500 (tab labels)
 *
 * Accessibility:
 *   - <nav> with aria-label
 *   - Each tab is a <button> with aria-current="page" when active
 *   - Badge notification count exposed via aria-label
 */

import React from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type NavTabKey = "home" | "crypto" | "card" | "cashback" | "more"

export interface NavTab {
  /** Unique key cho tab */
  key: NavTabKey
  /** Label hiển thị dưới icon */
  label: string
  /** Bold SVG icon — dùng khi tab active */
  iconBold: React.ReactNode
  /** Linear SVG icon — dùng khi tab inactive */
  iconLinear: React.ReactNode
  /** Số thông báo (1–99). Hiển thị badge đỏ khi > 0 */
  badge?: number
}

export interface BottomNavBarProps {
  /** Tab đang được chọn */
  activeTab: NavTabKey
  /** Callback khi người dùng đổi tab */
  onTabChange: (tab: NavTabKey) => void
  /**
   * Custom tab definitions.
   * Khi không truyền, dùng DEFAULT_TABS với inline SVG icons.
   */
  tabs?: NavTab[]
  /** Override style của container ngoài cùng */
  style?: React.CSSProperties
}

// ─── Default Icons (inline SVG, 22×22, strokeWidth 1.8) ─────────────────────

const Icons = {
  HomeBold: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
      <path d="M9 21V12h6v9" fill="white"/>
    </svg>
  ),
  HomeLinear: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  ),
  CryptoBold: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="9"/>
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">₿</text>
    </svg>
  ),
  CryptoLinear: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9"/>
      <path d="M9 8h4a2.5 2.5 0 0 1 0 5H9m0-5v8m0-8v-1m0 9v1m4-5h1.5a2.5 2.5 0 0 1 0 5H9"/>
    </svg>
  ),
  CardBold: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="3"/>
      <rect x="2" y="9" width="20" height="3" fill="white" opacity="0.4"/>
      <rect x="5" y="15" width="4" height="2" rx="1" fill="white" opacity="0.7"/>
    </svg>
  ),
  CardLinear: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="3"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
      <line x1="6" y1="15" x2="9" y2="15"/>
    </svg>
  ),
  CashbackBold: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
    </svg>
  ),
  CashbackLinear: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
    </svg>
  ),
  MoreBold: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5"  cy="12" r="2.2"/>
      <circle cx="12" cy="12" r="2.2"/>
      <circle cx="19" cy="12" r="2.2"/>
    </svg>
  ),
  MoreLinear: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="5"  cy="12" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  ),
}

// ─── Default Tabs ─────────────────────────────────────────────────────────────

const DEFAULT_TABS: NavTab[] = [
  { key: "home",     label: "Home",     iconBold: <Icons.HomeBold />,     iconLinear: <Icons.HomeLinear />     },
  { key: "crypto",   label: "Crypto",   iconBold: <Icons.CryptoBold />,   iconLinear: <Icons.CryptoLinear />   },
  { key: "card",     label: "Card",     iconBold: <Icons.CardBold />,     iconLinear: <Icons.CardLinear />     },
  { key: "cashback", label: "Cashback", iconBold: <Icons.CashbackBold />, iconLinear: <Icons.CashbackLinear /> },
  { key: "more",     label: "More",     iconBold: <Icons.MoreBold />,     iconLinear: <Icons.MoreLinear />     },
]

// ─── Component ────────────────────────────────────────────────────────────────

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  tabs = DEFAULT_TABS,
  style,
}) => {
  return (
    <nav
      aria-label="Main navigation"
      style={{
        display:         "flex",
        alignItems:      "stretch",
        // navbar/bg → surface/default → #FFFFFF
        background:      "var(--axq-surface-default, #FFFFFF)",
        // navbar/border-top → border/subtle → #EDF1F7
        borderTop:       "1px solid var(--axq-border-default, #EDF1F7)",
        // navbar/height → 64px (includes safe area env padding)
        height:          "64px",
        paddingBottom:   "env(safe-area-inset-bottom, 0px)",
        width:           "100%",
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab

        return (
          <button
            key={tab.key}
            type="button"
            aria-label={
              tab.badge && tab.badge > 0
                ? `${tab.label}, ${tab.badge} notification${tab.badge > 1 ? "s" : ""}`
                : tab.label
            }
            aria-current={isActive ? "page" : undefined}
            onClick={() => onTabChange(tab.key)}
            style={{
              flex:           1,
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "3px",
              background:     "transparent",
              border:         "none",
              cursor:         "pointer",
              padding:        "8px 4px 0",
              position:       "relative",
              // Prevent flash of button default outline
              outline:        "none",
              // navbar/icon-active → #000  |  navbar/icon-inactive → #8F9BB3
              color:          isActive
                ? "var(--axq-primitive-black, #000000)"
                : "var(--axq-primitive-grey-400, #8F9BB3)",
              transition:     "color 0.15s",
            }}
          >
            {/* Icon */}
            <span
              aria-hidden="true"
              style={{
                position:   "relative",
                display:    "flex",
                alignItems: "center",
              }}
            >
              {isActive ? tab.iconBold : tab.iconLinear}

              {/* Notification badge — only when badge > 0 */}
              {tab.badge && tab.badge > 0 ? (
                <span
                  aria-hidden="true"
                  style={{
                    position:     "absolute",
                    top:          "-4px",
                    right:        "-6px",
                    minWidth:     "16px",
                    height:       "16px",
                    borderRadius: "9999px",
                    // status/error → #FF3D71
                    background:   "var(--axq-primitive-status-error, #FF3D71)",
                    color:        "#FFFFFF",
                    fontSize:     "9px",
                    fontWeight:   700,
                    display:      "flex",
                    alignItems:   "center",
                    justifyContent: "center",
                    padding:      "0 3px",
                    lineHeight:   1,
                    // badge outline — stops bleeding on dark cards
                    outline:      "2px solid var(--axq-surface-default, #FFFFFF)",
                  }}
                >
                  {tab.badge > 99 ? "99+" : tab.badge}
                </span>
              ) : null}
            </span>

            {/* Label: type/caption → 12px/500 */}
            <span
              style={{
                fontSize:   "var(--axq-font-size-caption, 12px)",
                fontWeight: isActive ? 600 : 500,
                lineHeight: 1,
                // navbar/label-active → text/primary  |  navbar/label-inactive → text/tertiary
                color:      isActive
                  ? "var(--axq-text-primary, #101426)"
                  : "var(--axq-text-secondary, #8F9BB3)",
                transition: "color 0.15s",
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

BottomNavBar.displayName = "BottomNavBar"
