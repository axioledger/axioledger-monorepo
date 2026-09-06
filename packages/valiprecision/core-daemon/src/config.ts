/**
 * core-daemon — DaemonConfig
 * Typed config interface cho Valiprecision P2P Node Daemon.
 */

export type LogLevel = "debug" | "info" | "warn" | "error"

export interface DaemonConfig {
  /** Unique node identifier (base58 pubkey) */
  nodeId: string
  /** Port lắng nghe kết nối P2P */
  listenPort: number
  /** Danh sách địa chỉ peer bootstrap ban đầu */
  bootstrapPeers: string[]
  /** Số peer tối đa. Mặc định: 50 */
  maxPeers: number
  /** Interval gửi heartbeat (ms). Mặc định: 30000 */
  heartbeatIntervalMs: number
  /** Thời gian chờ trước khi reconnect (ms). Mặc định: 5000 */
  reconnectDelayMs: number
  /** Mức log. Mặc định: "info" */
  logLevel: LogLevel
}

export const DEFAULT_DAEMON_CONFIG: Omit<DaemonConfig, "nodeId" | "listenPort"> = {
  bootstrapPeers:      [],
  maxPeers:            50,
  heartbeatIntervalMs: 30_000,
  reconnectDelayMs:    5_000,
  logLevel:            "info",
}

/**
 * Merge partial config với defaults. Throw nếu thiếu nodeId hoặc listenPort.
 */
export function mergeDaemonConfig(partial: Partial<DaemonConfig>): DaemonConfig {
  if (!partial.nodeId)     throw new Error("DaemonConfig: nodeId là bắt buộc")
  if (!partial.listenPort) throw new Error("DaemonConfig: listenPort là bắt buộc")
  return { ...DEFAULT_DAEMON_CONFIG, ...partial } as DaemonConfig
}
