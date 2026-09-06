/**
 * @axioledger/ans-sdk — Compliance Middleware
 *
 * Bộ lọc OFAC/SDN (Office of Foreign Assets Control / Specially Designated
 * Nationals) tích hợp vào mọi điểm gửi giao dịch của ANS SDK và
 * AxioPassConnector.
 *
 * Luồng kiểm tra:
 *   1. Normalize địa chỉ (bech32, base58, EVM 0x) → lowercase hex
 *   2. Tra cứu local blocklist (bundle trong SDK, cập nhật qua CDN)
 *   3. Nếu AXIO_OFAC_API_URL được cấu hình → gọi API screening thứ 3
 *   4. Throw ComplianceError nếu hit — giao dịch bị chặn ngay lập tức
 *
 * QUAN TRỌNG — Giới hạn kỹ thuật:
 *   - Local blocklist chỉ là TẤM CHẮN ĐẦU TIÊN, không phải giải pháp hoàn chỉnh.
 *   - Triển khai production BẮT BUỘC phải tích hợp nhà cung cấp dữ liệu OFAC
 *     được cấp phép (Chainalysis, Elliptic, TRM Labs, v.v.) qua env var
 *     AXIO_OFAC_API_URL + AXIO_OFAC_API_KEY.
 *   - Quyết định cuối cùng về tuân thủ thuộc về bộ phận Pháp lý, không phải
 *     phần mềm.
 *
 * Cập nhật blocklist:
 *   - Cập nhật file này hoặc cấu hình AXIO_OFAC_BLOCKLIST_URL để tải danh
 *     sách mới nhất từ CDN nội bộ.
 *   - Tần suất khuyến nghị: hàng ngày (cron job trong CI/CD).
 *
 * Spec: ADVISORY_BOARD_REPORT.md §2 RR-L2 · FATF Recommendation 16
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ComplianceCheckResult {
  allowed:   boolean
  address:   string
  /** Lý do bị chặn — chỉ có khi allowed = false */
  reason?:   string
  /** Nguồn dữ liệu xác định vi phạm */
  source?:   "local-blocklist" | "ofac-api" | "pattern-match"
}

/** Lỗi tuân thủ — throw khi địa chỉ bị trừng phạt */
export class ComplianceError extends Error {
  constructor(
    public readonly address: string,
    public readonly reason: string,
    public readonly source: ComplianceCheckResult["source"]
  ) {
    super(
      `COMPLIANCE_BLOCKED: Địa chỉ "${address}" bị chặn bởi bộ lọc ${source}. ` +
      `Lý do: ${reason}. ` +
      `Liên hệ compliance@axioledger.org nếu bạn cho rằng đây là lỗi.`
    )
    this.name = "ComplianceError"
  }
}

// ─── Local Blocklist (seed data — cập nhật trước Testnet public) ──────────────
//
// HƯỚNG DẪN BẢO TRÌ:
//   Danh sách này chứa địa chỉ mẫu phục vụ unit test và minh họa kiến trúc.
//   Trước khi đưa lên Testnet, nhóm Legal phải:
//     1. Thay thế bằng danh sách OFAC SDN thực từ nhà cung cấp được cấp phép
//     2. Thiết lập pipeline cập nhật tự động (hàng ngày)
//     3. Bổ sung địa chỉ từ EU Sanctions List, UN Consolidated List
//
// Format: lowercase hex (không có prefix 0x), base58, hoặc bech32 tất cả
//   đều được normalize trước khi so sánh.
//
const SEED_BLOCKLIST: ReadonlySet<string> = new Set([
  // ── Địa chỉ mẫu cho unit test ────────────────────────────────────────────
  // Ethereum OFAC mẫu (đã được công bố công khai trong các test suite)
  "7f367cc49515606ec7f8dc97d7ad19bf7ca6b8a7",   // Tornado Cash deployer (public OFAC example)
  "d882cfc20f52f2599d84b8e8d58c7fb62cfe344b",   // mẫu OFAC addr 2
  "901bb9583b24d97e995513c6778dc6888ab6870e",   // mẫu OFAC addr 3
  // Solana (base58 → hex normalized)
  // EVM sanctioned addresses sẽ được thêm bởi Legal team
])

// ─── Address Normalizer ───────────────────────────────────────────────────────

/**
 * Chuẩn hóa địa chỉ về lowercase hex 20 bytes (40 ký tự) để so sánh nhất quán.
 *
 * Hỗ trợ:
 *   - EVM: `0x742d35Cc...` → `742d35cc...`
 *   - Base58 (Solana/SVM): trả về lowercase nguyên bản vì độ dài khác EVM
 *   - Bech32 (Cosmos): strip prefix `cosmos1...` → phần data lowercase
 */
function normalizeAddress(address: string): string {
  if (!address || address.trim().length === 0) return ""
  const trimmed = address.trim()

  // EVM hex — strip 0x prefix, lowercase
  if (trimmed.startsWith("0x") || trimmed.startsWith("0X")) {
    return trimmed.slice(2).toLowerCase()
  }

  // Bech32 — strip human-readable prefix (anything before "1")
  const bech32Sep = trimmed.indexOf("1")
  if (
    bech32Sep > 0 &&
    bech32Sep < trimmed.length - 1 &&
    /^[a-z]+$/.test(trimmed.slice(0, bech32Sep))
  ) {
    // Trả về toàn bộ lowercase để matching pattern
    return trimmed.toLowerCase()
  }

  // Base58 / bất kỳ định dạng nào khác — lowercase
  return trimmed.toLowerCase()
}

// ─── Optional External API Screening ─────────────────────────────────────────

interface OfacApiResponse {
  /** true = địa chỉ sạch, false = bị trừng phạt */
  clear:   boolean
  match?:  string
  reason?: string
}

/**
 * Gọi OFAC screening API bên ngoài (Chainalysis / TRM / Elliptic).
 * Chỉ được gọi khi AXIO_OFAC_API_URL được cấu hình.
 *
 * Trả về null nếu API không khả dụng (fail-open với cảnh báo).
 * Production phải dùng fail-closed — cần điều chỉnh theo chính sách Legal.
 */
async function checkExternalOfacApi(
  address: string,
  apiUrl: string,
  apiKey: string,
  timeoutMs = 5_000
): Promise<OfacApiResponse | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${apiUrl}/screen`, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "X-Client-Id":   "axioledger-ans-sdk",
      },
      body:   JSON.stringify({ address }),
      signal: controller.signal,
    })

    if (!res.ok) {
      console.warn(
        `[OFAC API] HTTP ${res.status} cho địa chỉ ${address} — ` +
        `fail-open theo cấu hình. Review chính sách với Legal team.`
      )
      return null
    }

    return res.json() as Promise<OfacApiResponse>
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      console.warn(`[OFAC API] Timeout (${timeoutMs}ms) — fail-open.`)
    } else {
      console.warn(`[OFAC API] Lỗi kết nối: ${(err as Error).message} — fail-open.`)
    }
    return null
  } finally {
    clearTimeout(timer)
  }
}

// ─── Core Checker ─────────────────────────────────────────────────────────────

export interface ComplianceCheckerOptions {
  /**
   * URL của OFAC screening API.
   * Đọc từ env var: AXIO_OFAC_API_URL
   * Nếu không cấu hình → chỉ dùng local blocklist.
   */
  apiUrl?: string
  /**
   * API key cho OFAC screening service.
   * Đọc từ env var: AXIO_OFAC_API_KEY
   */
  apiKey?: string
  /**
   * Danh sách bổ sung ngoài seed blocklist.
   * Dùng để inject danh sách từ CDN hoặc config động.
   */
  additionalBlocklist?: ReadonlySet<string>
  /**
   * Timeout cho external API call (ms). Mặc định: 5_000
   */
  apiTimeoutMs?: number
}

/**
 * ComplianceChecker — kiểm tra địa chỉ trước khi gửi giao dịch.
 *
 * Sử dụng:
 * ```typescript
 * const checker = new ComplianceChecker({
 *   apiUrl: process.env.AXIO_OFAC_API_URL,
 *   apiKey: process.env.AXIO_OFAC_API_KEY,
 * })
 * await checker.assertAllowed("0x742d35Cc...")  // throw nếu bị chặn
 * ```
 */
export class ComplianceChecker {
  private readonly apiUrl:             string | undefined
  private readonly apiKey:             string | undefined
  private readonly additionalBlocklist: ReadonlySet<string>
  private readonly apiTimeoutMs:        number

  constructor(options: ComplianceCheckerOptions = {}) {
    this.apiUrl              = options.apiUrl
    this.apiKey              = options.apiKey
    this.additionalBlocklist = options.additionalBlocklist ?? new Set()
    this.apiTimeoutMs        = options.apiTimeoutMs ?? 5_000
  }

  /**
   * Kiểm tra một địa chỉ. Trả về kết quả chi tiết.
   */
  async check(address: string): Promise<ComplianceCheckResult> {
    const normalized = normalizeAddress(address)
    if (!normalized) {
      return { allowed: false, address, reason: "Địa chỉ rỗng hoặc không hợp lệ", source: "pattern-match" }
    }

    // 1. Local blocklist (tức thì — không cần network)
    if (SEED_BLOCKLIST.has(normalized) || this.additionalBlocklist.has(normalized)) {
      return {
        allowed: false,
        address,
        reason:  "Địa chỉ nằm trong danh sách OFAC/SDN",
        source:  "local-blocklist",
      }
    }

    // 2. Pattern detection — địa chỉ toàn số 0 ngoại trừ prefix (burn/null address)
    if (/^0+$/.test(normalized) || /^0{38,}/.test(normalized)) {
      return {
        allowed: false,
        address,
        reason:  "Địa chỉ null/burn không được phép",
        source:  "pattern-match",
      }
    }

    // 3. External OFAC API (nếu được cấu hình)
    if (this.apiUrl && this.apiKey) {
      const apiResult = await checkExternalOfacApi(
        address,
        this.apiUrl,
        this.apiKey,
        this.apiTimeoutMs
      )
      if (apiResult !== null && !apiResult.clear) {
        return {
          allowed: false,
          address,
          reason:  apiResult.reason ?? `Match: ${apiResult.match ?? "unknown"}`,
          source:  "ofac-api",
        }
      }
    }

    return { allowed: true, address }
  }

  /**
   * Kiểm tra địa chỉ và throw ComplianceError nếu bị chặn.
   * Đây là hàm chính được gọi trong registerName() và sendTransaction().
   */
  async assertAllowed(address: string): Promise<void> {
    const result = await this.check(address)
    if (!result.allowed) {
      throw new ComplianceError(address, result.reason!, result.source)
    }
  }

  /**
   * Kiểm tra nhiều địa chỉ cùng lúc (sender + recipient).
   * Throw ngay khi gặp địa chỉ đầu tiên bị chặn.
   */
  async assertAllAddressesAllowed(addresses: string[]): Promise<void> {
    await Promise.all(addresses.map((addr) => this.assertAllowed(addr)))
  }
}

// ─── Singleton factory ────────────────────────────────────────────────────────

let _defaultChecker: ComplianceChecker | null = null

/**
 * Lấy ComplianceChecker mặc định (singleton, đọc env vars tự động).
 * Dùng trong AnsClient và AxioPassConnector để tránh khởi tạo lại nhiều lần.
 */
export function getDefaultComplianceChecker(): ComplianceChecker {
  if (!_defaultChecker) {
    const apiUrl = typeof process !== "undefined" ? process.env?.AXIO_OFAC_API_URL : undefined
    const apiKey = typeof process !== "undefined" ? process.env?.AXIO_OFAC_API_KEY : undefined
    _defaultChecker = new ComplianceChecker({ apiUrl, apiKey })
  }
  return _defaultChecker
}
