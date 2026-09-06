import { describe, it, expect, vi } from "vitest"
import { FairOrderingQueue } from "../fair-ordering.js"
import { Sequencer } from "../sequencer.js"
import type { L2Transaction } from "../types.js"

function makeTx(hash: string, receivedAtNs: bigint): L2Transaction {
  return { hash, from: "alice", to: "bob", value: "1", data: "", fee: "1", receivedAtNs, nonce: 0 }
}

describe("FairOrderingQueue", () => {
  it("dequeues transactions in arrival-time order", () => {
    const q = new FairOrderingQueue()
    q.enqueue(makeTx("tx3", 300n))
    q.enqueue(makeTx("tx1", 100n))
    q.enqueue(makeTx("tx2", 200n))
    const out = q.dequeue(3)
    expect(out.map((t) => t.hash)).toEqual(["tx1", "tx2", "tx3"])
  })

  it("size() and peek() work correctly", () => {
    const q = new FairOrderingQueue()
    q.enqueue(makeTx("tx-a", 1n))
    expect(q.size()).toBe(1)
    expect(q.peek()?.hash).toBe("tx-a")
    q.dequeue(1)
    expect(q.size()).toBe(0)
    expect(q.peek()).toBeUndefined()
  })
})

describe("Sequencer", () => {
  it("throws when submitting before start()", () => {
    const seq = new Sequencer()
    expect(() => seq.submit(makeTx("tx1", 1n))).toThrow("not running")
  })

  it("seals a batch with submitted transactions", () => {
    const seq = new Sequencer({ maxBatchSize: 10, maxBatchDelayMs: 1000 })
    seq.start()
    seq.submit(makeTx("tx1", 100n))
    seq.submit(makeTx("tx2", 200n))
    const batch = seq.sealBatch()
    expect(batch.batchNumber).toBe(1)
    expect(batch.transactions).toHaveLength(2)
    expect(batch.transactions[0]?.hash).toBe("tx1")
    seq.stop()
  })

  it("throws when sealing empty queue", () => {
    const seq = new Sequencer()
    seq.start()
    expect(() => seq.sealBatch()).toThrow("empty")
    seq.stop()
  })
})
