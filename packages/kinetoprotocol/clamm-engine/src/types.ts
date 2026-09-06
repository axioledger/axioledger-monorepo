/**
 * @file types.ts
 * Core types for the CLAMM Engine.
 */

/** Fee tier options (in basis points × 100, matching Uniswap v3 convention) */
export type FeeAmount =
  | 100   // 0.01% — stable pairs
  | 500   // 0.05% — stable-ish pairs
  | 3000  // 0.30% — standard pairs
  | 10000 // 1.00% — exotic pairs

/** A price tick boundary in the CLAMM price space */
export interface Tick {
  /** Tick index (signed integer, log1.0001 of price) */
  index: number
  /** Net liquidity change at this tick boundary */
  liquidityNet: bigint
  /** Gross liquidity reference count at this tick */
  liquidityGross: bigint
}

/** Configuration for creating a new liquidity pool */
export interface PoolConfig {
  /** Address/identifier of token A */
  tokenA: string
  /** Address/identifier of token B */
  tokenB: string
  /** Fee tier in basis-point units */
  fee: FeeAmount
  /** Initial sqrt price as Q64.96 fixed-point bigint */
  sqrtPriceX96: bigint
}

/** An LP position within a CLAMM pool */
export interface LiquidityPosition {
  /** Unique position ID */
  id: string
  /** Owner account identifier */
  owner: string
  /** Pool identifier */
  poolId: string
  /** Lower tick index of the position range */
  tickLower: number
  /** Upper tick index of the position range */
  tickUpper: number
  /** Active liquidity units deposited */
  liquidity: bigint
  /** Accumulated token A fees, in token base units */
  tokensOwedA: bigint
  /** Accumulated token B fees, in token base units */
  tokensOwedB: bigint
}

/** Parameters for executing a swap */
export interface SwapParams {
  /** Pool to swap against */
  poolId: string
  /** If true swap token A → B; false swaps B → A */
  zeroForOne: boolean
  /** Exact input amount (positive) or exact output amount (negative) */
  amountSpecified: bigint
  /** sqrt price limit as Q64.96 — protects against excessive slippage */
  sqrtPriceLimitX96: bigint
}

/** Result returned after a swap is simulated or executed */
export interface SwapResult {
  /** Amount of token A consumed (negative) or received (positive) */
  amount0: bigint
  /** Amount of token B consumed (negative) or received (positive) */
  amount1: bigint
  /** New sqrt price after swap as Q64.96 */
  sqrtPriceX96: bigint
  /** New active tick after swap */
  tick: number
  /** Total liquidity active during the swap */
  liquidity: bigint
  /** Fee amount collected (in the input token units) */
  feeAmount: bigint
}
