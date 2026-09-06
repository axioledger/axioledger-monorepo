/**
 * @file validator.ts
 * Hàm kiểm tra tính hợp lệ của cấu hình thị trường trước khi đăng ký.
 * Trả về danh sách lỗi chi tiết thay vì ném ngoại lệ để caller tự xử lý.
 */

import type { MarketConfig } from "./types.js";

// ---------------------------------------------------------------------------
// Kiểu kết quả validation
// ---------------------------------------------------------------------------

/**
 * Kết quả kiểm tra cấu hình thị trường.
 * - valid: true nếu không có lỗi nào
 * - errors: mảng các chuỗi mô tả lỗi phát hiện được
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ---------------------------------------------------------------------------
// Hàm kiểm tra chính
// ---------------------------------------------------------------------------

/**
 * Kiểm tra tính hợp lệ của một cấu hình thị trường (có thể là partial).
 * Hàm này không ném ngoại lệ — mọi vấn đề được ghi vào mảng `errors`.
 *
 * Các quy tắc được kiểm tra:
 * 1. `id` không được là chuỗi rỗng hoặc chỉ chứa khoảng trắng.
 * 2. `feeBps` phải là số nguyên trong khoảng [0, 10 000].
 * 3. `minOrderSize` phải lớn hơn 0.
 * 4. `maxOrderSize` phải lớn hơn `minOrderSize`.
 * 5. `baseAsset` và `quoteAsset` không được giống nhau.
 *
 * @param config - Đối tượng cấu hình cần kiểm tra (có thể thiếu trường)
 * @returns Kết quả kiểm tra gồm cờ `valid` và danh sách lỗi `errors`
 */
export function validateMarketConfig(
  config: Partial<MarketConfig>
): ValidationResult {
  const errors: string[] = [];

  // ------------------------------------------------------------------
  // Kiểm tra id
  // ------------------------------------------------------------------
  if (config.id === undefined || config.id === null) {
    errors.push("Trường 'id' là bắt buộc.");
  } else if (config.id.trim().length === 0) {
    errors.push("Trường 'id' không được là chuỗi rỗng hoặc chỉ chứa khoảng trắng.");
  }

  // ------------------------------------------------------------------
  // Kiểm tra feeBps — phải là số nguyên trong khoảng [0, 10 000]
  // ------------------------------------------------------------------
  if (config.feeBps === undefined || config.feeBps === null) {
    errors.push("Trường 'feeBps' là bắt buộc.");
  } else if (!Number.isInteger(config.feeBps)) {
    errors.push("Trường 'feeBps' phải là số nguyên.");
  } else if (config.feeBps < 0 || config.feeBps > 10_000) {
    errors.push(
      `Trường 'feeBps' phải nằm trong khoảng [0, 10 000], nhận được: ${config.feeBps}.`
    );
  }

  // ------------------------------------------------------------------
  // Kiểm tra minOrderSize — phải lớn hơn 0
  // ------------------------------------------------------------------
  if (config.minOrderSize === undefined || config.minOrderSize === null) {
    errors.push("Trường 'minOrderSize' là bắt buộc.");
  } else if (config.minOrderSize <= 0) {
    errors.push(
      `Trường 'minOrderSize' phải lớn hơn 0, nhận được: ${config.minOrderSize}.`
    );
  }

  // ------------------------------------------------------------------
  // Kiểm tra maxOrderSize — phải lớn hơn minOrderSize
  // Chỉ kiểm tra nếu minOrderSize hợp lệ để tránh thông báo lỗi thừa
  // ------------------------------------------------------------------
  if (config.maxOrderSize === undefined || config.maxOrderSize === null) {
    errors.push("Trường 'maxOrderSize' là bắt buộc.");
  } else if (
    config.minOrderSize !== undefined &&
    config.minOrderSize !== null &&
    config.minOrderSize > 0 &&
    config.maxOrderSize <= config.minOrderSize
  ) {
    errors.push(
      `Trường 'maxOrderSize' (${config.maxOrderSize}) phải lớn hơn 'minOrderSize' (${config.minOrderSize}).`
    );
  }

  // ------------------------------------------------------------------
  // Kiểm tra baseAsset != quoteAsset
  // ------------------------------------------------------------------
  if (
    config.baseAsset !== undefined &&
    config.quoteAsset !== undefined &&
    config.baseAsset.trim().length > 0 &&
    config.quoteAsset.trim().length > 0 &&
    config.baseAsset.trim().toUpperCase() === config.quoteAsset.trim().toUpperCase()
  ) {
    errors.push(
      `'baseAsset' và 'quoteAsset' không được giống nhau (cả hai đều là "${config.baseAsset}").`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
