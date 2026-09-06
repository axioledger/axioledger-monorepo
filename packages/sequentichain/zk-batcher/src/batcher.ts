/**
 * @file batcher.ts
 * ZKBatcher — accumulates L2 state transitions and seals batch commitments.
 */
import type { BatchCommitment, StateTransition, ZKBatcherConfig } from "./types.js"
import { CommitmentBuilder } from "./commitment.js"

const DEFAULTS: Required<ZKBatcherConfig> = {
  maxTransitions: 10_000,
  maxCommitDelayMs: 30_000,
}

export class ZKBatcher {
  private readonly config: Required<ZKBatcherConfig>
  private readonly builder: CommitmentBuilder
  private readonly pending: StateTransition[] = []
  private batchNumber = 0
  private _timer: ReturnType<typeof setInterval> | null = null

  constructor(config: Partial<ZKBatcherConfig> = {}) {
    this.config  = { ...DEFAULTS, ...config }
    this.builder = new CommitmentBuilder()
  }

  /** Add a state transition to the pending batch. */
  addTransition(transition: StateTransition): void {
    this.pending.push(transition)
    if (this.pending.length >= this.config.maxTransitions) {
      // Auto-seal when batch is full
      void this._autoSeal()
    }
  }

  /** Start the commit timer (auto-seals every maxCommitDelayMs). */
  start(onCommit?: (commitment: BatchCommitment) => void): void {
    this._timer = setInterval(() => {
      if (this.pending.length > 0) {
        const commitment = this.sealBatch()
        onCommit?.(commitment)
      }
    }, this.config.maxCommitDelayMs)
  }

  /** Stop the commit timer. */
  stop(): void {
    if (this._timer !== null) {
      clearInterval(this._timer)
      this._timer = null
    }
  }

  /**
   * Manually seal the current pending transitions into a BatchCommitment.
   * Returns the sealed commitment (snarkProof = null until proven).
   */
  sealBatch(): BatchCommitment {
    if (this.pending.length === 0) {
      throw new Error("No pending transitions to seal")
    }
    const transitions = this.pending.splice(0)
    return this.builder.build(++this.batchNumber, transitions)
  }

  pendingCount(): number { return this.pending.length }
  batchCount():   number { return this.batchNumber }

  private async _autoSeal(): Promise<void> {
    // Delegate to sealBatch synchronously
    this.sealBatch()
  }
}
