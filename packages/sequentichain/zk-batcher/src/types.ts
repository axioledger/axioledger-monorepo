/**
 * @file types.ts
 * Core types for the ZK Batcher.
 */

/** A single L2 state transition (input to the ZK circuit) */
export interface StateTransition {
  /** Account or contract whose state changed */
  account: string
  /** Previous state root (Merkle commitment) */
  prevStateRoot: string
  /** New state root after applying this transition */
  nextStateRoot: string
  /** Transaction hash that caused this transition */
  txHash: string
}

/** A batch commitment submitted to L1 */
export interface BatchCommitment {
  /** L2 batch number */
  batchNumber: number
  /** Merkle root of all state transitions in this batch */
  stateRoot: string
  /** Number of state transitions included */
  transitionCount: number
  /** ZK-SNARK proof bytes (base64), null until proven */
  snarkProof: string | null
  /** Timestamp (ms) when this commitment was created */
  createdAt: number
}

/** Configuration for the ZK Batcher */
export interface ZKBatcherConfig {
  /** Maximum number of state transitions per batch */
  maxTransitions: number
  /** Maximum time (ms) to accumulate before forcing a commit */
  maxCommitDelayMs: number
}
