import { describe, it, expect } from "vitest"
import { loadProverConfig }  from "../config.js"
import { ProverRuntime }     from "../prover-runtime.js"

describe("loadProverConfig", () => {
  it("returns defaults", () => {
    const cfg = loadProverConfig()
    expect(cfg.backend).toBe("halo2")
    expect(cfg.targetProofTimeMs).toBe(100)
    expect(cfg.maxConcurrentProofs).toBe(8)
    expect(cfg.port).toBe(7050)
  })

  it("reads PROVER_BACKEND from env", () => {
    process.env["PROVER_BACKEND"] = "plonky2"
    expect(loadProverConfig().backend).toBe("plonky2")
    delete process.env["PROVER_BACKEND"]
  })
})

describe("ProverRuntime", () => {
  it("generates a stub proof after start()", async () => {
    const rt = new ProverRuntime(loadProverConfig())
    rt.start()

    const response = await rt.prove({
      requestId:  "req-abc",
      circuitId:  "transfer-v1",
      witness:    { circuitId: "transfer-v1", inputs: {} },
      deadlineMs: Date.now() + 5000,
    })

    expect(response.requestId).toBe("req-abc")
    expect(response.proof).toContain("halo2-proof-stub")
    expect(rt.health().proofsGenerated).toBe(1)
  })

  it("enforces maxConcurrentProofs cap", async () => {
    const rt = new ProverRuntime({ ...loadProverConfig(), maxConcurrentProofs: 0 })
    rt.start()
    await expect(
      rt.prove({ requestId: "r1", circuitId: "c1", witness: { circuitId: "c1", inputs: {} }, deadlineMs: 0 })
    ).rejects.toThrow("capacity")
  })
})
