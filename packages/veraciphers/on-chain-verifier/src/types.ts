/**
 * @file types.ts
 * Core types for the On-Chain Verifier.
 */
import type { CircuitId } from "@veraciphers/circuit-compiler"

/** A verification key used to verify proofs for a specific circuit */
export interface VerificationKey {
  circuitId: CircuitId
  /** Serialized verification key bytes (base64) */
  vkBytes: string
}

/** Parameters passed to the on-chain verifier */
export interface VerifyParams {
  circuitId: CircuitId
  /** ZK proof bytes as base64 */
  proof: string
  /** Public inputs/signals to verify against */
  publicSignals: Record<string, string>
}

/** Result returned by the on-chain verifier */
export interface VerifyResult {
  circuitId: CircuitId
  /** True if the proof is valid under the registered verification key */
  valid: boolean
  /** Error description if invalid */
  error?: string
  /** Gas used for verification (SVM compute units) */
  computeUnits: number
}
