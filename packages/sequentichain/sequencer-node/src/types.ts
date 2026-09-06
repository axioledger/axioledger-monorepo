/**
 * @file types.ts
 * Core types for the Sequencer Node.
 */

/** A raw L2 transaction received by the sequencer */
export interface L2Transaction {
  /** Unique transaction hash */
  hash: string
  /** Sender account identifier */
  from: string
  /** Recipient account identifier (contract or EOA) */
  to: string
  /** Transfer value in $SQX base units (as decimal string) */
  value: string
  /** Encoded call data (base64) */
  data: string
  /** Transaction fee in $SQX base units */
  fee: string
  /** Unix timestamp (nanoseconds) of when the sequencer received the tx */
  receivedAtNs: bigint
  /** Nonce of the sender account */
  nonce: number
}

/** An ordered batch ready for ZK-SNARK commitment */
export interface OrderedBatch {
  /** Sequential batch number on L2 */
  batchNumber: number
  /** Ordered list of transactions in this batch */
  transactions: readonly L2Transaction[]
  /** Merkle root of the transactions in this batch */
  txRoot: string
  /** Unix timestamp (milliseconds) when the batch was sealed */
  sealedAt: number
}

/** Configuration for the Sequencer */
export interface SequencerConfig {
  /** Maximum number of transactions per batch */
  maxBatchSize: number
  /** Maximum time (ms) to wait before sealing a batch even if not full */
  maxBatchDelayMs: number
  /** Sequencer account identifier (signer for batch submissions) */
  sequencerAccount: string
}
