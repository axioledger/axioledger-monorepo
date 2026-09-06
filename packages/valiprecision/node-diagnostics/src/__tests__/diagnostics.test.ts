/**
 * node-diagnostics — Tests
 */
import { describe, it, expect } from "vitest"
import { MetricsCollector }  from "../metrics.js"
import { HealthChecker }     from "../health-check.js"
import { MetricsReporter }   from "../reporter.js"
import { NodeDiagnostics }   from "../index.js"

describe("MetricsCollector", () => {
  it("collect() trả về object với tất cả fields", () => {
    const c = new MetricsCollector()
    const m = c.collect()
    expect(typeof m.cpuUsagePercent).toBe("number")
    expect(typeof m.memoryUsedMb).toBe("number")
    expect(typeof m.peerCount).toBe("number")
    expect(typeof m.blockHeight).toBe("number")
    expect(typeof m.uptimeSeconds).toBe("number")
  })

  it("memoryUsedMb > 0 (thực từ process.memoryUsage)", () => {
    const c = new MetricsCollector()
    expect(c.collect().memoryUsedMb).toBeGreaterThan(0)
  })

  it("getHistory trả về đúng số lần collect", () => {
    const c = new MetricsCollector()
    c.collect(); c.collect(); c.collect()
    expect(c.getHistory().length).toBe(3)
    expect(c.getHistory(2).length).toBe(2)
  })
})

describe("HealthChecker", () => {
  it("healthy khi metrics trong threshold", () => {
    const checker = new HealthChecker({ minPeerCount: 1, maxCpuPercent: 100 })
    const metrics = { timestamp: Date.now(), cpuUsagePercent: 30, memoryUsedMb: 100, memoryTotalMb: 1000, peerCount: 10, blockHeight: 1, pendingTxCount: 0, uptimeSeconds: 60 }
    expect(checker.isHealthy(metrics).healthy).toBe(true)
  })

  it("unhealthy khi peerCount < minPeerCount", () => {
    const checker = new HealthChecker({ minPeerCount: 10 })
    const metrics = { timestamp: Date.now(), cpuUsagePercent: 30, memoryUsedMb: 100, memoryTotalMb: 1000, peerCount: 2, blockHeight: 1, pendingTxCount: 0, uptimeSeconds: 60 }
    const report = checker.isHealthy(metrics)
    expect(report.healthy).toBe(false)
    expect(report.checks["peers"]?.ok).toBe(false)
  })
})

describe("MetricsReporter", () => {
  it("toPrometheus() chứa axioledger_cpu_usage_percent", () => {
    const r = new MetricsReporter()
    const m = new MetricsCollector().collect()
    expect(r.toPrometheus(m)).toContain("axioledger_cpu_usage_percent")
  })

  it("toJSON() trả về JSON hợp lệ", () => {
    const r = new MetricsReporter()
    const m = new MetricsCollector().collect()
    const json = JSON.parse(r.toJSON(m))
    expect(json.memoryUsedMb).toBeGreaterThan(0)
  })
})

describe("NodeDiagnostics", () => {
  it("getHealthReport() trả về HealthReport với field healthy", () => {
    const nd = new NodeDiagnostics({ minPeerCount: 0 })
    const report = nd.getHealthReport()
    expect(typeof report.healthy).toBe("boolean")
    expect(report.checks).toBeDefined()
  })

  it("setPeerCountProvider inject peer count vào metrics", () => {
    const nd = new NodeDiagnostics({ minPeerCount: 5 })
    // Trước khi inject — peerCount = 0, peers check fail
    const before = nd.getHealthReport()
    expect(before.checks["peers"]?.ok).toBe(false)

    // Sau khi inject provider trả về 10 peers
    nd.setPeerCountProvider(() => 10)
    const after = nd.collect()
    expect(after.peerCount).toBe(10)
    expect(nd.getHealthReport().checks["peers"]?.ok).toBe(true)
  })

  it("setPeerCountProvider trả về this (fluent API)", () => {
    const nd = new NodeDiagnostics()
    expect(nd.setPeerCountProvider(() => 5)).toBe(nd)
  })
})
