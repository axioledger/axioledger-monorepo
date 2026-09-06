/**
 * @file types.ts
 * Định nghĩa tất cả kiểu dữ liệu cốt lõi cho Intents Engine.
 * Các kiểu này được dùng xuyên suốt toàn bộ package.
 */

// ─── Kiểu loại Intent ────────────────────────────────────────────────────────

/**
 * Loại hành động mà người dùng muốn thực hiện thông qua hệ thống intents.
 * - swap: Hoán đổi token trên cùng một chuỗi
 * - bridge: Chuyển token sang chuỗi khác
 * - limit_order: Đặt lệnh giới hạn với mức giá cụ thể
 * - cancel: Hủy một intent đang chờ xử lý
 */
export type IntentType = "swap" | "bridge" | "limit_order" | "cancel";

// ─── Trạng thái vòng đời Intent ───────────────────────────────────────────────

/**
 * Trạng thái trong vòng đời thực thi của một intent.
 * - pending: Vừa được tạo, chưa gửi lên mạng
 * - submitted: Đã gửi lên mạng solver
 * - matched: Đã được solver chấp nhận
 * - executing: Đang trong quá trình thực thi on-chain
 * - completed: Hoàn thành thành công
 * - failed: Thất bại do lỗi
 * - expired: Hết hạn trước khi được thực thi
 */
export type IntentStatus =
  | "pending"
  | "submitted"
  | "matched"
  | "executing"
  | "completed"
  | "failed"
  | "expired";

// ─── Cấu trúc Intent ─────────────────────────────────────────────────────────

/**
 * Đối tượng Intent đại diện cho một yêu cầu giao dịch của người dùng.
 * Intent là đơn vị cơ bản trong hệ thống NEAR Intents Protocol.
 */
export interface Intent {
  /** Định danh duy nhất của intent, thường là UUID v4 */
  id: string;

  /** Loại hành động: swap, bridge, limit_order, hoặc cancel */
  type: IntentType;

  /** Địa chỉ hoặc symbol của token nguồn (ví dụ: "USDC", "near:usdc.token.near") */
  fromAsset: string;

  /** Địa chỉ hoặc symbol của token đích */
  toAsset: string;

  /** Số lượng token nguồn muốn dùng, biểu diễn dạng chuỗi để tránh mất độ chính xác */
  fromAmount: string;

  /** Số lượng token đích tối thiểu chấp nhận được (slippage bảo vệ) */
  toAmountMin: string;

  /** Thời điểm hết hạn của intent, tính bằng Unix timestamp (giây) */
  expiry: number;

  /** Dữ liệu bổ sung tùy theo loại intent (ví dụ: targetChain cho bridge) */
  metadata: Record<string, unknown>;
}

// ─── Báo giá từ Solver ────────────────────────────────────────────────────────

/**
 * Báo giá do solver cung cấp cho một intent cụ thể.
 * Người dùng cần chấp thuận quote trước khi thực thi.
 */
export interface Quote {
  /** ID của intent mà quote này ứng với */
  intentId: string;

  /** Địa chỉ ví của solver cung cấp báo giá này */
  solverAddress: string;

  /** Số lượng token đầu vào mà solver sẽ lấy */
  fromAmount: string;

  /** Số lượng token đầu ra mà người dùng sẽ nhận */
  toAmount: string;

  /** Phí tính theo basis points (1 bps = 0.01%). Ví dụ: 30 = 0.3% */
  feeBps: number;

  /** Thời điểm quote hết hạn, tính bằng Unix timestamp (giây) */
  validUntil: number;
}

// ─── Kết quả thực thi ─────────────────────────────────────────────────────────

/**
 * Kết quả trả về sau khi thực thi một intent.
 * Chứa thông tin trạng thái và các giá trị thực tế của giao dịch.
 */
export interface ExecutionResult {
  /** ID của intent đã thực thi */
  intentId: string;

  /** Trạng thái cuối cùng của intent sau khi thực thi */
  status: IntentStatus;

  /** Hash giao dịch on-chain, chỉ có khi status = "completed" hoặc "failed" */
  txHash?: string;

  /** Số lượng token nguồn thực tế đã tiêu */
  actualFromAmount: string;

  /** Số lượng token đích thực tế nhận được */
  actualToAmount: string;

  /** Thông báo lỗi chi tiết, chỉ có khi status = "failed" */
  errorMessage?: string;
}

// ─── Mã lỗi định danh ─────────────────────────────────────────────────────────

/**
 * Các mã lỗi đặc thù của Intents Engine để phân biệt các tình huống lỗi.
 * Giúp phía gọi xử lý từng loại lỗi một cách có cấu trúc.
 */
export type IntentsEngineErrorCode =
  | "SOLVER_UNAVAILABLE"    // Không có solver nào sẵn sàng phục vụ intent này
  | "QUOTE_EXPIRED"         // Quote đã hết hạn trước khi người dùng thực thi
  | "INSUFFICIENT_BALANCE"  // Số dư không đủ để thực hiện giao dịch
  | "INVALID_INTENT"        // Intent có dữ liệu không hợp lệ hoặc thiếu trường bắt buộc
  | "EXECUTION_FAILED";     // Giao dịch on-chain thất bại

// ─── Lớp lỗi tùy chỉnh ───────────────────────────────────────────────────────

/**
 * Lớp lỗi tùy chỉnh cho Intents Engine.
 * Mang theo mã lỗi có kiểu để dễ phân biệt và xử lý programmatically.
 *
 * @example
 * throw new IntentsEngineError("QUOTE_EXPIRED", "Quote đã hết hạn 5 giây trước");
 */
export class IntentsEngineError extends Error {
  /** Mã lỗi có kiểu giúp phân loại nguyên nhân lỗi */
  readonly code: IntentsEngineErrorCode;

  constructor(code: IntentsEngineErrorCode, message: string) {
    super(message);
    this.code = code;
    // Đặt lại prototype để instanceof hoạt động đúng sau khi transpile
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "IntentsEngineError";
  }
}
