import { describe, it, expect } from "vitest"
import { ZKBatcher } from "../batcher.js"
import { CommitmentBuilder } from "../commitment.js"
import type { StateTransition } from "../types.js"

function makeTransition(i: number): StateTransition {
  return { account: `acct-${i}`, prevStateRoot: `prev-${i}`, nextStateRoot: `next-${i}`, txHash: `0x${i}` }
}

describe("CommitmentBuilder", () => {
  it("builds a commitment from transitions", () => {
    const builder = new CommitmentBuilder()
    const c = builder.build(1, [makeTransition(1), makeTransition(2)])
    expect(c.batchNumber).toBe(1)
    expect(c.transitionCount).toBe(2)
    expect(c.snarkProof).toBeNull()
    expect(c.stateRoot).toContain("next-2")
  })

  it("attaches a SNARK proof", () => {
    const builder = new CommitmentBuilder()
    const c = builder.build(1, [makeTransition(1)])
    const proven = builder.attachProof(c, "base64snark==")
    expect(proven.snarkProof).toBe("base64snark==")
  })

  it("throws on empty transitions", () => {
    const builder = new CommitmentBuilder()
    expect(() => builder.build(1, [])).toThrow()
  })
})

describe("ZKBatcher", () => {
  it("accumulates transitions and seals a batch", () => {
    const batcher = new ZKBatcher()
    batcher.addTransition(makeTransition(1))
    batcher.addTransition(makeTransition(2))
    expect(batcher.pendingCount()).toBe(2)
    const commitment = batcher.sealBatch()
    expect(commitment.transitionCount).toBe(2)
    expect(batcher.pendingCount()).toBe(0)
    expect(batcher.batchCount()).toBe(1)
  })

  it("throws when sealing empty batcher", () => {
    const batcher = new ZKBatcher()
    expect(() => batcher.sealBatch()).toThrow("No pending")
  })

  it("auto-seals when maxTransitions is reached", () => {
    const batcher = new ZKBatcher({ maxTransitions: 2, maxCommitDelayMs: 60_000 })
    batcher.addTransition(makeTransition(1))
    batcher.addTransition(makeTransition(2))
    // Auto-seal should have fired
    expect(batcher.pendingCount()).toBe(0)
    expect(batcher.batchCount()).toBe(1)
  })
})
