/**
 * @file adapter.ts
 * Lớp adapter trung gian giữa Intents Engine và thư viện @hot-labs/omni-sdk.
 *
 * TODO: Khi tích hợp thực với @hot-labs/omni-sdk:
 *  1. Cài đặt: pnpm add @hot-labs/omni-sdk
 *  2. Import: import { OmniClient } from "@hot-labs/omni-sdk"
 *  3. Khởi tạo OmniClient trong constructor với programId và network
 *  4. Thay thế các stub bên dưới bằng lệnh gọi API thực của SDK
 *
 * Tham khảo: https://docs.hot.rocks/omni-sdk
 */

import type { Intent, Quote } from "./types.js";
import { IntentsEngineError } from "./types.js";

// ─── Kiểu nội bộ cho raw data từ omni-sdk ────────────────────────────────────

/**
 * Kiểu đại diện cho raw quote object trả về từ solver network.
 * Cần map sang kiểu `Quote` của chúng ta.
 * TODO: Thay thế bằng kiểu thực từ @hot-labs/omni-sdk khi tích hợp
 */
interface RawSolverQuote {
  intent_id: string;
  solver: string;
  input_amount: string;
  output_amount: string;
  fee_bps: number;
  valid_until: number;
  [key: string]: unknown;
}

// ─── Lớp OmniSdkAdapter ──────────────────────────────────────────────────────

/**
 * Adapter bọc @hot-labs/omni-sdk để chuẩn hóa giao tiếp giữa
 * Intents Engine và NEAR Intents Protocol.
 *
 * Hiện tại cung cấp stub implementation — không có side effects thực sự.
 * Toàn bộ business logic sẽ được wiring khi tích hợp omni-sdk thực.
 */
export class OmniSdkAdapter {
  /**
   * Program ID của NEAR Intents smart contract.
   * Ví dụ mainnet: "intents.near", testnet: "intents.testnet"
   * TODO: Dùng giá trị này khi khởi tạo OmniClient thực
   */
  private readonly programId: string;

  /**
   * Mạng NEAR đang kết nối (mainnet / testnet / localnet)
   * TODO: Dùng giá trị này khi khởi tạo OmniClient thực
   */
  private readonly network: string;

  constructor(programId = "intents.near", network = "mainnet") {
    this.programId = programId;
    this.network = network;

    // TODO: Khởi tạo OmniClient tại đây khi tích hợp thực
    // this.client = new OmniClient({ programId: this.programId, network: this.network });
  }

  // ─── Chuẩn hóa Intent sang định dạng omni-sdk ──────────────────────────────

  /**
   * Chuyển đổi đối tượng `Intent` nội bộ sang định dạng mà omni-sdk mong đợi.
   * Hiện tại trả về một plain object tương thích để dùng làm payload.
   *
   * TODO: Khi tích hợp thực, thay thế bằng:
   *   return this.client.buildIntentPayload(intent)
   *
   * @param intent - Intent nội bộ cần chuẩn hóa
   * @returns Đối tượng payload tương thích với omni-sdk (kiểu unknown vì sẽ thay đổi)
   */
  normalizeIntent(intent: Intent): unknown {
    // Kiểm tra cơ bản để đảm bảo intent hợp lệ trước khi serialize
    if (!intent.id || !intent.type || !intent.fromAsset || !intent.toAsset) {
      throw new IntentsEngineError(
        "INVALID_INTENT",
        "Intent thiếu trường bắt buộc — không thể chuẩn hóa"
      );
    }

    // TODO: Thay thế mapping này bằng schema thực của omni-sdk
    // Hiện tại chuyển sang snake_case theo convention của NEAR protocol
    return {
      id: intent.id,
      intent_type: intent.type,
      from_asset: intent.fromAsset,
      to_asset: intent.toAsset,
      from_amount: intent.fromAmount,
      to_amount_min: intent.toAmountMin,
      expiry: intent.expiry,
      metadata: intent.metadata,
      // Thông tin về program và network để omni-sdk định tuyến đúng
      program_id: this.programId,
      network: this.network,
    };
  }

  // ─── Phân tích Quote từ raw response ───────────────────────────────────────

  /**
   * Chuyển đổi raw quote object từ solver network sang kiểu `Quote` của chúng ta.
   * Đảm bảo tất cả trường bắt buộc có mặt và đúng kiểu.
   *
   * TODO: Khi tích hợp thực, omni-sdk có thể đã trả về kiểu đúng rồi,
   * chỉ cần map lại tên trường.
   *
   * @param raw - Raw data nhận từ solver (kiểu unknown vì có thể thay đổi)
   * @returns Đối tượng `Quote` đã được chuẩn hóa
   * @throws {IntentsEngineError} Nếu raw data thiếu trường bắt buộc
   */
  parseQuote(raw: unknown): Quote {
    // Kiểm tra raw là object và không null
    if (typeof raw !== "object" || raw === null) {
      throw new IntentsEngineError(
        "EXECUTION_FAILED",
        "Raw quote không phải là object hợp lệ"
      );
    }

    // Cast sang kiểu nội bộ để truy cập các trường
    const data = raw as RawSolverQuote;

    // Kiểm tra sự tồn tại của các trường bắt buộc
    const requiredFields = [
      "intent_id",
      "solver",
      "input_amount",
      "output_amount",
      "fee_bps",
      "valid_until",
    ] as const;

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null) {
        throw new IntentsEngineError(
          "EXECUTION_FAILED",
          `Raw quote thiếu trường bắt buộc: "${field}"`
        );
      }
    }

    // Map từ định dạng snake_case của omni-sdk sang camelCase của chúng ta
    return {
      intentId: data.intent_id,
      solverAddress: data.solver,
      fromAmount: data.input_amount,
      toAmount: data.output_amount,
      feeBps: Number(data.fee_bps),
      validUntil: Number(data.valid_until),
    };
  }
}
