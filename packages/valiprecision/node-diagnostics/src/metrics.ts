/**
 * node-diagnostics — MetricsCollector
 *
 * Thu thập metrics hệ thống từ Node.js process API.
 *
 * Thiết kế injectable:
 *   - cpuUsagePercent  : đo bằng process.cpuUsage() delta giữa 2 lần collect
 *   - peerCount        : nhận qua PeerCountProvider callback — tách biệt khỏi
 *                        P2P layer, tránh circular dependency
 *   - blockHeight / pendingTxCount : vẫn mock cho đến khi Phase-2 wires chain RPC
 *
 * Cách inject peerCount từ @valiprecision/core-daemon:
 * ```typescript
 * const diagnostics = new NodeDiagnostics()
 * diagnostics.setPeerCountProvider(() => p2pNode.connectedPeers.size)
 * ```
 */

export interface NodeMetrics {
  timestamp:       number
  cpuUsagePercent: number
  memoryUsedMb:    number
  memoryTotalMb:   number
  peerCount:       number
  blockHeight:     number
  pendingTxCount:  number
  uptimeSeconds:   number
}

/** Callback trả về số peer đang kết nối từ P2P layer */
export type PeerCountProvider = () => number

const MAX_HISTORY   = 100
/** Khoảng sampling tối thiểu (ms) để tính CPU delta hợp lý */
const CPU_SAMPLE_MS = 1_000

export class MetricsCollector {
  private readonly history:    NodeMetrics[]    = []
  private readonly startedAt:  number           = Date.now()

  // ── CPU delta state ──────────────────────────────────────────────────────
  // cpuUsage() trả về microseconds user+system từ khi process start.
  // Để có % tức thì, lưu lại snapshot lần trước và tính delta.
  private lastCpuUsage:        NodeJS.CpuUsage  = process.cpuUsage()
  private lastCpuSampleAt:     number           = Date.now()

  // ── Injectable peer count ────────────────────────────────────────────────
  private peerCountProvider:   PeerCountProvider | null = null

  /**
   * Đăng ký callback cung cấp số peer từ P2P layer.
   * Nên được gọi một lần khi khởi động daemon, trước lần collect đầu tiên.
   *
   * @param provider - Hàm trả về số peer hiện tại (đồng bộ, không async)
   */
  setPeerCountProvider(provider: PeerCountProvider): void {
    this.peerCountProvider = provider
  }

  /**
   * Thu thập metrics. Sử dụng giá trị thực từ process API.
   *
   * cpuUsagePercent: tỷ lệ CPU (user+system) trong khoảng thời gian kể từ
   *   lần collect trước, tính trên 1 core. Giá trị > 100% nghĩa là process
   *   đang dùng nhiều hơn 1 core (multi-thread).
   *
   * peerCount: từ peerCountProvider nếu đã inject; 0 nếu chưa.
   *   0 khác với mock — HealthChecker sẽ đánh dấu peers check fail đúng cách,
   *   thay vì giả tạo con số pass.
   */
  collect(): NodeMetrics {
    const now = Date.now()
    const mem = process.memoryUsage()

    // ── cpuUsagePercent (thực) ────────────────────────────────────────────
    const currentCpu  = process.cpuUsage()
    const elapsedMs   = now - this.lastCpuSampleAt

    let cpuUsagePercent: number
    if (elapsedMs >= CPU_SAMPLE_MS) {
      // delta microseconds (user + system) ÷ elapsed microseconds × 100
      const userDelta   = currentCpu.user   - this.lastCpuUsage.user
      const systemDelta = currentCpu.system - this.lastCpuUsage.system
      const elapsedUs   = elapsedMs * 1_000
      cpuUsagePercent = Math.min(
        Math.round(((userDelta + systemDelta) / elapsedUs) * 100 * 10) / 10,
        9999  // cap tại 9999% để tránh tràn metric
      )
      this.lastCpuUsage    = currentCpu
      this.lastCpuSampleAt = now
    } else {
      // Khoảng quá ngắn — dùng lại giá trị gần nhất từ history
      const last = this.history[this.history.length - 1]
      cpuUsagePercent = last ? last.cpuUsagePercent : 0
    }

    // ── peerCount (injectable, default 0 nếu chưa wire) ──────────────────
    const peerCount = this.peerCountProvider
      ? this.peerCountProvider()
      : 0  // 0 = honest "not wired" — beter than random mock

    const metrics: NodeMetrics = {
      timestamp:       now,
      cpuUsagePercent,
      memoryUsedMb:    Math.round(mem.heapUsed  / 1_048_576),
      memoryTotalMb:   Math.round(mem.heapTotal / 1_048_576) || 512,
      peerCount,
      blockHeight:     Math.floor(now / 1000),   // TODO(Phase-2): wire chain RPC
      pendingTxCount:  0,                        // TODO(Phase-2): wire mempool API
      uptimeSeconds:   Math.round((now - this.startedAt) / 1000),
    }

    if (this.history.length >= MAX_HISTORY) this.history.shift()
    this.history.push(metrics)
    return metrics
  }

  getHistory(lastN?: number): NodeMetrics[] {
    if (lastN === undefined) return [...this.history]
    return this.history.slice(-lastN)
  }
}
