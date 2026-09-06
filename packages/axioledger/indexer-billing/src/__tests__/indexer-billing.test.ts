/**
 * @axioledger/indexer-billing — IndexerBillingEngine Test Suite
 */
import { describe, it, expect, beforeEach } from "vitest"
import { IndexerBillingEngine } from "../indexer-billing.js"
import { IndexerBillingError } from "../types.js"

let clock = 1_000_000
const nowFn = () => clock

function makeEngine() {
  clock = 1_000_000
  return new IndexerBillingEngine(undefined, nowFn)
}

// ---------------------------------------------------------------------------
// IB-1: Indexer Registry
// ---------------------------------------------------------------------------

describe("IndexerBillingEngine — IB-1 Indexer Registry", () => {
  it("registers an indexer and retrieves it", () => {
    const engine = makeEngine()
    const idx = engine.registerIndexer("ANS Indexer", "https://idx.axq", ["ans-domains"], 10n)
    expect(idx.name).toBe("ANS Indexer")
    expect(idx.status).toBe("active")
    expect(idx.baseFeePerQuery).toBe(10n)
    expect(idx.freeQueryQuota).toBe(100)
  })

  it("listIndexers returns active indexers, filterable by dataset", () => {
    const engine = makeEngine()
    engine.registerIndexer("A", "https://a", ["ans-domains"], 10n)
    engine.registerIndexer("B", "https://b", ["defi-events"], 5n)
    expect(engine.listIndexers()).toHaveLength(2)
    expect(engine.listIndexers("ans-domains")).toHaveLength(1)
    expect(engine.listIndexers("nft-metadata")).toHaveLength(0)
  })

  it("suspended indexer is not in listIndexers", () => {
    const engine = makeEngine()
    const idx = engine.registerIndexer("C", "https://c", ["custom"], 10n)
    engine.setIndexerStatus(idx.indexerId, "suspended")
    expect(engine.listIndexers()).toHaveLength(0)
  })

  it("throws INDEXER_NOT_FOUND for unknown ID", () => {
    const engine = makeEngine()
    expect(() => engine.getIndexer("ghost")).toThrow(IndexerBillingError)
  })
})

// ---------------------------------------------------------------------------
// IB-4: Consumer Credits
// ---------------------------------------------------------------------------

describe("IndexerBillingEngine — IB-4 Consumer Credits", () => {
  it("depositCredits creates account on first call", () => {
    const engine = makeEngine()
    const acc = engine.depositCredits("wallet-1", 500_000n)
    expect(acc.balanceMicroAxq).toBe(500_000n)
    expect(acc.consumerId).toBe("wallet-1")
  })

  it("depositCredits adds to existing balance", () => {
    const engine = makeEngine()
    engine.depositCredits("wallet-2", 100n)
    engine.depositCredits("wallet-2", 200n)
    expect(engine.getConsumer("wallet-2").balanceMicroAxq).toBe(300n)
  })

  it("throws CONSUMER_NOT_FOUND for unknown consumer", () => {
    const engine = makeEngine()
    expect(() => engine.getConsumer("ghost")).toThrow(IndexerBillingError)
  })
})

// ---------------------------------------------------------------------------
// IB-2 + IB-3: Query Metering + Fee Tiers
// ---------------------------------------------------------------------------

describe("IndexerBillingEngine — IB-2 Query Metering", () => {
  let engine: IndexerBillingEngine
  let indexerId: string

  beforeEach(() => {
    engine = makeEngine()
    indexerId = engine.registerIndexer("IDX", "https://idx", ["ans-domains"], 100n, 3).indexerId
  })

  it("first 3 queries use free quota (fee = 0)", () => {
    for (let i = 0; i < 3; i++) {
      const q = engine.recordQuery(indexerId, "consumer-1", "simple", 5)
      expect(q.feeMicroAxq).toBe(0n)
      expect(q.usedFreeQuota).toBe(true)
    }
  })

  it("4th query (beyond free quota) charges baseFee × multiplier", () => {
    for (let i = 0; i < 3; i++) engine.recordQuery(indexerId, "c1", "simple", 5)
    engine.depositCredits("c1", 1_000n)
    const q = engine.recordQuery(indexerId, "c1", "simple", 5)
    expect(q.feeMicroAxq).toBe(100n)  // baseFee 100 × 1.0 (simple)
    expect(q.usedFreeQuota).toBe(false)
  })

  it("complex query multiplier is 10×", () => {
    for (let i = 0; i < 3; i++) engine.recordQuery(indexerId, "c2", "simple", 5)
    engine.depositCredits("c2", 10_000n)
    const q = engine.recordQuery(indexerId, "c2", "complex", 50)
    expect(q.feeMicroAxq).toBe(1_000n)  // 100 × 10.0
  })

  it("medium query multiplier is 3×", () => {
    for (let i = 0; i < 3; i++) engine.recordQuery(indexerId, "c3", "simple", 5)
    engine.depositCredits("c3", 5_000n)
    const q = engine.recordQuery(indexerId, "c3", "medium", 20)
    expect(q.feeMicroAxq).toBe(300n)  // 100 × 3.0
  })

  it("throws INSUFFICIENT_CREDITS when balance < fee", () => {
    for (let i = 0; i < 3; i++) engine.recordQuery(indexerId, "poor", "simple", 5)
    // No credits deposited
    expect(() => engine.recordQuery(indexerId, "poor", "simple", 10))
      .toThrow(IndexerBillingError)
  })

  it("throws INDEXER_SUSPENDED when indexer is not active", () => {
    engine.setIndexerStatus(indexerId, "suspended")
    expect(() => engine.recordQuery(indexerId, "wallet", "simple", 5))
      .toThrow(IndexerBillingError)
  })

  it("24h period reset re-grants free quota", () => {
    for (let i = 0; i < 3; i++) engine.recordQuery(indexerId, "c4", "simple", 5)
    // Advance past 24h window
    clock += 24 * 60 * 60 * 1000 + 1
    const q = engine.recordQuery(indexerId, "c4", "simple", 5)
    expect(q.usedFreeQuota).toBe(true)
    expect(q.feeMicroAxq).toBe(0n)
  })
})

// ---------------------------------------------------------------------------
// IB-5: Settlement
// ---------------------------------------------------------------------------

describe("IndexerBillingEngine — IB-5 Settlement", () => {
  it("settle() returns correct totals for paid queries", () => {
    const engine = makeEngine()
    const idx = engine.registerIndexer("SETTLE", "https://s", ["ans-domains"], 100n, 0).indexerId
    engine.depositCredits("buyer", 10_000n)
    const from = clock
    engine.recordQuery(idx, "buyer", "simple", 10)   // 100 μAXQ
    engine.recordQuery(idx, "buyer", "medium", 20)   // 300 μAXQ
    engine.recordQuery(idx, "buyer", "complex", 50)  // 1000 μAXQ

    const batch = engine.settle(idx, from)
    expect(batch.queryCount).toBe(3)
    expect(batch.totalCollected).toBe(1_400n)
    expect(batch.netToIndexer).toBe(1_400n)
    expect(batch.txHash).toHaveLength(64)
  })

  it("getUnsettledFees aggregates paid queries", () => {
    const engine = makeEngine()
    const idx = engine.registerIndexer("US", "https://u", ["custom"], 50n, 0).indexerId
    engine.depositCredits("w", 5_000n)
    engine.recordQuery(idx, "w", "simple", 5)
    engine.recordQuery(idx, "w", "simple", 5)
    expect(engine.getUnsettledFees(idx)).toBe(100n)
  })

  it("getSettlements filters by indexer", () => {
    const engine = makeEngine()
    const i1 = engine.registerIndexer("I1", "https://i1", ["ans-domains"], 10n, 0).indexerId
    const i2 = engine.registerIndexer("I2", "https://i2", ["nft-metadata"], 10n, 0).indexerId
    engine.depositCredits("buyer", 1_000n)
    engine.recordQuery(i1, "buyer", "simple", 5)
    engine.settle(i1, 0)
    engine.settle(i2, 0)  // no queries → 0 settlement
    expect(engine.getSettlements(i1)).toHaveLength(1)
    expect(engine.getSettlements(i2)).toHaveLength(1)
  })
})
