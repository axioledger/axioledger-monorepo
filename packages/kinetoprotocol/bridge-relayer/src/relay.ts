/**
 * @file relay.ts
 * Cross-Chain Message Relay — Module 11.3
 * Coordinates asynchronous state updates between chains.
 */
import type { BridgeMessage } from "./types.js"

export interface RelayConfig {
  /** WebSocket or HTTP RPC endpoint for the source chain */
  srcRpcUrl: string
  /** WebSocket or HTTP RPC endpoint for the destination chain */
  dstRpcUrl: string
  /** Polling interval in milliseconds */
  pollIntervalMs?: number
}

/**
 * MessageRelay listens for cross-chain events and advances
 * BridgeMessage state through the confirmed → relayed lifecycle.
 *
 * Phase 1: stub with configurable transport.
 * Phase 2: full libp2p-based relay network (Module 11.3).
 */
export class MessageRelay {
  private readonly config: Required<RelayConfig>
  private running = false

  constructor(config: RelayConfig) {
    this.config = {
      srcRpcUrl: config.srcRpcUrl,
      dstRpcUrl: config.dstRpcUrl,
      pollIntervalMs: config.pollIntervalMs ?? 5_000,
    }
  }

  /** Start the relay polling loop. Phase 2: replaces with event subscription. */
  start(): void {
    this.running = true
    // Phase 2: subscribe to srcChain lock events via WebSocket
  }

  /** Stop the relay loop cleanly. */
  stop(): void {
    this.running = false
  }

  isRunning(): boolean {
    return this.running
  }

  /**
   * Manually advance a message to "relayed" after its ZK proof has been
   * submitted and verified on the destination chain.
   * Phase 2: called automatically by the ZK verifier callback.
   */
  markRelayed(msg: BridgeMessage): BridgeMessage {
    return { ...msg, status: "relayed" }
  }
}
