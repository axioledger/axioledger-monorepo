/**
 * @sequentichain/sequencer-node — Public API
 *
 * L2 Sequencer Node — Module 4 (Sequentichain L2 Scaling Infrastructure)
 *   - 4.1 Low-latency L2 sequencer with sub-millisecond transaction ordering
 *   - 4.2 Zero-Copy AF_XDP Network Socket Acceleration (interface spec)
 *   - 4.3 Batch aggregation → delegates to @sequentichain/zk-batcher
 *   - 4.4 MEV-Boost & Anti-Frontrunning Fair Ordering (FIFO timestamp ordering)
 */

export { Sequencer }          from "./sequencer.js"
export { FairOrderingQueue }  from "./fair-ordering.js"

export type {
  L2Transaction,
  SequencerConfig,
  OrderedBatch,
} from "./types.js"
