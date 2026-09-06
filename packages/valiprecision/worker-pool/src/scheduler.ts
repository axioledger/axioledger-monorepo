/**
 * @file scheduler.ts
 * TaskScheduler — priority queue for compute tasks.
 * Routes tasks to available workers via the WorkerRegistry.
 */
import type { WorkerTask, TaskPriority } from "./types.js"

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  critical: 4,
  high:     3,
  normal:   2,
  low:      1,
}

export class TaskScheduler {
  private readonly queues: Map<TaskPriority, WorkerTask[]> = new Map([
    ["critical", []],
    ["high",     []],
    ["normal",   []],
    ["low",      []],
  ])

  /** Enqueue a task. Higher priority tasks will be dequeued first. */
  enqueue(task: WorkerTask): void {
    const q = this.queues.get(task.priority)
    if (!q) throw new Error(`Unknown priority: ${task.priority}`)
    q.push(task)
  }

  /**
   * Dequeue the next highest-priority task.
   * Returns undefined if all queues are empty.
   */
  dequeue(): WorkerTask | undefined {
    for (const priority of ["critical", "high", "normal", "low"] as TaskPriority[]) {
      const q = this.queues.get(priority)!
      if (q.length > 0) return q.shift()
    }
    return undefined
  }

  /** Total number of tasks across all priority queues. */
  size(): number {
    let total = 0
    for (const q of this.queues.values()) total += q.length
    return total
  }

  /** Number of tasks in a specific priority queue. */
  sizeByPriority(priority: TaskPriority): number {
    return this.queues.get(priority)?.length ?? 0
  }
}
