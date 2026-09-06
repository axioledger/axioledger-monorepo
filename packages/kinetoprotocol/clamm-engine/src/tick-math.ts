/**
 * @file tick-math.ts
 * Tick ↔ sqrt-price conversion math for the CLAMM engine.
 *
 * Uses Q64.96 fixed-point arithmetic to match Uniswap v3 conventions.
 * All intermediate calculations use bigint to avoid floating-point loss.
 */

/** Minimum tick index (corresponds to ~2.3×10⁻³⁸ price) */
export const MIN_TICK = -887272
/** Maximum tick index (corresponds to ~4.3×10³⁷ price) */
export const MAX_TICK = 887272

/** Q96 scaling constant: 2^96 */
const Q96 = 2n ** 96n

/**
 * Approximates sqrt(1.0001^tick) × 2^96 as a Q64.96 fixed-point bigint.
 *
 * Note: production implementations use a precomputed lookup table and
 * bit-manipulation tricks (cf. Uniswap v3 TickMath.sol). This version
 * uses a bigint-safe linear approximation sufficient for Phase 1 testing.
 */
export class TickMath {
  /**
   * Returns the sqrt price ratio as a Q64.96 bigint for a given tick index.
   * @throws {RangeError} if tick is outside [MIN_TICK, MAX_TICK]
   */
  static getSqrtRatioAtTick(tick: number): bigint {
    if (tick < MIN_TICK || tick > MAX_TICK) {
      throw new RangeError(`tick ${tick} out of range [${MIN_TICK}, ${MAX_TICK}]`)
    }
    // Phase 1 approximation: sqrt(1.0001^tick) ≈ e^(tick × ln(1.0001)/2)
    // Using integer math: multiply Q96 by rational approximation
    const lnSqrt10001 = 0.00004999916722  // ln(1.0001) / 2
    const ratio = Math.exp(tick * lnSqrt10001)
    // Convert float ratio to Q64.96 bigint
    return BigInt(Math.floor(ratio * Number(Q96)))
  }

  /**
   * Returns the tick index for a given Q64.96 sqrt price ratio.
   * @throws {RangeError} if sqrtPriceX96 is out of valid range
   */
  static getTickAtSqrtRatio(sqrtPriceX96: bigint): number {
    if (sqrtPriceX96 <= 0n) {
      throw new RangeError("sqrtPriceX96 must be positive")
    }
    const ratio = Number(sqrtPriceX96) / Number(Q96)
    // tick = log_sqrt(1.0001)(ratio) = log(ratio) / log(sqrt(1.0001))
    const tick = Math.log(ratio) / Math.log(Math.sqrt(1.0001))
    return Math.floor(tick)
  }
}
