/**
 * TopNavBar — AXQ Design System
 * Inventory: #2 · Group 1 Navigation & Bars · Phase 1–2 ⚡
 */

import React from "react"

export type TopNavBarVariant = "standard" | "search" | "avatar" | "cryptoDetail"

export interface TopNavBarProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  actionIcon?: React.ReactNode
  onAction?: () => void
  variant?: TopNavBarVariant
  avatarUrl?: string
  greeting?: string
  ticker?: string
  isFavorite?: boolean
  onToggleFavorite?: () => void
  onShare?: () => void
}

const NAV_HEIGHT = 56

export const TopNavBar: React.FC<TopNavBarProps> = ({
  title,
  showBack = false,
  onBack,
  actionIcon,
  onAction,
  variant = "standard",
  avatarUrl,
  greeting,
  ticker,
  isFavorite = false,
  onToggleFavorite,
  onShare,
}) => {
  const base: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    height: NAV_HEIGHT,
    padding: "0 var(--axq-spacing-inset-md, 16px)",
    backgroundColor: "var(--axq-surface-default, #FFFFFF)",
    borderBottom: "1px solid var(--axq-border-subtle, #EDF1F7)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  }
  const iconBtn: React.CSSProperties = {
    background: "none", border: "none", cursor: "pointer", padding: "8px",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--axq-icon-primary, #101426)", fontSize: "1.25rem",
    borderRadius: "var(--axq-radius-full, 9999px)",
    flexShrink: 0,
  }

  /* ── avatar variant ── */
  if (variant === "avatar") {
    return (
      <nav style={base} aria-label="Top navigation">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" width={36} height={36} style={{ borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <div aria-hidden="true" style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "var(--axq-bg-secondary, #EDF1F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>👤</div>
          )}
          {greeting && <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--axq-text-primary, #101426)" }}>{greeting}</span>}
        </div>
        {actionIcon && <button type="button" style={iconBtn} onClick={onAction} aria-label="Action">{actionIcon}</button>}
      </nav>
    )
  }

  /* ── cryptoDetail variant ── */
  if (variant === "cryptoDetail") {
    return (
      <nav style={base} aria-label="Top navigation">
        {showBack && <button type="button" style={iconBtn} onClick={onBack} aria-label="Quay lại">←</button>}
        <span style={{ flex: 1, textAlign: "center", fontSize: "1.125rem", fontWeight: 600, color: "var(--axq-text-primary, #101426)" }}>
          {ticker ?? title}
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          {onToggleFavorite && (
            <button type="button" style={iconBtn} onClick={onToggleFavorite} aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}>
              {isFavorite ? "★" : "☆"}
            </button>
          )}
          {onShare && <button type="button" style={iconBtn} onClick={onShare} aria-label="Chia sẻ">⬆</button>}
        </div>
      </nav>
    )
  }

  /* ── standard / search ── */
  return (
    <nav style={base} aria-label="Top navigation">
      {showBack ? (
        <button type="button" style={iconBtn} onClick={onBack} aria-label="Quay lại">←</button>
      ) : (
        <div style={{ width: 40 }} aria-hidden="true" />
      )}
      <span style={{ flex: 1, textAlign: "center", fontSize: "1.125rem", fontWeight: 600, color: "var(--axq-text-primary, #101426)" }}>
        {title}
      </span>
      {actionIcon ? (
        <button type="button" style={iconBtn} onClick={onAction} aria-label="Action">{actionIcon}</button>
      ) : (
        <div style={{ width: 40 }} aria-hidden="true" />
      )}
    </nav>
  )
}

TopNavBar.displayName = "TopNavBar"
