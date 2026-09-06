/**
 * node-diagnostics — Public API
 */
import { MetricsCollector }         from "./metrics.js"
import { HealthChecker }            from "./health-check.js"
import { MetricsReporter }          from "./reporter.js"
import type { HealthThresholds }    from "./health-check.js"
import type { PeerCountProvider }   from "./metrics.js"

export { MetricsCollector }         from "./metrics.js"
export type { NodeMetrics, PeerCountProvider } from "./metrics.js"
export { HealthChecker, DEFAULT_HEALTH_THRESHOLDS } from "./health-check.js"
export type { HealthThresholds, HealthReport, HealthCheck } from "./health-check.js"
export { MetricsReporter }          from "./reporter.js"
export { PrometheusHttpServer }     from "./prometheus-server.js"
export type { PrometheusServerOptions } from "./prometheus-server.js"

export class NodeDiagnostics {
  private readonly collector: MetricsCollector
  private readonly checker:   HealthChecker
  private readonly reporter:  MetricsReporter

  constructor(thresholds: Partial<HealthThresholds> = {}) {
    this.collector = new MetricsCollector()
    this.checker   = new HealthChecker(thresholds)
    this.reporter  = new MetricsReporter()
  }

  /**
   * Đăng ký callback cung cấp số peer từ P2P layer.
   *
   * Gọi từ @valiprecision/core-daemon khi P2P node đã sẵn sàng:
   * ```typescript
   * const diag = new NodeDiagnostics()
   * diag.setPeerCountProvider(() => p2pNode.connectedPeers.size)
   * ```
   */
  setPeerCountProvider(provider: PeerCountProvider): this {
    this.collector.setPeerCountProvider(provider)
    return this  // fluent API cho chaining
  }

  collect()                                              { return this.collector.collect() }
  getHealthReport()                                      { return this.checker.isHealthy(this.collector.collect()) }
  exportJSON()                                           { return this.reporter.toJSON(this.collector.collect()) }
  exportPrometheus(labels?: Record<string, string>)      { return this.reporter.toPrometheus(this.collector.collect(), labels) }
  getHistory(n?: number)                                 { return this.collector.getHistory(n) }
}
