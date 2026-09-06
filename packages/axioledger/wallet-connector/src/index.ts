/**
 * @axioledger/wallet-connector — src/index.ts
 *
 * Tích hợp WebAuthn Passkey (FIDO2 / @simplewebauthn/browser) và
 * mật mã học secp256k1 (@noble/secp256k1) để ký giao dịch phi trạng thái
 * mà không cần seed phrase.
 *
 * Kiến trúc:
 *   AxioPassConnector — WebAuthn ↔ Secure Enclave ↔ secp256k1 key derivation
 *   signTransactionStateless  — Ký giao dịch dùng P-256 WebAuthn credential
 *   verifyWebAuthnSignature   — Xác minh chữ ký từ WebAuthn response
 *   deriveAxioPassPublicKey   — Trích xuất public key từ COSE credential
 *
 * Nguồn spec: docs/logic/GENESIS_ALLOCATION.md
 * Liên quan:  packages/axioledger/wallet-connector/
 */

import {
  startAuthentication,
  startRegistration,
  browserSupportsWebAuthn,
} from "@simplewebauthn/browser"
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/browser"
import { secp256k1 } from "@noble/secp256k1"
import {
  ComplianceChecker,
  getDefaultComplianceChecker,
} from "@axioledger/ans-sdk"

// ─── Types ────────────────────────────────────────────────────────────────────

/** Kết quả giao dịch đã được ký bởi WebAuthn credential */
export interface SignedTransaction {
  /** Bytes giao dịch gốc */
  txBytes: Uint8Array
  /** Chữ ký DER (compact, 64 bytes) từ Secure Enclave */
  signature: Uint8Array
  /** Credential ID dùng để ký */
  credentialId: string
  /** Public key secp256k1 (33 bytes compressed) */
  publicKey: Uint8Array
  /** Timestamp Unix của lần ký */
  signedAt: number
}

/** Phiên kết nối ví AxioPass */
export interface WalletSession {
  /** Địa chỉ ví native SVM (Pubkey) */
  address: string
  /** Public key compressed (hex) */
  publicKeyHex: string
  /** Credential ID đã đăng ký */
  credentialId: string
  /** Trạng thái kết nối */
  connected: boolean
  /** Chain ID */
  chainId: string
}

/** Tham số giao dịch */
export interface TransactionParams {
  /** Địa chỉ người nhận */
  to: string
  /** Số lượng token (chuỗi string để tránh overflow BigInt) */
  amount: string
  /** Ghi chú giao dịch */
  memo?: string
  /** Phí gas tùy chỉnh */
  gasLimit?: string
}

/** Lỗi cụ thể của AxioPass */
export class AxioPassError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = "AxioPassError"
  }
}

// ─── Utility Functions ────────────────────────────────────────────────────────

/**
 * Chuyển đổi Base64URL string thành Uint8Array.
 * WebAuthn trả về nhiều field dạng Base64URL.
 */
function base64urlToBytes(base64url: string): Uint8Array {
  const base64 = base64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), "=")
  const binary = atob(base64)
  return new Uint8Array([...binary].map((c) => c.charCodeAt(0)))
}

/**
 * Chuyển đổi Uint8Array thành chuỗi hex.
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * Tạo SHA-256 hash của dữ liệu.
 * Dùng Web Crypto API (sẵn có trong browser và Node.js ≥ 18).
 */
async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return new Uint8Array(hashBuffer)
}

/**
 * Trích xuất public key secp256k1 (compressed, 33 bytes) từ COSE_Key format
 * mà WebAuthn trả về trong authenticatorData.
 *
 * COSE_Key EC2 format (CBOR map):
 *   key -2 (0x21) → x (32 bytes)
 *   key -3 (0x22) → y (32 bytes)
 *
 * Ngoài ra authenticatorData chứa credentialPublicKey ở dạng uncompressed:
 *   0x04 || x (32 bytes) || y (32 bytes)
 *
 * SECURITY: Hàm này throw AxioPassError khi không parse được — KHÔNG fallback
 * về zero key. Caller phải xử lý lỗi và yêu cầu người dùng đăng ký lại.
 *
 * @throws {AxioPassError} INVALID_COSE_KEY — dữ liệu quá ngắn
 * @throws {AxioPassError} COSE_UNCOMPRESSED_MARKER_NOT_FOUND — không tìm thấy
 *   marker 0x04 hợp lệ và không có đủ 64 bytes cuối để trích xuất x||y
 * @throws {AxioPassError} COSE_INVALID_POINT — điểm EC không hợp lệ (x hoặc y rỗng)
 */
function coseKeyToCompressedSecp256k1(coseBytes: Uint8Array): Uint8Array {
  if (coseBytes.length < 65) {
    throw new AxioPassError(
      `COSE key quá ngắn (${coseBytes.length} bytes, cần ít nhất 65)`,
      "INVALID_COSE_KEY"
    )
  }

  // Tìm marker uncompressed 0x04 theo đúng thứ tự — phải có đủ 64 bytes sau đó
  let offset = -1
  for (let i = 0; i <= coseBytes.length - 65; i++) {
    if (coseBytes[i] === 0x04) {
      offset = i
      break
    }
  }

  if (offset === -1) {
    // Thử interpret 64 bytes CUỐI là x||y (một số authenticator bỏ marker)
    if (coseBytes.length < 64) {
      throw new AxioPassError(
        "Không tìm thấy uncompressed EC point marker (0x04) trong COSE key",
        "COSE_UNCOMPRESSED_MARKER_NOT_FOUND"
      )
    }
    offset = coseBytes.length - 65
    if (coseBytes[offset] !== 0x04) {
      // Coi 64 bytes cuối là x||y không có prefix
      const xBytes64 = coseBytes.slice(coseBytes.length - 64, coseBytes.length - 32)
      const yBytes64 = coseBytes.slice(coseBytes.length - 32)
      if (xBytes64.length !== 32 || yBytes64.length !== 32) {
        throw new AxioPassError(
          "Không thể trích xuất x/y coordinates hợp lệ từ COSE key",
          "COSE_INVALID_POINT"
        )
      }
      const prefix64 = yBytes64[31] % 2 === 0 ? 0x02 : 0x03
      const compressed64 = new Uint8Array(33)
      compressed64[0] = prefix64
      compressed64.set(xBytes64, 1)
      return compressed64
    }
  }

  const xBytes = coseBytes.slice(offset + 1, offset + 33)
  const yBytes = coseBytes.slice(offset + 33, offset + 65)

  if (xBytes.length !== 32 || yBytes.length !== 32) {
    throw new AxioPassError(
      "x hoặc y coordinate không đủ 32 bytes trong COSE key",
      "COSE_INVALID_POINT"
    )
  }

  // Compressed: 0x02 nếu y chẵn, 0x03 nếu y lẻ
  const prefix = yBytes[31] % 2 === 0 ? 0x02 : 0x03
  const compressed = new Uint8Array(33)
  compressed[0] = prefix
  compressed.set(xBytes, 1)
  return compressed
}

// ─── Core: WebAuthn Ký Giao Dịch Phi Trạng Thái ─────────────────────────────

/**
 * Ký giao dịch phi trạng thái (Stateless Transaction) bằng WebAuthn credential.
 *
 * Quy trình:
 *   1. Hash txBytes → SHA-256 challenge
 *   2. Tạo WebAuthn Authentication request với challenge = hash(txBytes)
 *   3. Trình duyệt hiển thị biometric prompt (Face ID / Touch ID / PIN)
 *   4. Secure Enclave ký challenge, trả về signature
 *   5. Trả về SignedTransaction với signature + credentialId + publicKey
 *
 * @param txBytes     - Bytes giao dịch cần ký (StatelessTransaction payload)
 * @param credentialId - ID credential WebAuthn đã đăng ký trước đó
 * @returns SignedTransaction
 */
export async function signTransactionStateless(
  txBytes: Uint8Array,
  credentialId: string
): Promise<SignedTransaction> {
  if (!browserSupportsWebAuthn()) {
    throw new AxioPassError(
      "Trình duyệt không hỗ trợ WebAuthn / Passkey",
      "WEBAUTHN_NOT_SUPPORTED"
    )
  }
  if (!txBytes || txBytes.length === 0) {
    throw new AxioPassError("txBytes không hợp lệ", "INVALID_TX_BYTES")
  }
  if (!credentialId) {
    throw new AxioPassError("credentialId trống", "MISSING_CREDENTIAL_ID")
  }

  // Bước 1 — Hash tx payload làm challenge
  const challenge = await sha256(txBytes)
  const challengeBase64 = btoa(String.fromCharCode(...challenge))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")

  // Bước 2 — Tạo Authentication options
  const authOptions: PublicKeyCredentialRequestOptionsJSON = {
    challenge: challengeBase64,
    allowCredentials: [
      {
        id: credentialId,
        type: "public-key",
        transports: ["internal", "hybrid"],
      },
    ],
    userVerification: "required",
    timeout: 60000,
    rpId: typeof window !== "undefined" ? window.location.hostname : "axioledger.org",
  }

  // Bước 3 — Gọi WebAuthn (hiển thị biometric prompt)
  let authResponse: AuthenticationResponseJSON
  try {
    authResponse = await startAuthentication({ optionsJSON: authOptions })
  } catch (err) {
    throw new AxioPassError(
      "WebAuthn authentication thất bại hoặc người dùng hủy",
      "WEBAUTHN_AUTH_FAILED",
      err
    )
  }

  // Bước 4 — Trích xuất signature
  const signatureBytes = base64urlToBytes(authResponse.response.signature)

  // Bước 5 — Trích xuất public key từ authenticatorData
  // SECURITY: KHÔNG fallback về zero key — throw để caller xử lý re-enrollment
  const authDataBytes = base64urlToBytes(authResponse.response.authenticatorData)
  let publicKey: Uint8Array
  try {
    publicKey = coseKeyToCompressedSecp256k1(authDataBytes)
  } catch (keyErr) {
    throw new AxioPassError(
      `Không thể trích xuất public key từ WebAuthn authenticatorData. ` +
      `Vui lòng thử lại hoặc đăng ký lại Passkey. Chi tiết: ${(keyErr as Error).message}`,
      "COSE_KEY_EXTRACTION_FAILED",
      keyErr
    )
  }

  return {
    txBytes,
    signature: signatureBytes,
    credentialId: authResponse.id,
    publicKey,
    signedAt: Date.now(),
  }
}

/**
 * Xác minh chữ ký từ WebAuthn Authentication Response.
 *
 * Kiểm tra:
 *   1. clientDataJSON chứa đúng type = "webauthn.get"
 *   2. authenticatorData không rỗng
 *   3. signature hợp lệ (không rỗng, độ dài hợp lý)
 *
 * Ghi chú: Xác minh đầy đủ (kiểm tra origin, rpIdHash, flags) phải thực hiện
 * ở phía server (backend) hoặc on-chain verifier. Hàm này chỉ kiểm tra
 * client-side sanity check.
 *
 * @param response - AuthenticationResponseJSON từ WebAuthn browser API
 * @returns true nếu response có cấu trúc hợp lệ
 */
export async function verifyWebAuthnSignature(
  response: AuthenticationResponseJSON
): Promise<boolean> {
  try {
    // Decode clientDataJSON
    const clientDataBytes = base64urlToBytes(response.response.clientDataJSON)
    const clientData = JSON.parse(new TextDecoder().decode(clientDataBytes)) as {
      type: string
      challenge: string
      origin: string
    }

    // Kiểm tra type
    if (clientData.type !== "webauthn.get") {
      return false
    }

    // Kiểm tra authenticatorData
    const authData = base64urlToBytes(response.response.authenticatorData)
    if (authData.length < 37) {
      // Minimum: 32 (rpIdHash) + 1 (flags) + 4 (counter)
      return false
    }

    // Kiểm tra signature không rỗng
    const signature = base64urlToBytes(response.response.signature)
    if (signature.length < 8) {
      return false
    }

    return true
  } catch {
    return false
  }
}

/**
 * Trích xuất và chuẩn hóa public key AxioPass từ credential public key bytes
 * trả về trong quá trình đăng ký WebAuthn.
 *
 * Hỗ trợ:
 *   - COSE EC2 (P-256, secp256k1) — định dạng chính
 *   - Raw 65-byte uncompressed (0x04 || x || y)
 *   - Raw 33-byte compressed (0x02/0x03 || x)
 *
 * @param credentialPublicKey - Bytes public key từ WebAuthn registration response
 * @returns Public key compressed secp256k1 (33 bytes)
 */
export async function deriveAxioPassPublicKey(
  credentialPublicKey: Uint8Array
): Promise<Uint8Array> {
  if (!credentialPublicKey || credentialPublicKey.length === 0) {
    throw new AxioPassError(
      "credentialPublicKey trống",
      "INVALID_PUBLIC_KEY"
    )
  }

  // Đã là compressed (33 bytes, prefix 0x02 hoặc 0x03)
  if (
    credentialPublicKey.length === 33 &&
    (credentialPublicKey[0] === 0x02 || credentialPublicKey[0] === 0x03)
  ) {
    return credentialPublicKey
  }

  // Uncompressed (65 bytes, prefix 0x04)
  if (
    credentialPublicKey.length === 65 &&
    credentialPublicKey[0] === 0x04
  ) {
    return coseKeyToCompressedSecp256k1(credentialPublicKey)
  }

  // COSE format (> 65 bytes)
  if (credentialPublicKey.length > 65) {
    return coseKeyToCompressedSecp256k1(credentialPublicKey)
  }

  throw new AxioPassError(
    `Định dạng public key không nhận diện được (length=${credentialPublicKey.length})`,
    "UNSUPPORTED_KEY_FORMAT"
  )
}

// ─── AxioPassConnector — High-level Wallet Interface ─────────────────────────

/**
 * AxioPassConnector — Trình kết nối ví AxioPass tích hợp WebAuthn + secp256k1.
 *
 * Sử dụng:
 * ```typescript
 * const wallet = new AxioPassConnector({ chainId: "axioledger-testnet-phase0" })
 * await wallet.register("Alice")
 * await wallet.connect()
 * const tx = await wallet.sendTransaction({ to: "dong.axq", amount: "1000000" })
 * ```
 */
export class AxioPassConnector {
  private session:    WalletSession | null = null
  private readonly chainId:    string
  private readonly rpId:       string
  private readonly compliance: ComplianceChecker | null

  constructor(options?: {
    chainId?:           string
    rpId?:              string
    /**
     * ComplianceChecker tùy chỉnh.
     * undefined → dùng default singleton (env vars AXIO_OFAC_*)
     * null      → tắt compliance check (chỉ dùng trong unit test)
     */
    complianceChecker?: ComplianceChecker | null
  }) {
    this.chainId    = options?.chainId ?? "axioledger-testnet-phase0"
    this.rpId       = options?.rpId ??
      (typeof window !== "undefined" ? window.location.hostname : "axioledger.org")
    this.compliance = options?.complianceChecker === null
      ? null
      : (options?.complianceChecker ?? getDefaultComplianceChecker())
  }

  /** Đăng ký credential WebAuthn mới cho người dùng */
  async register(username: string): Promise<RegistrationResponseJSON> {
    if (!browserSupportsWebAuthn()) {
      throw new AxioPassError(
        "Trình duyệt không hỗ trợ WebAuthn",
        "WEBAUTHN_NOT_SUPPORTED"
      )
    }

    const regOptions: PublicKeyCredentialCreationOptionsJSON = {
      challenge: btoa(crypto.randomUUID()),
      rp: { name: "Axioledger AxioPass", id: this.rpId },
      user: {
        id: btoa(username),
        name: username,
        displayName: username,
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },   // ES256 (P-256)
        { alg: -257, type: "public-key" }, // RS256 (RSA) fallback
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "required",
      },
      timeout: 60000,
      attestation: "none",
    }

    try {
      const regResponse = await startRegistration({ optionsJSON: regOptions })
      return regResponse
    } catch (err) {
      throw new AxioPassError(
        "Đăng ký WebAuthn thất bại",
        "WEBAUTHN_REGISTRATION_FAILED",
        err
      )
    }
  }

  /** Kết nối ví (chọn credential đã đăng ký) */
  async connect(credentialId?: string): Promise<WalletSession> {
    if (!browserSupportsWebAuthn()) {
      throw new AxioPassError(
        "Trình duyệt không hỗ trợ WebAuthn",
        "WEBAUTHN_NOT_SUPPORTED"
      )
    }

    // Sinh challenge ngẫu nhiên cho việc kết nối
    const connectChallenge = new Uint8Array(32)
    crypto.getRandomValues(connectChallenge)
    const challengeBase64 = btoa(String.fromCharCode(...connectChallenge))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")

    const authOptions: PublicKeyCredentialRequestOptionsJSON = {
      challenge: challengeBase64,
      userVerification: "required",
      timeout: 60000,
      rpId: this.rpId,
      ...(credentialId
        ? {
            allowCredentials: [
              { id: credentialId, type: "public-key", transports: ["internal"] },
            ],
          }
        : {}),
    }

    let authResponse: AuthenticationResponseJSON
    try {
      authResponse = await startAuthentication({ optionsJSON: authOptions })
    } catch (err) {
      throw new AxioPassError(
        "Kết nối ví thất bại",
        "WALLET_CONNECT_FAILED",
        err
      )
    }

    // Trích xuất public key từ authenticatorData
    // SECURITY: KHÔNG fallback về raw bytes ngắn — throw nếu parse thất bại
    const authDataBytes = base64urlToBytes(authResponse.response.authenticatorData)
    let publicKeyHex: string
    try {
      const compressed = coseKeyToCompressedSecp256k1(authDataBytes)
      publicKeyHex = bytesToHex(compressed)
    } catch (keyErr) {
      throw new AxioPassError(
        `Không thể trích xuất public key khi kết nối ví. ` +
        `Vui lòng thử lại hoặc đăng ký lại Passkey. Chi tiết: ${(keyErr as Error).message}`,
        "COSE_KEY_EXTRACTION_FAILED",
        keyErr
      )
    }

    // Sinh địa chỉ native SVM từ public key (hash đơn giản cho testnet)
    const pkHash = await sha256(new TextEncoder().encode(publicKeyHex))
    const address = bytesToHex(pkHash.slice(0, 20))

    this.session = {
      address,
      publicKeyHex,
      credentialId: authResponse.id,
      connected: true,
      chainId: this.chainId,
    }

    return this.session
  }

  /** Ngắt kết nối ví */
  disconnect(): void {
    this.session = null
  }

  /** Lấy phiên hiện tại (null nếu chưa kết nối) */
  getSession(): WalletSession | null {
    return this.session
  }

  /** Kiểm tra trạng thái kết nối */
  isConnected(): boolean {
    return this.session?.connected === true
  }

  /**
   * Ký và gửi giao dịch.
   * Trong môi trường production, txBytes sẽ được serialize bởi
   * @axioledger/ans-sdk và gửi qua Axioledger L2 Sequencer RPC.
   */
  async sendTransaction(params: TransactionParams): Promise<{ txHash: string }> {
    if (!this.session) {
      throw new AxioPassError(
        "Chưa kết nối ví. Gọi connect() trước.",
        "WALLET_NOT_CONNECTED"
      )
    }

    // ── Compliance check (OFAC/SDN) ────────────────────────────────────────
    // Kiểm tra cả địa chỉ người gửi (from = session.address) và người nhận
    // (params.to — có thể là địa chỉ ví hoặc ANS domain).
    // ComplianceError sẽ được throw và phải được UI xử lý để hiển thị
    // thông báo phù hợp cho người dùng.
    if (this.compliance) {
      await this.compliance.assertAllAddressesAllowed([
        this.session.address,
        params.to,
      ])
    }

    // Serialize transaction payload (đơn giản hóa cho testnet)
    const payloadJson = JSON.stringify({
      from:    this.session.address,
      to:      params.to,
      amount:  params.amount,
      memo:    params.memo ?? "",
      chainId: this.chainId,
      nonce:   Date.now().toString(),
    })
    const txBytes = new TextEncoder().encode(payloadJson)

    // Ký bằng WebAuthn Passkey
    const signed = await signTransactionStateless(txBytes, this.session.credentialId)

    // Tạo txHash từ hash của (txBytes + signature)
    const combined = new Uint8Array(signed.txBytes.length + signed.signature.length)
    combined.set(signed.txBytes, 0)
    combined.set(signed.signature, signed.txBytes.length)
    const hashBytes = await sha256(combined)
    const txHash = "0x" + bytesToHex(hashBytes)

    return { txHash }
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export default AxioPassConnector
