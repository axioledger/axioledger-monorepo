import { describe, it, expect } from "vitest"
import { BridgeVault } from "../vault.js"
import { MessageRelay } from "../relay.js"
import { EscapeHatch } from "../escape-hatch.js"
import type { LockEvent } from "../types.js"

const LOCK: LockEvent = {
  txHash: "0xabc",
  blockNumber: 100,
  token: "USDC",
  amount: "1000000",
  sender: "0xAlice",
  nonce: 1,
}

describe("BridgeVault", () => {
  it("records a lock event and creates pending message", () => {
    const vault = new BridgeVault()
    const msg = vault.recordLock(LOCK, "ethereum", "axioledger", "alice.axq")
    expect(msg.status).toBe("pending")
    expect(msg.token).toBe("USDC")
    expect(msg.amount).toBe("1000000")
    expect(msg.zkProof).toBeNull()
  })

  it("attaches proof and advances to submitted", () => {
    const vault = new BridgeVault()
    const msg = vault.recordLock(LOCK, "ethereum", "axioledger", "alice.axq")
    const updated = vault.attachProof(msg.id, "base64zkproof==")
    expect(updated.status).toBe("submitted")
    expect(updated.zkProof).toBe("base64zkproof==")
  })

  it("rejects duplicate proof attachment", () => {
    const vault = new BridgeVault()
    const msg = vault.recordLock(LOCK, "ethereum", "axioledger", "alice.axq")
    vault.attachProof(msg.id, "proof1")
    expect(() => vault.attachProof(msg.id, "proof2")).toThrow()
  })
})

describe("MessageRelay", () => {
  it("starts and stops cleanly", () => {
    const relay = new MessageRelay({ srcRpcUrl: "ws://localhost:8545", dstRpcUrl: "ws://localhost:9545" })
    expect(relay.isRunning()).toBe(false)
    relay.start()
    expect(relay.isRunning()).toBe(true)
    relay.stop()
    expect(relay.isRunning()).toBe(false)
  })
})

describe("EscapeHatch", () => {
  it("submits escape and marks message escaped", () => {
    const vault = new BridgeVault()
    const msg = vault.recordLock(LOCK, "ethereum", "axioledger", "alice.axq")
    const hatch = new EscapeHatch()
    const escaped = hatch.requestEscape(msg, { messageId: msg.id })
    expect(escaped.status).toBe("escaped")
    expect(hatch.hasEscape(msg.id)).toBe(true)
  })

  it("throws when escaping an already completed message", () => {
    const vault = new BridgeVault()
    const msg = vault.recordLock(LOCK, "ethereum", "axioledger", "alice.axq")
    // Force complete state
    const completedMsg = { ...msg, status: "completed" as const }
    const hatch = new EscapeHatch()
    expect(() => hatch.requestEscape(completedMsg, { messageId: msg.id })).toThrow()
  })
})
