/**
 * @file swap-router.ts
 * Smart Order Router — Module 13.2
 *
 * Routes swaps across multiple CLAMM pools to minimize price impact.
 * Phase 1: single-hop swap simulation using SwapMath.computeSwapStep.
 * Phase 2: multi-hop routing with optimal path selection.
 *
 * SwapMath implements the Uniswap v3 concentrated-liquidity swap formula:
 *
 *   For zeroForOne (A → B):
 *     sqrtPriceNext = liquidity × sqrtPriceCurrent
 *                     ─────────────────────────────
 *                     liquidity + Δtoken_A × sqrtPriceCurrent / Q96
 *
 *   For oneForZero (B → A):
 *     sqrtPriceNext = sqrtPriceCurrent + Δtoken_B × Q96 / liquidity
 *
 * All arithmetic uses bigint (Q64.96 fixed-point) — no floating-point loss.
 * Reference: Uniswap v3 whitepaper §6.2, SqrtPriceMath.sol
 */
import type { Pool } from "./pool.js"
import type { SwapParams, SwapResult } from "./types.js"
import { TickMath } from "./tick-math.js"

// ── Q96 constant ──────────────────────────────────────────────────────────────
const Q96 = 2n ** 96n

// ── Fee denominator: fee tiers are expressed in units per 1_000_000 ──────────
const FEE_DENOMINATOR = 1_000_000n

// ─── SwapMath ─────────────────────────────────────────────────────────────────

/**
 * Computes one step of the swap tick-crossing loop.
 *
 * Given the current sqrt price, the next tick boundary sqrt price,
 * the available liquidity, and the remaining amount to swap, calculates:
 *   - How far the price moves
 *   - How much of each token is consumed / received
 *   - How much fee is collected
 *
 * If the full amountRemaining can be absorbed within this tick range,
 * the step is "exact" and sqrtPriceNext reflects the final price.
 * Otherwise the step consumes the entire tick range and amountRemaining
 * is reduced by the partial fill.
 *
 * @param sqrtPriceCurrent  Current sqrt price (Q64.96)
 * @param sqrtPriceTarget   Sqrt price at the next tick boundary (Q64.96)
 * @param liquidity         Active liquidity in the current tick range
 * @param amountRemaining   Remaining input (positive = exact-in)
 * @param feePips           Fee tier in pips (e.g. 3000 = 0.30%)
 * @returns step result
 */
function computeSwapStep(
  sqrtPriceCurrent:  bigint,
  sqrtPriceTarget:   bigint,
  liquidity:         bigint,
  amountRemaining:   bigint,
  feePips:           bigint,
): {
  sqrtPriceNext: bigint
  amountIn:      bigint
  amountOut:     bigint
  feeAmount:     bigint
} {
  if (liquidity === 0n || amountRemaining === 0n) {
    return {
      sqrtPriceNext: sqrtPriceCurrent,
      amountIn:      0n,
      amountOut:     0n,
      feeAmount:     0n,
    }
  }

  const zeroForOne = sqrtPriceCurrent >= sqrtPriceTarget

  // Amount available after fee deduction (exact-in)
  const amountRemainingLessFee =
    (amountRemaining * (FEE_DENOMINATOR - feePips)) / FEE_DENOMINATOR

  let amountIn:  bigint
  let amountOut: bigint
  let sqrtPriceNext: bigint

  if (zeroForOne) {
    // Selling token A, price moves down (sqrtPrice decreases)
    //
    // Maximum token A that can be sold to reach sqrtPriceTarget:
    //   ΔA = liquidity × (1/sqrtPriceTarget - 1/sqrtPriceCurrent) × Q96
    //      = liquidity × Q96 × (sqrtPriceCurrent - sqrtPriceTarget)
    //        ─────────────────────────────────────────────────────────
    //                   sqrtPriceCurrent × sqrtPriceTarget
    const maxAmountIn =
      (liquidity * Q96 * (sqrtPriceCurrent - sqrtPriceTarget)) /
      (sqrtPriceCurrent * sqrtPriceTarget)

    if (amountRemainingLessFee >= maxAmountIn) {
      // Enough input to cross the tick — use full range
      sqrtPriceNext = sqrtPriceTarget
      amountIn      = maxAmountIn
    } else {
      // Partial fill — compute new price from amountRemainingLessFee
      //   sqrtPriceNext = liquidity × sqrtPriceCurrent × Q96
      //                   ─────────────────────────────────────────────
      //                   liquidity × Q96 + amountIn × sqrtPriceCurrent
      amountIn = amountRemainingLessFee
      const denom = liquidity * Q96 + amountIn * sqrtPriceCurrent
      sqrtPriceNext = (liquidity * sqrtPriceCurrent * Q96) / denom
      // Clamp to target — never overshoot
      if (sqrtPriceNext < sqrtPriceTarget) sqrtPriceNext = sqrtPriceTarget
    }

    // Amount of token B received:
    //   ΔB = liquidity × (sqrtPriceCurrent - sqrtPriceNext) / Q96
    amountOut = (liquidity * (sqrtPriceCurrent - sqrtPriceNext)) / Q96

  } else {
    // Selling token B, price moves up (sqrtPrice increases)
    //
    // Maximum token B to reach sqrtPriceTarget:
    //   ΔB = liquidity × (sqrtPriceTarget - sqrtPriceCurrent) / Q96
    const maxAmountIn =
      (liquidity * (sqrtPriceTarget - sqrtPriceCurrent)) / Q96

    if (amountRemainingLessFee >= maxAmountIn) {
      sqrtPriceNext = sqrtPriceTarget
      amountIn      = maxAmountIn
    } else {
      amountIn = amountRemainingLessFee
      // sqrtPriceNext = sqrtPriceCurrent + amountIn × Q96 / liquidity
      sqrtPriceNext = sqrtPriceCurrent + (amountIn * Q96) / liquidity
      if (sqrtPriceNext > sqrtPriceTarget) sqrtPriceNext = sqrtPriceTarget
    }

    // Amount of token A received:
    //   ΔA = liquidity × Q96 × (sqrtPriceNext - sqrtPriceCurrent)
    //        ───────────────────────────────────────────────────────
    //                  sqrtPriceCurrent × sqrtPriceNext
    amountOut =
      (liquidity * Q96 * (sqrtPriceNext - sqrtPriceCurrent)) /
      (sqrtPriceCurrent * sqrtPriceNext)
  }

  // Fee = amountIn × feePips / (FEE_DENOMINATOR - feePips)
  // Equivalent to back-computing fee from the net amount
  const feeAmount = (amountIn * feePips + FEE_DENOMINATOR - 1n) / FEE_DENOMINATOR

  return { sqrtPriceNext, amountIn, amountOut, feeAmount }
}

// ─── SwapRouter ───────────────────────────────────────────────────────────────

export class SwapRouter {
  private readonly pools = new Map<string, Pool>()

  /** Register a pool for routing. */
  registerPool(pool: Pool): void {
    this.pools.set(pool.id, pool)
  }

  /** Deregister a pool. */
  removePool(poolId: string): void {
    this.pools.delete(poolId)
  }

  /**
   * Simulate a single-hop exact-input swap against the specified pool.
   *
   * Implements the Uniswap v3 tick-stepping loop:
   *   While amountRemaining > 0 and price hasn't hit sqrtPriceLimit:
   *     1. Determine next initialised tick boundary
   *     2. Call computeSwapStep to move price toward that boundary
   *     3. If tick boundary crossed, apply liquidityNet delta
   *     4. Accumulate amount0, amount1, feeAmount
   *
   * Phase 1 limitation: uses a single-step approximation (no tick crossing).
   * Full multi-tick stepping is planned for Phase 2 when the tick bitmap
   * (sparse tick map → sorted tick list) is wire to the pool state.
   *
   * @throws {Error} if pool is not registered
   * @throws {RangeError} if sqrtPriceLimitX96 is invalid for the swap direction
   */
  simulateSwap(params: SwapParams): SwapResult {
    const pool = this.pools.get(params.poolId)
    if (!pool) {
      throw new Error(`Pool ${params.poolId} not registered in SwapRouter`)
    }

    const { zeroForOne, amountSpecified, sqrtPriceLimitX96 } = params

    // Guard: price limit must be on the correct side of current price
    if (zeroForOne && sqrtPriceLimitX96 >= pool.sqrtPriceX96) {
      throw new RangeError(
        "sqrtPriceLimitX96 must be < current price for zeroForOne swap"
      )
    }
    if (!zeroForOne && sqrtPriceLimitX96 !== 0n && sqrtPriceLimitX96 <= pool.sqrtPriceX96) {
      throw new RangeError(
        "sqrtPriceLimitX96 must be > current price for oneForZero swap"
      )
    }

    // Empty pool — nothing to swap against
    if (pool.liquidity === 0n) {
      return {
        amount0:      0n,
        amount1:      0n,
        sqrtPriceX96: pool.sqrtPriceX96,
        tick:         pool.currentTick,
        liquidity:    0n,
        feeAmount:    0n,
      }
    }

    const feePips = BigInt(pool.config.fee)

    // Determine the next tick boundary to use as sqrtPriceTarget.
    // Phase 1: step toward the nearest initialised tick, or the price limit
    // if no tick is initialised in that direction.
    const nextTick       = zeroForOne
      ? pool.currentTick - 1          // step down
      : pool.currentTick + 1          // step up
    const sqrtPriceNext  = TickMath.getSqrtRatioAtTick(nextTick)

    // Clamp sqrtPriceTarget to the user's price limit
    const sqrtPriceTarget = zeroForOne
      ? (sqrtPriceLimitX96 > sqrtPriceNext ? sqrtPriceLimitX96 : sqrtPriceNext)
      : (sqrtPriceLimitX96 !== 0n && sqrtPriceLimitX96 < sqrtPriceNext
          ? sqrtPriceLimitX96
          : sqrtPriceNext)

    // Run one swap step
    const step = computeSwapStep(
      pool.sqrtPriceX96,
      sqrtPriceTarget,
      pool.liquidity,
      amountSpecified < 0n ? -amountSpecified : amountSpecified,
      feePips,
    )

    // Derive finalTick from the new sqrt price
    const finalTick = TickMath.getTickAtSqrtRatio(step.sqrtPriceNext)

    // Sign convention (matches Uniswap v3 return values):
    //   amount0: token A delta (negative = consumed by swapper)
    //   amount1: token B delta (negative = consumed by swapper)
    const amount0 = zeroForOne
      ? -(step.amountIn  + step.feeAmount)   // swapper provides A
      : step.amountOut                        // swapper receives A

    const amount1 = zeroForOne
      ? step.amountOut                        // swapper receives B
      : -(step.amountIn  + step.feeAmount)   // swapper provides B

    return {
      amount0,
      amount1,
      sqrtPriceX96: step.sqrtPriceNext,
      tick:         finalTick,
      liquidity:    pool.liquidity,
      feeAmount:    step.feeAmount,
    }
  }

  /** Returns all registered pool IDs. */
  listPools(): string[] {
    return [...this.pools.keys()]
  }
}
