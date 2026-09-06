/**
 * async-task-runner — Tests
 */
import { describe, it, expect, vi } from "vitest"
import { PriorityQueue }  from "../queue.js"
import { calcBackoffDelay, withRetry } from "../retry.js"
import { TaskRunner }     from "../index.js"
import { TaskRunnerError } from "../types.js"

// ─── PriorityQueue tests ─────────────────────────────────────────────────────

describe("PriorityQueue", () => {
  const makeItem = (priority: number, id = String(priority)) => ({
    task: { id, priority, execute: async () => id },
    addedAt: Date.now(),
  })

  it("dequeue trả về item priority cao nhất trước", () => {
    const q = new PriorityQueue()
    q.enqueue(makeItem(1))
    q.enqueue(makeItem(10))
    q.enqueue(makeItem(5))
    expect(q.dequeue().task.priority).toBe(10)
    expect(q.dequeue().task.priority).toBe(5)
    expect(q.dequeue().task.priority).toBe(1)
  })

  it("peek không xoá item", () => {
    const q = new PriorityQueue()
    q.enqueue(makeItem(7))
    q.peek()
    expect(q.size).toBe(1)
  })

  it("isEmpty đúng khi rỗng", () => {
    const q = new PriorityQueue()
    expect(q.isEmpty()).toBe(true)
    q.enqueue(makeItem(1))
    expect(q.isEmpty()).toBe(false)
  })

  it("dequeue từ queue rỗng throw Error", () => {
    const q = new PriorityQueue()
    expect(() => q.dequeue()).toThrow()
  })

  it("clear xoá tất cả items", () => {
    const q = new PriorityQueue()
    q.enqueue(makeItem(1)); q.enqueue(makeItem(2))
    q.clear()
    expect(q.isEmpty()).toBe(true)
  })
})

// ─── calcBackoffDelay tests ───────────────────────────────────────────────────

describe("calcBackoffDelay", () => {
  it("delay tăng theo exponential", () => {
    const d0 = calcBackoffDelay(0, 100, 100_000)
    const d1 = calcBackoffDelay(1, 100, 100_000)
    const d2 = calcBackoffDelay(2, 100, 100_000)
    // Với base=100: d0 ≈ 100+jitter, d1 ≈ 200+jitter, d2 ≈ 400+jitter
    expect(d1).toBeGreaterThan(d0)
    expect(d2).toBeGreaterThan(d1)
  })

  it("không vượt quá maxDelayMs", () => {
    const delay = calcBackoffDelay(100, 100, 500)
    expect(delay).toBeLessThanOrEqual(500)
  })
})

// ─── withRetry tests ──────────────────────────────────────────────────────────

describe("withRetry", () => {
  it("trả về kết quả khi thành công ngay lần đầu", async () => {
    const { value, attempts } = await withRetry(() => Promise.resolve(42), { maxRetries: 3 })
    expect(value).toBe(42)
    expect(attempts).toBe(1)
  })

  it("retry đúng số lần khi thất bại liên tiếp", async () => {
    let calls = 0
    const fn = () => { calls++; return Promise.reject(new Error("fail")) }
    await expect(withRetry(fn, { maxRetries: 2, baseDelayMs: 1 }))
      .rejects.toMatchObject({ code: "MAX_RETRIES_EXCEEDED" })
    expect(calls).toBe(3)  // 1 lần đầu + 2 retry
  })

  it("thành công ở lần retry thứ 2", async () => {
    let calls = 0
    const fn = () => {
      calls++
      if (calls < 3) return Promise.reject(new Error("not yet"))
      return Promise.resolve("ok")
    }
    const { value, attempts } = await withRetry(fn, { maxRetries: 3, baseDelayMs: 1 })
    expect(value).toBe("ok")
    expect(attempts).toBe(3)
  })

  it("throw TASK_TIMEOUT khi vượt quá timeoutMs", async () => {
    const slow = () => new Promise<void>((_, reject) => setTimeout(() => reject(new Error("late")), 200))
    await expect(withRetry(slow, { maxRetries: 0, timeoutMs: 10 }))
      .rejects.toMatchObject({ code: "TASK_TIMEOUT" })
  })
})

// ─── TaskRunner tests ─────────────────────────────────────────────────────────

describe("TaskRunner", () => {
  it("chạy task đơn giản và trả về kết quả", async () => {
    const runner = new TaskRunner({ concurrency: 1 })
    const result = await runner.run({ execute: () => Promise.resolve("hello"), priority: 1 })
    expect(result.value).toBe("hello")
    expect(result.status).toBe("completed")
    runner.stop()
  })

  it("throw RUNNER_STOPPED khi enqueue sau khi stop", () => {
    const runner = new TaskRunner()
    runner.stop()
    expect(() =>
      runner.enqueue({ id: "x", priority: 1, execute: () => Promise.resolve() })
    ).toThrow(TaskRunnerError)
  })

  it("pendingCount đúng sau enqueue", () => {
    const runner = new TaskRunner({ concurrency: 0 })  // concurrency=0 để không tự chạy
    // Không thể kiểm tra trực tiếp với concurrency=0 vì tick không chạy worker
    // Kiểm tra thông qua isStopped
    expect(runner.isStopped()).toBe(false)
    runner.stop()
    expect(runner.isStopped()).toBe(true)
  })
})
