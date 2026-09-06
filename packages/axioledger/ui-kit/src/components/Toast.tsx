/**
 * Toast — AXQ Design System
 * Inventory: #86 · Group 8 Feedback, System States & Banners · Phase 1–2 ⚡
 */

import React, { useEffect } from "react"

export type ToastVariant = "default" | "success" | "warning" | "error" | "info"

export interface ToastProps {
  message: string
  variant?: ToastVariant
  duration?: number
  onDismiss?: () => void
  position?: "top" | "bottom"
  visible: boolean
}

const VARIANT_MAP: Record<ToastVariant, { bg: string; color: string; icon: string }> = {
  default: { bg: "var(--axq-bg-inverse, #101426)",           color: "var(--axq-text-inverse, #FFFFFF)",          icon: "ℹ" },
  success: { bg: "var(--axq-status-success-bg, #F0FFF5)",    color: "var(--axq-status-success-text, #00997A)",   icon: "✓" },
  warning: { bg: "var(--axq-status-warning-bg, #FFFDF2)",    color: "var(--axq-status-warning-text, #B86E00)",   icon: "⚠" },
  error:   { bg: "var(--axq-status-error-bg, #FFF2F2)",      color: "var(--axq-status-error-text, #B81D5B)",     icon: "✕" },
  info:    { bg: "var(--axq-status-info-bg, #F2F8FF)",       color: "var(--axq-status-info-text, #0057C2)",      icon: "ℹ" },
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = "default",
  duration = 3000,
  onDismiss,
  position = "top",
  visible,
}) => {
  useEffect(() => {
    if (!visible || duration <= 0) return
    const t = setTimeout(() => onDismiss?.(), duration)
    return () => clearTimeout(t)
  }, [visible, duration, onDismiss])

  if (!visible) return null

  const { bg, color, icon } = VARIANT_MAP[variant]

  return (
    <>
      <style>{`@keyframes axq-toast-in{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        onClick={onDismiss}
        style={{
          position: "fixed",
          [position]: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9000,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "16px 20px",
          maxWidth: "calc(100vw - 48px)",
          width: "max-content",
          backgroundColor: bg,
          color,
          borderRadius: "var(--axq-radius-2xl, 24px)",
          fontSize: "1rem",
          fontWeight: 500,
          cursor: onDismiss ? "pointer" : "default",
          animation: "axq-toast-in 0.2s ease",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          whiteSpace: "nowrap",
        }}
      >
        <span aria-hidden="true" style={{ fontSize: "1.125rem", lineHeight: 1 }}>{icon}</span>
        <span>{message}</span>
      </div>
    </>
  )
}

Toast.displayName = "Toast"
