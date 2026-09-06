/**
 * @file sequencer.ts
 * L2 Sequencer — Module 4.1
 *
 * Accepts incoming L2 transactions, applies FIFO fair ordering,
 * and seals ordered batches for ZK commitment.
 */
import type { L2Transaction, OrderedBatch, SequencerConfig } from "./types.js"
import { FairOrderingQueue } from "./fair-ordering.js"

const DEFAULT_CONFIG: Required<SequencerConfig> = {
  maxBatchSize: 1000,
  maxBatchDelayMs: 200,
  sequencerAccount: "sequencer.axq",
}

export class Sequencer {
  private readonly config: Required<SequencerConfig>
  private readonly queue: FairOrderingQueue
  private batchNumber = 0
  private running = false
  private _timer: ReturnType<typeof setInterval> | null = null

  constructor(config: Partial<SequencerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.queue  = new FairOrderingQueue()
  }

  /** Accept a new L2 transaction into the ordering queue. */
  submit(tx: L2Transaction): void {
    if (!this.running) {
      throw new Error("Sequencer is not running — call start() first")
    }
    this.queue.enqueue(tx)
  }

  /**
   * Start the sequencer batch-sealing loop.
   * Batches are sealed on maxBatchSize OR maxBatchDelayMs timeout.
   */
  start(onBatch?: (batch: OrderedBatch) => void): void {
    this.running = true
    this._timer = setInterval(() => {
      if (this.queue.size() > 0) {
        const batch = this.sealBatch()
        onBatch?.(batch)
      }
    }, this.config.maxBatchDelayMs)
  }

  /** Stop the sequencer and clear the batch timer. */
  stop(): void {
    this.running = false
    if (this._timer !== null) {
      clearInterval(this._timer)
      this._timer = null
    }
  }

  /**
   * Seal the current queue into an OrderedBatch.
   * Drains up to maxBatchSize transactions.
   */
  sealBatch(): OrderedBatch {
    const txs = this.queue.dequeue(this.config.maxBatchSize)
    if (txs.length === 0) throw new Error("Cannot seal empty batch")

    const batch: OrderedBatch = {
      batchNumber: ++this.batchNumber,
      transactions: txs,
      txRoot: this._computeTxRoot(txs),
      sealedAt: Date.now(),
    }
    return batch
  }

  isRunning(): boolean { return this.running }
  queueDepth(): number { return this.queue.size() }

  /** Phase 1: simple hash placeholder. Phase 2: Merkle root. */
  private _computeTxRoot(txs: L2Transaction[]): string {
    return `txroot-batch-${this.batchNumber}-len-${txs.length}`
  }
}
