/**
 * @file fair-ordering.ts
 * FIFO Fair Ordering Queue — Module 4.4
 *
 * Orders transactions deterministically by arrival timestamp to prevent
 * sandwich attacks and MEV front-running.
 */
import type { L2Transaction } from "./types.js"

/**
 * A priority queue that enforces strict arrival-time ordering.
 * Transactions received earlier (smaller receivedAtNs) are dequeued first.
 */
export class FairOrderingQueue {
  private readonly queue: L2Transaction[] = []

  /**
   * Insert a transaction into the queue.
   * The queue remains sorted by receivedAtNs ascending.
   */
  enqueue(tx: L2Transaction): void {
    // Binary insertion to maintain sort order
    let lo = 0
    let hi = this.queue.length
    while (lo < hi) {
      const mid = (lo + hi) >>> 1
      const midTx = this.queue[mid]
      if (midTx === undefined || midTx.receivedAtNs <= tx.receivedAtNs) {
        lo = mid + 1
      } else {
        hi = mid
      }
    }
    this.queue.splice(lo, 0, tx)
  }

  /**
   * Dequeue up to `count` transactions in strict arrival-time order.
   */
  dequeue(count: number): L2Transaction[] {
    return this.queue.splice(0, count)
  }

  /** Returns the number of transactions currently in the queue. */
  size(): number {
    return this.queue.length
  }

  /** Peek at the oldest transaction without removing it. */
  peek(): L2Transaction | undefined {
    return this.queue[0]
  }
}
