/**
 * @file pool.ts
 * CLAMM Pool state management.
 * Module 13.1 — Concentrated Liquidity Pool.
 */
import type { PoolConfig, Tick } from "./types.js"

/** The active state of a CLAMM liquidity pool */
export interface Pool {
  /** Unique pool identifier (derived from tokenA+tokenB+fee) */
  id: string
  config: PoolConfig
  /** Current sqrt price as Q64.96 bigint */
  sqrtPriceX96: bigint
  /** Current active tick index */
  currentTick: number
  /** Total active liquidity in the current tick range */
  liquidity: bigint
  /** Sparse map of tick index → Tick data */
  ticks: Map<number, Tick>
  /** Protocol fee accumulator for token A */
  protocolFeeA: bigint
  /** Protocol fee accumulator for token B */
  protocolFeeB: bigint
}

/**
 * Creates a new in-memory Pool instance from a PoolConfig.
 * The pool ID is derived as `${tokenA}:${tokenB}:${fee}`.
 */
export function createPool(config: PoolConfig): Pool {
  const id = `${config.tokenA}:${config.tokenB}:${config.fee}`
  return {
    id,
    config,
    sqrtPriceX96: config.sqrtPriceX96,
    currentTick: 0,
    liquidity: 0n,
    ticks: new Map(),
    protocolFeeA: 0n,
    protocolFeeB: 0n,
  }
}
