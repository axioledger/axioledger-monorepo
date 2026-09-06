/**
 * @file types.ts
 * Định nghĩa các kiểu dữ liệu cốt lõi cho Market Registry trong KPX Protocol.
 * Tất cả các interface và class lỗi đều được khai báo tại đây để tái sử dụng toàn gói.
 */

// ---------------------------------------------------------------------------
// Trạng thái thị trường
// ---------------------------------------------------------------------------

/**
 * Trạng thái vòng đời của một thị trường giao dịch.
 * - active:     Đang hoạt động, có thể nhận lệnh.
 * - paused:     Tạm dừng, không nhận lệnh mới.
 * - deprecated: Ngừng hoạt động vĩnh viễn, không thể khôi phục.
 * - pending:    Đã đăng ký nhưng chưa được kích hoạt.
 */
export type MarketStatus = "active" | "paused" | "deprecated" | "pending";

// ---------------------------------------------------------------------------
// Cặp tài sản
// ---------------------------------------------------------------------------

/**
 * Cặp tài sản giao dịch gồm tài sản cơ sở và tài sản định giá.
 * Ví dụ: baseAsset = "BTC", quoteAsset = "USDC"
 */
export interface AssetPair {
  /** Tài sản cơ sở (tài sản được mua/bán) */
  baseAsset: string;
  /** Tài sản định giá (tài sản dùng để thanh toán) */
  quoteAsset: string;
}

// ---------------------------------------------------------------------------
// Cấu hình thị trường
// ---------------------------------------------------------------------------

/**
 * Toàn bộ cấu hình của một thị trường trong registry.
 * Mọi trường đều bắt buộc để đảm bảo tính toàn vẹn dữ liệu.
 */
export interface MarketConfig {
  /** Mã định danh duy nhất của thị trường (ví dụ: "BTC-USDC") */
  id: string;
  /** Tài sản cơ sở của cặp giao dịch */
  baseAsset: string;
  /** Tài sản định giá của cặp giao dịch */
  quoteAsset: string;
  /**
   * Phí giao dịch tính theo basis points (bps).
   * 1 bps = 0.01%. Phạm vi hợp lệ: 0 – 10 000 (tương đương 0% – 100%).
   */
  feeBps: number;
  /** Kích thước lệnh tối thiểu (đơn vị: tài sản cơ sở) */
  minOrderSize: number;
  /** Kích thước lệnh tối đa (đơn vị: tài sản cơ sở) */
  maxOrderSize: number;
  /** Trạng thái hiện tại của thị trường */
  status: MarketStatus;
  /** Thời điểm thị trường được tạo (Unix timestamp, milliseconds) */
  createdAt: number;
  /** Thời điểm cấu hình thị trường được cập nhật lần cuối (Unix timestamp, milliseconds) */
  updatedAt: number;
}

// ---------------------------------------------------------------------------
// Mã lỗi registry
// ---------------------------------------------------------------------------

/**
 * Các mã lỗi chuẩn của Market Registry.
 * Dùng để phân loại lỗi một cách rõ ràng thay vì phụ thuộc vào chuỗi thông báo.
 */
export type MarketRegistryErrorCode =
  | "MARKET_NOT_FOUND"       // Không tìm thấy thị trường với ID đã cho
  | "MARKET_ALREADY_EXISTS"  // Đã tồn tại thị trường với ID trùng lặp
  | "INVALID_CONFIG"         // Cấu hình thị trường không hợp lệ
  | "REGISTRY_LOCKED";       // Registry đang bị khoá, không cho phép thay đổi

// ---------------------------------------------------------------------------
// Class lỗi tùy chỉnh
// ---------------------------------------------------------------------------

/**
 * Lỗi chuyên biệt của Market Registry, mang theo mã lỗi có kiểu rõ ràng.
 * Sử dụng thay cho Error thông thường để caller có thể xử lý lỗi theo từng mã.
 *
 * @example
 * throw new MarketRegistryError("MARKET_NOT_FOUND", `Không tìm thấy market: ${id}`);
 */
export class MarketRegistryError extends Error {
  /** Mã lỗi xác định loại lỗi xảy ra trong registry */
  public readonly code: MarketRegistryErrorCode;

  constructor(code: MarketRegistryErrorCode, message: string) {
    super(message);
    // Đặt tên lỗi để dễ nhận dạng trong stack trace
    this.name = "MarketRegistryError";
    this.code = code;
    // Khắc phục vấn đề prototype chain khi extend Error trong TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
