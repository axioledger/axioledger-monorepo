/**
 * node-diagnostics — PrometheusHttpServer
 *
 * HTTP server tối giản (Node.js `http` module — không phụ thuộc Express)
 * phục vụ Prometheus scrape endpoint tại `/metrics`.
 *
 * Endpoints:
 *   GET /metrics   — Prometheus text format v0.0.4
 *   GET /health    — JSON health report (cho load balancer health check)
 *   GET /           — Redirect → /metrics
 *
 * Cách chạy:
 * ```typescript
 * import { PrometheusHttpServer } from "@valiprecision/node-diagnostics"
 *
 * const server = new PrometheusHttpServer({ port: 9100 })
 * server.start()
 * // Prometheus scrape: http://localhost:9100/metrics
 * ```
 *
 * prometheus.yml scrape config:
 * ```yaml
 * scrape_configs:
 *   - job_name: axioledger-validator
 *     static_configs:
 *       - targets: ["localhost:9100"]
 *     scrape_interval: 15s
 * ```
 *
 * Grafana: import `docs/grafana/axioledger-node-dashboard.json`
 */

import http from "node:http"
import { MetricsCollector }  from "./metrics.js"
import { HealthChecker }     from "./health-check.js"
import { MetricsReporter }   from "./reporter.js"
import type { HealthThresholds } from "./health-check.js"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PrometheusServerOptions {
  /** Port để lắng nghe. Mặc định: 9100 (Prometheus node exporter convention) */
  port?:        number
  /** Hostname / IP. Mặc định: "0.0.0.0" */
  host?:        string
  /** Labels cố định gắn vào mọi metric (ví dụ: node_id, region, chain_id) */
  nodeLabels?:  Record<string, string>
  /** Health thresholds tùy chỉnh */
  thresholds?:  Partial<HealthThresholds>
  /**
   * Scrape interval (ms) — dùng để pre-compute metrics trong bộ nhớ.
   * Mặc định: 15_000 (15 giây, khớp với Prometheus default)
   */
  scrapeIntervalMs?: number
}

// ─── PrometheusHttpServer ─────────────────────────────────────────────────────

export class PrometheusHttpServer {
  private readonly port:            number
  private readonly host:            string
  private readonly nodeLabels:      Record<string, string>
  private readonly collector:       MetricsCollector
  private readonly checker:         HealthChecker
  private readonly reporter:        MetricsReporter
  private readonly scrapeIntervalMs: number
  private server:   http.Server | null = null
  private intervalHandle: ReturnType<typeof setInterval> | null = null

  constructor(options: PrometheusServerOptions = {}) {
    this.port             = options.port             ?? 9100
    this.host             = options.host             ?? "0.0.0.0"
    this.nodeLabels       = options.nodeLabels        ?? {}
    this.scrapeIntervalMs = options.scrapeIntervalMs ?? 15_000
    this.collector        = new MetricsCollector()
    this.checker          = new HealthChecker(options.thresholds ?? {})
    this.reporter         = new MetricsReporter()
  }

  /** Khởi động HTTP server và bắt đầu thu thập metrics định kỳ */
  start(): void {
    if (this.server) {
      throw new Error("PrometheusHttpServer: server đã chạy")
    }

    // Pre-collect ngay khi khởi động
    this.collector.collect()

    // Collect định kỳ để giảm latency khi Prometheus scrape
    this.intervalHandle = setInterval(
      () => this.collector.collect(),
      this.scrapeIntervalMs
    )

    this.server = http.createServer((req, res) => {
      this._handleRequest(req, res)
    })

    this.server.listen(this.port, this.host, () => {
      console.log(
        `[PrometheusHttpServer] Listening on http://${this.host}:${this.port}/metrics`
      )
      if (Object.keys(this.nodeLabels).length > 0) {
        console.log(`[PrometheusHttpServer] Node labels: ${JSON.stringify(this.nodeLabels)}`)
      }
    })

    this.server.on("error", (err) => {
      console.error(`[PrometheusHttpServer] Server error: ${err.message}`)
    })
  }

  /** Graceful shutdown */
  stop(): Promise<void> {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle)
      this.intervalHandle = null
    }
    return new Promise((resolve, reject) => {
      if (!this.server) { resolve(); return }
      this.server.close((err) => {
        this.server = null
        if (err) reject(err)
        else {
          console.log("[PrometheusHttpServer] Server stopped.")
          resolve()
        }
      })
    })
  }

  // ── Request router ──────────────────────────────────────────────────────────

  private _handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    const url    = req.url ?? "/"
    const method = req.method ?? "GET"

    // Chỉ nhận GET
    if (method !== "GET") {
      res.writeHead(405, { "Allow": "GET" })
      res.end("Method Not Allowed")
      return
    }

    // Strip query string
    const path = url.split("?")[0]

    if (path === "/metrics") {
      this._serveMetrics(res)
    } else if (path === "/health") {
      this._serveHealth(res)
    } else if (path === "/") {
      res.writeHead(302, { "Location": "/metrics" })
      res.end()
    } else {
      res.writeHead(404)
      res.end("Not Found — available: /metrics  /health")
    }
  }

  private _serveMetrics(res: http.ServerResponse): void {
    try {
      const metrics = this.collector.collect()
      const body    = this.reporter.toPrometheus(metrics, this.nodeLabels)
      res.writeHead(200, {
        "Content-Type":  "text/plain; version=0.0.4; charset=utf-8",
        "Cache-Control": "no-store",
      })
      res.end(body)
    } catch (err) {
      console.error("[PrometheusHttpServer] /metrics error:", err)
      res.writeHead(500)
      res.end("Internal Server Error")
    }
  }

  private _serveHealth(res: http.ServerResponse): void {
    try {
      const metrics = this.collector.collect()
      const report  = this.checker.isHealthy(metrics)
      const status  = report.healthy ? 200 : 503
      res.writeHead(status, { "Content-Type": "application/json" })
      res.end(JSON.stringify(report, null, 2))
    } catch (err) {
      console.error("[PrometheusHttpServer] /health error:", err)
      res.writeHead(500)
      res.end(JSON.stringify({ healthy: false, error: String(err) }))
    }
  }
}
