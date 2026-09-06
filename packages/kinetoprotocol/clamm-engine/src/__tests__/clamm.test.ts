import { describe, it, expect } from "vitest"
import { TickMath, MIN_TICK, MAX_TICK } from "../tick-math.js"
import { PositionManager } from "../position.js"
import { createPool } from "../pool.js"
import { SwapRouter } from "../swap-router.js"
import type { PoolConfig } from "../types.js"

describe("TickMath", () => {
  it("returns Q96 for tick 0 (price = 1)", () => {
    const sqrt = TickMath.getSqrtRatioAtTick(0)
    const Q96 = 2n ** 96n
    // sqrt(1) = 1, so result should be ≈ Q96
    expect(Number(sqrt)).toBeCloseTo(Number(Q96), -2)
  })

  it("throws for tick below MIN_TICK", () => {
    expect(() => TickMath.getSqrtRatioAtTick(MIN_TICK - 1)).toThrow(RangeError)
  })

  it("throws for tick above MAX_TICK", () => {
    expect(() => TickMath.getSqrtRatioAtTick(MAX_TICK + 1)).toThrow(RangeError)
  })

  it("getTickAtSqrtRatio roundtrips through tick 100", () => {
    const sqrtPrice = TickMath.getSqrtRatioAtTick(100)
    const tick = TickMath.getTickAtSqrtRatio(sqrtPrice)
    expect(tick).toBe(100)
  })
})

describe("PositionManager", () => {
  it("mints and retrieves a position", () => {
    const mgr = new PositionManager()
    const pos = mgr.mint("alice", "pool-1", -100, 100, 1_000_000n)
    expect(pos.owner).toBe("alice")
    expect(pos.poolId).toBe("pool-1")
    expect(pos.liquidity).toBe(1_000_000n)
    expect(mgr.getPosition(pos.id)).toStrictEqual(pos)
  })

  it("burns a position and removes it", () => {
    const mgr = new PositionManager()
    const pos = mgr.mint("bob", "pool-1", -50, 50, 500n)
    mgr.burn(pos.id)
    expect(mgr.getPosition(pos.id)).toBeUndefined()
  })

  it("throws on invalid tick range", () => {
    const mgr = new PositionManager()
    expect(() => mgr.mint("alice", "pool-1", 100, 100, 1n)).toThrow(RangeError)
  })
})

describe("createPool + SwapRouter", () => {
  const Q96 = 2n ** 96n

  // Pool AXQ:USDC — initial price = 1 (sqrtPriceX96 = Q96)
  const config: PoolConfig = {
    tokenA: "AXQ",
    tokenB: "USDC",
    fee: 3000,
    sqrtPriceX96: Q96,
  }

  it("creates pool with correct id", () => {
    const pool = createPool(config)
    expect(pool.id).toBe("AXQ:USDC:3000")
    expect(pool.liquidity).toBe(0n)
  })

  it("simulateSwap returns zero amounts for empty pool (liquidity = 0)", () => {
    const router = new SwapRouter()
    const pool = createPool(config)
    router.registerPool(pool)
    // No liquidity — computeSwapStep short-circuits to zero
    const result = router.simulateSwap({
      poolId: pool.id,
      zeroForOne: true,
      amountSpecified: 1_000_000n,
      sqrtPriceLimitX96: 1n,
    })
    expect(result.amount0).toBe(0n)
    expect(result.amount1).toBe(0n)
    expect(result.feeAmount).toBe(0n)
  })

  it("simulateSwap with liquidity: amount0 negative (input), amount1 positive (output)", () => {
    const router = new SwapRouter()
    const pool = createPool(config)
    // Inject liquidity so swap has something to work against
    pool.liquidity = 1_000_000_000n
    router.registerPool(pool)

    const result = router.simulateSwap({
      poolId:            pool.id,
      zeroForOne:        true,             // A → B
      amountSpecified:   1_000_000n,       // exact-in
      sqrtPriceLimitX96: 1n,               // accept any price
    })

    // zeroForOne: amount0 is consumed (negative), amount1 is received (positive)
    expect(result.amount0).toBeLessThan(0n)
    expect(result.amount1).toBeGreaterThan(0n)
    expect(result.feeAmount).toBeGreaterThan(0n)
    // Price should have moved down
    expect(result.sqrtPriceX96).toBeLessThan(Q96)
  })

  it("simulateSwap oneForZero: amount1 negative, amount0 positive", () => {
    const router = new SwapRouter()
    const pool = createPool(config)
    pool.liquidity = 1_000_000_000n
    router.registerPool(pool)

    const result = router.simulateSwap({
      poolId:            pool.id,
      zeroForOne:        false,            // B → A
      amountSpecified:   1_000_000n,
      sqrtPriceLimitX96: 0n,               // no price limit (oneForZero)
    })

    expect(result.amount1).toBeLessThan(0n)
    expect(result.amount0).toBeGreaterThan(0n)
    expect(result.sqrtPriceX96).toBeGreaterThan(Q96)
  })

  it("simulateSwap throws for unregistered pool", () => {
    const router = new SwapRouter()
    expect(() =>
      router.simulateSwap({
        poolId: "nonexistent",
        zeroForOne: true,
        amountSpecified: 100n,
        sqrtPriceLimitX96: 1n,
      })
    ).toThrow("not registered")
  })

  it("simulateSwap throws RangeError for invalid price limit (zeroForOne)", () => {
    const router = new SwapRouter()
    const pool = createPool(config)
    pool.liquidity = 1_000n
    router.registerPool(pool)
    // sqrtPriceLimitX96 >= currentPrice → invalid for zeroForOne
    expect(() =>
      router.simulateSwap({
        poolId:            pool.id,
        zeroForOne:        true,
        amountSpecified:   100n,
        sqrtPriceLimitX96: Q96 + 1n,       // above current price — invalid
      })
    ).toThrow(RangeError)
  })
})
