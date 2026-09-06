/**
 * @file types.ts
 * Core types for the Proof Aggregator.
 */
import type { CircuitId } from "@veraciphers/circuit-compiler"

/** Supported proof aggregation schemes */
export type AggregationScheme = "halo2-accumulator" | "plonky2-recursion" | "groth16-batch"

/** A request to aggregate a set of proofs */
export interface AggregationRequest {
  /** Unique request ID */
  id: string
  /** Aggregation scheme to use */
  scheme: AggregationScheme
  /** Ordered list of (circuitId, proof) pairs to aggregate */
  proofs: ReadonlyArray<{ circuitId: CircuitId; proof: string }>
}

/** A single aggregated proof that verifies N input proofs */
export interface AggregatedProof {
  /** Request ID this aggregation corresponds to */
  requestId: string
  /** Aggregation scheme used */
  scheme: AggregationScheme
  /** Number of input proofs folded into this aggregate */
  inputProofCount: number
  /** The aggregated proof bytes (base64) */
  aggregatedProof: string
  /** Public signals from all aggregated proofs (merged) */
  publicSignals: Record<string, string>
  /** Aggregation time in milliseconds */
  aggregationTimeMs: number
}
