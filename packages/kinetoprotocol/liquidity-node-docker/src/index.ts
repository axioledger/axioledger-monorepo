/**
 * @kinetoprotocol/liquidity-node-docker — Public API
 *
 * Liquidity Node — Dockerized Market Maker Environment
 * Modules 13.1/13.4 — CLAMM position management & automated rebalancing
 *
 * Runs as a standalone service that:
 *   1. Monitors CLAMM pool price ranges for registered LP positions
 *   2. Automatically rebalances out-of-range positions (Module 13.4)
 *   3. Collects and aggregates swap fees (Module 14.4)
 *   4. Participates in gauge weight voting via bribes (Module 14.3)
 */

export { LiquidityNode }       from "./liquidity-node.js"
export { AutoRebalancer }      from "./rebalancer.js"
export { loadLiquidityConfig } from "./config.js"

export type { LiquidityConfig, NodeHealth, PositionSummary } from "./types.js"
