/**
 * @file types.ts
 * Runtime types for the Docker container runtime.
 */

export interface RuntimeConfig {
  sequencerAccount:  string
  maxBatchSize:      number
  maxBatchDelayMs:   number
  logLevel:          "debug" | "info" | "warn" | "error"
  port:              number
}

export interface HealthStatus {
  healthy: boolean
  uptime:  number        // seconds since start
  queueDepth: number     // pending L2 transactions
  batchCount: number     // total sealed batches
}
