import { describe, it, expect } from "vitest"
import { WorkerRegistry }   from "../registry.js"
import { TaskScheduler }    from "../scheduler.js"
import { WorkerPool }       from "../pool.js"
import type { WorkerConfig, WorkerTask } from "../types.js"

const WORKER: WorkerConfig = {
  id:             "worker-alpha",
  endpoint:       "grpc://localhost:6000",
  maxConcurrency: 4,
  capabilities:   ["zk-prove", "zk-verify", "state-root"],
}

function makeTask(id: string, priority: WorkerTask["priority"] = "normal"): WorkerTask {
  return {
    id,
    type:       "zk-prove",
    payload:    { circuit: "transfer-v1" },
    priority,
    deadlineMs: 0,
    retries:    3,
  }
}

describe("WorkerRegistry", () => {
  it("registers and finds available worker", () => {
    const reg = new WorkerRegistry()
    reg.register(WORKER)
    expect(reg.count()).toBe(1)
    const found = reg.findAvailable("zk-prove")
    expect(found?.config.id).toBe("worker-alpha")
  })

  it("findAvailable returns undefined for unsupported task type", () => {
    const reg = new WorkerRegistry()
    reg.register(WORKER)
    expect(reg.findAvailable("simulation")).toBeUndefined()
  })

  it("throws on duplicate registration", () => {
    const reg = new WorkerRegistry()
    reg.register(WORKER)
    expect(() => reg.register(WORKER)).toThrow("already registered")
  })

  it("deregisters a worker", () => {
    const reg = new WorkerRegistry()
    reg.register(WORKER)
    expect(reg.deregister("worker-alpha")).toBe(true)
    expect(reg.count()).toBe(0)
  })
})

describe("TaskScheduler", () => {
  it("dequeues critical before normal", () => {
    const sched = new TaskScheduler()
    sched.enqueue(makeTask("t-normal", "normal"))
    sched.enqueue(makeTask("t-critical", "critical"))
    const first = sched.dequeue()
    expect(first?.id).toBe("t-critical")
    expect(sched.size()).toBe(1)
  })

  it("returns undefined when empty", () => {
    const sched = new TaskScheduler()
    expect(sched.dequeue()).toBeUndefined()
  })
})

describe("WorkerPool", () => {
  it("submits a task and returns a stub result", async () => {
    const pool = new WorkerPool()
    pool.registry.register(WORKER)
    const result = await pool.submit(makeTask("task-001"))
    expect(result.success).toBe(true)
    expect(result.taskId).toBe("task-001")
    expect(result.output["stub"]).toBe(true)
  })
})
