/**
 * @file escape-hatch.ts
 * Emergency Escape Hatch — Module 11.4
 *
 * Allows users to withdraw collateral directly on L1 if the bridge
 * sequencer becomes unresponsive or malicious.
 */
import type { EscapeParams, BridgeMessage } from "./types.js"

/**
 * EscapeHatch processes emergency L1 withdrawal requests.
 *
 * Phase 1: records escape requests; Phase 2 wires to on-chain
 * vault smart contract's `emergencyWithdraw()` instruction.
 */
export class EscapeHatch {
  private readonly escapes = new Map<string, { params: EscapeParams; submittedAt: number }>()

  /**
   * Submit an emergency escape request for a stuck bridge message.
   * Returns the (frozen) message with status set to "escaped".
   */
  requestEscape(msg: BridgeMessage, params: EscapeParams): BridgeMessage {
    if (msg.status === "completed" || msg.status === "escaped") {
      throw new Error(`Message ${msg.id} is already finalized (${msg.status})`)
    }
    this.escapes.set(msg.id, { params, submittedAt: Math.floor(Date.now() / 1000) })
    return { ...msg, status: "escaped" }
  }

  /** Returns the escape record for a given message ID, or undefined. */
  getEscape(messageId: string) {
    return this.escapes.get(messageId)
  }

  /** Returns true if an escape has been submitted for the message. */
  hasEscape(messageId: string): boolean {
    return this.escapes.has(messageId)
  }
}
