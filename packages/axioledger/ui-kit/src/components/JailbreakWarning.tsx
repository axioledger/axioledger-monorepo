/**
 * JailbreakWarning — AXQ Design System
 * Inventory: #176 · Group 15 Miscellaneous & Specialized · Phase 1–2 ⚡
 *
 * Non-dismissible full-screen security block — jailbreak / root detection.
 * Render trực tiếp lên DOM khi phát hiện thiết bị bị compromise.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    bg/primary            → #101426 (full-screen overlay)
//           brand/orange          → #FC7339 (card border + icon tint)
//           text/primary          → #FFFFFF  (title on dark bg)
//           text/secondary        → #8F9BB3  (message body)
//           surface/card          → #1A2035  (card surface)
// radius:   radius/card (16px)
// spacing:  inset/lg (24px)
// shadow:   8px 8px 0 brand/orange (Neubrutal card lift)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JailbreakWarningProps {
  /** Hiển thị / ẩn overlay */
  isVisible: boolean
  /** Tiêu đề cảnh báo */
  title?: string
  /** Nội dung mô tả rủi ro */
  message?: string
  /** Nút xác nhận rủi ro — gọi callback nếu cần ghi log */
  onAcknowledge?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const JailbreakWarning: React.FC<JailbreakWarningProps> = ({
  isVisible,
  title = "Thiết bị không an toàn",
  message = "Thiết bị của bạn đã bị jailbreak hoặc root. Ứng dụng không thể hoạt động an toàn trên thiết bị này. Khóa bí mật của bạn có thể bị lộ.",
  onAcknowledge,
}) => {
  if (!isVisible) return null

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="jailbreak-title"
      aria-describedby="jailbreak-msg"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "var(--axq-bg-primary, #101426)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--axq-spacing-inset-lg, 24px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "var(--axq-surface-card, #1A2035)",
          border: "4px solid var(--axq-brand-orange, #FC7339)",
          borderRadius: "var(--axq-radius-card, 16px)",
          boxShadow: "8px 8px 0 var(--axq-brand-orange, #FC7339)",
          padding: "var(--axq-spacing-inset-lg, 24px)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Icon */}
        <div aria-hidden="true" style={{ fontSize: "2.5rem", textAlign: "center" }}>
          🔒
        </div>

        {/* Title */}
        <h2
          id="jailbreak-title"
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--axq-brand-orange, #FC7339)",
          }}
        >
          {title}
        </h2>

        {/* Message */}
        <p
          id="jailbreak-msg"
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: "var(--axq-text-secondary, #8F9BB3)",
          }}
        >
          {message}
        </p>

        {/* Acknowledge button */}
        {onAcknowledge && (
          <button
            type="button"
            onClick={onAcknowledge}
            style={{
              marginTop: "4px",
              padding: "14px 24px",
              fontSize: "0.9375rem",
              fontWeight: 700,
              cursor: "pointer",
              color: "var(--axq-bg-primary, #101426)",
              backgroundColor: "var(--axq-brand-orange, #FC7339)",
              border: "3px solid var(--axq-bg-primary, #101426)",
              borderRadius: "var(--axq-radius-card, 16px)",
              boxShadow: "4px 4px 0 var(--axq-bg-primary, #101426)",
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
            }}
            onMouseDown={(e) => {
              const el = e.currentTarget
              el.style.transform = "translate(4px,4px)"
              el.style.boxShadow = "none"
            }}
            onMouseUp={(e) => {
              const el = e.currentTarget
              el.style.transform = ""
              el.style.boxShadow = "4px 4px 0 var(--axq-bg-primary, #101426)"
            }}
          >
            Tôi hiểu rủi ro, tiếp tục
          </button>
        )}
      </div>
    </div>
  )
}

JailbreakWarning.displayName = "JailbreakWarning"
