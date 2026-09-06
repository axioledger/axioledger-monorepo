import { describe, it, expect } from "vitest"
import { GpuCluster }    from "../cluster.js"
import { GpuNode }       from "../node.js"
import { ProofJobQueue } from "../job-queue.js"
import type { GpuNodeSpec, ProofJob } from "../types.js"

const SPEC: GpuNodeSpec = {
  id:             "gpu-01",
  backend:        "cuda",
  vramMb:         24_000,
  computeUnits:   10_496,
  endpoint:       "grpc://localhost:7001",
  maxConcurrency: 8,
}

function makeJob(id: string, priority = 128): ProofJob {
  return { id, circuitId: "transfer-v1", witnessPayload: "e30=", priority, submittedAt: Date.now() }
}

describe("GpuNode", () => {
  it("executes a job and returns stub proof", async () => {
    const node = new GpuNode(SPEC)
    const result = await node.execute(makeJob("job-1"))
    expect(result.success).toBe(true)
    expect(result.nodeId).toBe("gpu-01")
    expect(result.proof).toContain("stub-gpu-proof")
    expect(node.jobsDone).toBe(1)
  })

  it("throws when called while busy", async () => {
    const node = new GpuNode(SPEC)
    // Simulate concurrent call
    const p1 = node.execute(makeJob("j1"))
    // Second concurrent call should throw
    await expect(node.execute(makeJob("j2"))).rejects.toThrow("busy")
    await p1 // drain
  })
})

describe("ProofJobQueue", () => {
  it("dequeues higher-priority jobs first", () => {
    const q = new ProofJobQueue()
    q.enqueue(makeJob("low",  10))
    q.enqueue(makeJob("high", 200))
    q.enqueue(makeJob("mid",  100))
    expect(q.dequeue()?.id).toBe("high")
    expect(q.dequeue()?.id).toBe("mid")
    expect(q.dequeue()?.id).toBe("low")
  })
})

describe("GpuCluster", () => {
  it("submits a job and returns result", async () => {
    const cluster = new GpuCluster()
    cluster.addNode(SPEC)
    const result = await cluster.submit(makeJob("cluster-job-1"))
    expect(result.success).toBe(true)
    const stats = cluster.stats()
    expect(stats.totalJobsDone).toBe(1)
    expect(stats.totalNodes).toBe(1)
  })

  it("throws when no nodes registered", async () => {
    const cluster = new GpuCluster()
    await expect(cluster.submit(makeJob("no-node"))).rejects.toThrow("busy")
  })

  it("throws on duplicate node registration", () => {
    const cluster = new GpuCluster()
    cluster.addNode(SPEC)
    expect(() => cluster.addNode(SPEC)).toThrow("already registered")
  })
})
