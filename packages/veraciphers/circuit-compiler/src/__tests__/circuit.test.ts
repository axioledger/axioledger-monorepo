import { describe, it, expect } from "vitest"
import { CircuitRegistry } from "../registry.js"
import { WitnessBuilder } from "../witness.js"
import { ProverClient } from "../prover-client.js"
import type { Circuit } from "../types.js"

const CIRCUIT: Circuit = {
  id: "transfer-v1",
  name: "AXQ Transfer",
  backend: "halo2",
  constraintCount: 512,
  maxWitnessBytes: 1024,
  compiledBytes: "base64compiledcircuit==",
}

describe("CircuitRegistry", () => {
  it("registers and retrieves a circuit", () => {
    const registry = new CircuitRegistry()
    registry.register(CIRCUIT)
    expect(registry.get("transfer-v1")).toStrictEqual(CIRCUIT)
    expect(registry.list()).toContain("transfer-v1")
  })

  it("throws on duplicate registration", () => {
    const registry = new CircuitRegistry()
    registry.register(CIRCUIT)
    expect(() => registry.register(CIRCUIT)).toThrow("already registered")
  })

  it("unregisters a circuit", () => {
    const registry = new CircuitRegistry()
    registry.register(CIRCUIT)
    const removed = registry.unregister("transfer-v1")
    expect(removed).toBe(true)
    expect(registry.get("transfer-v1")).toBeUndefined()
  })
})

describe("WitnessBuilder", () => {
  it("builds a witness from circuit and inputs", () => {
    const builder = new WitnessBuilder()
    const witness = builder.build(CIRCUIT, { from: "alice", to: "bob", amount: 1000n })
    expect(witness.circuitId).toBe("transfer-v1")
    expect(witness.inputs["from"]).toBe("alice")
    expect(witness.inputs["amount"]).toBe(1000n)
  })
})

describe("ProverClient", () => {
  it("returns a stub proof in Phase 1", async () => {
    const client = new ProverClient({ endpoint: "grpc://localhost:50051" })
    const response = await client.prove({
      requestId: "req-001",
      circuitId: "transfer-v1",
      witness: { circuitId: "transfer-v1", inputs: {} },
      deadlineMs: Date.now() + 60_000,
    })
    expect(response.requestId).toBe("req-001")
    expect(response.proof).toContain("stub-proof")
  })
})
