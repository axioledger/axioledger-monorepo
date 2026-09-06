/**
 * @file verifier.ts
 * ProofVerifier — on-chain proof verification interface.
 * Module 5.3 — On-Chain Verifier Contracts.
 */
import type { VerificationKey, VerifyParams, VerifyResult } from "./types.js"

export class ProofVerifier {
  private readonly vkeys = new Map<string, VerificationKey>()

  /**
   * Register a verification key for a circuit.
   * @throws {Error} if a VKey for this circuitId is already registered.
   */
  registerVKey(vkey: VerificationKey): void {
    if (this.vkeys.has(vkey.circuitId)) {
      throw new Error(`VerificationKey for circuit "${vkey.circuitId}" already registered`)
    }
    this.vkeys.set(vkey.circuitId, vkey)
  }

  /**
   * Verify a ZK proof against the registered VKey for the circuit.
   *
   * Phase 1: validates proof is non-empty and circuitId has a registered VKey.
   * Phase 2: delegates to WASM/native Halo2 or Groth16 verifier.
   */
  verify(params: VerifyParams): VerifyResult {
    const vkey = this.vkeys.get(params.circuitId)

    if (!vkey) {
      return {
        circuitId: params.circuitId,
        valid: false,
        error: `No verification key registered for circuit "${params.circuitId}"`,
        computeUnits: 0,
      }
    }

    if (!params.proof || params.proof.length === 0) {
      return {
        circuitId: params.circuitId,
        valid: false,
        error: "Proof is empty",
        computeUnits: 100,
      }
    }

    // Phase 2: run actual WASM/native Halo2/Groth16 verification here
    // For Phase 1: accept any non-empty proof with a registered VKey
    return {
      circuitId: params.circuitId,
      valid: true,
      computeUnits: 200_000,  // Approximate SVM CU cost for ZK verification
    }
  }

  /** Check if a VKey is registered for a given circuit. */
  hasVKey(circuitId: string): boolean {
    return this.vkeys.has(circuitId)
  }
}
