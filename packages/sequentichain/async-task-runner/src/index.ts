/**
 * async-task-runner — TaskRunner
 *
 * Facade kết hợp PriorityQueue + WorkerPool thành public API đơn giản.
 */

import { PriorityQueue } from "./queue.js"
import { WorkerPool }    from "./worker.js"
import { TaskRunnerError } from "./types.js"
import type { Task, TaskResult, WorkerOptions } from "./types.js"

export class TaskRunner {
  private readonly queue:  PriorityQueue
  private readonly pool:   WorkerPool
  private _stopped = false

  constructor(opts: WorkerOptions = {}) {
    this.queue = new PriorityQueue()
    this.pool  = new WorkerPool(this.queue, opts)
  }

  /**
   * Thêm task vào queue và kích hoạt worker.
   * @throws TaskRunnerError nếu runner đã stopped
   */
  enqueue<T>(task: Task<T>): void {
    if (this._stopped) {
      throw new TaskRunnerError(
        "TaskRunner đã dừng — không thể nhận task mới",
        "RUNNER_STOPPED",
        task.id
      )
    }
    this.queue.enqueue({ task, addedAt: Date.now() })
    this.pool.tick()
  }

  /**
   * Chạy một task và trả về kết quả ngay lập tức (Promise).
   * Tiện lợi cho các task cần biết kết quả.
   */
  run<T>(task: Omit<Task<T>, "id"> & { id?: string }): Promise<TaskResult<T>> {
    const id = task.id ?? `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    return new Promise<TaskResult<T>>((resolve) => {
      const wrappedTask: Task<T> = {
        ...task,
        id,
        execute: () => task.execute(),
      }
      this.enqueue({
        ...wrappedTask,
        execute: async () => {
          const result = await task.execute()
          resolve({ taskId: id, status: "completed", value: result, attempts: 1, durationMs: 0 })
          return result
        },
      })
    })
  }

  /** Số tasks đang trong queue */
  get pendingCount(): number {
    return this.queue.size
  }

  /** Dừng nhận task mới */
  stop(): void {
    this._stopped = true
    this.pool.stop()
  }

  /** Đợi tất cả tasks hoàn tất */
  waitIdle(): Promise<void> {
    return this.pool.waitIdle()
  }

  isStopped(): boolean {
    return this._stopped
  }
}
