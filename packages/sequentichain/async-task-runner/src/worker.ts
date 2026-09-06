/**
 * async-task-runner — Worker Pool
 *
 * Quản lý concurrent workers lấy tasks từ PriorityQueue.
 * Graceful shutdown: đợi tasks đang chạy hoàn tất trước khi dừng.
 */

import { PriorityQueue }       from "./queue.js"
import { withRetry }           from "./retry.js"
import { TaskRunnerError }     from "./types.js"
import type { Task, TaskResult, WorkerOptions } from "./types.js"

export class WorkerPool {
  private readonly queue:       PriorityQueue
  private readonly concurrency: number
  private readonly defaultTimeoutMs:   number
  private readonly defaultMaxRetries: number

  private running:   number   = 0
  private stopped:   boolean  = false
  private resolveIdle?: () => void

  constructor(queue: PriorityQueue, opts: WorkerOptions = {}) {
    this.queue              = queue
    this.concurrency        = opts.concurrency       ?? 4
    this.defaultTimeoutMs  = opts.defaultTimeoutMs  ?? 0
    this.defaultMaxRetries = opts.defaultMaxRetries ?? 3
  }

  /**
   * Kiểm tra worker pool có đang idle (không có task nào chạy).
   */
  isIdle(): boolean {
    return this.running === 0 && this.queue.isEmpty()
  }

  /**
   * Đợi cho đến khi tất cả tasks hoàn tất và queue rỗng.
   */
  async waitIdle(): Promise<void> {
    if (this.isIdle()) return
    return new Promise<void>((resolve) => {
      this.resolveIdle = resolve
    })
  }

  /**
   * Dừng nhận task mới. Tasks đang chạy sẽ hoàn tất bình thường.
   */
  stop(): void {
    this.stopped = true
  }

  /**
   * Kích hoạt vòng lặp xử lý — gọi sau khi enqueue task mới.
   */
  tick(): void {
    while (!this.stopped && this.running < this.concurrency && !this.queue.isEmpty()) {
      const item = this.queue.dequeue()
      this._runTask(item.task)
    }
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  private _runTask<T>(task: Task<T>): void {
    this.running++

    const maxRetries = task.maxRetries  ?? this.defaultMaxRetries
    const timeoutMs  = task.timeoutMs  ?? this.defaultTimeoutMs

    withRetry(task.execute, { maxRetries, timeoutMs, taskId: task.id, baseDelayMs: 100 })
      .then(({ value, attempts }): TaskResult<T> => ({
        taskId:     task.id,
        status:     "completed",
        value,
        attempts,
        durationMs: 0,
      }))
      .catch((err): TaskResult<T> => ({
        taskId:     task.id,
        status:     "failed",
        error:      err instanceof Error ? err : new Error(String(err)),
        attempts:   maxRetries + 1,
        durationMs: 0,
      }))
      .finally(() => {
        this.running--
        this.tick()  // lấy task tiếp theo
        if (this.isIdle()) this.resolveIdle?.()
      })
  }
}
