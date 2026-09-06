/**
 * @file commitment.ts
 * Commitment Builder — constructs BatchCommitment headers from state transitions.
 */
import type { BatchCommitment, StateTransition } from "./types.js"

export class CommitmentBuilder {
  /**
   * Build a BatchCommitment from an ordered list of state transitions.
   * Phase 1: state root is a simple concatenation hash.
   * Phase 2: Merkle Patricia Trie root over all nextStateRoots.
   */
  build(
    batchNumber: number,
    transitions: readonly StateTransition[],
  ): BatchCommitment {
    if (transitions.length === 0) {
      throw new Error("Cannot build commitment from empty transitions")
    }
    const stateRoot = this._mergeRoots(transitions)
    return {
      batchNumber,
      stateRoot,
      transitionCount: transitions.length,
      snarkProof: null,
      createdAt: Date.now(),
    }
  }

  /**
   * Attach a SNARK proof to an existing commitment.
   * Called after @veraciphers/circuit-compiler generates the proof.
   */
  attachProof(commitment: BatchCommitment, snarkProof: string): BatchCommitment {
    return { ...commitment, snarkProof }
  }

  /** Phase 1: XOR-style string merge of last state roots. Phase 2: Merkle. */
  private _mergeRoots(transitions: readonly StateTransition[]): string {
    const last = transitions[transitions.length - 1]
    return `stateroot-${last?.nextStateRoot ?? "empty"}-n${transitions.length}`
  }
}
