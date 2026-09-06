/**
 * @file index.ts
 * Điểm vào chính của package @kinetoprotocol/intents-engine.
 *
 * File này cung cấp:
 *  1. Class `IntentsEngine` — facade tổng hợp tất cả chức năng
 *  2. Re-export tất cả types và classes con để dùng trực tiếp nếu cần
 *
 * Cách sử dụng cơ bản:
 * @example
 * import { IntentsEngine } from "@kinetoprotocol/intents-engine";
 *
 * const engine = new IntentsEngine({ network: "testnet" });
 *
 * const intent = engine.buildSwap("USDC", "NEAR", "100");
 * const quote  = await engine.getQuote(intent);
 * const result = await engine.execute(intent, quote);
 * console.log(result.status); // "completed"
 */

import { IntentBuilder } from "./intent-builder.js";
import { IntentExecutor } from "./executor.js";
import { SolverNetwork } from "./solver.js";
import type { ExecutionResult, Intent, IntentStatus, Quote } from "./types.js";

// ─── Re-export tất cả types ───────────────────────────────────────────────────

// Kiểu dữ liệu cốt lõi
export type {
  IntentType,
  IntentStatus,
  Intent,
  Quote,
  ExecutionResult,
  IntentsEngineErrorCode,
} from "./types.js";

// Lớp lỗi có typed code
export { IntentsEngineError } from "./types.js";

// Các lớp con — cho phép dùng trực tiếp nếu cần kiểm soát chi tiết hơn
export { IntentBuilder } from "./intent-builder.js";
export { OmniSdkAdapter } from "./adapter.js";
export { SolverNetwork } from "./solver.js";
export { IntentExecutor } from "./executor.js";

// ─── Cấu hình khởi tạo ────────────────────────────────────────────────────────

/**
 * Cấu hình cho IntentsEngine.
 * Tất cả trường đều tùy chọn — có giá trị mặc định hợp lý.
 */
export interface IntentsEngineConfig {
  /**
   * Program ID của NEAR Intents smart contract.
   * Mặc định: "intents.near" (mainnet)
   * Testnet: "intents.testnet"
   */
  programId?: string;

  /**
   * Mạng NEAR kết nối.
   * Giá trị hợp lệ: "mainnet" | "testnet" | "localnet"
   * Mặc định: "mainnet"
   */
  network?: string;
}

// ─── Lớp IntentsEngine (Facade) ──────────────────────────────────────────────

/**
 * Facade chính của package — tổng hợp tất cả chức năng của Intents Engine
 * thành một API đơn giản, dễ dùng.
 *
 * Nội bộ sử dụng:
 *  - `IntentBuilder` để xây dựng intent
 *  - `SolverNetwork` để lấy báo giá
 *  - `IntentExecutor` để thực thi và theo dõi
 *
 * @example
 * // Khởi tạo engine
 * const engine = new IntentsEngine({ network: "testnet" });
 *
 * // Swap 100 USDC lấy NEAR
 * const intent = engine.buildSwap("USDC", "NEAR", "100");
 *
 * // Lấy báo giá tốt nhất
 * const quote = await engine.getQuote(intent);
 * console.log(`Sẽ nhận được ${quote.toAmount} NEAR`);
 *
 * // Thực thi
 * const result = await engine.execute(intent, quote);
 * console.log(`Tx hash: ${result.txHash}`);
 */
export class IntentsEngine {
  /** Cấu hình đang sử dụng */
  private readonly config: Required<IntentsEngineConfig>;

  /** Mạng solver — lấy báo giá từ các solver */
  private readonly solverNetwork: SolverNetwork;

  /** Executor — thực thi intent và theo dõi trạng thái */
  private readonly executor: IntentExecutor;

  /**
   * Khởi tạo IntentsEngine với cấu hình tùy chọn.
   * @param config - Cấu hình tùy chọn (programId, network)
   */
  constructor(config: IntentsEngineConfig = {}) {
    // Áp dụng giá trị mặc định cho các trường không được cung cấp
    this.config = {
      programId: config.programId ?? "intents.near",
      network: config.network ?? "mainnet",
    };

    // Khởi tạo các dependency nội bộ
    this.solverNetwork = new SolverNetwork();
    this.executor = new IntentExecutor();
  }

  // ─── Xây dựng Intent ────────────────────────────────────────────────────────

  /**
   * Xây dựng một swap intent — hoán đổi token trong cùng chuỗi.
   *
   * @param fromAsset - Token nguồn muốn bán (symbol hoặc địa chỉ)
   * @param toAsset - Token đích muốn mua
   * @param fromAmount - Số lượng token nguồn
   * @param options - Tùy chọn bổ sung (expiry, minOutput)
   * @returns Intent đã sẵn sàng để lấy báo giá
   *
   * @example
   * const intent = engine.buildSwap("USDC", "NEAR", "100");
   * // Với tùy chọn slippage bảo vệ:
   * const intent = engine.buildSwap("USDC", "NEAR", "100", { minOutput: "97" });
   */
  buildSwap(
    fromAsset: string,
    toAsset: string,
    fromAmount: string,
    options: { expiry?: number; minOutput?: string } = {}
  ): Intent {
    const builder = new IntentBuilder().swap(fromAsset, toAsset, fromAmount);

    if (options.expiry !== undefined) {
      builder.withExpiry(options.expiry);
    }
    if (options.minOutput !== undefined) {
      builder.withMinOutput(options.minOutput);
    }

    return builder.build();
  }

  /**
   * Xây dựng một bridge intent — chuyển token sang chuỗi khác.
   *
   * @param fromAsset - Token nguồn trên chuỗi hiện tại
   * @param toAsset - Token đích trên chuỗi nhận
   * @param fromAmount - Số lượng token cần bridge
   * @param targetChain - Chuỗi đích (ví dụ: "ethereum", "polygon", "base")
   * @param options - Tùy chọn bổ sung (expiry, minOutput)
   * @returns Intent bridge đã sẵn sàng
   *
   * @example
   * const intent = engine.buildBridge("NEAR", "ETH", "10", "ethereum");
   */
  buildBridge(
    fromAsset: string,
    toAsset: string,
    fromAmount: string,
    targetChain: string,
    options: { expiry?: number; minOutput?: string } = {}
  ): Intent {
    const builder = new IntentBuilder().bridge(
      fromAsset,
      toAsset,
      fromAmount,
      targetChain
    );

    if (options.expiry !== undefined) {
      builder.withExpiry(options.expiry);
    }
    if (options.minOutput !== undefined) {
      builder.withMinOutput(options.minOutput);
    }

    return builder.build();
  }

  // ─── Lấy báo giá ────────────────────────────────────────────────────────────

  /**
   * Lấy báo giá tốt nhất cho intent từ mạng solver.
   * Hỏi nhiều solver đồng thời và chọn giá tốt nhất.
   *
   * @param intent - Intent cần lấy báo giá
   * @param solverCount - Số solver tối đa cần hỏi (mặc định: 3)
   * @returns Promise chứa Quote tốt nhất
   *
   * @example
   * const quote = await engine.getQuote(intent);
   * console.log(`Phí: ${quote.feeBps / 100}%`);
   */
  async getQuote(intent: Intent, solverCount?: number): Promise<Quote> {
    return this.solverNetwork.getBestQuote(intent, solverCount);
  }

  // ─── Thực thi ────────────────────────────────────────────────────────────────

  /**
   * Thực thi intent với quote đã được chấp thuận.
   * Gửi giao dịch lên NEAR network và chờ kết quả.
   *
   * @param intent - Intent cần thực thi
   * @param quote - Quote đã chọn từ solver
   * @returns Promise chứa ExecutionResult
   *
   * @example
   * const result = await engine.execute(intent, quote);
   * if (result.status === "completed") {
   *   console.log(`Thành công! Tx: ${result.txHash}`);
   * }
   */
  async execute(intent: Intent, quote: Quote): Promise<ExecutionResult> {
    return this.executor.execute(intent, quote);
  }

  // ─── Tra cứu trạng thái ──────────────────────────────────────────────────────

  /**
   * Tra cứu trạng thái hiện tại của một intent.
   *
   * @param intentId - ID của intent cần tra cứu
   * @returns Promise chứa IntentStatus
   *
   * @example
   * const status = await engine.getStatus(intent.id);
   * console.log(status); // "completed"
   */
  async getStatus(intentId: string): Promise<IntentStatus> {
    return this.executor.getStatus(intentId);
  }

  // ─── Thông tin engine ────────────────────────────────────────────────────────

  /**
   * Trả về cấu hình hiện tại của engine (readonly).
   * Hữu ích cho debugging và logging.
   */
  getConfig(): Readonly<Required<IntentsEngineConfig>> {
    return this.config;
  }
}
