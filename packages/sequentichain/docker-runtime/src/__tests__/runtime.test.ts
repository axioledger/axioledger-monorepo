import { describe, it, expect } from "vitest"
import { loadRuntimeConfig }  from "../config.js"
import { ContainerRuntime }   from "../runtime.js"

describe("loadRuntimeConfig", () => {
  it("returns defaults when no env vars set", () => {
    const cfg = loadRuntimeConfig()
    expect(cfg.maxBatchSize).toBe(1000)
    expect(cfg.maxBatchDelayMs).toBe(200)
    expect(cfg.port).toBe(8080)
    expect(cfg.logLevel).toBe("info")
    expect(cfg.sequencerAccount).toBe("sequencer.axq")
  })

  it("reads MAX_BATCH_SIZE from env", () => {
    process.env["MAX_BATCH_SIZE"] = "500"
    const cfg = loadRuntimeConfig()
    expect(cfg.maxBatchSize).toBe(500)
    delete process.env["MAX_BATCH_SIZE"]
  })
})

describe("ContainerRuntime", () => {
  it("starts and reports healthy, then stops", async () => {
    const rt = new ContainerRuntime()
    rt.start()
    // Give the HTTP server a moment to bind
    await new Promise((r) => setTimeout(r, 50))
    const health = rt.getHealth()
    expect(health.healthy).toBe(true)
    expect(health.uptime).toBeGreaterThanOrEqual(0)
    await rt.stop()
  })
})
