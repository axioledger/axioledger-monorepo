/**
 * @sequentichain/zk-batcher — Public API
 *
 * ZK Batch Aggregator — Module 4.3
 * Bundles thousands of L2 state transitions into a single ZK-SNARK proof
 * submitted periodically to L1.
 *
 * Phase 1: batch accumulation and commitment header generation.
 * Phase 2: integration with @veraciphers/circuit-compiler for SNARK generation.
 */

export { ZKBatcher }           from "./batcher.js"
export { CommitmentBuilder }   from "./commitment.js"

export type {
  BatchCommitment,
  ZKBatcherConfig,
  StateTransition,
} from "./types.js"
