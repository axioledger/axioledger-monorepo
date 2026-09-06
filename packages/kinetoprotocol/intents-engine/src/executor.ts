/**
 * @file executor.ts
 * Lớp IntentExecutor chịu trách nhiệm thực thi intent đã được solver chấp thuận.
 *
 * Luồng thực thi:
 *  1. Nhận intent + quote đã được người dùng chấp nhận
 *  2. Kiểm tra quote còn hạn sử dụng
 *  3. Gửi lệnh thực thi lên NEAR network (hiện tại là mock)
 *  4. Lưu kết quả vào lịch sử nội bộ
 *  5. Cho phép tra cứu trạng thái sau này
 *
 * TODO: Khi tích hợp omni-sdk thực:
 *   const result = await omniClient.executeIntent(intent, quote, walletSigner)
 */

import type { ExecutionResult, Intent, IntentStatus, Quote } from "./types.js";
import { IntentsEngineError } from "./types.js";

// ─── Lớp IntentExecutor ───────────────────────────────────────────────────────

/**
 * Thực thi intent dựa trên quote đã được chấp thuận.
 * Lưu toàn bộ lịch sử thực thi trong bộ nhớ để tra cứu trạng thái.
 *
 * Lưu ý: Lịch sử chỉ tồn tại trong memory của process hiện tại.
 * TODO: Thêm persistence layer (ví dụ IndexedDB, localStorage, hoặc database)
 * cho production use.
 */
export class IntentExecutor {
  /**
   * Bộ nhớ nội bộ lưu lịch sử thực thi.
   * Key là intentId, value là ExecutionResult.
   *
   * Dùng Map thay vì plain object để có performance tốt hơn
   * và tránh xung đột với built-in property names.
   */
  private readonly executionHistory = new Map<string, ExecutionResult>();

  // ─── Thực thi Intent ────────────────────────────────────────────────────────

  /**
   * Thực thi một intent dựa trên quote đã chọn.
   * Kiểm tra tính hợp lệ, giả lập giao dịch, và lưu kết quả.
   *
   * TODO: Thay thế phần simulation bằng:
   *   const txResult = await omniClient.executeIntent(intent, quote, signer)
   *   return mapTxResultToExecutionResult(txResult)
   *
   * @param intent - Intent cần thực thi
   * @param quote - Quote đã được chấp thuận từ solver
   * @returns Promise chứa ExecutionResult với trạng thái cuối cùng
   * @throws {IntentsEngineError} Khi quote hết hạn hoặc intent không khớp
   */
  async execute(intent: Intent, quote: Quote): Promise<ExecutionResult> {
    // Kiểm tra quote và intent có khớp nhau không
    if (quote.intentId !== intent.id) {
      throw new IntentsEngineError(
        "INVALID_INTENT",
        `Quote intentId "${quote.intentId}" không khớp với intent id "${intent.id}"`
      );
    }

    // Kiểm tra quote còn hạn sử dụng
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (quote.validUntil <= nowSeconds) {
      throw new IntentsEngineError(
        "QUOTE_EXPIRED",
        `Quote cho intent "${intent.id}" đã hết hạn — hãy lấy báo giá mới`
      );
    }

    // Kiểm tra intent chưa được thực thi trước đó (chống double-execution)
    const existing = this.executionHistory.get(intent.id);
    if (existing && existing.status === "completed") {
      // Trả về kết quả cũ thay vì thực thi lại
      return existing;
    }

    // Cập nhật trạng thái thành "submitted" trong lịch sử
    const submittedResult: ExecutionResult = {
      intentId: intent.id,
      status: "submitted",
      actualFromAmount: intent.fromAmount,
      actualToAmount: "0",
    };
    this.executionHistory.set(intent.id, submittedResult);

    // Giả lập thời gian xử lý on-chain (100-300ms)
    await simulateOnChainDelay();

    // TODO: Gửi transaction thực lên NEAR network tại đây
    // const txHash = await nearClient.sendTransaction(buildTxPayload(intent, quote))

    // Tạo mock transaction hash theo định dạng NEAR (base58, 44 ký tự)
    const mockTxHash = generateMockTxHash(intent.id);

    // Xây dựng kết quả thực thi thành công
    const result: ExecutionResult = {
      intentId: intent.id,
      status: "completed",
      txHash: mockTxHash,
      // Số lượng thực tế lấy từ quote (trong mock, bằng với quote)
      actualFromAmount: quote.fromAmount,
      actualToAmount: quote.toAmount,
    };

    // Lưu kết quả cuối vào lịch sử
    this.executionHistory.set(intent.id, result);

    return result;
  }

  // ─── Tra cứu trạng thái ─────────────────────────────────────────────────────

  /**
   * Tra cứu trạng thái hiện tại của một intent theo ID.
   * Tìm trong lịch sử nội bộ trước, sau đó sẽ query on-chain nếu cần.
   *
   * TODO: Khi tích hợp thực, nếu không tìm thấy trong history,
   * query trực tiếp từ NEAR network:
   *   const onChainStatus = await nearClient.getIntentStatus(intentId)
   *
   * @param intentId - ID của intent cần tra cứu
   * @returns Promise chứa IntentStatus hiện tại
   * @throws {IntentsEngineError} Khi không tìm thấy intent trong lịch sử
   */
  async getStatus(intentId: string): Promise<IntentStatus> {
    const result = this.executionHistory.get(intentId);

    if (!result) {
      // Intent chưa được thực thi qua executor này
      // TODO: Fallback về query on-chain trước khi throw
      throw new IntentsEngineError(
        "INVALID_INTENT",
        `Không tìm thấy intent "${intentId}" trong lịch sử thực thi`
      );
    }

    return result.status;
  }

  // ─── API tiện ích ───────────────────────────────────────────────────────────

  /**
   * Lấy toàn bộ lịch sử thực thi.
   * Hữu ích cho debugging và hiển thị transaction history.
   *
   * @returns Mảng tất cả ExecutionResult đã lưu
   */
  getHistory(): ExecutionResult[] {
    return Array.from(this.executionHistory.values());
  }

  /**
   * Xóa toàn bộ lịch sử thực thi trong bộ nhớ.
   * Chủ yếu dùng trong testing hoặc khi người dùng logout.
   */
  clearHistory(): void {
    this.executionHistory.clear();
  }
}

// ─── Hàm tiện ích nội bộ ─────────────────────────────────────────────────────

/**
 * Giả lập thời gian xử lý on-chain: 100-300ms.
 * Thực tế NEAR finality thường mất 1-2 giây.
 */
function simulateOnChainDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 200) + 100;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Tạo mock transaction hash giả dạng NEAR tx hash.
 * Format: "mock_" + 8 ký tự hex từ intentId
 * Đây CHỈ dùng cho testing — không phải hash thật.
 *
 * @param intentId - ID của intent dùng để seed hash (deterministic trong test)
 */
function generateMockTxHash(intentId: string): string {
  // Lấy 8 ký tự đầu của intentId (bỏ dấu gạch ngang UUID)
  const seed = intentId.replace(/-/g, "").substring(0, 8);
  // Thêm timestamp để đảm bảo uniqueness
  const uniqueSuffix = Date.now().toString(16).slice(-8);
  return `mock_${seed}${uniqueSuffix}`;
}
