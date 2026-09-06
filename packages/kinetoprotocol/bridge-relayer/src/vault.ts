/**
 * @file vault.ts
 * BridgeVault — Lock-and-Mint vault interface (Module 11.1)
 */
import type { BridgeMessage, LockEvent, MintParams, BurnParams } from "./types.js"

let _msgSeq = 1

/**
 * Manages bridge vault operations: locking assets, minting wrapped tokens,
 * and recording bridge message state.
 */
export class BridgeVault {
  private readonly messages = new Map<string, BridgeMessage>()

  /**
   * Record a lock event observed on the source chain.
   * Returns the created BridgeMessage awaiting ZK proof generation.
   */
  recordLock(
    lock: LockEvent,
    srcChain: string,
    dstChain: string,
    recipient: string,
  ): BridgeMessage {
    const id = `bridge-${String(_msgSeq++)}-${lock.nonce}`
    const msg: BridgeMessage = {
      id,
      srcChain,
      dstChain,
      token: lock.token,
      amount: lock.amount,
      sender: lock.sender,
      recipient,
      zkProof: null,
      status: "pending",
      createdAt: Math.floor(Date.now() / 1000),
    }
    this.messages.set(id, msg)
    return msg
  }

  /**
   * Attach a ZK storage proof to a bridge message.
   * Advances status from "pending" → "submitted".
   */
  attachProof(messageId: string, zkProof: string): BridgeMessage {
    const msg = this._require(messageId)
    if (msg.status !== "pending") {
      throw new Error(`Message ${messageId} is not in pending state (got ${msg.status})`)
    }
    const updated: BridgeMessage = { ...msg, zkProof, status: "submitted" }
    this.messages.set(messageId, updated)
    return updated
  }

  /**
   * Simulate minting on the destination chain.
   * Advances status to "completed".
   * Phase 2: wire up to actual on-chain instruction builder.
   */
  executeMint(params: MintParams): BridgeMessage {
    const msg = this._require(params.messageId)
    if (msg.status !== "relayed") {
      throw new Error(`Message ${params.messageId} must be in 'relayed' state to mint`)
    }
    const updated: BridgeMessage = { ...msg, status: "completed" }
    this.messages.set(params.messageId, updated)
    return updated
  }

  /** Retrieve a message by ID. */
  getMessage(id: string): BridgeMessage | undefined {
    return this.messages.get(id)
  }

  /** List messages by status. */
  listByStatus(status: BridgeMessage["status"]): BridgeMessage[] {
    return [...this.messages.values()].filter((m) => m.status === status)
  }

  private _require(id: string): BridgeMessage {
    const msg = this.messages.get(id)
    if (!msg) throw new Error(`Bridge message ${id} not found`)
    return msg
  }
}
