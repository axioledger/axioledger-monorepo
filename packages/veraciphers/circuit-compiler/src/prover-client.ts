/**
 * @file prover-client.ts
 * ProverClient — dispatches proof requests to off-chain GPU/FPGA prover clusters.
 * Module 5.2 — Off-Chain Prover GPU/FPGA Clusters.
 */
import type { ProofRequest, ProofResponse } from "./types.js"

export interface ProverClientConfig {
  /** gRPC or HTTP endpoint of the prover cluster */
  endpoint: string
  /** Request timeout in milliseconds */
  timeoutMs?: number
}

export class ProverClient {
  private readonly config: Required<ProverClientConfig>

  constructor(config: ProverClientConfig) {
    this.config = {
      endpoint: config.endpoint,
      timeoutMs: config.timeoutMs ?? 60_000,
    }
  }

  /**
   * Submit a proof request to the prover cluster.
   * Returns a ProofResponse when the proof is ready.
   *
   * Phase 1: returns a stub proof immediately.
   * Phase 2: wire to gRPC prover endpoint (Rust/C++ backend).
   */
  async prove(request: ProofRequest): Promise<ProofResponse> {
    // Phase 2: POST/gRPC to this.config.endpoint
    return {
      requestId: request.requestId,
      circuitId: request.circuitId,
      proof: `stub-proof-${request.requestId}`,
      publicSignals: {},
      proofTimeMs: 0,
    }
  }

  getEndpoint(): string {
    return this.config.endpoint
  }
}
