import { describe, it, expect } from "vitest"
import { ProofVerifier } from "../verifier.js"
import { buildVerifyInstruction } from "../instruction.js"
import type { VerificationKey, VerifyParams } from "../types.js"

const VKEY: VerificationKey = {
  circuitId: "transfer-v1",
  vkBytes: "base64vkbytes==",
}

describe("ProofVerifier", () => {
  it("rejects proof when no VKey is registered", () => {
    const verifier = new ProofVerifier()
    const result = verifier.verify({ circuitId: "unknown", proof: "abc", publicSignals: {} })
    expect(result.valid).toBe(false)
    expect(result.error).toContain("No verification key")
  })

  it("rejects empty proof", () => {
    const verifier = new ProofVerifier()
    verifier.registerVKey(VKEY)
    const result = verifier.verify({ circuitId: "transfer-v1", proof: "", publicSignals: {} })
    expect(result.valid).toBe(false)
    expect(result.error).toContain("empty")
  })

  it("accepts valid proof with registered VKey", () => {
    const verifier = new ProofVerifier()
    verifier.registerVKey(VKEY)
    const result = verifier.verify({ circuitId: "transfer-v1", proof: "base64proof==", publicSignals: { amount: "1000" } })
    expect(result.valid).toBe(true)
    expect(result.computeUnits).toBeGreaterThan(0)
  })

  it("throws on duplicate VKey registration", () => {
    const verifier = new ProofVerifier()
    verifier.registerVKey(VKEY)
    expect(() => verifier.registerVKey(VKEY)).toThrow("already registered")
  })
})

describe("buildVerifyInstruction", () => {
  it("builds an instruction with correct programId", () => {
    const params: VerifyParams = { circuitId: "transfer-v1", proof: "abc", publicSignals: {} }
    const ix = buildVerifyInstruction(params, "VeraProgram111", "callerPubkey")
    expect(ix.programId).toBe("VeraProgram111")
    expect(ix.keys[0]?.pubkey).toBe("callerPubkey")
    expect(ix.data.length).toBeGreaterThan(0)
  })
})
