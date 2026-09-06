/**
 * @file types.ts
 * Core types for the Cross-Chain Bridge Relayer.
 */

/** Status of a cross-chain relay message */
export type RelayStatus =
  | "pending"       // Created locally, not yet broadcast
  | "submitted"     // Submitted to origin chain
  | "confirmed"     // Confirmed on origin chain (sufficient finality)
  | "relayed"       // Relay proof verified on destination chain
  | "completed"     // Mint/unlock executed on destination
  | "failed"        // Relay or execution failed
  | "escaped"       // Processed via emergency escape hatch

/** A cross-chain bridge message (lock/burn event + ZK proof) */
export interface BridgeMessage {
  /** Unique message identifier (UUID v4) */
  id: string
  /** Source chain identifier (e.g. "ethereum", "axioledger") */
  srcChain: string
  /** Destination chain identifier */
  dstChain: string
  /** Token address/identifier on the source chain */
  token: string
  /** Serialized amount as decimal string (avoids integer overflow) */
  amount: string
  /** Sender address on source chain */
  sender: string
  /** Recipient address on destination chain */
  recipient: string
  /** ZK storage proof bytes (base64-encoded), null until generated */
  zkProof: string | null
  /** Current relay lifecycle status */
  status: RelayStatus
  /** Unix timestamp (seconds) when the message was created */
  createdAt: number
}

/** Parameters for locking assets on source chain */
export interface LockEvent {
  txHash: string
  blockNumber: number
  token: string
  amount: string
  sender: string
  nonce: number
}

/** Parameters to mint wrapped tokens on destination chain */
export interface MintParams {
  messageId: string
  recipient: string
  token: string
  amount: string
  zkProof: string
}

/** Parameters to burn wrapped tokens and unlock on source chain */
export interface BurnParams {
  messageId: string
  token: string
  amount: string
  recipient: string
}

/** Parameters for the emergency escape hatch (Module 11.4) */
export interface EscapeParams {
  messageId: string
  /** Proof that the bridge sequencer is unresponsive or malicious */
  fraudProof?: string
}
