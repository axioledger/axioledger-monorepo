/**
 * @file prover-runtime.ts
 * ProverRuntime — core proof generation engine.
 *
 * Phase 1: stub prover with configurable latency simulation.
 * Phase 2: delegates to a Rust WASM module (halo2/plonky2) via N-API.
 */
import type { ProverConfig, ProverHealth } from "./types.js"
import type { ProofRequest, ProofResponse } from "@veraciphers/circuit-compiler"

export class ProverRuntime {
  private readonly config:    ProverConfig
  private _proofsGenerated  = 0
  private _totalProofTimeMs = 0
  private _concurrentProofs = 0
  private _startedAt        = 0

  constructor(config: ProverConfig) {
    this.config = config
  }

  start(): void {
    this._startedAt = Date.now()
  }

  /**
   * Generate a ZK proof for the given request.
   *
   * Phase 1: returns a stub proof immediately.
   * Phase 2: calls into Rust halo2/plonky2 proving backend via N-API.
   */
  async prove(request: ProofRequest): Promise<ProofResponse> {
    if (this._concurrentProofs >= this.config.maxConcurrentProofs) {
      throw new Error(
        `Prover at capacity: ${this._concurrentProofs}/${this.config.maxConcurrentProofs} proofs in flight`
      )
    }

    this._concurrentProofs++
    const start = Date.now()

    try {
      // Phase 2: await rust_prove(request.circuitId, request.witness)
      const proofTimeMs = Date.now() - start
      this._proofsGenerated++
      this._totalProofTimeMs += proofTimeMs

      return {
        requestId:    request.requestId,
        circuitId:    request.circuitId,
        proof:        `halo2-proof-stub-${request.requestId}`,
        publicSignals: {},
        proofTimeMs,
      }
    } finally {
      this._concurrentProofs--
    }
  }

  health(): ProverHealth {
    return {
      healthy:          this._startedAt > 0,
      backend:          this.config.backend,
      proofsGenerated:  this._proofsGenerated,
      avgProofTimeMs:   this._proofsGenerated > 0
        ? this._totalProofTimeMs / this._proofsGenerated
        : 0,
      concurrentProofs: this._concurrentProofs,
      uptime:           Math.floor((Date.now() - this._startedAt) / 1000),
    }
  }
}
