/**
 * ModalSuccess — AXQ Design System
 * Inventory: #59 · Group 5 Modals, Drawers & Popups · Phase 1–2 ⚡
 *
 * Full-screen success modal — transaction confirmed, action completed.
 * Khóa body.overflow khi mở, animation slide-up từ dưới lên.
 */

import React, { useEffect } from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// overlay:  rgba(16,20,38,0.7) (bg/primary at 70%)
// surface:  surface/default (#FFFFFF) · radius/card (16px)
// icon bg:  status/success-light (#E3FFF5) · icon → #00997A
// title:    text/primary (#101426) · weight 700 · 1.25rem
// message:  text/secondary (#8F9BB3) · 0.875rem
// cta:      bg brand/teal (#49DBC8) · border #101426 · Neubrutal shadow

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModalSuccessProps {
  /** Hiển thị / ẩn modal */
  isOpen: boolean
  /** Callback khi đóng overlay (click ngoài hoặc nút đóng) */
  onClose?: () => void
  /** Tiêu đề */
  title?: string
  /** Nội dung mô tả */
  message?: string
  /** Nhãn nút CTA */
  ctaLabel?: string
  /** Callback khi nhấn CTA */
  onCta?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ModalSuccess: React.FC<ModalSuccessProps> = ({
  isOpen,
  onClose,
  title = "Giao dịch thành công!",
  message = "Giao dịch của bạn đã được xác nhận trên mạng lưới.",
  ctaLabel = "Về trang chủ",
  onCta,
}) => {
  // Khóa scroll body khi modal mở
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  if (!isOpen) return null

  const handleCta = () => {
    onCta?.()
    onClose?.()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-success-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        backgroundColor: "rgba(16,20,38,0.7)",
        padding: "0 0 0 0",
        /* slide-up animation */
        animation: "axq-fade-in 0.2s ease",
      }}
    >
      {/* Inline keyframe — không cần CSS file riêng */}
      <style>{`@keyframes axq-fade-in{from{opacity:0}to{opacity:1}}@keyframes axq-slide-up{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "var(--axq-surface-default, #FFFFFF)",
          borderRadius: "var(--axq-radius-card, 16px) var(--axq-radius-card, 16px) 0 0",
          padding: "32px 24px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          animation: "axq-slide-up 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Success icon */}
        <div
          aria-hidden="true"
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "var(--axq-status-success-light, #E3FFF5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
          }}
        >
          ✓
        </div>

        {/* Title */}
        <h2
          id="modal-success-title"
          style={{
            margin: 0,
            fontSize: "1.25rem",
            fontWeight: 700,
            textAlign: "center",
            color: "var(--axq-text-primary, #101426)",
          }}
        >
          {title}
        </h2>

        {/* Message */}
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            lineHeight: 1.6,
            textAlign: "center",
            color: "var(--axq-text-secondary, #8F9BB3)",
          }}
        >
          {message}
        </p>

        {/* CTA */}
        <button
          type="button"
          onClick={handleCta}
          style={{
            width: "100%",
            marginTop: "8px",
            padding: "16px 24px",
            fontSize: "1rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            color: "var(--axq-text-primary, #101426)",
            backgroundColor: "var(--axq-brand-teal, #49DBC8)",
            border: "3px solid var(--axq-text-primary, #101426)",
            borderRadius: "var(--axq-radius-card, 16px)",
            boxShadow: "4px 4px 0 var(--axq-text-primary, #101426)",
            transition: "transform 0.1s ease, box-shadow 0.1s ease",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "translate(4px,4px)"
            e.currentTarget.style.boxShadow = "none"
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = ""
            e.currentTarget.style.boxShadow = "4px 4px 0 var(--axq-text-primary, #101426)"
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}

ModalSuccess.displayName = "ModalSuccess"
