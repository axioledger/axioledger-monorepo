/**
 * async-task-runner — Exponential Backoff Retry
 *
 * Thực thi một async function với retry tự động khi gặp lỗi.
 * Sử dụng exponential backoff với jitter để tránh thundering herd.
 *
 * Formula: delay = base * 2^attempt + jitter(0..base)
 */

import { TaskRunnerError } from "./types.js"

export interface RetryOptions {
  /** Số lần retry tối đa (không tính lần chạy đầu) */
  maxRetries: number
  /** Base delay ms. Mặc định: 100 */
  baseDelayMs?: number
  /** Max delay ms để tránh delay quá lớn. Mặc định: 10_000 */
  maxDelayMs?: number
  /** Timeout ms cho mỗi lần thực thi. 0 = không giới hạn */
  timeoutMs?: number
  /** taskId để log/error message rõ ràng */
  taskId?: string
}

/**
 * Tính delay cho lần thử thứ `attempt` (0-indexed retry count).
 * @returns số ms cần đợi
 */
export function calcBackoffDelay(
  attempt: number,
  baseDelayMs = 100,
  maxDelayMs  = 10_000
): number {
  const exponential = baseDelayMs * Math.pow(2, attempt)
  const jitter      = Math.random() * baseDelayMs
  return Math.min(exponential + jitter, maxDelayMs)
}

/**
 * Thực thi `fn` với retry tự động.
 * Throw `TaskRunnerError` nếu vượt quá số lần retry.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions
): Promise<{ value: T; attempts: number }> {
  const {
    maxRetries,
    baseDelayMs = 100,
    maxDelayMs  = 10_000,
    timeoutMs   = 0,
    taskId,
  } = opts

  let lastError: Error = new Error("unknown")
  let attempts = 0

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    attempts = attempt + 1
    try {
      const value = timeoutMs > 0
        ? await withTimeout(fn(), timeoutMs, taskId)
        : await fn()
      return { value, attempts }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))

      if (err instanceof TaskRunnerError && err.code === "TASK_TIMEOUT") {
        throw err  // timeout không retry
      }

      if (attempt < maxRetries) {
        const delay = calcBackoffDelay(attempt, baseDelayMs, maxDelayMs)
        await sleep(delay)
      }
    }
  }

  throw new TaskRunnerError(
    `Task ${taskId ?? "?"} thất bại sau ${attempts} lần thử: ${lastError.message}`,
    "MAX_RETRIES_EXCEEDED",
    taskId
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  taskId?: string
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new TaskRunnerError(`Timeout sau ${ms}ms`, "TASK_TIMEOUT", taskId)),
      ms
    )
  )
  return Promise.race([promise, timeout])
}
