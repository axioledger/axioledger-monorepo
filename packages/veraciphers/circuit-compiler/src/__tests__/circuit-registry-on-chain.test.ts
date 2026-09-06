/**
 * @veraciphers/circuit-compiler — OnChainCircuitRegistry Test Suite
 */
import { describe, it, expect, beforeEach } from "vitest"
import { OnChainCircuitRegistry } from "../circuit-registry-on-chain.js"
import type { Circuit } from "../types.js"

function makeCircuit(id: string, overrides: Partial<Circuit> = {}): Circuit {
  return {
    id,
    name: `Circuit ${id}`,
    backend: "halo2",
    constraintCount: 1000,
    maxWitnessBytes: 4096,
    compiledBytes: Buffer.from(`compiled-${id}`).toString("base64"),
    ...overrides,
  }
}

describe("OnChainCircuitRegistry — CR-1 Versioning", () => {
  it("registers a circuit with initial version and commitHash", () => {
    const reg = new OnChainCircuitRegistry()
    const cv = reg.register(makeCircuit("transfer-v1"), "1.0.0", "alice")
    expect(cv.version).toBe("1.0.0")
    expect(cv.publishedBy).toBe("alice")
    expect(cv.commitHash).toMatch(/^[0-9a-f]{64}$/)
  })

  it("throws on duplicate registration", () => {
    const reg = new OnChainCircuitRegistry()
    reg.register(makeCircuit("c1"))
    expect(() => reg.register(makeCircuit("c1"))).toThrow()
  })

  it("upgrade() adds new version to history", () => {
    const reg = new OnChainCircuitRegistry()
    reg.register(makeCircuit("c2"), "1.0.0", "alice")
    const v2 = reg.upgrade(
      makeCircuit("c2", { compiledBytes: Buffer.from("new-bytes").toString("base64") }),
      "2.0.0",
      "bob",
    )
    expect(v2.version).toBe("2.0.0")
    const history = reg.getVersionHistory("c2")
    expect(history).toHaveLength(2)
    expect(history[0]?.version).toBe("1.0.0")
    expect(history[1]?.version).toBe("2.0.0")
  })

  it("getCurrentVersion returns latest", () => {
    const reg = new OnChainCircuitRegistry()
    reg.register(makeCircuit("c3"), "1.0.0", "x")
    reg.upgrade(makeCircuit("c3", { compiledBytes: "new==" }), "1.1.0", "y")
    expect(reg.getCurrentVersion("c3")?.version).toBe("1.1.0")
  })

  it("getByVersion retrieves specific version snapshot", () => {
    const reg = new OnChainCircuitRegistry()
    reg.register(makeCircuit("c4"), "1.0.0", "a")
    reg.upgrade(makeCircuit("c4", { compiledBytes: "updated==" }), "1.1.0", "b")
    const v1 = reg.getByVersion("c4", "1.0.0")
    expect(v1?.publishedBy).toBe("a")
  })
})

describe("OnChainCircuitRegistry — CR-2 Audit Trail", () => {
  it("submits and retrieves audit records", () => {
    const reg = new OnChainCircuitRegistry()
    reg.register(makeCircuit("c5"), "1.0.0")
    reg.submitAudit({
      circuitId: "c5",
      version: "1.0.0",
      status: "approved",
      auditor: "SecureAudit LLC",
      auditorSignature: "sig==",
      notes: "No issues found",
    })
    expect(reg.getLatestAudit("c5")?.status).toBe("approved")
    expect(reg.isApproved("c5")).toBe(true)
  })

  it("isApproved returns false when unaudited", () => {
    const reg = new OnChainCircuitRegistry()
    reg.register(makeCircuit("c6"), "1.0.0")
    expect(reg.isApproved("c6")).toBe(false)
  })

  it("isApproved is version-specific — new version resets approval", () => {
    const reg = new OnChainCircuitRegistry()
    reg.register(makeCircuit("c7"), "1.0.0")
    reg.submitAudit({ circuitId: "c7", version: "1.0.0", status: "approved", auditor: "A", auditorSignature: "s", notes: "" })
    reg.upgrade(makeCircuit("c7", { compiledBytes: "v2==" }), "2.0.0", "dev")
    // v2.0.0 is not audited
    expect(reg.isApproved("c7")).toBe(false)
  })
})

describe("OnChainCircuitRegistry — CR-3 Reward Pool", () => {
  it("deposits and claims rewards", () => {
    const reg = new OnChainCircuitRegistry()
    reg.register(makeCircuit("c8"), "1.0.0")
    reg.depositReward("c8", 1_000_000n, 100n)  // 1 VRQ pool, 0.0001 VRQ/proof
    const claimed = reg.claimProofReward("c8", "prover-1")
    expect(claimed).toBe(100n)
    const pool = reg.getRewardPool("c8")!
    expect(pool.proofsGenerated).toBe(1)
    expect(pool.totalDistributed).toBe(100n)
  })

  it("returns 0 when pool exhausted", () => {
    const reg = new OnChainCircuitRegistry()
    reg.register(makeCircuit("c9"), "1.0.0")
    reg.depositReward("c9", 50n, 100n)  // pool too small for reward
    expect(reg.claimProofReward("c9", "p")).toBe(0n)
  })
})

describe("OnChainCircuitRegistry — CR-4 Prover Assignment", () => {
  it("assigns and retrieves prover assignment", () => {
    const reg = new OnChainCircuitRegistry()
    reg.register(makeCircuit("c10"), "1.0.0")
    const assignment = reg.assignProvers("c10", ["prov-1", "prov-2"], "gpu-datacenter")
    expect(assignment.providerIds).toContain("prov-1")
    expect(reg.getProverAssignment("c10")?.preferredTier).toBe("gpu-datacenter")
  })
})

describe("OnChainCircuitRegistry — CR-5 Merkle Commitment", () => {
  it("computeCommitment returns a 64-char hex root", () => {
    const reg = new OnChainCircuitRegistry()
    reg.register(makeCircuit("ca"), "1.0.0")
    reg.register(makeCircuit("cb"), "1.0.0")
    const commitment = reg.computeCommitment()
    expect(commitment.merkleRoot).toMatch(/^[0-9a-f]{64}$/)
    expect(commitment.circuitCount).toBe(2)
  })

  it("commitment changes after upgrade", () => {
    const reg = new OnChainCircuitRegistry()
    reg.register(makeCircuit("cc"), "1.0.0")
    const c1 = reg.computeCommitment().merkleRoot
    reg.upgrade(makeCircuit("cc", { compiledBytes: "new==" }), "2.0.0", "dev")
    const c2 = reg.computeCommitment().merkleRoot
    expect(c1).not.toBe(c2)
  })

  it("empty registry returns deterministic root", () => {
    const reg = new OnChainCircuitRegistry()
    const c = reg.computeCommitment()
    expect(c.circuitCount).toBe(0)
    expect(c.merkleRoot).toHaveLength(64)
  })
})
