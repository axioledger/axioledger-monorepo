/**
 * TransactionItem — AXQ Design System
 * Inventory: #70–72 · Group 6 Lists, Cells & Structure · Phase 1–2 ⚡
 *
 * Transaction list row for: pending | refund | cryptoBuy | cryptoSell | debit | credit
 */

import React from "react"
import { StatusBadge } from "./StatusBadge.js"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color (by type):
//   credit/refund:   amount → status/success-text (#00997A)
//   cryptoSell/debit:amount → status/error-text  (#B81D5B)
//   pending:         badge/warning-*
// color common: text/primary → #101426 (title)
//               text/secondary → #2E3A59 (subtitle)
//               text/tertiary → #8F9BB3 (timestamp)
//               border/subtle → #EDF1F7 (bottom separator)
// radius:   radius/full → 9999px (icon container 40×40)
// spacing:  inset/md (16px) horizontal · 12px vertical · gap/md (12px)
// typography: tabular-nums pada amount (font-variant-numeric: tabular-nums)

// ─── Types ────────────────────────────────────────────────────────────────────

export type TransactionType =
  | "pending"
  | "refund"
  | "cryptoBuy"
  | "cryptoSell"
  | "debit"
  | "credit"

export type TransactionStatus = "pending" | "completed" | "failed"

export interface TransactionItemProps {
  type: TransactionType
  title: string
  subtitle: string
  /** Số tiền đã format, bao gồm ký hiệu "+"/"-" */
  amount: string
  timestamp: string
  /** Icon tùy chỉnh (40×40) */
  icon?: React.ReactNode
  status?: TransactionStatus
  onClick?: () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_ICON: Record<TransactionType, string> = {
  pending:    "⏳",
  refund:     "↩",
  cryptoBuy:  "↓",
  cryptoSell: "↑",
  debit:      "−",
  credit:     "+",
}

function amountColor(type: TransactionType): string {
  if (type === "credit" || type === "refund" || type === "cryptoBuy")
    return "var(--axq-status-success-text, #00997A)"
  if (type === "cryptoSell" || type === "debit")
    return "var(--axq-status-error-text, #B81D5B)"
  return "var(--axq-text-primary, #101426)"
}

function statusToBadge(s: TransactionStatus): "success" | "pending" | "error" {
  if (s === "completed") return "success"
  if (s === "failed")    return "error"
  return "pending"
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TransactionItem: React.FC<TransactionItemProps> = ({
  type,
  title,
  subtitle,
  amount,
  timestamp,
  icon,
  status,
  onClick,
}) => {
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
      {/* Icon container */}
      <div
        aria-hidden="true"
        style={{
          width: "40px",
          height: "40px",
          flexShrink: 0,
          borderRadius: "var(--axq-radius-full, 9999px)",
          backgroundColor: "var(--axq-surface-muted, #F7F9FC)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.125rem",
        }}
      >
        {icon ?? TYPE_ICON[type]}
      </div>

      {/* Left text */}
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
          {title}
        </span>
        <span style={{ fontSize: "0.875rem", color: "var(--axq-text-secondary, #2E3A59)" }}>
          {subtitle}
        </span>
      </div>

      {/* Right: amount + timestamp + badge */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            color: amountColor(type),
          }}
        >
          {amount}
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--axq-text-tertiary, #8F9BB3)" }}>
          {timestamp}
        </span>
        {status && (
          <StatusBadge variant={statusToBadge(status)} size="sm" />
        )}
      </div>
    </button>
  )
}

TransactionItem.displayName = "TransactionItem"
