/**
 * @file market.ts
 * Lớp đại diện cho một thị trường giao dịch đơn lẻ trong KPX Protocol.
 * Bao bọc MarketConfig và cung cấp các phương thức truy vấn, cập nhật trạng thái.
 */

import type { AssetPair, MarketConfig, MarketStatus } from "./types.js";

/**
 * Đại diện cho một thị trường giao dịch cụ thể.
 * Đóng gói cấu hình và cung cấp API rõ ràng để thao tác với dữ liệu thị trường.
 */
export class Market {
  /** Bản sao nội bộ của cấu hình thị trường */
  private config: MarketConfig;

  /**
   * Khởi tạo một đối tượng Market từ cấu hình đã cho.
   * @param config - Cấu hình đầy đủ của thị trường
   */
  constructor(config: MarketConfig) {
    // Sao chép để tránh thay đổi ngoài ý muốn từ bên ngoài
    this.config = { ...config };
  }

  // -------------------------------------------------------------------------
  // Phương thức truy vấn (query)
  // -------------------------------------------------------------------------

  /**
   * Trả về mã định danh duy nhất của thị trường.
   */
  getId(): string {
    return this.config.id;
  }

  /**
   * Trả về trạng thái hiện tại của thị trường.
   */
  getStatus(): MarketStatus {
    return this.config.status;
  }

  /**
   * Trả về cặp tài sản giao dịch (baseAsset / quoteAsset).
   */
  getAssetPair(): AssetPair {
    return {
      baseAsset: this.config.baseAsset,
      quoteAsset: this.config.quoteAsset,
    };
  }

  /**
   * Trả về bản sao toàn bộ cấu hình thị trường.
   * Trả về bản sao để ngăn chỉnh sửa trực tiếp từ bên ngoài.
   */
  getConfig(): MarketConfig {
    return { ...this.config };
  }

  /**
   * Kiểm tra xem thị trường có đang ở trạng thái hoạt động hay không.
   * @returns true nếu status là "active", false với mọi trạng thái khác
   */
  isActive(): boolean {
    return this.config.status === "active";
  }

  // -------------------------------------------------------------------------
  // Phương thức cập nhật (mutation)
  // -------------------------------------------------------------------------

  /**
   * Cập nhật trạng thái của thị trường và đánh dấu thời gian cập nhật.
   * @param status - Trạng thái mới cần đặt
   */
  setStatus(status: MarketStatus): void {
    this.config.status = status;
    // Ghi nhận thời điểm trạng thái được thay đổi
    this.config.updatedAt = Date.now();
  }

  // -------------------------------------------------------------------------
  // Serialization
  // -------------------------------------------------------------------------

  /**
   * Chuyển đổi thị trường thành plain object để serialise hoặc log.
   * Trả về bản sao để tránh rò rỉ tham chiếu nội bộ.
   */
  toJSON(): MarketConfig {
    return { ...this.config };
  }
}
