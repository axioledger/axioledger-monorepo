/**
 * @kinetoprotocol/clamm-engine — Public API
 *
 * Concentrated Liquidity AMM — Module 13 (Kinetoprotocol AMM Exchange Engine)
 *   - 13.1 Concentrated Liquidity positions within customized price ranges
 *   - 13.2 Smart Order Routing across multiple pools
 *   - 13.3 Dynamic Fee Tier adjustment based on volatility
 *   - 13.4 Automated LP Position Rebalancing
 */

export { TickMath }           from "./tick-math.js"
export { PositionManager }    from "./position.js"
export { Pool, createPool }   from "./pool.js"
export { SwapRouter }         from "./swap-router.js"

export type {
  PoolConfig,
  LiquidityPosition,
  SwapParams,
  SwapResult,
  FeeAmount,
  Tick,
} from "./types.js"
