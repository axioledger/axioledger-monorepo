/**
 * node-diagnostics — MetricsReporter
 *
 * Xuất metrics dưới dạng:
 *   - JSON (debug/API consumption)
 *   - Prometheus text format v0.0.4 (scrape endpoint /metrics)
 *
 * Prometheus naming convention:
 *   axioledger_<subsystem>_<metric>_<unit>
 *   Subsystems: node, chain, network, process
 *
 * Grafana dashboard: docs/ (được tạo bởi PrometheusHttpServer)
 */
import type { NodeMetrics } from "./metrics.js"

// ─── Label helpers ────────────────────────────────────────────────────────────

function labelStr(labels: Record<string, string>): string {
  const pairs = Object.entries(labels)
    .map(([k, v]) => `${k}="${v.replace(/"/g, '\\"')}"`)
    .join(",")
  return pairs ? `{${pairs}}` : ""
}

function metric(
  help: string,
  type: "gauge" | "counter" | "histogram",
  name: string,
  value: number | string,
  labels: Record<string, string> = {}
): string[] {
  return [
    `# HELP ${name} ${help}`,
    `# TYPE ${name} ${type}`,
    `${name}${labelStr(labels)} ${value}`,
    ``,
  ]
}

// ─── MetricsReporter ─────────────────────────────────────────────────────────

export class MetricsReporter {
  toJSON(metrics: NodeMetrics): string {
    return JSON.stringify(metrics, null, 2)
  }

  /**
   * Xuất toàn bộ metrics theo Prometheus text format v0.0.4.
   * Content-Type: text/plain; version=0.0.4; charset=utf-8
   */
  toPrometheus(metrics: NodeMetrics, nodeLabels: Record<string, string> = {}): string {
    const ts    = metrics.timestamp
    const lines: string[] = [
      `# Axioledger Node Metrics — generated at ${new Date(ts).toISOString()}`,
      ``,
      // ── Process / System ────────────────────────────────────────────────────
      ...metric("CPU usage percentage (0–100)", "gauge",
        "axioledger_node_cpu_usage_percent", metrics.cpuUsagePercent.toFixed(2), nodeLabels),
      ...metric("Memory used in megabytes", "gauge",
        "axioledger_node_memory_used_mb", metrics.memoryUsedMb, nodeLabels),
      ...metric("Total heap memory in megabytes", "gauge",
        "axioledger_node_memory_total_mb", metrics.memoryTotalMb, nodeLabels),
      ...metric("Memory utilization ratio (0–1)", "gauge",
        "axioledger_node_memory_utilization_ratio",
        metrics.memoryTotalMb > 0
          ? (metrics.memoryUsedMb / metrics.memoryTotalMb).toFixed(4)
          : "0",
        nodeLabels),
      ...metric("Process uptime in seconds", "counter",
        "axioledger_node_uptime_seconds", metrics.uptimeSeconds, nodeLabels),
      // ── Chain ────────────────────────────────────────────────────────────────
      ...metric("Latest block height observed", "counter",
        "axioledger_chain_block_height", metrics.blockHeight, nodeLabels),
      ...metric("Number of transactions pending in mempool", "gauge",
        "axioledger_chain_pending_tx_count", metrics.pendingTxCount, nodeLabels),
      // ── Network ──────────────────────────────────────────────────────────────
      ...metric("Number of currently connected peers", "gauge",
        "axioledger_network_peer_count", metrics.peerCount, nodeLabels),
      // ── Timestamp meta ───────────────────────────────────────────────────────
      ...metric("Unix timestamp of this metrics snapshot (ms)", "gauge",
        "axioledger_scrape_timestamp_ms", ts, nodeLabels),
    ]
    return lines.join("\n").trimEnd()
  }
}
