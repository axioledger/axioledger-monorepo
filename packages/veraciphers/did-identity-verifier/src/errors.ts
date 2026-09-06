/**
 * @file errors.ts
 * Typed error classes for @veraciphers/did-identity-verifier.
 *
 * Mỗi class map 1-1 với một điều kiện lỗi cụ thể có thể xảy ra
 * trong pipeline ZK-DID. Các consumer (ví dụ: useDIDVerifier.ts) có thể
 * dùng `instanceof` để bắt chính xác từng loại và wrap thành AxioPassError.
 *
 * @example
 * try {
 *   await sd.prove(request, credProof)
 * } catch (err) {
 *   if (err instanceof DIDProverCapacityError) {
 *     throw new AxioPassError("PROVER_BUSY", err)
 *   }
 * }
 */

// ─── Base ─────────────────────────────────────────────────────────────────────

/**
 * Base class cho tất cả lỗi phát sinh từ @veraciphers/did-identity-verifier.
 * Consumer có thể bắt toàn bộ SDK errors bằng `instanceof DIDError`.
 */
export abstract class DIDError extends Error {
  /** Machine-readable error code — dùng để map sang AxioPassError */
  abstract readonly code: string

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = this.constructor.name
    // Giữ stack trace đúng trên V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

// ─── Credential Lifecycle Errors ──────────────────────────────────────────────

/**
 * Ném khi không tìm thấy credential hợp lệ (active, chưa revoke, chưa hết hạn)
 * cho cặp (holderDid, credentialType).
 *
 * Nguồn: IdentityVerifier.verify(), SoulboundRegistry.findActive()
 * AxioPass mapping: "CREDENTIAL_NOT_FOUND"
 */
export class DIDCredentialNotFoundError extends DIDError {
  readonly code = "CREDENTIAL_NOT_FOUND" as const
  readonly holderDid:      string
  readonly credentialType: string

  constructor(holderDid: string, credentialType: string, options?: ErrorOptions) {
    super(
      `No active credential of type "${credentialType}" found for holder "${holderDid}"`,
      options,
    )
    this.holderDid      = holderDid
    this.credentialType = credentialType
  }
}

/**
 * Ném khi cố issue một credential mới cho holder đã sở hữu credential
 * active cùng loại (vi phạm tính Soulbound — 1 credential / loại / holder).
 *
 * Nguồn: SoulboundRegistry.issue()
 * AxioPass mapping: "DUPLICATE_CREDENTIAL"
 */
export class DIDCredentialDuplicateError extends DIDError {
  readonly code = "DUPLICATE_CREDENTIAL" as const
  readonly holderDid:      string
  readonly credentialType: string
  readonly existingId:     string

  constructor(
    holderDid:      string,
    credentialType: string,
    existingId:     string,
    options?:       ErrorOptions,
  ) {
    super(
      `Holder "${holderDid}" already has an active "${credentialType}" credential (id: ${existingId})`,
      options,
    )
    this.holderDid      = holderDid
    this.credentialType = credentialType
    this.existingId     = existingId
  }
}

/**
 * Ném khi credential đã hết hạn (expiresAt > 0 && expiresAt <= now).
 *
 * Nguồn: IdentityVerifier.verify()
 * AxioPass mapping: "CREDENTIAL_EXPIRED"
 */
export class DIDCredentialExpiredError extends DIDError {
  readonly code = "CREDENTIAL_EXPIRED" as const
  readonly holderDid:      string
  readonly credentialType: string
  readonly expiredAt:      number  // Unix seconds

  constructor(
    holderDid:      string,
    credentialType: string,
    expiredAt:      number,
    options?:       ErrorOptions,
  ) {
    super(
      `Credential "${credentialType}" for holder "${holderDid}" expired at ${new Date(expiredAt * 1000).toISOString()}`,
      options,
    )
    this.holderDid      = holderDid
    this.credentialType = credentialType
    this.expiredAt      = expiredAt
  }
}

/**
 * Ném khi credential đã bị thu hồi bởi issuer.
 *
 * Nguồn: IdentityVerifier.verify(), SoulboundRegistry.revoke()
 * AxioPass mapping: "CREDENTIAL_REVOKED"
 */
export class DIDCredentialRevokedError extends DIDError {
  readonly code = "CREDENTIAL_REVOKED" as const
  readonly credentialId: string
  readonly holderDid:    string

  constructor(credentialId: string, holderDid: string, options?: ErrorOptions) {
    super(
      `Credential "${credentialId}" for holder "${holderDid}" has been revoked`,
      options,
    )
    this.credentialId = credentialId
    this.holderDid    = holderDid
  }
}

/**
 * Ném khi tìm kiếm credential theo ID nhưng không tồn tại trong registry.
 *
 * Nguồn: SoulboundRegistry._require() (revoke, get)
 * AxioPass mapping: "CREDENTIAL_NOT_FOUND"
 */
export class DIDCredentialLookupError extends DIDError {
  readonly code = "CREDENTIAL_NOT_FOUND" as const
  readonly credentialId: string

  constructor(credentialId: string, options?: ErrorOptions) {
    super(`Credential "${credentialId}" not found in registry`, options)
    this.credentialId = credentialId
  }
}

// ─── Proof Generation Errors ──────────────────────────────────────────────────

/**
 * Ném khi prover cluster đang xử lý quá số lượng proof đồng thời tối đa
 * (maxConcurrentProofs đã đạt ngưỡng).
 *
 * Nguồn: ProverRuntime.prove()
 * AxioPass mapping: "PROVER_BUSY"
 */
export class DIDProverCapacityError extends DIDError {
  readonly code = "PROVER_BUSY" as const
  readonly current: number
  readonly max:     number

  constructor(current: number, max: number, options?: ErrorOptions) {
    super(`Prover at capacity: ${current}/${max} proofs in flight`, options)
    this.current = current
    this.max     = max
  }
}

/**
 * Ném khi proof generation vượt quá thời gian deadline cho phép.
 *
 * Nguồn: ProverRuntime.prove() — Phase 2
 * AxioPass mapping: "PROVER_TIMEOUT"
 */
export class DIDProofTimeoutError extends DIDError {
  readonly code = "PROVER_TIMEOUT" as const
  readonly deadlineMs:   number
  readonly elapsedMs:    number

  constructor(deadlineMs: number, elapsedMs: number, options?: ErrorOptions) {
    super(
      `Proof generation timed out after ${elapsedMs}ms (deadline: ${deadlineMs}ms)`,
      options,
    )
    this.deadlineMs = deadlineMs
    this.elapsedMs  = elapsedMs
  }
}

/**
 * Ném khi witness đầu vào không hợp lệ — thiếu tín hiệu bắt buộc,
 * sai kiểu dữ liệu, hoặc vi phạm constraint của circuit.
 *
 * Nguồn: WitnessBuilder (Phase 2), ProverRuntime.prove()
 * AxioPass mapping: "INVALID_PROOF_INPUT"
 */
export class DIDInvalidWitnessError extends DIDError {
  readonly code = "INVALID_PROOF_INPUT" as const
  readonly circuitId: string
  readonly field?:    string

  constructor(circuitId: string, field?: string, options?: ErrorOptions) {
    const detail = field ? ` (field: "${field}")` : ""
    super(`Invalid witness for circuit "${circuitId}"${detail}`, options)
    this.circuitId = circuitId
    this.field     = field
  }
}

/**
 * Ném khi ZK proof không pass xác minh — proof bytes bị hỏng hoặc
 * public signals không khớp với verification key.
 *
 * Nguồn: SelectiveDisclosure.verify(), on-chain verifier (Phase 2)
 * AxioPass mapping: "PROOF_VERIFICATION_FAILED"
 */
export class DIDProofVerificationError extends DIDError {
  readonly code = "PROOF_VERIFICATION_FAILED" as const
  readonly requestId?: string

  constructor(requestId?: string, options?: ErrorOptions) {
    const detail = requestId ? ` (requestId: "${requestId}")` : ""
    super(`ZK proof verification failed${detail}`, options)
    this.requestId = requestId
  }
}

// ─── MACI Errors ──────────────────────────────────────────────────────────────

/**
 * Ném khi cố tally một proposal chưa có vote nào.
 *
 * Nguồn: MaciCircuit.tally()
 * AxioPass mapping: "MACI_NO_VOTES"
 */
export class DIDMaciNoVotesError extends DIDError {
  readonly code = "MACI_NO_VOTES" as const
  readonly proposalId: string

  constructor(proposalId: string, options?: ErrorOptions) {
    super(`No votes found for proposal "${proposalId}"`, options)
    this.proposalId = proposalId
  }
}

// ─── Type guards ──────────────────────────────────────────────────────────────

/** True nếu `err` là bất kỳ lỗi nào từ DID SDK */
export function isDIDError(err: unknown): err is DIDError {
  return err instanceof DIDError
}

/** True nếu `err` liên quan đến credential không hợp lệ/thiếu */
export function isCredentialError(
  err: unknown,
): err is
  | DIDCredentialNotFoundError
  | DIDCredentialDuplicateError
  | DIDCredentialExpiredError
  | DIDCredentialRevokedError
  | DIDCredentialLookupError {
  return (
    err instanceof DIDCredentialNotFoundError  ||
    err instanceof DIDCredentialDuplicateError ||
    err instanceof DIDCredentialExpiredError   ||
    err instanceof DIDCredentialRevokedError   ||
    err instanceof DIDCredentialLookupError
  )
}

/** True nếu `err` liên quan đến proof generation/verification */
export function isProofError(
  err: unknown,
): err is
  | DIDProverCapacityError
  | DIDProofTimeoutError
  | DIDInvalidWitnessError
  | DIDProofVerificationError {
  return (
    err instanceof DIDProverCapacityError    ||
    err instanceof DIDProofTimeoutError      ||
    err instanceof DIDInvalidWitnessError    ||
    err instanceof DIDProofVerificationError
  )
}
