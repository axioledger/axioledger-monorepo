/**
 * @file types.ts
 * Core types for the ZK Circuit Compiler.
 */

/** Unique circuit identifier */
export type CircuitId = string

/** Supported ZK proof system backends */
export type CircuitBackend = "halo2" | "plonky2" | "groth16"

/** A compiled ZK circuit descriptor */
export interface Circuit {
  id: CircuitId
  /** Human-readable name (e.g. "transfer", "zk-did-verify") */
  name: string
  /** ZK proof system backend */
  backend: CircuitBackend
  /** Constraint count (number of gates in the arithmetic circuit) */
  constraintCount: number
  /** Maximum witness size in bytes */
  maxWitnessBytes: number
  /** Compiled circuit bytes as base64 (e.g. .r1cs or Halo2 pk bytes) */
  compiledBytes: string
}

/** Private witness inputs for proof generation */
export interface Witness {
  circuitId: CircuitId
  /** Private input values keyed by signal name */
  inputs: Record<string, string | number | bigint | boolean>
  /** Computed intermediate values (optional, for debugging) */
  intermediates?: Record<string, string>
}

/** A proof generation request sent to the prover cluster */
export interface ProofRequest {
  /** Unique request ID */
  requestId: string
  circuitId: CircuitId
  witness: Witness
  /** Requested deadline in Unix ms */
  deadlineMs: number
}

/** A proof generation response from the prover cluster */
export interface ProofResponse {
  requestId: string
  circuitId: CircuitId
  /** ZK proof bytes as base64 */
  proof: string
  /** Public inputs/outputs exposed by the circuit */
  publicSignals: Record<string, string>
  /** Proof generation time in milliseconds */
  proofTimeMs: number
}
