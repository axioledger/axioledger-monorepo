/**
 * @veraciphers/proof-aggregator — Public API
 *
 * Recursive ZK Proof Aggregation — Module 5.4
 * Combines multiple ZK proofs into a single aggregated proof to minimize
 * L1 verification overhead and reduce on-chain compute costs.
 *
 * Supported aggregation schemes:
 *   - Halo2 accumulator-based recursion
 *   - PlonKy2 recursive STARK composition
 *   - Groth16 → SNARK batch verification
 */

export { ProofAggregator }   from "./aggregator.js"
export { AggregationQueue }  from "./queue.js"

export type {
  AggregatedProof,
  AggregationRequest,
  AggregationScheme,
} from "./types.js"
