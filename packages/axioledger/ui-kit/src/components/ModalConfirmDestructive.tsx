/**
 * ModalConfirmDestructive — AXQ Design System
 * Inventory: #61 · Group 5 Modals, Drawers & Popups · Phase 1–2 ⚡
 */

import React, { useEffect } from "react"

export interface ModalConfirmDestructiveProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}

export const ModalConfirmDestructive: React.FC<ModalConfirmDestructiveProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Huỷ",
}) => {
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="modal-destructive-title"
      aria-describedby="modal-destructive-msg"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(16,20,38,0.6)", padding: "24px",
      }}
    >
      <style>{`@keyframes axq-modal-pop{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}`}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "400px",
          backgroundColor: "var(--axq-surface-default, #FFFFFF)",
          borderRadius: "var(--axq-radius-2xl, 24px)",
          padding: "32px 24px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
          animation: "axq-modal-pop 0.2s ease",
        }}
      >
        <div aria-hidden="true" style={{
          width: "64px", height: "64px", borderRadius: "50%",
          backgroundColor: "var(--axq-status-error-bg, #FFF2F2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.75rem",
        }}>⚠</div>

        <h2 id="modal-destructive-title" style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, textAlign: "center", color: "var(--axq-text-primary, #101426)" }}>
          {title}
        </h2>
        <p id="modal-destructive-msg" style={{ margin: 0, fontSize: "1rem", lineHeight: 1.6, textAlign: "center", color: "var(--axq-text-secondary, #2E3A59)" }}>
          {message}
        </p>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
          <button type="button" onClick={() => { onConfirm(); onClose(); }} style={{
            padding: "14px", fontSize: "1rem", fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
            color: "var(--axq-status-error-default, #FF3D71)",
            backgroundColor: "var(--axq-status-error-bg, #FFF2F2)",
            border: "2px solid var(--axq-status-error-default, #FF3D71)",
            borderRadius: "var(--axq-radius-2xl, 24px)",
          }}>{confirmLabel}</button>
          <button type="button" onClick={onClose} style={{
            padding: "14px", fontSize: "1rem", fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
            color: "var(--axq-text-primary, #101426)",
            backgroundColor: "transparent",
            border: "2px solid var(--axq-border-default, #E4E9F2)",
            borderRadius: "var(--axq-radius-2xl, 24px)",
          }}>{cancelLabel}</button>
        </div>
      </div>
    </div>
  )
}

ModalConfirmDestructive.displayName = "ModalConfirmDestructive"
