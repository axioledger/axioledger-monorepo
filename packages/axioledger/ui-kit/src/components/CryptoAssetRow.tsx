/**
 * CryptoAssetRow — AXQ Design System
 * Inventory: #28 · Group 3 Data Display & Visual Cards · Phase 1–2 ⚡
 *
 * Crypto asset list row: Icon + Name + Ticker + Price + 24h% + Balance.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    text/primary → #101426 (name, price, balance)
//           text/secondary → #2E3A59 (ticker symbol)
//           status/success-text → #00997A (positive 24h%)
//           status/error-text → #B81D5B (negative 24h%)
//           border/subtle → #EDF1F7 (bottom separator)
// radius:   radius/full → 9999px (token icon container 40×40)
// spacing:  inset/md (16px) horizontal · 12px vertical · gap/md (12px)
// typography: tabular-nums (price, balance)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CryptoAssetRowProps {
  /** Icon token (ReactNode, 40×40px circle) */
  icon: React.ReactNode
  /** Tên token, ví dụ: "Bitcoin" */
  name: string
  /** Ký hiệu, ví dụ: "BTC" */
  ticker: string
  /** Giá hiện tại đã format, ví dụ: "$43,210.00" */
  price: string
  /** Thay đổi 24h đã format, ví dụ: "+3.9%" */
  change24h: string
  /** Chiều của thay đổi */
  changeTrend: "up" | "down"
  /** Số dư người dùng đã format */
  balance?: string
  /** Callback khi nhấn */
  onClick?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CryptoAssetRow: React.FC<CryptoAssetRowProps> = ({
  icon,
  name,
  ticker,
  price,
  change24h,
  changeTrend,
  balance,
  onClick,
}) => {
  const changeColor = changeTrend === "up"
    ? "var(--axq-status-success-text, #00997A)"
    : "var(--axq-status-error-text, #B81D5B)"

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        width: "100%",
        padding: "12px 16px",
        textAlign: "left",
        cursor: onClick ? "pointer" : "default",
        background: "none",
        border: "none",
        borderBottom: "1px solid var(--axq-border-subtle, #EDF1F7)",
        fontFamily: "inherit",
      }}
    >
      {/* Token icon */}
      <div
        aria-hidden="true"
        style={{
          width: "40px",
          height: "40px",
          flexShrink: 0,
          borderRadius: "var(--axq-radius-full, 9999px)",
          overflow: "hidden",
          backgroundColor: "var(--axq-surface-muted, #F7F9FC)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>

      {/* Name + ticker */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--axq-text-primary, #101426)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--axq-text-secondary, #2E3A59)" }}>
            {ticker}
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
              color: changeColor,
            }}
          >
            {change24h}
          </span>
        </div>
      </div>

      {/* Price + balance */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px", flexShrink: 0 }}>
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            color: "var(--axq-text-primary, #101426)",
          }}
        >
          {price}
        </span>
        {balance && (
          <span
            style={{
              fontSize: "0.875rem",
              fontVariantNumeric: "tabular-nums",
              color: "var(--axq-text-secondary, #2E3A59)",
            }}
          >
            {balance}
          </span>
        )}
      </div>
    </button>
  )
}

CryptoAssetRow.displayName = "CryptoAssetRow"
