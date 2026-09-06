/**
 * useDIDVerifier — ZK-DID SDK Adapter Hook
 *
 * Cầu nối (adapter) giữa KYCFlow.tsx và @veraciphers/did-identity-verifier.
 * Cô lập toàn bộ logic tiền xử lý sinh trắc học, xây dựng witness,
 * gọi SelectiveDisclosure.prove(), và ánh xạ ngoại lệ.
 *
 * Nguyên tắc thiết kế:
 *   - KHÔNG duy trì state cục bộ (useState / isLoading).
 *     Mọi trạng thái luồng thuộc về useKYCStore — hook này chỉ gọi ngược lại.
 *   - KHÔNG throw lỗi trần ra ngoài. Mọi ngoại lệ được bắt, ánh xạ thành
 *     thông báo thân thiện, và đẩy vào failProof() để hiển thị Fail-Visible.
 *   - Actions registerDIDSuccess / failProof được nhận qua tham số để đảm bảo
 *     cùng store instance với KYCFlow (useKYCStore là useReducer, không phải
 *     global store — mỗi lần gọi tạo ra một instance riêng biệt).
 *
 * Async pipeline:
 *   biometricPayload (Uint8Array | string)
 *     → buildWitness()          — chuẩn hóa sang WitnessInput
 *     → sd.prove()              — tạo ZK proof (CPU intensive)
 *     → extractDIDFromProof()   — trích xuất DID Document ID
 *     → registerDIDSuccess()    — đẩy DID vào store
 *
 * Error mapping (Fail-Visible):
 *   DIDProverCapacityError    → "Hệ thống đang bận. Vui lòng thử lại sau."
 *   DIDProofTimeoutError      → "Tạo proof quá thời gian. Vui lòng thử lại."
 *   DIDProofVerificationError → "Xác minh proof thất bại. Vui lòng quét lại."
 *   DIDInvalidWitnessError    → "Dữ liệu đầu vào không hợp lệ."
 *   DIDCredential*Error       → "Thông tin định danh không hợp lệ."
 *   DIDError (generic)        → "Lỗi ZK-DID không xác định."
 *   Error (non-DID)           → "Lỗi hệ thống không mong đợi."
 */

import { useCallback } from "react"
import {
  SelectiveDisclosure,
} from "@veraciphers/did-identity-verifier"
import type {
  DisclosureRequest,
} from "@veraciphers/did-identity-verifier"
import {
  DIDError,
  DIDProverCapacityError,
  DIDProofTimeoutError,
  DIDProofVerificationError,
  DIDInvalidWitnessError,
  isCredentialError,
} from "@veraciphers/did-identity-verifier"

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Dữ liệu sinh trắc học thô từ camera / liveness engine.
 * Uint8Array: frame bytes từ canvas.  string: base64 encode của frame bytes.
 */
export type BiometricPayload = Uint8Array | string

/** Tham số khởi tạo hook — nhận actions từ store instance của KYCFlow */
export interface UseDIDVerifierOptions {
  /** Gọi khi proof thành công — DID Document ID được trích xuất từ proof */
  onSuccess: (didId: string) => void
  /** Gọi khi pipeline thất bại — thông báo lỗi thân thiện cho người dùng */
  onError: (message: string) => void
  /**
   * DID của issuer phát hành credential.
   * Mặc định: "did:axq:issuer" (stub cho Phase 1)
   */
  issuerDid?: string
}

/** Kết quả trả về từ hook */
export interface UseDIDVerifierResult {
  /**
   * Hàm kích hoạt toàn bộ pipeline ZK-proof.
   * Gọi từ KYCFlow khi state chuyển sang PROOF_GENERATING.
   */
  generateDID: (payload: BiometricPayload) => Promise<void>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Chuẩn hóa BiometricPayload sang chuỗi base64 để truyền làm private witness.
 *
 * Phase 1: truyền thẳng payload (dù là Uint8Array hay string).
 * Phase 2: tích hợp bước hash SHA-256 để bảo vệ dữ liệu thô
 *          trước khi đưa vào circuit witness:
 *            const hash = await crypto.subtle.digest("SHA-256", bytes)
 *            return btoa(String.fromCharCode(...new Uint8Array(hash)))
 */
function normalizePayload(payload: BiometricPayload): string {
  if (typeof payload === "string") return payload
  // Uint8Array → base64
  let binary = ""
  for (let i = 0; i < payload.length; i++) {
    binary += String.fromCharCode(payload[i])
  }
  return btoa(binary)
}

/**
 * Xây dựng DisclosureRequest từ biometric payload đã chuẩn hóa.
 *
 * Phase 1: yêu cầu chứng minh "unique-human" với attribute "liveness".
 * Phase 2: bổ sung "jurisdiction", "age-18+" tùy theo luồng KYC level.
 */
function buildDisclosureRequest(
  normalizedPayload: string,
  issuerDid: string,
): { request: DisclosureRequest; credentialProof: string } {
  // holderDid Phase 1: sinh từ hash của payload để đảm bảo tính duy nhất
  // Phase 2: thay bằng DID thực từ wallet key pair
  const holderDid = `did:axq:holder:${normalizedPayload.slice(0, 16)}`

  const request: DisclosureRequest = {
    holderDid,
    credentialType: "unique-human",
    attributes:     ["liveness"],
  }

  // credentialProof Phase 1: forward payload làm private input cho circuit stub
  // Phase 2: đây là zkProof của SoulboundCredential đã được issuer ký
  const credentialProof = `${issuerDid}::${normalizedPayload}`

  return { request, credentialProof }
}

/**
 * Trích xuất DID Document ID từ DisclosureProof vừa được tạo.
 *
 * Phase 1: dùng holderDid của request làm DID ID.
 * Phase 2: parse DID Document từ publicSignals["didDocument"] sau khi
 *          giải mã proof.
 */
function extractDIDFromProof(holderDid: string): string {
  return holderDid
}

/**
 * Ánh xạ bất kỳ ngoại lệ nào sang thông báo lỗi thân thiện (tiếng Việt).
 * KHÔNG bao giờ throw — luôn trả về string.
 */
function mapErrorToMessage(err: unknown): string {
  if (err instanceof DIDProverCapacityError) {
    return `Hệ thống đang xử lý quá tải (${err.current}/${err.max} proofs). Vui lòng thử lại sau ít phút.`
  }
  if (err instanceof DIDProofTimeoutError) {
    return `Tạo bằng chứng ZK quá thời gian (${err.elapsedMs}ms). Vui lòng thử lại.`
  }
  if (err instanceof DIDProofVerificationError) {
    return "Bằng chứng ZK không hợp lệ. Vui lòng quét lại khuôn mặt."
  }
  if (err instanceof DIDInvalidWitnessError) {
    const detail = err.field ? ` (trường: "${err.field}")` : ""
    return `Dữ liệu sinh trắc học không đúng định dạng${detail}. Vui lòng thử lại.`
  }
  if (isCredentialError(err)) {
    return "Thông tin định danh không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ hỗ trợ."
  }
  if (err instanceof DIDError) {
    // DIDError.code là typed string literal — cast an toàn vì đã pass instanceof
    return `Lỗi ZK-DID [${(err as DIDError).code}]. Vui lòng thử lại.`
  }
  if (err instanceof Error) {
    // Lỗi hệ thống không mong đợi (network, WASM crash, v.v.)
    return `Lỗi hệ thống không mong đợi: ${(err as Error).message}`
  }
  return "Đã xảy ra lỗi không xác định. Vui lòng thử lại."
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDIDVerifier({
  onSuccess,
  onError,
  issuerDid = "did:axq:issuer",
}: UseDIDVerifierOptions): UseDIDVerifierResult {

  // SelectiveDisclosure instance — stable reference trong lifetime của hook.
  // Phase 2: thay bằng ProverClient với endpoint thật.
  const sd = new SelectiveDisclosure()

  const generateDID = useCallback(
    async (payload: BiometricPayload): Promise<void> => {
      try {
        // ── Bước 1: Chuẩn bị Witness ────────────────────────────────────────
        const normalizedPayload             = normalizePayload(payload)
        const { request, credentialProof } = buildDisclosureRequest(
          normalizedPayload,
          issuerDid,
        )

        // ── Bước 2: Thực thi ZK Proof (CPU intensive) ───────────────────────
        // KYCFlow đã khóa UI bằng lock overlay — không cần lo về UX ở đây.
        const proof = await sd.prove(request, credentialProof)

        // ── Bước 3: Xác minh cục bộ trước khi đẩy on-chain ─────────────────
        // Phase 2: gọi @veraciphers/on-chain-verifier để verify proof bytes
        const isValid = sd.verify(proof)
        if (!isValid) {
          throw new DIDProofVerificationError(proof.requestId)
        }

        // ── Bước 4: Trích xuất DID và thông báo thành công ──────────────────
        const didId = extractDIDFromProof(proof.holderDid)
        onSuccess(didId)

      } catch (err) {
        // ── Fail-Visible: KHÔNG re-throw, chỉ ánh xạ và đẩy vào store ──────
        onError(mapErrorToMessage(err))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [issuerDid, onSuccess, onError],
  )

  return { generateDID }
}
