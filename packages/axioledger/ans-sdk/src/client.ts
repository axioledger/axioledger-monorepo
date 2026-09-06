/**
 * @axioledger/ans-sdk — AnsClient
 *
 * Lớp client chính để tương tác với ANS Registry program trên Axioledger/Solana.
 * Cung cấp các method để:
 *   - Giải mã (resolve) tên miền .axq
 *   - Lấy danh sách tên miền của một owner
 *   - Xây dựng và gửi transaction đăng ký / cập nhật tên miền
 *
 * Thiết kế:
 *   - Không giữ state wallet — caller cung cấp wallet adapter khi cần sign
 *   - Cache in-memory với TTL để đạt mục tiêu < 10ms khi resolve lần 2
 *   - Mọi lỗi RPC được wrap thành AnsClientError có typed message
 */

import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  type Commitment,
  type GetProgramAccountsFilter,
  type Signer,
} from "@solana/web3.js"
import BN from "bn.js"

import {
  deserializeAnsNameRecord,
  rawToAnsRecord,
  type AnsRecord,
  type AnsRecordFormat,
  ANS_RECORD_FORMAT,
} from "./schema.js"
import {
  deriveNameAccountPDA,
  deriveResolverPDA,
  normalizeName,
  parseDomain,
} from "./pda.js"
import {
  buildRegisterNameIx,
  buildUpdateRecordIx,
  buildTransferNameIx,
  buildRenewNameIx,
  type RegisterNameParams,
  type UpdateRecordParams,
  type TransferNameParams,
  type RenewNameParams,
} from "./instructions.js"
import {
  ComplianceChecker,
  getDefaultComplianceChecker,
} from "./compliance.js"

// ─── Error Types ──────────────────────────────────────────────────────────────

/**
 * Lỗi có kiểu rõ ràng từ AnsClient — không dùng any.
 */
export class AnsClientError extends Error {
  constructor(
    message: string,
    /** Mã lỗi để phân loại xử lý ở phía caller */
    public readonly code:
      | "NOT_FOUND"
      | "DECODE_ERROR"
      | "RPC_ERROR"
      | "INVALID_DOMAIN"
      | "WALLET_NOT_CONNECTED"
  ) {
    super(message)
    this.name = "AnsClientError"
  }
}

// ─── Cache Entry ──────────────────────────────────────────────────────────────

interface CacheEntry {
  record:     AnsRecord
  fetchedAt:  number   // Date.now() ms
}

// ─── Options ──────────────────────────────────────────────────────────────────

export interface AnsClientOptions {
  /** Connection tới Axioledger/Solana RPC */
  connection: Connection
  /** PublicKey của ANS Registry program */
  programId: PublicKey
  /** Mức cam kết cho các query. Mặc định: "confirmed" */
  commitment?: Commitment
  /** Cache TTL tính bằng ms. Mặc định: 30_000 (30 giây) */
  cacheTtlMs?: number
  /**
   * ComplianceChecker tùy chỉnh. Nếu không truyền → dùng singleton mặc định
   * (đọc AXIO_OFAC_API_URL + AXIO_OFAC_API_KEY từ env vars).
   * Truyền `null` để TẮT kiểm tra compliance (chỉ dùng trong unit test).
   */
  complianceChecker?: ComplianceChecker | null
}

// ─── Wallet Adapter interface tối giản (tránh import toàn bộ adapter package) ─

export interface MinimalWalletAdapter {
  publicKey: PublicKey | null
  signTransaction: (tx: Transaction) => Promise<Transaction>
  signAllTransactions?: (txs: Transaction[]) => Promise<Transaction[]>
}

// ─── RegisterOptions ──────────────────────────────────────────────────────────

export interface RegisterOptions {
  format?:    AnsRecordFormat
  ttl?:       number
  expiresAt?: BN
}

// ─── AnsClient ────────────────────────────────────────────────────────────────

export class AnsClient {
  private readonly connection:  Connection
  private readonly programId:   PublicKey
  private readonly commitment:  Commitment
  private readonly cacheTtlMs:  number
  private readonly cache:       Map<string, CacheEntry>
  private readonly compliance:  ComplianceChecker | null

  constructor(opts: AnsClientOptions) {
    this.connection = opts.connection
    this.programId  = opts.programId
    this.commitment = opts.commitment ?? "confirmed"
    this.cacheTtlMs = opts.cacheTtlMs ?? 30_000
    this.cache      = new Map()
    // undefined → dùng default singleton; null → tắt hoàn toàn (test only)
    this.compliance = opts.complianceChecker === null
      ? null
      : (opts.complianceChecker ?? getDefaultComplianceChecker())
  }

  // ── resolveName ─────────────────────────────────────────────────────────────

  /**
   * Giải mã một tên miền .axq thành AnsRecord.
   * Ưu tiên cache (mục tiêu < 1ms), RPC khi cache miss (mục tiêu < 10ms).
   *
   * @param name - Tên đơn, ví dụ "alice"
   * @param tld  - TLD, ví dụ "axq"
   * @returns AnsRecord nếu tồn tại, null nếu chưa đăng ký
   * @throws AnsClientError nếu có lỗi RPC hoặc decode
   */
  async resolveName(name: string, tld: string): Promise<AnsRecord | null> {
    const key = `${normalizeName(name)}.${normalizeName(tld)}`

    // Kiểm tra cache
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.fetchedAt < this.cacheTtlMs) {
      return cached.record
    }

    const [pda] = deriveNameAccountPDA(name, tld, this.programId)

    let accountInfo: Awaited<ReturnType<Connection["getAccountInfo"]>>
    try {
      accountInfo = await this.connection.getAccountInfo(pda, this.commitment)
    } catch (err) {
      throw new AnsClientError(
        `resolveName: RPC thất bại khi lấy account "${key}": ${String(err)}`,
        "RPC_ERROR"
      )
    }

    if (!accountInfo) return null   // account không tồn tại → chưa đăng ký

    let record: AnsRecord
    try {
      const raw = deserializeAnsNameRecord(Buffer.from(accountInfo.data))
      record = rawToAnsRecord(raw)
    } catch (err) {
      throw new AnsClientError(
        `resolveName: không thể decode dữ liệu account "${key}": ${String(err)}`,
        "DECODE_ERROR"
      )
    }

    this.cache.set(key, { record, fetchedAt: Date.now() })
    return record
  }

  // ── resolveByDomain ─────────────────────────────────────────────────────────

  /**
   * Giải mã theo chuỗi domain đầy đủ, ví dụ "alice.axq".
   * Wrapper tiện lợi của resolveName.
   */
  async resolveByDomain(domain: string): Promise<AnsRecord | null> {
    const { name, tld } = parseDomain(domain)
    return this.resolveName(name, tld)
  }

  // ── getNamesByOwner ─────────────────────────────────────────────────────────

  /**
   * Lấy tất cả tên miền thuộc sở hữu của một PublicKey.
   * Dùng `getProgramAccounts` với memcmp filter theo owner bytes.
   *
   * @param owner - PublicKey của chủ sở hữu
   * @returns Mảng AnsRecord, có thể rỗng nếu chưa có tên miền
   */
  async getNamesByOwner(owner: PublicKey): Promise<AnsRecord[]> {
    // Offset của trường `owner` trong AnsNameRecord (sau các field đứng trước)
    // Borsh layout: owner bắt đầu từ byte 0 (field đầu tiên, độ dài 32)
    const OWNER_OFFSET = 0

    const filters: GetProgramAccountsFilter[] = [
      {
        memcmp: {
          offset: OWNER_OFFSET,
          bytes:  owner.toBase58(),
        },
      },
    ]

    let accounts: Awaited<ReturnType<Connection["getProgramAccounts"]>>
    try {
      accounts = await this.connection.getProgramAccounts(this.programId, {
        commitment: this.commitment,
        filters,
      })
    } catch (err) {
      throw new AnsClientError(
        `getNamesByOwner: RPC thất bại: ${String(err)}`,
        "RPC_ERROR"
      )
    }

    const results: AnsRecord[] = []
    for (const { account } of accounts) {
      try {
        const raw = deserializeAnsNameRecord(Buffer.from(account.data))
        results.push(rawToAnsRecord(raw))
      } catch {
        // Bỏ qua account có dữ liệu không hợp lệ (không throw để không gián đoạn)
        continue
      }
    }
    return results
  }

  // ── registerName ─────────────────────────────────────────────────────────────

  /**
   * Đăng ký một tên miền .axq mới.
   * Tạo transaction, ký bằng wallet adapter, gửi và đợi confirmation.
   *
   * @param wallet  - Wallet adapter đã connect
   * @param name    - Tên đơn muốn đăng ký, ví dụ "alice"
   * @param tld     - TLD, ví dụ "axq"
   * @param value   - Địa chỉ / hash / CID gắn vào tên
   * @param options - Các tuỳ chọn bổ sung
   * @returns Transaction signature (base58)
   * @throws AnsClientError nếu wallet chưa connect hoặc RPC thất bại
   */
  async registerName(
    wallet: MinimalWalletAdapter,
    name: string,
    tld: string,
    value: string,
    options: RegisterOptions = {}
  ): Promise<string> {
    if (!wallet.publicKey) {
      throw new AnsClientError(
        "registerName: ví chưa được kết nối",
        "WALLET_NOT_CONNECTED"
      )
    }

    // ── Compliance check (OFAC/SDN) ──────────────────────────────────────────
    // Kiểm tra cả địa chỉ người đăng ký (payer) lẫn giá trị được gắn vào tên
    // (value thường là địa chỉ ví đích — cần kiểm tra cả hai).
    if (this.compliance) {
      await this.compliance.assertAllAddressesAllowed([
        wallet.publicKey.toBase58(),
        value,
      ])
    }

    const params: RegisterNameParams = {
      name,
      tld,
      value,
      payer:     wallet.publicKey,
      programId: this.programId,
      format:    options.format    ?? ANS_RECORD_FORMAT.SVM,
      ttl:       options.ttl       ?? 86400,
      expiresAt: options.expiresAt ?? new BN(0),
    }

    const ix = buildRegisterNameIx(params)
    const tx = new Transaction().add(ix)

    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash(this.commitment)
    tx.recentBlockhash = blockhash
    tx.feePayer = wallet.publicKey

    const signed = await wallet.signTransaction(tx)

    let sig: string
    try {
      sig = await this.connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
      })
      await this.connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        this.commitment
      )
    } catch (err) {
      throw new AnsClientError(
        `registerName: gửi transaction thất bại: ${String(err)}`,
        "RPC_ERROR"
      )
    }

    // Xoá cache để lần resolve sau lấy dữ liệu mới
    this.invalidateCache(`${normalizeName(name)}.${normalizeName(tld)}`)
    return sig
  }

  // ── updateRecord ─────────────────────────────────────────────────────────────

  /**
   * Cập nhật bản ghi của một tên miền đã đăng ký.
   * Chỉ chủ sở hữu mới có thể ký transaction này.
   */
  async updateRecord(
    wallet: MinimalWalletAdapter,
    params: Omit<UpdateRecordParams, "owner" | "programId">
  ): Promise<string> {
    if (!wallet.publicKey) {
      throw new AnsClientError("updateRecord: ví chưa được kết nối", "WALLET_NOT_CONNECTED")
    }

    const ix = buildUpdateRecordIx({
      ...params,
      owner:     wallet.publicKey,
      programId: this.programId,
    })
    const tx = new Transaction().add(ix)

    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash(this.commitment)
    tx.recentBlockhash = blockhash
    tx.feePayer = wallet.publicKey

    const signed = await wallet.signTransaction(tx)

    let sig: string
    try {
      sig = await this.connection.sendRawTransaction(signed.serialize())
      await this.connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        this.commitment
      )
    } catch (err) {
      throw new AnsClientError(
        `updateRecord: transaction thất bại: ${String(err)}`,
        "RPC_ERROR"
      )
    }

    this.invalidateCache(`${normalizeName(params.name)}.${normalizeName(params.tld)}`)
    return sig
  }

  // ── transferName ──────────────────────────────────────────────────────────────

  /**
   * Chuyển quyền sở hữu tên miền sang địa chỉ mới.
   */
  async transferName(
    wallet: MinimalWalletAdapter,
    params: Omit<TransferNameParams, "owner" | "programId">
  ): Promise<string> {
    if (!wallet.publicKey) {
      throw new AnsClientError("transferName: ví chưa được kết nối", "WALLET_NOT_CONNECTED")
    }

    const ix = buildTransferNameIx({
      ...params,
      owner:     wallet.publicKey,
      programId: this.programId,
    })
    return this._sendTx(wallet, ix, `${normalizeName(params.name)}.${normalizeName(params.tld)}`)
  }

  // ── renewName ─────────────────────────────────────────────────────────────────

  /**
   * Gia hạn thời gian sở hữu tên miền.
   */
  async renewName(
    wallet: MinimalWalletAdapter,
    params: Omit<RenewNameParams, "payer" | "programId">
  ): Promise<string> {
    if (!wallet.publicKey) {
      throw new AnsClientError("renewName: ví chưa được kết nối", "WALLET_NOT_CONNECTED")
    }

    const ix = buildRenewNameIx({
      ...params,
      payer:     wallet.publicKey,
      programId: this.programId,
    })
    return this._sendTx(wallet, ix, `${normalizeName(params.name)}.${normalizeName(params.tld)}`)
  }

  // ── Cache helpers ─────────────────────────────────────────────────────────────

  invalidateCache(key: string): void {
    this.cache.delete(key)
  }

  clearCache(): void {
    this.cache.clear()
  }

  cacheSize(): number {
    return this.cache.size
  }

  // ── Internal helper ───────────────────────────────────────────────────────────

  private async _sendTx(
    wallet: MinimalWalletAdapter,
    ix: ReturnType<typeof buildRegisterNameIx>,
    cacheKey: string
  ): Promise<string> {
    const tx = new Transaction().add(ix)
    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash(this.commitment)
    tx.recentBlockhash = blockhash
    tx.feePayer = wallet.publicKey!

    const signed = await wallet.signTransaction(tx)
    let sig: string
    try {
      sig = await this.connection.sendRawTransaction(signed.serialize())
      await this.connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        this.commitment
      )
    } catch (err) {
      throw new AnsClientError(`Transaction thất bại: ${String(err)}`, "RPC_ERROR")
    }
    this.invalidateCache(cacheKey)
    return sig
  }
}
