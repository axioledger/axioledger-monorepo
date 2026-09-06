/**
 * @file types.ts
 * Runtime types for the ZK Prover service.
 */
import type { CircuitBackend } from "@veraciphers/circuit-compiler"

export interface ProverConfig {
  /** ZK proof system backend to use */
  backend:              CircuitBackend
  /** Target proof time in milliseconds */
  targetProofTimeMs:    number
  /** Maximum concurrent proofs in flight */
  maxConcurrentProofs:  number
  logLevel:             "debug" | "info" | "warn" | "error"
  port:                 number
}

export interface ProverHealth {
  healthy:            boolean
  backend:            CircuitBackend
  proofsGenerated:    number
  avgProofTimeMs:     number
  concurrentProofs:   number
  uptime:             number  // seconds
}
