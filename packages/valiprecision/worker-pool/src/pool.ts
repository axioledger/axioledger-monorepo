/**
 * @file pool.ts
 * WorkerPool — orchestrates task dispatch across registered compute workers.
 *
 * Phase 1: local in-process stub execution.
 * Phase 2: gRPC dispatch to Golem provider nodes.
 */
import type { WorkerTask, TaskResult } from "./types.js"
import { WorkerRegistry }             from "./registry.js"
import { TaskScheduler }              from "./scheduler.js"

export class WorkerPool {
  readonly registry  = new WorkerRegistry()
  readonly scheduler = new TaskScheduler()

  /**
   * Submit a task to the pool.
   * Enqueues the task and immediately attempts dispatch to an available worker.
   * Returns the TaskResult (Phase 1: stub execution; Phase 2: async gRPC call).
   */
  async submit(task: WorkerTask): Promise<TaskResult> {
    this.scheduler.enqueue(task)
    return this._dispatch()
  }

  /**
   * Drain the scheduler queue and execute one pending task.
   * Phase 1: stubs instant completion; Phase 2: dispatches via gRPC.
   */
  private async _dispatch(): Promise<TaskResult> {
    const task = this.scheduler.dequeue()
    if (!task) throw new Error("No tasks in scheduler queue")

    const worker = this.registry.findAvailable(task.type)

    // Phase 1: execute inline regardless of worker availability
    const start = Date.now()
    const workerId = worker?.config.id ?? "local-stub"

    // Phase 2: forward to worker.config.endpoint via gRPC + await real result
    return {
      taskId:     task.id,
      workerId,
      success:    true,
      output:     { stub: true, taskType: task.type },
      durationMs: Date.now() - start,
    }
  }

  /** Number of tasks currently waiting in the scheduler queue. */
  pendingCount(): number {
    return this.scheduler.size()
  }
}
