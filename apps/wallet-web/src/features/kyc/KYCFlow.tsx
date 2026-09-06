/**
 * KYCFlow — eKYC Orchestrator Component
 *
 * Người gác cổng (Gatekeeper) điều phối toàn bộ giao diện luồng eKYC.
 * Đọc trạng thái từ useKYCStore và render đúng một màn hình cho mỗi state.
 *
 * Nguyên tắc thiết kế:
 *   - KHÔNG chứa bất kỳ logic nghiệp vụ hay lời gọi SDK nào.
 *   - Mọi side effect ZK-proof chạy qua useDIDVerifier (Sprint sau) và
 *     giao tiếp ngược lại qua registerDIDSuccess() / failProof().
 *   - useEffect giám sát chuyển trạng thái sang PROOF_GENERATING là điểm
 *     tích hợp duy nhất — được đánh dấu rõ ràng bằng comment.
 */

import React, { useEffect } from "react"
import { Button }      from "@axioledger/ui-kit"
import { LivenessFrame } from "@axioledger/ui-kit"
import { ModalError }  from "@axioledger/ui-kit"
import { Spinner }     from "@axioledger/ui-kit"
import type { LivenessStatus } from "@axioledger/ui-kit"
import { useKYCStore } from "./useKYCStore.js"
import { useDIDVerifier } from "./useDIDVerifier.js"

// ─── Props ────────────────────────────────────────────────────────────────────

export interface KYCFlowProps {
  /** Gọi khi luồng hoàn tất (state = COMPLETED) để điều hướng về WalletDashboard */
  onComplete: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KYCFlow({ onComplete }: KYCFlowProps): React.JSX.Element {
  const {
    currentState,
    livenessScore,
    errorMessage,
    // actions
    requestCamera,
    onCameraReady,
    startProofGeneration,
    registerDIDSuccess,
    failProof,
    completeFATCA,
    reset,
  } = useKYCStore()

  // ── Tích hợp useDIDVerifier — Ranh giới SDK duy nhất trong KYCFlow ────────
  //
  // Actions của store được truyền xuống làm callbacks —
  // đảm bảo hook nhận đúng instance store này, không tạo instance mới.
  const { generateDID } = useDIDVerifier({
    onSuccess: registerDIDSuccess,
    onError:   failProof,
  })

  // Khi state chuyển sang PROOF_GENERATING, kích hoạt pipeline ZK-proof.
  // livenessScore (từ store) được encode thành string để làm biometric payload.
  // Phase 2: thay bằng frame bytes thực từ canvas của LivenessFrame.
  useEffect(() => {
    if (currentState === "PROOF_GENERATING") {
      const payload = livenessScore !== null
        ? String(livenessScore)
        : "liveness-payload-stub"
      void generateDID(payload)
    }
  }, [currentState, livenessScore, generateDID])
  // ──────────────────────────────────────────────────────────────────────────

  // ── Bypass FATCA: DID_REGISTERED → COMPLETED (Sprint sau hoàn thiện) ──────
  useEffect(() => {
    if (currentState === "DID_REGISTERED") {
      completeFATCA()
    }
  }, [currentState, completeFATCA])

  // ── Điều hướng về WalletDashboard khi hoàn tất ────────────────────────────
  useEffect(() => {
    if (currentState === "COMPLETED") {
      onComplete()
    }
  }, [currentState, onComplete])

  // ── Callback từ LivenessFrame khi trạng thái camera thay đổi ──────────────
  const handleCameraStatusChange = (status: LivenessStatus, errorMsg?: string) => {
    if (status === "active") {
      onCameraReady()
    } else if (status === "error") {
      failProof(errorMsg ?? "Không thể khởi tạo camera. Vui lòng thử lại.")
    }
  }

  // ── Callback khi liveness scan hoàn tất ───────────────────────────────────
  // Truyền vào LivenessFrame qua prop mở rộng khi component đó hỗ trợ
  // Tạm thời: dùng nút giả lập trong LIVENESS_SCANNING để test luồng
  const handleLivenessSuccess = (score: number) => {
    startProofGeneration(score)
  }

  // ─── Render switch ─────────────────────────────────────────────────────────

  switch (currentState) {

    // ── IDLE: Entry point ────────────────────────────────────────────────────
    case "IDLE":
      return (
        <div style={styles.centeredScreen}>
          <div style={styles.iconBadge} aria-hidden="true">🪪</div>
          <h2 style={styles.heading}>Xác minh danh tính</h2>
          <p style={styles.subtext}>
            Hoàn tất eKYC để mở khóa đầy đủ tính năng ví và tuân thủ quy định AML/KYC.
          </p>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={requestCamera}
          >
            Bắt đầu định danh (eKYC)
          </Button>
        </div>
      )

    // ── CAMERA_REQUESTED: Chờ cấp quyền camera ──────────────────────────────
    case "CAMERA_REQUESTED":
      return (
        <div style={styles.centeredScreen}>
          <LivenessFrame
            title="Đang yêu cầu quyền camera…"
            onStatusChange={handleCameraStatusChange}
          />
          <p style={{ ...styles.subtext, marginTop: "16px" }}>
            Vui lòng cấp quyền truy cập camera khi trình duyệt yêu cầu.
          </p>
        </div>
      )

    // ── LIVENESS_SCANNING: Camera active, đang quét khuôn mặt ───────────────
    case "LIVENESS_SCANNING":
      return (
        <div style={styles.centeredScreen}>
          <LivenessFrame
            title="Hướng khuôn mặt vào khung"
            onStatusChange={handleCameraStatusChange}
          />
          {/* Nút giả lập để test luồng — Sprint 4B sẽ thay bằng tín hiệu tự động từ ML model */}
          <Button
            variant="secondary"
            size="md"
            style={{ marginTop: "20px" }}
            onClick={() => handleLivenessSuccess(0.97)}
          >
            Giả lập: Scan thành công (score 0.97)
          </Button>
        </div>
      )

    // ── PROOF_GENERATING: Lock màn hình — Chốt chặn Bảo mật UX ─────────────
    //
    // Bắt buộc:
    //   1. Overlay khóa toàn màn hình (không có nút tắt)
    //   2. Spinner hiển thị tiến trình
    //   3. Văn bản cảnh báo người dùng không đóng app
    //
    case "PROOF_GENERATING":
      return (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="proof-generating-title"
          aria-live="assertive"
          style={styles.lockOverlay}
        >
          <div style={styles.lockCard}>
            <Spinner size="lg" color="teal" label="Đang tạo ZK-proof…" />
            <h2
              id="proof-generating-title"
              style={{ ...styles.heading, marginTop: "20px", marginBottom: "8px" }}
            >
              Đang mã hóa định danh
            </h2>
            <p style={{ ...styles.subtext, fontWeight: 600, color: "var(--axq-text-secondary, #2E3A59)" }}>
              ZK-DID đang được tạo. Vui lòng không đóng ứng dụng.
            </p>
            <p style={{ ...styles.subtext, fontSize: "12px", color: "var(--axq-text-tertiary, #8F9BB3)", marginTop: "4px" }}>
              Quá trình này có thể mất vài giây.
            </p>
          </div>
        </div>
      )

    // ── PROOF_FAILED: Hiển thị lỗi + nút Thử Lại ────────────────────────────
    case "PROOF_FAILED":
      return (
        <>
          {/* Nền mờ phía sau modal */}
          <div style={styles.centeredScreen} aria-hidden="true" />
          <ModalError
            isOpen
            onClose={reset}
            title="Xác minh thất bại"
            message={errorMessage ?? "Đã xảy ra lỗi trong quá trình tạo ZK-proof. Vui lòng thử lại."}
            onRetry={reset}
            retryLabel="Thử Lại"
          />
        </>
      )

    // ── DID_REGISTERED & COMPLETED: useEffect xử lý — không render gì ───────
    // useEffect bên trên gọi completeFATCA() và onComplete() tương ứng.
    // Render tạm thời để tránh flash trắng trong thời gian effect chạy.
    case "DID_REGISTERED":
    case "COMPLETED":
      return (
        <div style={styles.centeredScreen}>
          <div style={styles.iconBadge} aria-hidden="true">✅</div>
          <h2 style={styles.heading}>Định danh hoàn tất</h2>
          <p style={styles.subtext}>Đang chuyển hướng về trang chủ…</p>
        </div>
      )

    default:
      return <></>
  }
}

KYCFlow.displayName = "KYCFlow"

// ─── Style constants ───────────────────────────────────────────────────────────

const styles = {
  centeredScreen: {
    display:        "flex",
    flexDirection:  "column" as const,
    alignItems:     "center",
    justifyContent: "center",
    minHeight:      "100%",
    padding:        "32px 24px",
    gap:            "16px",
    textAlign:      "center" as const,
  },
  iconBadge: {
    fontSize:     "48px",
    lineHeight:   1,
    marginBottom: "8px",
  },
  heading: {
    margin:     0,
    fontSize:   "20px",
    fontWeight: 700,
    color:      "var(--axq-text-primary, #101426)",
    lineHeight: 1.3,
  },
  subtext: {
    margin:     0,
    fontSize:   "14px",
    color:      "var(--axq-text-secondary, #2E3A59)",
    lineHeight: 1.6,
    maxWidth:   "300px",
  },
  // Overlay cho PROOF_GENERATING — khóa toàn màn hình, không có nút tắt
  lockOverlay: {
    position:       "fixed"    as const,
    inset:          0,
    zIndex:         9000,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    backgroundColor: "rgba(16, 20, 38, 0.75)",
    backdropFilter: "blur(4px)",
    padding:        "24px",
  },
  lockCard: {
    display:         "flex",
    flexDirection:   "column" as const,
    alignItems:      "center",
    backgroundColor: "var(--axq-surface-default, #FFFFFF)",
    borderRadius:    "var(--axq-radius-2xl, 24px)",
    padding:         "40px 32px",
    maxWidth:        "320px",
    width:           "100%",
    textAlign:       "center" as const,
    gap:             "0px",
  },
} satisfies Record<string, React.CSSProperties>
