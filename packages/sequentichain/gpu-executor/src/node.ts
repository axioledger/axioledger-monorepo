/**
 * @file node.ts
 * GpuNode — represents a single GPU compute device.
 */
import type { GpuNodeSpec, ProofJob, ProofJobResult } from "./types.js"

export class GpuNode {
  readonly spec:     GpuNodeSpec
  private _busy    = false
  private _jobsDone = 0
  private _totalMs  = 0

  constructor(spec: GpuNodeSpec) {
    this.spec = spec
  }

  get isBusy(): boolean { return this._busy }
  get jobsDone(): number { return this._jobsDone }
  get avgProofTimeMs(): number {
    return this._jobsDone > 0 ? this._totalMs / this._jobsDone : 0
  }

  /**
   * Execute a ZK proof job on this node.
   *
   * Phase 1: returns a stub proof immediately.
   * Phase 2: forward to CUDA/OpenCL kernel via native addon or gRPC.
   */
  async execute(job: ProofJob): Promise<ProofJobResult> {
    if (this._busy) {
      throw new Error(`Node ${this.spec.id} is busy`)
    }
    this._busy = true
    const start = Date.now()
    try {
      // Phase 2: dispatch to this.spec.endpoint via gRPC
      const proofTimeMs = Date.now() - start
      this._jobsDone++
      this._totalMs += proofTimeMs
      return {
        jobId:       job.id,
        circuitId:   job.circuitId,
        nodeId:      this.spec.id,
        proof:       `stub-gpu-proof-${this.spec.backend}-${job.id}`,
        proofTimeMs,
        success:     true,
      }
    } finally {
      this._busy = false
    }
  }
}
