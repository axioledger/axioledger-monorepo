/**
 * @file config.ts
 */
import type { LiquidityConfig } from "./types.js"

export function loadLiquidityConfig(): LiquidityConfig {
  const poolIds = (process.env["POOL_IDS"] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  return {
    nodeId:              process.env["LP_NODE_ID"]              ?? "lp-node-default",
    poolIds,
    rebalanceIntervalMs: parseInt(process.env["REBALANCE_INTERVAL_MS"] ?? "60000", 10),
    logLevel:            (process.env["LOG_LEVEL"] ?? "info") as LiquidityConfig["logLevel"],
    port:                parseInt(process.env["PORT"]              ?? "8090", 10),
  }
}
