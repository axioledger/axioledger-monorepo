/**
 * @axioledger/kms — Key Management Service
 *
 * Adapter pattern cho phép chuyển đổi giữa:
 *   - LocalSoftKMS   : Dev/test local — dùng @noble/secp256k1 thuần TypeScript
 *   - VaultKMSProvider : Production — HashiCorp Vault Transit Secret Engine
 *
 * Proto schema: packages/axioledger/kms/proto/signerservice/signerservice.proto
 *
 * Sử dụng:
 * ```typescript
 * // Dev
 * const kms = new LocalSoftKMS()
 * await kms.importKey("validator-1", privateKeyBytes, SignatureScheme.ECDSA_SECP256K1)
 * const sig = await kms.sign("validator-1", txHashBytes)
 *
 * // Production
 * const kms = new VaultKMSProvider({
 *   endpoint: process.env.VAULT_ADDR!,
 *   token:    process.env.VAULT_TOKEN!,
 * })
 * const sig = await kms.sign("validator-1", txHashBytes)
 * ```
 *
 * SECURITY:
 *   - VaultKMSProvider KHÔNG bao giờ expose private key ra bộ nhớ JS.
 *   - LocalSoftKMS chỉ dùng trên môi trường dev (NODE_ENV !== "production").
 *   - Mọi thay đổi trong file này cần 2 approvals từ Security Team.
 */

import { secp256k1 } from "@noble/secp256k1"
import { sha256 as nobleSha256 } from "@noble/hashes/sha256"

// ─── Enums ────────────────────────────────────────────────────────────────────

/** Phù hợp với SignatureScheme trong signerservice.proto */
export enum SignatureScheme {
  UNKNOWN              = 0,
  ECDSA_SECP256K1      = 1,
  ED25519              = 2,
  ECDSA_SECP256K1_ETH  = 3,
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KmsKey {
  /** ID định danh duy nhất (ví dụ: "validator-1", "oracle-signer") */
  id: string
  /** Public key bytes (33 bytes compressed secp256k1 hoặc 32 bytes ed25519) */
  pubkey: Uint8Array
  scheme: SignatureScheme
}

export interface SignRequest {
  keyId:   string
  payload: Uint8Array
}

export interface SignResponse {
  /** 64-byte r||s (low-S) cho secp256k1, 64-byte cho ed25519 */
  signature: Uint8Array
}

/** Lỗi cụ thể của KMS */
export class KmsError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "KEY_NOT_FOUND"
      | "SIGNING_FAILED"
      | "VAULT_UNAVAILABLE"
      | "INVALID_SCHEME"
      | "UNSAFE_ENVIRONMENT"
  ) {
    super(message)
    this.name = "KmsError"
  }
}

// ─── Interface ────────────────────────────────────────────────────────────────

/**
 * KeyManagerService — interface chung cho mọi KMS provider.
 * Ánh xạ trực tiếp từ SignerService trong signerservice.proto.
 */
export interface KeyManagerService {
  /** Lấy thông tin public key theo ID */
  getKey(id: string): Promise<KmsKey>
  /** Liệt kê tất cả key có trong KMS */
  getKeys(): Promise<KmsKey[]>
  /** Ký payload bằng key được chỉ định */
  sign(request: SignRequest): Promise<SignResponse>
}

// ─── LocalSoftKMS — Dùng cho Dev/Test ─────────────────────────────────────────

/**
 * LocalSoftKMS — KMS cục bộ dùng @noble/secp256k1 thuần TypeScript.
 *
 * CẢNH BÁO: Private key được lưu trong bộ nhớ JavaScript — KHÔNG an toàn
 * cho môi trường production. Sẽ throw nếu NODE_ENV === "production".
 *
 * Dùng cho: unit tests, local devnet, CI pipeline.
 */
export class LocalSoftKMS implements KeyManagerService {
  private readonly keys = new Map<string, { privkey: Uint8Array; meta: KmsKey }>()

  constructor() {
    if (
      typeof process !== "undefined" &&
      process.env?.NODE_ENV === "production"
    ) {
      throw new KmsError(
        "LocalSoftKMS KHÔNG được phép chạy trong môi trường production. " +
        "Dùng VaultKMSProvider hoặc AwsKmsProvider.",
        "UNSAFE_ENVIRONMENT"
      )
    }
  }

  /**
   * Import một private key vào KMS local.
   * Chỉ hỗ trợ ECDSA_SECP256K1 trong phiên bản này.
   *
   * @param id         - Định danh key (ví dụ "validator-1")
   * @param privkeyHex - Private key dạng hex 32 bytes (64 ký tự)
   * @param scheme     - Thuật toán ký — hiện chỉ hỗ trợ ECDSA_SECP256K1
   */
  importKey(
    id: string,
    privkeyHex: string,
    scheme: SignatureScheme = SignatureScheme.ECDSA_SECP256K1
  ): void {
    if (scheme !== SignatureScheme.ECDSA_SECP256K1) {
      throw new KmsError(
        `LocalSoftKMS chưa hỗ trợ scheme ${scheme}. Hiện chỉ có ECDSA_SECP256K1.`,
        "INVALID_SCHEME"
      )
    }
    const privkeyBytes = hexToBytes(privkeyHex)
    if (privkeyBytes.length !== 32) {
      throw new KmsError(
        `Private key phải là 32 bytes (nhận được ${privkeyBytes.length})`,
        "SIGNING_FAILED"
      )
    }
    const pubkey = secp256k1.getPublicKey(privkeyBytes, true) // compressed
    this.keys.set(id, {
      privkey: privkeyBytes,
      meta: { id, pubkey, scheme },
    })
  }

  async getKey(id: string): Promise<KmsKey> {
    const entry = this.keys.get(id)
    if (!entry) {
      throw new KmsError(`Key "${id}" không tìm thấy trong LocalSoftKMS`, "KEY_NOT_FOUND")
    }
    return entry.meta
  }

  async getKeys(): Promise<KmsKey[]> {
    return Array.from(this.keys.values()).map((e) => e.meta)
  }

  async sign(request: SignRequest): Promise<SignResponse> {
    const entry = this.keys.get(request.keyId)
    if (!entry) {
      throw new KmsError(
        `Key "${request.keyId}" không tìm thấy — không thể ký`,
        "KEY_NOT_FOUND"
      )
    }

    try {
      // SHA-256 hash payload trước khi ký (low-S normalized)
      const msgHash = nobleSha256(request.payload)
      const sig = secp256k1.sign(msgHash, entry.privkey, { lowS: true })
      // Trả về compact 64-byte r||s
      return { signature: sig.toCompactRawBytes() }
    } catch (err) {
      throw new KmsError(
        `Ký thất bại với key "${request.keyId}": ${(err as Error).message}`,
        "SIGNING_FAILED"
      )
    }
  }
}

// ─── VaultKMSProvider — Production (HashiCorp Vault) ─────────────────────────

export interface VaultKMSOptions {
  /** Vault server URL, ví dụ: https://vault.axioledger.internal:8200 */
  endpoint: string
  /** Vault token hoặc AppRole secret_id (ưu tiên lấy từ env var) */
  token: string
  /**
   * Mount path của Transit Secret Engine. Mặc định: "transit"
   * Xem: https://developer.hashicorp.com/vault/docs/secrets/transit
   */
  mountPath?: string
  /** Timeout cho mỗi request (ms). Mặc định: 10_000 */
  timeoutMs?: number
}

/**
 * VaultKMSProvider — KMS production tích hợp HashiCorp Vault Transit Engine.
 *
 * Private key KHÔNG BAO GIỜ rời khỏi Vault. Mọi thao tác ký được
 * thực hiện trong Vault HSM-backed secret engine.
 *
 * Cấu hình Vault cần thiết:
 * ```
 * vault secrets enable transit
 * vault write -f transit/keys/validator-1 type=ecdsa-p256
 * vault write transit/keys/oracle-signer type=ecdsa-p256
 * ```
 *
 * Quyền Vault policy (tối thiểu):
 * ```hcl
 * path "transit/sign/validator-*" { capabilities = ["update"] }
 * path "transit/keys/validator-*" { capabilities = ["read"]   }
 * ```
 */
export class VaultKMSProvider implements KeyManagerService {
  private readonly endpoint: string
  private readonly token: string
  private readonly mountPath: string
  private readonly timeoutMs: number

  constructor(options: VaultKMSOptions) {
    if (!options.endpoint || !options.token) {
      throw new KmsError(
        "VaultKMSProvider: endpoint và token là bắt buộc",
        "VAULT_UNAVAILABLE"
      )
    }
    this.endpoint  = options.endpoint.replace(/\/$/, "")
    this.token     = options.token
    this.mountPath = options.mountPath ?? "transit"
    this.timeoutMs = options.timeoutMs ?? 10_000
  }

  async getKey(id: string): Promise<KmsKey> {
    const url = `${this.endpoint}/v1/${this.mountPath}/keys/${encodeURIComponent(id)}`
    const data = await this._vaultRequest<{
      data: { keys: Record<string, { public_key: string }>; type: string }
    }>("GET", url)

    // Lấy public key của phiên bản mới nhất
    const versions = data.data.keys
    const latestVersion = Math.max(...Object.keys(versions).map(Number))
    const pubkeyPem = versions[String(latestVersion)].public_key

    return {
      id,
      pubkey: pemToBytes(pubkeyPem),
      scheme: SignatureScheme.ECDSA_SECP256K1,
    }
  }

  async getKeys(): Promise<KmsKey[]> {
    const url = `${this.endpoint}/v1/${this.mountPath}/keys?list=true`
    const data = await this._vaultRequest<{ data: { keys: string[] } }>("GET", url)
    const results = await Promise.allSettled(
      data.data.keys.map((id) => this.getKey(id))
    )
    return results
      .filter((r): r is PromiseFulfilledResult<KmsKey> => r.status === "fulfilled")
      .map((r) => r.value)
  }

  async sign(request: SignRequest): Promise<SignResponse> {
    const url = `${this.endpoint}/v1/${this.mountPath}/sign/${encodeURIComponent(request.keyId)}`
    const inputBase64 = bytesToBase64(request.payload)

    const data = await this._vaultRequest<{
      data: { signature: string }
    }>("POST", url, {
      input:          inputBase64,
      hash_algorithm: "sha2-256",
      signature_algorithm: "pss",
      marshaling_algorithm: "asn1",
    })

    // Vault trả về "vault:v1:<base64_signature>"
    const parts = data.data.signature.split(":")
    if (parts.length < 3) {
      throw new KmsError(
        "Vault trả về signature không đúng định dạng",
        "SIGNING_FAILED"
      )
    }
    const sigBytes = base64ToBytes(parts[2])
    return { signature: sigBytes }
  }

  // ── Internal HTTP helper ────────────────────────────────────────────────────

  private async _vaultRequest<T>(
    method: "GET" | "POST",
    url: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeoutMs)

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "X-Vault-Token": this.token,
          "Content-Type":  "application/json",
        },
        signal: controller.signal,
        ...(body ? { body: JSON.stringify(body) } : {}),
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => res.statusText)
        throw new KmsError(
          `Vault HTTP ${res.status}: ${errorText}`,
          res.status === 503 ? "VAULT_UNAVAILABLE" : "SIGNING_FAILED"
        )
      }

      return res.json() as Promise<T>
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        throw new KmsError(
          `Vault request timeout (${this.timeoutMs}ms) — endpoint: ${url}`,
          "VAULT_UNAVAILABLE"
        )
      }
      throw err
    } finally {
      clearTimeout(timer)
    }
  }
}

// ─── Factory — Khởi tạo KMS theo môi trường ───────────────────────────────────

/**
 * createKms — Factory function chọn KMS provider phù hợp theo biến môi trường.
 *
 * Ưu tiên:
 *   1. Nếu VAULT_ADDR và VAULT_TOKEN có trong env → dùng VaultKMSProvider
 *   2. Còn lại → dùng LocalSoftKMS (chỉ trên non-production)
 *
 * Không truyền bất kỳ secret nào trực tiếp — đọc từ env vars.
 */
export function createKms(): KeyManagerService {
  const vaultAddr  = typeof process !== "undefined" ? process.env?.VAULT_ADDR  : undefined
  const vaultToken = typeof process !== "undefined" ? process.env?.VAULT_TOKEN : undefined

  if (vaultAddr && vaultToken) {
    return new VaultKMSProvider({ endpoint: vaultAddr, token: vaultToken })
  }

  // LocalSoftKMS sẽ tự throw nếu NODE_ENV === "production"
  return new LocalSoftKMS()
}

// ─── Utility helpers ─────────────────────────────────────────────────────────

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex
  if (clean.length % 2 !== 0) {
    throw new Error(`hexToBytes: chuỗi hex độ dài lẻ (${clean.length} chars)`)
  }
  const result = new Uint8Array(clean.length / 2)
  for (let i = 0; i < result.length; i++) {
    result[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  }
  return result
}

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64.replace(/-/g, "+").replace(/_/g, "/"))
  return new Uint8Array([...binary].map((c) => c.charCodeAt(0)))
}

/**
 * PEM → raw bytes (stripped header/footer, base64 decoded).
 * Chỉ extract payload bytes — không parse DER/ASN.1 cấu trúc.
 */
function pemToBytes(pem: string): Uint8Array {
  const b64 = pem
    .replace(/-----BEGIN[^-]+-----/, "")
    .replace(/-----END[^-]+-----/, "")
    .replace(/\s/g, "")
  return base64ToBytes(b64)
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export default createKms
