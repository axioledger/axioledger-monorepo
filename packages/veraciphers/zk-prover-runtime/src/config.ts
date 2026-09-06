/**
 * @file config.ts
 * Load ProverConfig from environment variables.
 */
import type { ProverConfig } from "./types.js"
import type { CircuitBackend } from "@veraciphers/circuit-compiler"

export function loadProverConfig(): ProverConfig {
  return {
    backend:             (process.env["PROVER_BACKEND"] ?? "halo2") as CircuitBackend,
    targetProofTimeMs:   parseInt(process.env["PROVER_TARGET_MS"]         ?? "100", 10),
    maxConcurrentProofs: parseInt(process.env["MAX_CONCURRENT_PROOFS"]    ?? "8",   10),
    logLevel:            (process.env["LOG_LEVEL"] ?? "info") as ProverConfig["logLevel"],
    port:                parseInt(process.env["PORT"]                      ?? "7050", 10),
  }
}
