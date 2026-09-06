/**
 * useKYCStore — KYC Flow State Machine
 *
 * Quản lý toàn bộ vòng đời của luồng eKYC theo mô hình Finite State Machine.
 * Component KYCFlow.tsx đọc state và gọi actions từ hook này —
 * không chứa bất kỳ logic gọi SDK nào.
 *
 * Sơ đồ chuyển trạng thái:
 *   IDLE
 *     → [requestCamera()]          → CAMERA_REQUESTED
 *   CAMERA_REQUESTED
 *     → [camera active]            → LIVENESS_SCANNING  (tự động qua onCameraReady)
 *     → [camera error]             → PROOF_FAILED
 *   LIVENESS_SCANNING
 *     → [startProofGeneration()]   → PROOF_GENERATING
 *     → [camera error]             → PROOF_FAILED
 *   PROOF_GENERATING
 *     → [registerDIDSuccess()]     → DID_REGISTERED
 *     → [failProof()]              → PROOF_FAILED
 *   DID_REGISTERED
 *     → [completeFATCA()]          → COMPLETED
 *   PROOF_FAILED
 *     → [reset()]                  → IDLE
 *   COMPLETED  (terminal)
 */

import { useReducer, useCallback } from "react"

// ─── States ───────────────────────────────────────────────────────────────────

export type KYCState =
  | "IDLE"
  | "CAMERA_REQUESTED"
  | "LIVENESS_SCANNING"
  | "PROOF_GENERATING"
  | "PROOF_FAILED"
  | "DID_REGISTERED"
  | "COMPLETED"

// ─── Store Shape ──────────────────────────────────────────────────────────────

export interface KYCStoreState {
  currentState: KYCState
  /** Điểm liveness từ camera engine (0–1). Được set khi chuyển sang PROOF_GENERATING. */
  livenessScore: number | null
  /** DID được cấp sau khi ZK proof thành công. */
  didId: string | null
  /** Thông báo lỗi hiển thị cho người dùng khi state = PROOF_FAILED. */
  errorMessage: string | null
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type KYCAction =
  | { type: "REQUEST_CAMERA" }
  | { type: "CAMERA_READY" }
  | { type: "START_PROOF_GENERATION"; score: number }
  | { type: "REGISTER_DID_SUCCESS"; didId: string }
  | { type: "FAIL_PROOF"; error: string }
  | { type: "COMPLETE_FATCA" }
  | { type: "RESET" }

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_STATE: KYCStoreState = {
  currentState:  "IDLE",
  livenessScore: null,
  didId:         null,
  errorMessage:  null,
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function kycReducer(state: KYCStoreState, action: KYCAction): KYCStoreState {
  switch (action.type) {

    case "REQUEST_CAMERA":
      if (state.currentState !== "IDLE") return state
      return { ...state, currentState: "CAMERA_REQUESTED", errorMessage: null }

    case "CAMERA_READY":
      if (state.currentState !== "CAMERA_REQUESTED") return state
      return { ...state, currentState: "LIVENESS_SCANNING" }

    case "START_PROOF_GENERATION":
      if (state.currentState !== "LIVENESS_SCANNING") return state
      return { ...state, currentState: "PROOF_GENERATING", livenessScore: action.score }

    case "REGISTER_DID_SUCCESS":
      if (state.currentState !== "PROOF_GENERATING") return state
      return { ...state, currentState: "DID_REGISTERED", didId: action.didId }

    case "FAIL_PROOF":
      if (
        state.currentState !== "PROOF_GENERATING" &&
        state.currentState !== "CAMERA_REQUESTED" &&
        state.currentState !== "LIVENESS_SCANNING"
      ) return state
      return { ...state, currentState: "PROOF_FAILED", errorMessage: action.error }

    case "COMPLETE_FATCA":
      if (state.currentState !== "DID_REGISTERED") return state
      return { ...state, currentState: "COMPLETED" }

    case "RESET":
      return INITIAL_STATE

    default:
      return state
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface KYCStoreActions {
  /** IDLE → CAMERA_REQUESTED */
  requestCamera: () => void
  /** CAMERA_REQUESTED → LIVENESS_SCANNING (gọi khi camera thực sự active) */
  onCameraReady: () => void
  /** LIVENESS_SCANNING → PROOF_GENERATING */
  startProofGeneration: (score: number) => void
  /** PROOF_GENERATING → DID_REGISTERED */
  registerDIDSuccess: (didId: string) => void
  /** * → PROOF_FAILED */
  failProof: (error: string) => void
  /** DID_REGISTERED → COMPLETED (bypass FATCA — Sprint sau hoàn thiện) */
  completeFATCA: () => void
  /** PROOF_FAILED → IDLE */
  reset: () => void
}

export function useKYCStore(): KYCStoreState & KYCStoreActions {
  const [state, dispatch] = useReducer(kycReducer, INITIAL_STATE)

  const requestCamera       = useCallback(() => dispatch({ type: "REQUEST_CAMERA" }), [])
  const onCameraReady       = useCallback(() => dispatch({ type: "CAMERA_READY" }), [])
  const startProofGeneration = useCallback(
    (score: number) => dispatch({ type: "START_PROOF_GENERATION", score }),
    [],
  )
  const registerDIDSuccess  = useCallback(
    (didId: string) => dispatch({ type: "REGISTER_DID_SUCCESS", didId }),
    [],
  )
  const failProof           = useCallback(
    (error: string) => dispatch({ type: "FAIL_PROOF", error }),
    [],
  )
  const completeFATCA       = useCallback(() => dispatch({ type: "COMPLETE_FATCA" }), [])
  const reset               = useCallback(() => dispatch({ type: "RESET" }), [])

  return {
    ...state,
    requestCamera,
    onCameraReady,
    startProofGeneration,
    registerDIDSuccess,
    failProof,
    completeFATCA,
    reset,
  }
}
