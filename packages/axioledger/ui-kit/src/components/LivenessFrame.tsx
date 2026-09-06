/**
 * LivenessFrame — AXQ Design System
 * Group 10 eKYC & Verification
 *
 * Lớp phủ camera cho luồng eKYC liveness check.
 * Fail-visible: mọi lỗi getUserMedia đều render alert tường minh trên UI,
 * không bao giờ fail silently với màn hình trắng.
 */

import React, { useEffect, useRef, useState } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type LivenessStatus = "initializing" | "active" | "error"

export interface LivenessFrameProps {
  /** Tiêu đề hiển thị trên header (mặc định: "Xác minh khuôn mặt") */
  title?: string
  /** Callback khi trạng thái camera thay đổi */
  onStatusChange?: (status: LivenessStatus, errorMsg?: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const LivenessFrame: React.FC<LivenessFrameProps> = ({
  title = "Xác minh khuôn mặt",
  onStatusChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<LivenessStatus>("initializing")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setStatus("active")
        onStatusChange?.("active")
      } catch (err: unknown) {
        const name = err instanceof Error ? err.name : ""
        const msg =
          name === "NotAllowedError" || name === "SecurityError"
            ? "Quyền truy cập camera bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt."
            : "Không thể khởi tạo camera. Vui lòng kiểm tra lại thiết bị phần cứng."
        setStatus("error")
        setErrorMessage(msg)
        onStatusChange?.("error", msg)
      }
    }

    startCamera()

    return () => {
      // Giải phóng phần cứng camera khi unmount
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [onStatusChange])

  return (
    <section
      aria-labelledby="liveness-title"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        border: "4px solid var(--axq-border-primary, #101426)",
        boxShadow: "8px 8px 0 var(--axq-shadow-primary, #101426)",
        borderRadius: "var(--axq-radius-xl, 24px)",
        backgroundColor: "var(--axq-card-bg, #FFFFFF)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "16px",
          borderBottom: "4px solid var(--axq-border-primary, #101426)",
          backgroundColor: "var(--axq-brand-teal, #49DBC8)",
          textAlign: "center",
        }}
      >
        <h2
          id="liveness-title"
          style={{
            margin: 0,
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--axq-text-primary, #101426)",
          }}
        >
          {title}
        </h2>
      </header>

      {/* Camera area */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3/4",
          backgroundColor: "var(--axq-surface-muted, #E2E8F0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {status === "error" ? (
          /* Fail-visible error state */
          <div
            role="alert"
            style={{
              padding: "24px",
              textAlign: "center",
              color: "var(--axq-text-error, #FF3D71)",
            }}
          >
            <p style={{ fontWeight: 700, marginBottom: "8px" }}>⚠ Lỗi camera</p>
            <p style={{ fontSize: "0.875rem", fontWeight: 400, margin: 0 }}>{errorMessage}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              aria-label="Luồng video từ camera thiết bị"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: status === "active" ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            />
            {/* Oval mask overlay — focus vào khuôn mặt */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                boxShadow: "inset 0 0 0 60px rgba(16,20,38,0.65)",
                border: "3px solid var(--axq-brand-teal, #49DBC8)",
                borderRadius: "50%",
                transform: "scale(0.85)",
                pointerEvents: "none",
              }}
            />
          </>
        )}
      </div>
    </section>
  )
}

LivenessFrame.displayName = "LivenessFrame"
