import { describe, it, expect } from "vitest"
import { loadLiquidityConfig } from "../config.js"
import { AutoRebalancer }      from "../rebalancer.js"
import { LiquidityNode }       from "../liquidity-node.js"
import type { LiquidityPosition } from "@kinetoprotocol/clamm-engine"

function makePosition(id: string, tickLower: number, tickUpper: number): LiquidityPosition {
  return {
    id,
    owner:      "lp-owner.axq",
    poolId:     "AXQ:USDC:3000",
    tickLower,
    tickUpper,
    liquidity:  1_000_000n,
    tokensOwedA: 0n,
    tokensOwedB: 0n,
  }
}

describe("loadLiquidityConfig", () => {
  it("returns defaults", () => {
    const cfg = loadLiquidityConfig()
    expect(cfg.rebalanceIntervalMs).toBe(60000)
    expect(cfg.port).toBe(8090)
  })

  it("parses POOL_IDS from env", () => {
    process.env["POOL_IDS"] = "AXQ:USDC:3000,AXQ:SQX:500"
    const cfg = loadLiquidityConfig()
    expect(cfg.poolIds).toEqual(["AXQ:USDC:3000", "AXQ:SQX:500"])
    delete process.env["POOL_IDS"]
  })
})

describe("AutoRebalancer", () => {
  it("returns in-range when tick is inside position range", () => {
    const rb     = new AutoRebalancer()
    const pos    = makePosition("pos-1", -100, 100)
    const result = rb.evaluate(pos, 0)
    expect(result.action).toBe("in-range")
    expect(rb.rebalancesRun).toBe(0)
  })

  it("returns rebalanced when tick is outside range", () => {
    const rb     = new AutoRebalancer()
    const pos    = makePosition("pos-2", -100, 100)
    const result = rb.evaluate(pos, 200)
    expect(result.action).toBe("rebalanced")
    expect(result.newTickLower).toBeDefined()
    expect(result.newTickUpper).toBeDefined()
    expect(rb.rebalancesRun).toBe(1)
  })

  it("summarize reflects in-range status", () => {
    const rb  = new AutoRebalancer()
    const pos = makePosition("pos-3", -50, 50)
    expect(rb.summarize(pos, 0).inRange).toBe(true)
    expect(rb.summarize(pos, 100).inRange).toBe(false)
  })
})

describe("LiquidityNode", () => {
  it("starts and serves /health", async () => {
    process.env["PORT"] = "18090"
    const node = new LiquidityNode()
    node.start()
    await new Promise((r) => setTimeout(r, 50))
    // Health check via fetch
    const res  = await fetch("http://localhost:18090/health")
    expect(res.ok).toBe(true)
    const body = await res.json() as { healthy: boolean }
    expect(body.healthy).toBe(true)
    await node.stop()
    delete process.env["PORT"]
  })
})
