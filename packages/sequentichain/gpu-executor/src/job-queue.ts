/**
 * @file job-queue.ts
 * ProofJobQueue — priority queue for ZK proof generation jobs.
 */
import type { ProofJob } from "./types.js"

export class ProofJobQueue {
  private readonly queue: ProofJob[] = []

  /** Enqueue a job. Higher priority (larger number) is served first. */
  enqueue(job: ProofJob): void {
    // Binary insert descending by priority
    let lo = 0, hi = this.queue.length
    while (lo < hi) {
      const mid = (lo + hi) >>> 1
      if ((this.queue[mid]?.priority ?? 0) >= job.priority) lo = mid + 1
      else hi = mid
    }
    this.queue.splice(lo, 0, job)
  }

  /** Dequeue the highest-priority job. Returns undefined if empty. */
  dequeue(): ProofJob | undefined {
    return this.queue.shift()
  }

  size(): number { return this.queue.length }
  peek(): ProofJob | undefined { return this.queue[0] }
}
