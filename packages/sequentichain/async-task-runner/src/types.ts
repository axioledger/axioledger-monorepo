/**
 * async-task-runner — Types
 *
 * Typed interfaces cho Task, TaskResult, TaskStatus.
 */

// ─── TaskStatus ───────────────────────────────────────────────────────────────

export type TaskStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "retrying"
  | "cancelled"

// ─── Task ─────────────────────────────────────────────────────────────────────

export interface Task<T = unknown> {
  /** Unique identifier */
  id: string
  /** Priority — số cao hơn được xử lý trước */
  priority: number
  /** Hàm thực thi task, trả về Promise<T> */
  execute: () => Promise<T>
  /** Số lần retry tối đa. Mặc định: 3 */
  maxRetries?: number
  /** Timeout ms cho mỗi lần thực thi. 0 = không giới hạn */
  timeoutMs?: number
  /** Metadata tuỳ chọn */
  metadata?: Record<string, unknown>
}

// ─── TaskResult ───────────────────────────────────────────────────────────────

export interface TaskResult<T = unknown> {
  taskId: string
  status: "completed" | "failed"
  value?: T
  error?: Error
  attempts: number
  durationMs: number
}

// ─── QueueItem (nội bộ) ───────────────────────────────────────────────────────

export interface QueueItem<T = unknown> {
  task: Task<T>
  addedAt: number
}

// ─── WorkerOptions ────────────────────────────────────────────────────────────

export interface WorkerOptions {
  /** Số worker chạy đồng thời. Mặc định: 4 */
  concurrency?: number
  /** Timeout global cho mỗi task ms. 0 = không giới hạn */
  defaultTimeoutMs?: number
  /** Số retry mặc định nếu task không khai báo maxRetries */
  defaultMaxRetries?: number
}

// ─── Custom Error ─────────────────────────────────────────────────────────────

export type TaskRunnerErrorCode =
  | "TASK_TIMEOUT"
  | "MAX_RETRIES_EXCEEDED"
  | "QUEUE_FULL"
  | "RUNNER_STOPPED"
  | "TASK_CANCELLED"

export class TaskRunnerError extends Error {
  constructor(
    message: string,
    public readonly code: TaskRunnerErrorCode,
    public readonly taskId?: string
  ) {
    super(message)
    this.name = "TaskRunnerError"
  }
}
