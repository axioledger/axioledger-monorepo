/**
 * @file registry.test.ts
 * Bộ kiểm thử đầy đủ cho MarketRegistry và validateMarketConfig.
 * Sử dụng Vitest — chạy bằng `pnpm test` hoặc `vitest run`.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { MarketRegistry } from "../registry.js";
import { MarketRegistryError } from "../types.js";
import { validateMarketConfig } from "../validator.js";
import type { MarketConfig } from "../types.js";

// ---------------------------------------------------------------------------
// Dữ liệu mẫu dùng chung cho các test
// ---------------------------------------------------------------------------

/**
 * Trả về một cấu hình thị trường hợp lệ mới mỗi lần gọi.
 * Dùng factory function thay vì hằng số để tránh tái sử dụng tham chiếu.
 */
function buildValidConfig(override: Partial<MarketConfig> = {}): MarketConfig {
  return {
    id: "BTC-USDC",
    baseAsset: "BTC",
    quoteAsset: "USDC",
    feeBps: 30,
    minOrderSize: 0.001,
    maxOrderSize: 100,
    status: "active",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...override,
  };
}

// ---------------------------------------------------------------------------
// Test suite chính
// ---------------------------------------------------------------------------

describe("MarketRegistry", () => {
  // Tạo mới registry trước mỗi test để tránh chia sẻ trạng thái
  let registry: MarketRegistry;

  beforeEach(() => {
    registry = new MarketRegistry();
  });

  // -------------------------------------------------------------------------
  // Test 1: Đăng ký thị trường thành công
  // -------------------------------------------------------------------------
  it("nên đăng ký thị trường mới thành công và trả về đối tượng Market", () => {
    const config = buildValidConfig();
    const market = registry.register(config);

    // Đảm bảo trả về đúng kiểu và giá trị
    expect(market.getId()).toBe("BTC-USDC");
    expect(market.getStatus()).toBe("active");
    expect(registry.count()).toBe(1);
  });

  // -------------------------------------------------------------------------
  // Test 2: Lấy thị trường đã đăng ký
  // -------------------------------------------------------------------------
  it("nên lấy được thị trường đã đăng ký qua ID", () => {
    registry.register(buildValidConfig({ id: "ETH-USDC", baseAsset: "ETH" }));

    const market = registry.get("ETH-USDC");
    expect(market.getId()).toBe("ETH-USDC");
    expect(market.getAssetPair()).toEqual({ baseAsset: "ETH", quoteAsset: "USDC" });
  });

  // -------------------------------------------------------------------------
  // Test 3: Ném MARKET_NOT_FOUND khi lấy thị trường không tồn tại
  // -------------------------------------------------------------------------
  it("nên ném lỗi MARKET_NOT_FOUND khi get() với ID không tồn tại", () => {
    expect(() => registry.get("NONEXISTENT")).toThrow(MarketRegistryError);

    try {
      registry.get("NONEXISTENT");
    } catch (err) {
      // Kiểm tra mã lỗi đúng loại
      expect(err).toBeInstanceOf(MarketRegistryError);
      expect((err as MarketRegistryError).code).toBe("MARKET_NOT_FOUND");
    }
  });

  // -------------------------------------------------------------------------
  // Test 4: Ném MARKET_ALREADY_EXISTS khi đăng ký trùng ID
  // -------------------------------------------------------------------------
  it("nên ném lỗi MARKET_ALREADY_EXISTS khi đăng ký trùng ID", () => {
    registry.register(buildValidConfig());

    // Đăng ký lần thứ hai với cùng ID phải ném lỗi
    expect(() => registry.register(buildValidConfig())).toThrow(MarketRegistryError);

    try {
      registry.register(buildValidConfig());
    } catch (err) {
      expect(err).toBeInstanceOf(MarketRegistryError);
      expect((err as MarketRegistryError).code).toBe("MARKET_ALREADY_EXISTS");
    }
  });

  // -------------------------------------------------------------------------
  // Test 5: Cập nhật thị trường thành công
  // -------------------------------------------------------------------------
  it("nên cập nhật thị trường thành công và giữ nguyên id", () => {
    registry.register(buildValidConfig());

    const updated = registry.update("BTC-USDC", { feeBps: 50, status: "paused" });

    expect(updated.getId()).toBe("BTC-USDC");
    expect(updated.getConfig().feeBps).toBe(50);
    expect(updated.getStatus()).toBe("paused");
  });

  // -------------------------------------------------------------------------
  // Test 6: Xoá thị trường khỏi registry
  // -------------------------------------------------------------------------
  it("nên xoá thị trường và giảm count() về 0", () => {
    registry.register(buildValidConfig());
    expect(registry.count()).toBe(1);

    registry.remove("BTC-USDC");
    expect(registry.count()).toBe(0);

    // Sau khi xoá, get() phải ném MARKET_NOT_FOUND
    expect(() => registry.get("BTC-USDC")).toThrow(MarketRegistryError);
  });

  // -------------------------------------------------------------------------
  // Test 7: list() trả về đúng số lượng thị trường
  // -------------------------------------------------------------------------
  it("nên list() trả về đúng số lượng thị trường và hỗ trợ lọc theo status", () => {
    // Đăng ký nhiều thị trường với trạng thái khác nhau
    registry.register(buildValidConfig({ id: "BTC-USDC", baseAsset: "BTC", status: "active" }));
    registry.register(buildValidConfig({ id: "ETH-USDC", baseAsset: "ETH", status: "paused" }));
    registry.register(buildValidConfig({ id: "SOL-USDC", baseAsset: "SOL", status: "active" }));

    // Tổng số phải là 3
    expect(registry.list()).toHaveLength(3);

    // Chỉ lọc "active" phải trả về 2
    expect(registry.list({ status: "active" })).toHaveLength(2);

    // Chỉ lọc "paused" phải trả về 1
    expect(registry.list({ status: "paused" })).toHaveLength(1);
  });

  // -------------------------------------------------------------------------
  // Test 8: validateMarketConfig phát hiện feeBps > 10 000
  // -------------------------------------------------------------------------
  it("nên validateMarketConfig() trả về lỗi khi feeBps vượt quá 10 000", () => {
    const result = validateMarketConfig(buildValidConfig({ feeBps: 10_001 }));

    expect(result.valid).toBe(false);
    // Phải có ít nhất một thông báo lỗi liên quan đến feeBps
    expect(result.errors.some((e) => e.includes("feeBps"))).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Test 9: isActive() trả về đúng theo status
  // -------------------------------------------------------------------------
  it("nên isActive() trả về true chỉ khi status là 'active'", () => {
    const activeMarket = registry.register(
      buildValidConfig({ id: "BTC-USDC", status: "active" })
    );
    expect(activeMarket.isActive()).toBe(true);

    const pausedMarket = registry.register(
      buildValidConfig({ id: "ETH-USDC", baseAsset: "ETH", status: "paused" })
    );
    expect(pausedMarket.isActive()).toBe(false);

    const deprecatedMarket = registry.register(
      buildValidConfig({ id: "SOL-USDC", baseAsset: "SOL", status: "deprecated" })
    );
    expect(deprecatedMarket.isActive()).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Test 10: Registry khoá/mở khoá hoạt động đúng
  // -------------------------------------------------------------------------
  it("nên ném REGISTRY_LOCKED khi thao tác ghi trong lúc registry bị khoá", () => {
    registry.register(buildValidConfig());
    registry.lock();

    // Mọi thao tác ghi đều phải ném lỗi
    expect(() => registry.register(buildValidConfig({ id: "NEW-MARKET" }))).toThrow(
      MarketRegistryError
    );
    expect(() => registry.remove("BTC-USDC")).toThrow(MarketRegistryError);

    // Sau khi mở khoá, thao tác ghi phải thành công trở lại
    registry.unlock();
    expect(() => registry.remove("BTC-USDC")).not.toThrow();
    expect(registry.count()).toBe(0);
  });
});
