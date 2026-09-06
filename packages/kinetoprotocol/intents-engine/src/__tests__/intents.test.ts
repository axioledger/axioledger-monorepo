/**
 * @file intents.test.ts
 * Bộ kiểm thử toàn diện cho @kinetoprotocol/intents-engine.
 *
 * Bao gồm 10+ test cases kiểm tra:
 *  - IntentBuilder: xây dựng swap, bridge, limit order
 *  - Validation: throw khi thiếu fields bắt buộc
 *  - SolverNetwork: lấy báo giá mock
 *  - IntentExecutor: thực thi và tra cứu trạng thái
 *  - IntentsEngine: facade smoke test
 *  - IntentsEngineError: typed error code
 *  - OmniSdkAdapter: normalizeIntent không throw
 */

import { describe, it, expect, beforeEach } from "vitest";
import { IntentBuilder } from "../intent-builder.js";
import { SolverNetwork } from "../solver.js";
import { IntentExecutor } from "../executor.js";
import { IntentsEngine } from "../index.js";
import { OmniSdkAdapter } from "../adapter.js";
import {
  IntentsEngineError,
  type Intent,
  type Quote,
} from "../types.js";

// ─── Hàm tiện ích tạo intent mẫu nhanh ───────────────────────────────────────

/**
 * Tạo một swap intent mẫu đã hợp lệ để dùng trong nhiều test.
 * expiry được đặt xa vào tương lai để tránh test fail vì hết hạn.
 */
function buildSampleSwapIntent(): Intent {
  return new IntentBuilder()
    .swap("USDC", "NEAR", "100")
    .withExpiry(3600) // Hết hạn sau 1 tiếng
    .withMinOutput("95")
    .build();
}

/**
 * Tạo một quote mẫu đã hợp lệ khớp với intent cho trước.
 */
function buildSampleQuote(intentId: string): Quote {
  return {
    intentId,
    solverAddress: "solver-alpha.near",
    fromAmount: "100",
    toAmount: "99.7",
    feeBps: 30,
    validUntil: Math.floor(Date.now() / 1000) + 120, // Còn hạn 2 phút
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 1-3: IntentBuilder — Xây dựng Intent
// ═══════════════════════════════════════════════════════════════════════════════

describe("IntentBuilder — xây dựng intent", () => {

  /**
   * TEST 1: swap() tạo intent đúng tất cả fields cốt lõi
   */
  it("swap() xây dựng intent với các fields đúng", () => {
    const intent = new IntentBuilder()
      .swap("USDC", "NEAR", "100")
      .build();

    // Kiểm tra loại intent
    expect(intent.type).toBe("swap");

    // Kiểm tra assets
    expect(intent.fromAsset).toBe("USDC");
    expect(intent.toAsset).toBe("NEAR");

    // Kiểm tra số lượng
    expect(intent.fromAmount).toBe("100");

    // Kiểm tra ID được sinh ra (UUID v4 format)
    expect(intent.id).toBeTruthy();
    expect(typeof intent.id).toBe("string");
    expect(intent.id.length).toBeGreaterThan(0);

    // Kiểm tra expiry được đặt tự động (trong tương lai)
    const nowSeconds = Math.floor(Date.now() / 1000);
    expect(intent.expiry).toBeGreaterThan(nowSeconds);
  });

  /**
   * TEST 2: bridge() tạo intent với targetChain trong metadata
   */
  it("bridge() xây dựng intent có targetChain trong metadata", () => {
    const intent = new IntentBuilder()
      .bridge("NEAR", "ETH", "10", "ethereum")
      .build();

    // Kiểm tra loại intent
    expect(intent.type).toBe("bridge");
    expect(intent.fromAsset).toBe("NEAR");
    expect(intent.toAsset).toBe("ETH");
    expect(intent.fromAmount).toBe("10");

    // Kiểm tra targetChain được lưu vào metadata
    expect(intent.metadata).toBeDefined();
    expect(intent.metadata["targetChain"]).toBe("ethereum");
  });

  /**
   * TEST 3: build() throw IntentsEngineError khi chưa chọn loại intent
   */
  it("throw INVALID_INTENT khi chưa gọi swap() hoặc bridge()", () => {
    // IntentBuilder mới không có type nào được đặt
    const builder = new IntentBuilder();

    // Phải throw với code INVALID_INTENT
    expect(() => builder.build()).toThrow(IntentsEngineError);
    expect(() => builder.build()).toThrow("Chưa chọn loại intent");
  });

  /**
   * TEST 4: build() throw INVALID_INTENT khi bridge() được gọi với targetChain rỗng
   */
  it("throw INVALID_INTENT khi bridge thiếu targetChain trong metadata", () => {
    // Khi targetChain là chuỗi rỗng, bridge() lưu "" vào metadata
    // nhưng build() kiểm tra giá trị falsy nên sẽ throw
    expect(() => {
      new IntentBuilder().bridge("NEAR", "ETH", "10", "").build();
    }).toThrow(IntentsEngineError);

    // Kiểm tra code lỗi đúng
    let caught: IntentsEngineError | null = null;
    try {
      new IntentBuilder().bridge("NEAR", "ETH", "10", "").build();
    } catch (e) {
      caught = e as IntentsEngineError;
    }
    expect(caught).not.toBeNull();
    expect(caught!.code).toBe("INVALID_INTENT");
    expect(caught!.message).toContain("targetChain");
  });

  /**
   * TEST 5: Intent có expiry mặc định khi không gọi withExpiry()
   */
  it("intent có expiry mặc định khi không gọi withExpiry()", () => {
    const beforeBuild = Math.floor(Date.now() / 1000);
    const intent = new IntentBuilder().swap("BTC", "USDC", "1").build();
    const afterBuild = Math.floor(Date.now() / 1000);

    // Expiry phải nằm trong khoảng [now + 299, now + 301] (mặc định 300 giây)
    expect(intent.expiry).toBeGreaterThanOrEqual(beforeBuild + 299);
    expect(intent.expiry).toBeLessThanOrEqual(afterBuild + 301);
  });

});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 6-7: SolverNetwork — Lấy báo giá
// ═══════════════════════════════════════════════════════════════════════════════

describe("SolverNetwork — lấy báo giá", () => {
  let solver: SolverNetwork;

  beforeEach(() => {
    // Khởi tạo solver mới trước mỗi test
    solver = new SolverNetwork();
  });

  /**
   * TEST 6: getQuote() trả về Quote với tất cả fields hợp lệ
   */
  it("getQuote() trả về Quote với các fields bắt buộc hợp lệ", async () => {
    const intent = buildSampleSwapIntent();
    const quote = await solver.getQuote(intent);

    // Kiểm tra tất cả fields bắt buộc có mặt
    expect(quote.intentId).toBe(intent.id);
    expect(typeof quote.solverAddress).toBe("string");
    expect(quote.solverAddress.length).toBeGreaterThan(0);
    expect(typeof quote.fromAmount).toBe("string");
    expect(typeof quote.toAmount).toBe("string");
    expect(typeof quote.feeBps).toBe("number");
    expect(typeof quote.validUntil).toBe("number");

    // Kiểm tra quote còn hạn sử dụng
    const nowSeconds = Math.floor(Date.now() / 1000);
    expect(quote.validUntil).toBeGreaterThan(nowSeconds);
  });

  /**
   * TEST 7: feeBps phải dương và trong ngưỡng hợp lý (0 < feeBps ≤ 1000)
   */
  it("Quote.feeBps > 0 và trong ngưỡng hợp lý (không quá 10%)", async () => {
    const intent = buildSampleSwapIntent();
    const quote = await solver.getQuote(intent);

    // Phí phải dương
    expect(quote.feeBps).toBeGreaterThan(0);

    // Phí không vượt quá 10% (1000 bps) — ngưỡng tối đa hợp lý
    expect(quote.feeBps).toBeLessThanOrEqual(1000);

    // Số tiền nhận được phải nhỏ hơn số tiền bỏ vào (do phí)
    const fromNum = parseFloat(quote.fromAmount);
    const toNum = parseFloat(quote.toAmount);
    expect(toNum).toBeLessThan(fromNum);
  });

});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 8: IntentExecutor — Thực thi và trạng thái
// ═══════════════════════════════════════════════════════════════════════════════

describe("IntentExecutor — thực thi intent", () => {
  let executor: IntentExecutor;

  beforeEach(() => {
    executor = new IntentExecutor();
  });

  /**
   * TEST 8: execute() trả về ExecutionResult với status "completed"
   */
  it("execute() trả về ExecutionResult với status completed và txHash", async () => {
    const intent = buildSampleSwapIntent();
    const quote = buildSampleQuote(intent.id);

    const result = await executor.execute(intent, quote);

    // Kiểm tra kết quả hợp lệ
    expect(result.intentId).toBe(intent.id);
    expect(result.status).toBe("completed");

    // Phải có txHash khi completed
    expect(result.txHash).toBeDefined();
    expect(typeof result.txHash).toBe("string");
    expect(result.txHash!.length).toBeGreaterThan(0);

    // Kiểm tra số lượng thực tế
    expect(result.actualFromAmount).toBe(quote.fromAmount);
    expect(result.actualToAmount).toBe(quote.toAmount);

    // Không có errorMessage khi thành công
    expect(result.errorMessage).toBeUndefined();
  });

  /**
   * TEST bổ sung: getStatus() trả về đúng trạng thái sau khi execute
   */
  it("getStatus() trả về trạng thái đúng sau khi thực thi", async () => {
    const intent = buildSampleSwapIntent();
    const quote = buildSampleQuote(intent.id);

    // Thực thi xong
    await executor.execute(intent, quote);

    // Tra cứu trạng thái
    const status = await executor.getStatus(intent.id);
    expect(status).toBe("completed");
  });

});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 9: IntentsEngine — Facade smoke test
// ═══════════════════════════════════════════════════════════════════════════════

describe("IntentsEngine — facade smoke test", () => {

  /**
   * TEST 9: Smoke test toàn bộ luồng: buildSwap → getQuote → execute → getStatus
   */
  it("smoke test: buildSwap → getQuote → execute → getStatus thành công", async () => {
    // Khởi tạo engine với config testnet
    const engine = new IntentsEngine({ network: "testnet" });
    expect(engine.getConfig().network).toBe("testnet");

    // Bước 1: Xây dựng intent
    const intent = engine.buildSwap("USDC", "NEAR", "50", {
      expiry: 3600,
      minOutput: "48",
    });
    expect(intent.type).toBe("swap");
    expect(intent.fromAmount).toBe("50");

    // Bước 2: Lấy báo giá
    const quote = await engine.getQuote(intent);
    expect(quote.intentId).toBe(intent.id);
    expect(quote.feeBps).toBeGreaterThan(0);

    // Bước 3: Thực thi
    const result = await engine.execute(intent, quote);
    expect(result.status).toBe("completed");
    expect(result.intentId).toBe(intent.id);

    // Bước 4: Kiểm tra trạng thái
    const status = await engine.getStatus(intent.id);
    expect(status).toBe("completed");
  });

  /**
   * TEST bổ sung: buildBridge tạo intent đúng loại và metadata
   */
  it("buildBridge() tạo bridge intent với targetChain đúng", () => {
    const engine = new IntentsEngine();

    const intent = engine.buildBridge("NEAR", "ETH", "5", "ethereum");
    expect(intent.type).toBe("bridge");
    expect(intent.metadata["targetChain"]).toBe("ethereum");
  });

});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 10: IntentsEngineError — Typed error
// ═══════════════════════════════════════════════════════════════════════════════

describe("IntentsEngineError — typed error code", () => {

  /**
   * TEST 10: IntentsEngineError phải có typed code và message đúng
   */
  it("IntentsEngineError có code đúng kiểu và message hợp lệ", () => {
    const error = new IntentsEngineError(
      "SOLVER_UNAVAILABLE",
      "Không có solver nào đang hoạt động"
    );

    // Kiểm tra instanceof
    expect(error).toBeInstanceOf(IntentsEngineError);
    expect(error).toBeInstanceOf(Error);

    // Kiểm tra code có kiểu đúng
    expect(error.code).toBe("SOLVER_UNAVAILABLE");

    // Kiểm tra message
    expect(error.message).toBe("Không có solver nào đang hoạt động");

    // Kiểm tra name
    expect(error.name).toBe("IntentsEngineError");
  });

  /**
   * TEST bổ sung: Tất cả error codes hoạt động đúng
   */
  it("tất cả IntentsEngineErrorCode đều tạo error hợp lệ", () => {
    const codes = [
      "SOLVER_UNAVAILABLE",
      "QUOTE_EXPIRED",
      "INSUFFICIENT_BALANCE",
      "INVALID_INTENT",
      "EXECUTION_FAILED",
    ] as const;

    for (const code of codes) {
      const error = new IntentsEngineError(code, `Lỗi test: ${code}`);
      expect(error.code).toBe(code);
      expect(error).toBeInstanceOf(IntentsEngineError);
    }
  });

});

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 11: OmniSdkAdapter — normalizeIntent không throw
// ═══════════════════════════════════════════════════════════════════════════════

describe("OmniSdkAdapter — chuẩn hóa intent", () => {

  /**
   * TEST 11: normalizeIntent() không throw với intent hợp lệ
   */
  it("normalizeIntent() không throw với swap intent hợp lệ", () => {
    const adapter = new OmniSdkAdapter("intents.testnet", "testnet");
    const intent = buildSampleSwapIntent();

    // Không được throw
    expect(() => adapter.normalizeIntent(intent)).not.toThrow();

    // Kết quả phải là object có các trường cốt lõi
    const normalized = adapter.normalizeIntent(intent) as Record<string, unknown>;
    expect(normalized).toBeTruthy();
    expect(normalized["id"]).toBe(intent.id);
    expect(normalized["intent_type"]).toBe("swap");
    expect(normalized["from_asset"]).toBe(intent.fromAsset);
    expect(normalized["to_asset"]).toBe(intent.toAsset);
    expect(normalized["network"]).toBe("testnet");
  });

  /**
   * TEST bổ sung: parseQuote() chuyển đổi raw quote đúng
   */
  it("parseQuote() chuyển đổi raw quote object sang Quote đúng fields", () => {
    const adapter = new OmniSdkAdapter();
    const nowSeconds = Math.floor(Date.now() / 1000);

    const rawQuote = {
      intent_id: "test-intent-123",
      solver: "solver-alpha.near",
      input_amount: "100",
      output_amount: "99.7",
      fee_bps: 30,
      valid_until: nowSeconds + 60,
    };

    const quote = adapter.parseQuote(rawQuote);

    expect(quote.intentId).toBe("test-intent-123");
    expect(quote.solverAddress).toBe("solver-alpha.near");
    expect(quote.fromAmount).toBe("100");
    expect(quote.toAmount).toBe("99.7");
    expect(quote.feeBps).toBe(30);
    expect(quote.validUntil).toBe(nowSeconds + 60);
  });

});
