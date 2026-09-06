/**
 * @file config.ts
 * Load RuntimeConfig from environment variables.
 */
import type { RuntimeConfig } from "./types.js"

export function loadRuntimeConfig(): RuntimeConfig {
  return {
    sequencerAccount: process.env["SEQUENCER_ACCOUNT"] ?? "sequencer.axq",
    maxBatchSize:     parseInt(process.env["MAX_BATCH_SIZE"]     ?? "1000", 10),
    maxBatchDelayMs:  parseInt(process.env["MAX_BATCH_DELAY_MS"] ?? "200",  10),
    logLevel: (process.env["LOG_LEVEL"] ?? "info") as RuntimeConfig["logLevel"],
    port:             parseInt(process.env["PORT"]               ?? "8080", 10),
  }
}
