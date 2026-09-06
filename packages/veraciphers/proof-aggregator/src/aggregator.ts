/**
 * @file aggregator.ts
 * ProofAggregator — folds multiple ZK proofs into one aggregated proof.
 * Module 5.4 — Recursion & Proof Aggregation Pipeline.
 */
import type { AggregationRequest, AggregatedProof } from "./types.js"

export class ProofAggregator {
  /**
   * Aggregate the proofs in the request into a single proof.
   *
   * Phase 1: returns a stub aggregated proof immediately.
   * Phase 2: delegates to Rust/C++ backend via gRPC:
   *   - halo2-accumulator: Halo2 accumulator recursion
   *   - plonky2-recursion: PlonKy2 recursive STARK composition
   *   - groth16-batch: Groth16 pairing-based batch verification
   */
  async aggregate(request: AggregationRequest): Promise<AggregatedProof> {
    if (request.proofs.length === 0) {
      throw new Error(`Aggregation request ${request.id} has no proofs to aggregate`)
    }

    const start = Date.now()

    // Phase 2: call prover backend based on request.scheme
    // Phase 1: concatenate proof bytes as a stub
    const aggregatedProof = `agg-${request.scheme}-${request.proofs.map((p) => p.proof).join("|")}`

    return {
      requestId: request.id,
      scheme: request.scheme,
      inputProofCount: request.proofs.length,
      aggregatedProof,
      publicSignals: {},
      aggregationTimeMs: Date.now() - start,
    }
  }
}
