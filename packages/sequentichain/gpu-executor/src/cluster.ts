/**
 * @file cluster.ts
 * GpuCluster — fleet manager that routes ProofJobs to available GpuNodes.
 */
import type { GpuNodeSpec, ProofJob, ProofJobResult, ClusterStats } from "./types.js"
import { GpuNode }      from "./node.js"
import { ProofJobQueue } from "./job-queue.js"

export class GpuCluster {
  private readonly nodes    = new Map<string, GpuNode>()
  private readonly queue    = new ProofJobQueue()
  private _totalJobsDone    = 0
  private _totalProofTimeMs = 0

  /** Register a GPU node with the cluster. */
  addNode(spec: GpuNodeSpec): void {
    if (this.nodes.has(spec.id)) {
      throw new Error(`GPU node "${spec.id}" already registered`)
    }
    this.nodes.set(spec.id, new GpuNode(spec))
  }

  /** Remove a GPU node from the cluster. */
  removeNode(nodeId: string): boolean {
    return this.nodes.delete(nodeId)
  }

  /**
   * Submit a proof job to the cluster.
   * Finds the first idle node and executes; falls back to the queue if all busy.
   * Returns the ProofJobResult when the job completes.
   */
  async submit(job: ProofJob): Promise<ProofJobResult> {
    const node = this._findIdleNode()
    if (!node) {
      // All nodes busy — queue and wait (Phase 2: event-driven drain)
      this.queue.enqueue(job)
      throw new Error(
        `All GPU nodes busy. Job ${job.id} queued (queue depth: ${this.queue.size()})`
      )
    }
    const result = await node.execute(job)
    this._totalJobsDone++
    this._totalProofTimeMs += result.proofTimeMs
    return result
  }

  stats(): ClusterStats {
    const nodes     = [...this.nodes.values()]
    const idleNodes = nodes.filter((n) => !n.isBusy).length
    return {
      totalNodes:     nodes.length,
      idleNodes,
      busyNodes:      nodes.length - idleNodes,
      totalJobsDone:  this._totalJobsDone,
      avgProofTimeMs: this._totalJobsDone > 0
        ? this._totalProofTimeMs / this._totalJobsDone
        : 0,
    }
  }

  private _findIdleNode(): GpuNode | undefined {
    for (const node of this.nodes.values()) {
      if (!node.isBusy) return node
    }
    return undefined
  }
}
