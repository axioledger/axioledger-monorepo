import { describe, it, expect } from "vitest"
import { SoulboundRegistry }   from "../soulbound.js"
import { SelectiveDisclosure }  from "../selective-disclosure.js"
import { MaciCircuit }          from "../maci.js"
import { IdentityVerifier }     from "../identity-verifier.js"

// ─── SoulboundRegistry ───────────────────────────────────────────────────────

describe("SoulboundRegistry", () => {
  it("issues a credential and finds it as active", () => {
    const reg = new SoulboundRegistry()
    const cred = reg.issue("did:axq:alice", "did:axq:issuer", "kyc-basic", 0, "zkproof==")
    expect(cred.holderDid).toBe("did:axq:alice")
    expect(cred.revoked).toBe(false)
    expect(reg.findActive("did:axq:alice", "kyc-basic")).toBeDefined()
  })

  it("throws on duplicate active credential for same holder+type", () => {
    const reg = new SoulboundRegistry()
    reg.issue("did:axq:bob", "did:axq:issuer", "age-18+", 0, "proof1")
    expect(() =>
      reg.issue("did:axq:bob", "did:axq:issuer", "age-18+", 0, "proof2")
    ).toThrow("already has an active")
  })

  it("revoke removes credential from active set", () => {
    const reg  = new SoulboundRegistry()
    const cred = reg.issue("did:axq:carol", "did:axq:issuer", "developer", 0, "proof3")
    reg.revoke(cred.id)
    expect(reg.findActive("did:axq:carol", "developer")).toBeUndefined()
  })
})

// ─── SelectiveDisclosure ─────────────────────────────────────────────────────

describe("SelectiveDisclosure", () => {
  it("generates a stub proof with public signals", async () => {
    const sd    = new SelectiveDisclosure()
    const proof = await sd.prove(
      { holderDid: "did:axq:dave", credentialType: "accredited-investor", attributes: ["jurisdiction", "accredited"] },
      "raw-cred-proof"
    )
    expect(proof.zkProof).toContain("sd-stub")
    expect(proof.publicSignals["jurisdiction"]).toBe("verified")
    expect(proof.publicSignals["accredited"]).toBe("verified")
  })

  it("verify returns true for valid stub proof", async () => {
    const sd    = new SelectiveDisclosure()
    const proof = await sd.prove(
      { holderDid: "did:axq:eve", credentialType: "age-18+", attributes: ["age"] },
      "raw"
    )
    expect(sd.verify(proof)).toBe(true)
  })
})

// ─── MaciCircuit ─────────────────────────────────────────────────────────────

describe("MaciCircuit", () => {
  it("tallies votes and returns a proof", () => {
    const maci = new MaciCircuit()
    maci.submitVote({ voterPubKey: "pk-1", encryptedVote: "enc1", proposalId: "prop-1", submittedAt: Date.now() })
    maci.submitVote({ voterPubKey: "pk-2", encryptedVote: "enc2", proposalId: "prop-1", submittedAt: Date.now() })
    const tally = maci.tally("prop-1")
    expect(tally.totalVotes).toBe(2)
    expect(tally.tallyProof).toContain("maci-tally-stub")
  })

  it("throws when no votes exist for proposal", () => {
    const maci = new MaciCircuit()
    expect(() => maci.tally("nonexistent")).toThrow("No votes")
  })
})

// ─── IdentityVerifier ────────────────────────────────────────────────────────

describe("IdentityVerifier", () => {
  it("returns valid=true for active credential", () => {
    const reg      = new SoulboundRegistry()
    const verifier = new IdentityVerifier(reg)
    reg.issue("did:axq:frank", "did:axq:issuer", "unique-human", 0, "proof==")
    const result = verifier.verify("did:axq:frank", "unique-human")
    expect(result.valid).toBe(true)
    expect(result.revoked).toBe(false)
    expect(result.expired).toBe(false)
  })

  it("returns valid=false for missing credential", () => {
    const verifier = new IdentityVerifier()
    const result   = verifier.verify("did:axq:ghost", "validator")
    expect(result.valid).toBe(false)
    expect(result.error).toContain("No credential")
  })
})
