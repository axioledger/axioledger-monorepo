import { describe, it, expect } from "vitest"
import { ProofAggregator } from "../aggregator.js"
import { AggregationQueue } from "../queue.js"
import type { AggregationRequest } from "../types.js"

describe("ProofAggregator", () => {
  it("aggregates multiple proofs into one", async () => {
    const aggregator = new ProofAggregator()
    const request: AggregationRequest = {
      id: "req-1",
      scheme: "halo2-accumulator",
      proofs: [
        { circuitId: "transfer-v1", proof: "proof-a" },
        { circuitId: "transfer-v1", proof: "proof-b" },
      ],
    }
    const result = await aggregator.aggregate(request)
    expect(result.requestId).toBe("req-1")
    expect(result.inputProofCount).toBe(2)
    expect(result.aggregatedProof).toContain("agg-halo2-accumulator")
    expect(result.scheme).toBe("halo2-accumulator")
  })

  it("throws on empty proof list", async () => {
    const aggregator = new ProofAggregator()
    await expect(
      aggregator.aggregate({ id: "empty", scheme: "groth16-batch", proofs: [] })
    ).rejects.toThrow("no proofs")
  })
})

describe("AggregationQueue", () => {
  it("accumulates proofs and flushes", async () => {
    const queue = new AggregationQueue({ maxBatchSize: 10, maxDelayMs: 1000 })
    queue.enqueue("transfer-v1", "proof-1")
    queue.enqueue("transfer-v1", "proof-2")
    expect(queue.size()).toBe(2)
    const result = await queue.flush()
    expect(result).toBeDefined()
    expect(result?.inputProofCount).toBe(2)
    expect(queue.size()).toBe(0)
  })

  it("flush returns undefined on empty queue", async () => {
    const queue = new AggregationQueue({ maxBatchSize: 10, maxDelayMs: 1000 })
    const result = await queue.flush()
    expect(result).toBeUndefined()
  })
})
