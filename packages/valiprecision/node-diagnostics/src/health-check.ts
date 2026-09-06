/**
 * node-diagnostics — NodeMetrics
 */
import type { NodeMetrics } from "./metrics.js"

export interface HealthThresholds {
  maxCpuPercent:   number   // mặc định: 90
  minPeerCount:    number   // mặc định: 3
  maxMemoryPercent:number   // mặc định: 85
  maxBlockLag:     number   // mặc định: 100
}

export const DEFAULT_HEALTH_THRESHOLDS: HealthThresholds = {
  maxCpuPercent:    90,
  minPeerCount:     3,
  maxMemoryPercent: 85,
  maxBlockLag:      100,
}

export interface HealthCheck {
  ok:        boolean
  value:     unknown
  threshold: unknown
}

export interface HealthReport {
  healthy:   boolean
  timestamp: number
  checks:    Record<string, HealthCheck>
}

export class HealthChecker {
  private readonly thresholds: HealthThresholds

  constructor(thresholds: Partial<HealthThresholds> = {}) {
    this.thresholds = { ...DEFAULT_HEALTH_THRESHOLDS, ...thresholds }
  }

  isHealthy(metrics: NodeMetrics): HealthReport {
    const t = this.thresholds
    const checks: Record<string, HealthCheck> = {
      cpu:    { ok: metrics.cpuUsagePercent   <= t.maxCpuPercent,    value: metrics.cpuUsagePercent,   threshold: t.maxCpuPercent    },
      memory: { ok: (metrics.memoryUsedMb / metrics.memoryTotalMb * 100) <= t.maxMemoryPercent, value: metrics.memoryUsedMb, threshold: t.maxMemoryPercent },
      peers:  { ok: metrics.peerCount          >= t.minPeerCount,     value: metrics.peerCount,         threshold: t.minPeerCount     },
    }
    return {
      healthy:   Object.values(checks).every((c) => c.ok),
      timestamp: Date.now(),
      checks,
    }
  }
}
