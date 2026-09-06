/**
 * @file queue.ts
 * AggregationQueue — accumulates proof requests and batches them
 * for efficient recursive aggregation.
 */
import type { AggregationRequest } from "./types.js"
import { ProofAggregator } from "./aggregator.js"

export interface AggregationQueueConfig {
  /** Maximum number of proofs to accumulate before triggering aggregation */
  maxBatchSize: number
  /** Maximum delay (ms) before forcing aggregation of accumulated proofs */
  maxDelayMs: number
}

export class AggregationQueue {
  private readonly config: Required<AggregationQueueConfig>
  private readonly aggregator: ProofAggregator
  private readonly pending: Array<{ circuitId: string; proof: string }> = []
  private _reqSeq = 0

  constructor(config: AggregationQueueConfig) {
    this.config     = config
    this.aggregator = new ProofAggregator()
  }

  /** Add a proof to the aggregation queue. */
  enqueue(circuitId: string, proof: string): void {
    this.pending.push({ circuitId, proof })
  }

  /** Returns the number of proofs currently queued. */
  size(): number { return this.pending.length }

  /**
   * Flush the queue and aggregate all pending proofs.
   * Returns the aggregated proof or undefined if queue is empty.
   */
  async flush(): Promise<import("./types.js").AggregatedProof | undefined> {
    if (this.pending.length === 0) return undefined
    const proofs = this.pending.splice(0)
    const request: AggregationRequest = {
      id: `agg-req-${String(++this._reqSeq)}`,
      scheme: "halo2-accumulator",
      proofs,
    }
    return this.aggregator.aggregate(request)
  }
}
