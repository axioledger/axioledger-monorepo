/**
 * @file solver.ts
 * Lớp SolverNetwork quản lý việc lấy báo giá từ mạng lưới solver.
 *
 * Solver là các nhà tạo lập thị trường (market makers) hoặc các protocol
 * tham gia vào NEAR Intents Protocol để thực hiện giao dịch cho người dùng.
 *
 * Hiện tại sử dụng mock implementation để có thể test và phát triển
 * mà không cần kết nối mạng thực.
 *
 * TODO: Thay thế mock bằng lệnh gọi omni-sdk thực khi tích hợp:
 *   const quotes = await omniClient.requestQuotes(normalizedIntent, { solverCount })
 */

import type { Intent, Quote } from "./types.js";
import { IntentsEngineError } from "./types.js";

// ─── Hằng số cấu hình mặc định ───────────────────────────────────────────────

/** Phí mặc định tính theo basis points: 30 bps = 0.3% */
const DEFAULT_FEE_BPS = 30;

/** Số solver mặc định được hỏi báo giá khi dùng getBestQuote */
const DEFAULT_SOLVER_COUNT = 3;

/** Thời gian hiệu lực mặc định của một quote: 30 giây */
const QUOTE_VALIDITY_SECONDS = 30;

// ─── Danh sách solver giả lập ────────────────────────────────────────────────

/**
 * Danh sách địa chỉ solver giả dùng trong môi trường mock.
 * Mỗi solver có mức phí khác nhau để mô phỏng cạnh tranh thị trường.
 * TODO: Thay thế bằng discovery mechanism thực từ omni-sdk
 */
const MOCK_SOLVERS: Array<{ address: string; feeBps: number }> = [
  { address: "solver-alpha.near", feeBps: 25 },  // Solver cạnh tranh nhất
  { address: "solver-beta.near", feeBps: 30 },   // Solver trung bình
  { address: "solver-gamma.near", feeBps: 35 },  // Solver dự phòng
];

// ─── Lớp SolverNetwork ────────────────────────────────────────────────────────

/**
 * Quản lý giao tiếp với mạng lưới solver của NEAR Intents Protocol.
 * Cung cấp khả năng lấy báo giá đơn lẻ hoặc so sánh nhiều báo giá
 * để tìm ra mức giá tốt nhất cho người dùng.
 */
export class SolverNetwork {
  /**
   * Lấy báo giá từ một solver duy nhất cho intent đã cho.
   * Hiện tại là mock — trả về quote giả với phí 0.3%.
   *
   * Cơ chế tính toán mock:
   * - Tỉ lệ hoán đổi giả định: 1:1 (để đơn giản hóa)
   * - Phí = fromAmount * feeBps / 10000
   * - toAmount = fromAmount - phí (sau khi tính phí)
   *
   * TODO: Thay thế bằng lệnh gọi omni-sdk thực:
   *   return omniClient.getSingleQuote(normalizedIntent)
   *
   * @param intent - Intent cần lấy báo giá
   * @returns Promise chứa Quote từ solver
   * @throws {IntentsEngineError} Khi intent đã hết hạn hoặc không hợp lệ
   */
  async getQuote(intent: Intent): Promise<Quote> {
    // Kiểm tra intent chưa hết hạn
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (intent.expiry <= nowSeconds) {
      throw new IntentsEngineError(
        "QUOTE_EXPIRED",
        `Intent "${intent.id}" đã hết hạn lúc ${new Date(intent.expiry * 1000).toISOString()}`
      );
    }

    // Giả lập độ trễ mạng (50-150ms) như khi gọi API thực
    await simulateNetworkDelay(50, 150);

    // Dùng solver đầu tiên trong danh sách mock
    const solver = MOCK_SOLVERS[0]!;

    return buildMockQuote(intent, solver.address, solver.feeBps);
  }

  /**
   * Lấy báo giá từ nhiều solver đồng thời và trả về báo giá tốt nhất.
   * "Tốt nhất" được định nghĩa là quote có `toAmount` cao nhất (người dùng nhận được nhiều nhất).
   *
   * TODO: Thay thế bằng:
   *   const quotes = await omniClient.requestQuotes(intent, { count: solverCount })
   *   return selectBestQuote(quotes)
   *
   * @param intent - Intent cần tìm báo giá tốt nhất
   * @param solverCount - Số solver tối đa cần hỏi (mặc định: 3)
   * @returns Promise chứa Quote tốt nhất trong số các báo giá nhận được
   * @throws {IntentsEngineError} Khi không có solver nào sẵn sàng hoặc intent không hợp lệ
   */
  async getBestQuote(
    intent: Intent,
    solverCount: number = DEFAULT_SOLVER_COUNT
  ): Promise<Quote> {
    // Kiểm tra intent chưa hết hạn
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (intent.expiry <= nowSeconds) {
      throw new IntentsEngineError(
        "QUOTE_EXPIRED",
        `Intent "${intent.id}" đã hết hạn — không thể lấy báo giá`
      );
    }

    // Giới hạn số solver không vượt quá danh sách mock có sẵn
    const count = Math.min(solverCount, MOCK_SOLVERS.length);
    if (count === 0) {
      throw new IntentsEngineError(
        "SOLVER_UNAVAILABLE",
        "Không có solver nào trong danh sách — kiểm tra cấu hình mạng"
      );
    }

    // Giả lập độ trễ mạng
    await simulateNetworkDelay(80, 200);

    // Lấy báo giá từ `count` solver đầu tiên đồng thời (Promise.all)
    const selectedSolvers = MOCK_SOLVERS.slice(0, count);
    const quotes: Quote[] = selectedSolvers.map((solver) =>
      buildMockQuote(intent, solver.address, solver.feeBps)
    );

    // Tìm quote có toAmount lớn nhất — người dùng nhận được nhiều nhất
    const bestQuote = quotes.reduce((best, current) => {
      const bestAmount = parseFloat(best.toAmount);
      const currentAmount = parseFloat(current.toAmount);
      return currentAmount > bestAmount ? current : best;
    });

    return bestQuote;
  }
}

// ─── Hàm tiện ích nội bộ ─────────────────────────────────────────────────────

/**
 * Xây dựng một Quote mock dựa trên intent và thông tin solver.
 * Áp dụng phí và tính toán số lượng token đích.
 *
 * @param intent - Intent cần tạo quote
 * @param solverAddress - Địa chỉ của solver cung cấp quote
 * @param feeBps - Phí tính theo basis points
 */
function buildMockQuote(
  intent: Intent,
  solverAddress: string,
  feeBps: number
): Quote {
  const fromAmountNum = parseFloat(intent.fromAmount);

  // Tính phí và số lượng token nhận được (giả định tỉ lệ 1:1 trước phí)
  const feeMultiplier = 1 - feeBps / 10_000;
  const toAmount = (fromAmountNum * feeMultiplier).toFixed(6);

  // Quote hết hạn sau QUOTE_VALIDITY_SECONDS giây
  const validUntil = Math.floor(Date.now() / 1000) + QUOTE_VALIDITY_SECONDS;

  return {
    intentId: intent.id,
    solverAddress,
    fromAmount: intent.fromAmount,
    toAmount,
    feeBps,
    validUntil,
  };
}

/**
 * Giả lập độ trễ mạng ngẫu nhiên trong khoảng [minMs, maxMs].
 * Giúp mock gần với behavior thực hơn và cho phép test async code.
 *
 * @param minMs - Độ trễ tối thiểu (milliseconds)
 * @param maxMs - Độ trễ tối đa (milliseconds)
 */
function simulateNetworkDelay(minMs: number, maxMs: number): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}
