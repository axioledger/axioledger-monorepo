/**
 * @file registry.ts
 * Lớp quản lý tập trung các thị trường giao dịch trong KPX Protocol.
 * Cung cấp CRUD đầy đủ, lọc danh sách, và cơ chế khoá registry.
 */

import { Market } from "./market.js";
import { MarketRegistryError } from "./types.js";
import { validateMarketConfig } from "./validator.js";
import type { MarketConfig, MarketStatus } from "./types.js";

// ---------------------------------------------------------------------------
// Kiểu bộ lọc danh sách thị trường
// ---------------------------------------------------------------------------

/**
 * Bộ lọc tuỳ chọn khi gọi `list()`.
 * Có thể lọc theo trạng thái và/hoặc tài sản cơ sở.
 */
export interface MarketListFilter {
  /** Chỉ trả về thị trường có trạng thái này nếu được cung cấp */
  status?: MarketStatus;
  /** Chỉ trả về thị trường có tài sản cơ sở này nếu được cung cấp */
  baseAsset?: string;
}

// ---------------------------------------------------------------------------
// Lớp registry chính
// ---------------------------------------------------------------------------

/**
 * Registry quản lý toàn bộ thị trường giao dịch trong KPX Protocol.
 *
 * Tính năng:
 * - Đăng ký, truy vấn, cập nhật, và xoá thị trường.
 * - Lọc danh sách theo trạng thái hoặc tài sản.
 * - Khoá/mở khoá để ngăn thay đổi trong các giai đoạn nhạy cảm.
 * - Mọi đầu vào đều được kiểm tra qua `validateMarketConfig` trước khi lưu.
 */
export class MarketRegistry {
  /** Kho lưu trữ nội bộ: map từ market ID sang đối tượng Market */
  private readonly markets: Map<string, Market> = new Map();

  /** Cờ khoá — khi true, mọi thao tác ghi đều bị từ chối */
  private locked: boolean = false;

  // -------------------------------------------------------------------------
  // Kiểm tra trạng thái khoá (nội bộ)
  // -------------------------------------------------------------------------

  /**
   * Ném lỗi REGISTRY_LOCKED nếu registry đang bị khoá.
   * Được gọi ở đầu mọi phương thức ghi.
   */
  private assertNotLocked(): void {
    if (this.locked) {
      throw new MarketRegistryError(
        "REGISTRY_LOCKED",
        "Registry đang bị khoá. Không thể thực hiện thao tác ghi."
      );
    }
  }

  // -------------------------------------------------------------------------
  // CRUD
  // -------------------------------------------------------------------------

  /**
   * Đăng ký một thị trường mới vào registry.
   * Ném lỗi nếu:
   * - Registry đang bị khoá.
   * - Cấu hình không hợp lệ (INVALID_CONFIG).
   * - Đã tồn tại thị trường với cùng ID (MARKET_ALREADY_EXISTS).
   *
   * @param config - Cấu hình đầy đủ của thị trường mới
   * @returns Đối tượng Market vừa được đăng ký
   */
  register(config: MarketConfig): Market {
    this.assertNotLocked();

    // Kiểm tra cấu hình trước khi lưu
    const validation = validateMarketConfig(config);
    if (!validation.valid) {
      throw new MarketRegistryError(
        "INVALID_CONFIG",
        `Cấu hình không hợp lệ: ${validation.errors.join("; ")}`
      );
    }

    // Kiểm tra trùng ID
    if (this.markets.has(config.id)) {
      throw new MarketRegistryError(
        "MARKET_ALREADY_EXISTS",
        `Thị trường với ID "${config.id}" đã tồn tại trong registry.`
      );
    }

    const market = new Market(config);
    this.markets.set(config.id, market);
    return market;
  }

  /**
   * Lấy thông tin thị trường theo ID.
   * Ném MARKET_NOT_FOUND nếu không tìm thấy.
   *
   * @param id - Mã định danh của thị trường cần lấy
   * @returns Đối tượng Market tương ứng
   */
  get(id: string): Market {
    const market = this.markets.get(id);
    if (!market) {
      throw new MarketRegistryError(
        "MARKET_NOT_FOUND",
        `Không tìm thấy thị trường với ID "${id}".`
      );
    }
    return market;
  }

  /**
   * Cập nhật một phần cấu hình của thị trường đã đăng ký.
   * Các trường không được cung cấp sẽ giữ nguyên giá trị cũ.
   * Ném lỗi nếu:
   * - Registry đang bị khoá.
   * - Không tìm thấy thị trường (MARKET_NOT_FOUND).
   * - Cấu hình mới không hợp lệ (INVALID_CONFIG).
   *
   * @param id      - ID của thị trường cần cập nhật
   * @param partial - Các trường cần thay đổi (id và createdAt bị bỏ qua nếu cung cấp)
   * @returns Đối tượng Market sau khi cập nhật
   */
  update(id: string, partial: Partial<Omit<MarketConfig, "id" | "createdAt">>): Market {
    this.assertNotLocked();

    const existing = this.get(id); // Ném MARKET_NOT_FOUND nếu không có
    const currentConfig = existing.getConfig();

    // Gộp cấu hình cũ với các thay đổi mới, cập nhật thời gian
    const merged: MarketConfig = {
      ...currentConfig,
      ...partial,
      id: currentConfig.id,           // Bảo vệ: không cho thay đổi id
      createdAt: currentConfig.createdAt, // Bảo vệ: không cho thay đổi createdAt
      updatedAt: Date.now(),
    };

    // Kiểm tra cấu hình sau khi gộp
    const validation = validateMarketConfig(merged);
    if (!validation.valid) {
      throw new MarketRegistryError(
        "INVALID_CONFIG",
        `Cấu hình cập nhật không hợp lệ: ${validation.errors.join("; ")}`
      );
    }

    // Thay thế đối tượng Market bằng phiên bản mới
    const updated = new Market(merged);
    this.markets.set(id, updated);
    return updated;
  }

  /**
   * Xoá thị trường khỏi registry.
   * Ném lỗi nếu:
   * - Registry đang bị khoá.
   * - Không tìm thấy thị trường (MARKET_NOT_FOUND).
   *
   * @param id - ID của thị trường cần xoá
   */
  remove(id: string): void {
    this.assertNotLocked();

    // Đảm bảo thị trường tồn tại trước khi xoá
    this.get(id); // Ném MARKET_NOT_FOUND nếu không có
    this.markets.delete(id);
  }

  /**
   * Liệt kê tất cả thị trường, có thể lọc theo tiêu chí.
   *
   * @param filter - Bộ lọc tuỳ chọn theo status và/hoặc baseAsset
   * @returns Mảng các đối tượng Market thoả bộ lọc
   */
  list(filter?: MarketListFilter): Market[] {
    const all = Array.from(this.markets.values());

    if (!filter) {
      return all;
    }

    return all.filter((market) => {
      const config = market.getConfig();

      // Lọc theo trạng thái nếu được yêu cầu
      if (filter.status !== undefined && config.status !== filter.status) {
        return false;
      }

      // Lọc theo tài sản cơ sở nếu được yêu cầu
      if (filter.baseAsset !== undefined && config.baseAsset !== filter.baseAsset) {
        return false;
      }

      return true;
    });
  }

  /**
   * Trả về tổng số thị trường hiện có trong registry.
   */
  count(): number {
    return this.markets.size;
  }

  // -------------------------------------------------------------------------
  // Cơ chế khoá
  // -------------------------------------------------------------------------

  /**
   * Kiểm tra registry có đang bị khoá không.
   * @returns true nếu registry đang bị khoá
   */
  isLocked(): boolean {
    return this.locked;
  }

  /**
   * Khoá registry, ngăn mọi thao tác ghi (register, update, remove).
   * Không có tác dụng nếu registry đã bị khoá.
   */
  lock(): void {
    this.locked = true;
  }

  /**
   * Mở khoá registry, cho phép thao tác ghi trở lại.
   * Không có tác dụng nếu registry chưa bị khoá.
   */
  unlock(): void {
    this.locked = false;
  }
}
