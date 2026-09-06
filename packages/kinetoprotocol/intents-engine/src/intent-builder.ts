/**
 * @file intent-builder.ts
 * Builder pattern để xây dựng Intent một cách an toàn với type-safety.
 * Sử dụng method chaining để API trở nên fluent và dễ đọc.
 */

import { randomUUID } from "crypto";
import type { Intent, IntentType } from "./types.js";
import { IntentsEngineError } from "./types.js";

// Thời gian sống mặc định của intent: 5 phút tính từ lúc build
const DEFAULT_EXPIRY_SECONDS = 5 * 60;

// ─── Lớp IntentBuilder ────────────────────────────────────────────────────────

/**
 * Builder giúp xây dựng đối tượng `Intent` một cách có kiểm tra.
 * Mỗi method trả về `this` để cho phép method chaining.
 *
 * @example
 * const intent = new IntentBuilder()
 *   .swap("USDC", "NEAR", "100")
 *   .withExpiry(300)
 *   .withMinOutput("95")
 *   .build();
 */
export class IntentBuilder {
  // Trường dữ liệu nội bộ đang được xây dựng
  private _type: IntentType | null = null;
  private _fromAsset: string | null = null;
  private _toAsset: string | null = null;
  private _fromAmount: string | null = null;
  private _toAmountMin: string = "0";
  private _expirySeconds: number = DEFAULT_EXPIRY_SECONDS;
  private _metadata: Record<string, unknown> = {};

  // ─── Phương thức thiết lập loại giao dịch ──────────────────────────────────

  /**
   * Thiết lập intent là lệnh hoán đổi token (swap).
   * @param from - Token nguồn (symbol hoặc địa chỉ hợp đồng)
   * @param to - Token đích
   * @param amount - Số lượng token nguồn muốn đổi
   */
  swap(from: string, to: string, amount: string): this {
    this._type = "swap";
    this._fromAsset = from;
    this._toAsset = to;
    this._fromAmount = amount;
    return this;
  }

  /**
   * Thiết lập intent là lệnh bridge token sang chuỗi khác.
   * @param from - Token nguồn
   * @param to - Token đích trên chuỗi nhận
   * @param amount - Số lượng token muốn bridge
   * @param targetChain - Tên hoặc chain-id của chuỗi đích (ví dụ: "ethereum", "polygon")
   */
  bridge(from: string, to: string, amount: string, targetChain: string): this {
    this._type = "bridge";
    this._fromAsset = from;
    this._toAsset = to;
    this._fromAmount = amount;
    // Lưu thông tin chuỗi đích vào metadata để adapter xử lý sau
    this._metadata = { ...this._metadata, targetChain };
    return this;
  }

  /**
   * Thiết lập intent là lệnh giới hạn (limit order).
   * Lệnh chỉ thực thi khi giá đạt đến mức người dùng đặt.
   * @param from - Token nguồn
   * @param to - Token đích
   * @param amount - Số lượng token nguồn muốn bán
   * @param price - Giá tối thiểu mong muốn (số lượng token đích trên mỗi token nguồn)
   */
  limitOrder(from: string, to: string, amount: string, price: string): this {
    this._type = "limit_order";
    this._fromAsset = from;
    this._toAsset = to;
    this._fromAmount = amount;
    // Lưu giá giới hạn vào metadata, solver sẽ dùng để so sánh
    this._metadata = { ...this._metadata, limitPrice: price };
    return this;
  }

  // ─── Phương thức cài đặt bổ sung ───────────────────────────────────────────

  /**
   * Cài đặt thời gian sống của intent tính từ lúc `build()` được gọi.
   * @param seconds - Số giây trước khi intent hết hạn (mặc định: 300 giây)
   */
  withExpiry(seconds: number): this {
    if (seconds <= 0) {
      throw new IntentsEngineError(
        "INVALID_INTENT",
        "Thời gian hết hạn phải lớn hơn 0 giây"
      );
    }
    this._expirySeconds = seconds;
    return this;
  }

  /**
   * Cài đặt số lượng token đích tối thiểu chấp nhận được.
   * Đây là cơ chế bảo vệ chống slippage — nếu solver không đáp ứng được,
   * giao dịch sẽ không được thực thi.
   * @param amount - Số lượng token đích tối thiểu (dạng chuỗi)
   */
  withMinOutput(amount: string): this {
    this._toAmountMin = amount;
    return this;
  }

  // ─── Xây dựng Intent hoàn chỉnh ────────────────────────────────────────────

  /**
   * Hoàn thiện và trả về đối tượng Intent.
   * Kiểm tra tính hợp lệ của tất cả trường bắt buộc trước khi tạo.
   *
   * @throws {IntentsEngineError} Khi thiếu các trường bắt buộc hoặc dữ liệu không hợp lệ
   */
  build(): Intent {
    // Kiểm tra các trường bắt buộc phải được thiết lập
    if (this._type === null) {
      throw new IntentsEngineError(
        "INVALID_INTENT",
        "Chưa chọn loại intent — hãy gọi swap(), bridge() hoặc limitOrder() trước"
      );
    }
    if (!this._fromAsset || this._fromAsset.trim() === "") {
      throw new IntentsEngineError(
        "INVALID_INTENT",
        "Trường fromAsset không được để trống"
      );
    }
    if (!this._toAsset || this._toAsset.trim() === "") {
      throw new IntentsEngineError(
        "INVALID_INTENT",
        "Trường toAsset không được để trống"
      );
    }
    if (!this._fromAmount || this._fromAmount.trim() === "") {
      throw new IntentsEngineError(
        "INVALID_INTENT",
        "Trường fromAmount không được để trống"
      );
    }
    // Kiểm tra số lượng phải là số dương
    const amountNum = parseFloat(this._fromAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new IntentsEngineError(
        "INVALID_INTENT",
        `fromAmount "${this._fromAmount}" không phải số dương hợp lệ`
      );
    }
    // Kiểm tra riêng cho bridge: phải có targetChain
    if (this._type === "bridge" && !this._metadata["targetChain"]) {
      throw new IntentsEngineError(
        "INVALID_INTENT",
        "Bridge intent yêu cầu targetChain — hãy gọi bridge() với tham số targetChain"
      );
    }

    // Tính thời gian hết hạn tuyệt đối (Unix timestamp giây)
    const expiry = Math.floor(Date.now() / 1000) + this._expirySeconds;

    return {
      id: randomUUID(),
      type: this._type,
      fromAsset: this._fromAsset,
      toAsset: this._toAsset,
      fromAmount: this._fromAmount,
      toAmountMin: this._toAmountMin,
      expiry,
      metadata: { ...this._metadata },
    };
  }
}
