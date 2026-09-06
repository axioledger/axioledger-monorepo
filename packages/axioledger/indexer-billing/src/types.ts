/**
 * @file types.ts
 * @axioledger/indexer-billing — Core types
 *
 * Metered $AXQ billing for on-chain data indexers.
 *
 * Architecture:
 *   IB-1  Indexer Registry  — operators register their subgraph endpoints
 *   IB-2  Query Meter       — track queries per consumer, per indexer
 *   IB-3  Fee Calculator    — tiered pricing (free tier + paid tiers)
 *   IB-4  Credit System     — consumers pre-deposit $AXQ credits
 *   IB-5  Settlement        — periodic batch settlement to indexers
 */

// ---------------------------------------------------------------------------
// Identifiers
// ---------------------------------------------------------------------------

export type IndexerId  = string
export type ConsumerId = string  // wallet address or dApp ID
export type QueryId    = string

/** μAXQ = 1 AXQ / 1_000_000 */
export type MicroAXQ = bigint

// ---------------------------------------------------------------------------
// IB-1: Indexer Registry
// ---------------------------------------------------------------------------

export type IndexerStatus = "active" | "suspended" | "deregistered"

export type DatasetType =
  | "ans-domains"       // .axq name service records
  | "nft-metadata"      // NFT identity records
  | "defi-events"       // Kinetoprotocol AMM events
  | "validator-stats"   // Valiprecision node metrics
  | "custom"            // Any other dataset

export interface IndexerRecord {
  indexerId: IndexerId
  /** Display name for the marketplace */
  name: string
  /** GraphQL or REST API endpoint */
  endpoint: string
  /** Datasets this indexer serves */
  datasets: DatasetType[]
  /** Base fee per query in μAXQ (before tier adjustments) */
  baseFeePerQuery: MicroAXQ
  /** Free query allowance per consumer per 24h rolling window */
  freeQueryQuota: number
  status: IndexerStatus
  registeredAt: number
  /** Total queries served (all-time) */
  totalQueriesServed: number
  /** Total $AXQ earned (settled) */
  totalEarned: MicroAXQ
}

// ---------------------------------------------------------------------------
// IB-2: Query Metering
// ---------------------------------------------------------------------------

export type QueryComplexity = "simple" | "medium" | "complex"

/** Per-query log entry (used for billing calculation and audit) */
export interface QueryRecord {
  queryId: QueryId
  indexerId: IndexerId
  consumerId: ConsumerId
  complexity: QueryComplexity
  /** Computed fee in μAXQ (may be 0 if within free tier) */
  feeMicroAxq: MicroAXQ
  /** True if counted against the consumer's free tier quota */
  usedFreeQuota: boolean
  executedAt: number
  /** Query execution time in ms */
  latencyMs: number
}

// ---------------------------------------------------------------------------
// IB-3: Fee Tiers
// ---------------------------------------------------------------------------

/**
 * Fee multipliers per complexity tier.
 * Final fee = indexer.baseFeePerQuery × multiplier
 */
export interface FeeTierConfig {
  simpleMultiplier: number   // e.g. 1.0 (1× base fee)
  mediumMultiplier: number   // e.g. 3.0
  complexMultiplier: number  // e.g. 10.0
}

export const DEFAULT_FEE_TIER: FeeTierConfig = {
  simpleMultiplier:  1.0,
  mediumMultiplier:  3.0,
  complexMultiplier: 10.0,
}

// ---------------------------------------------------------------------------
// IB-4: Consumer Credits
// ---------------------------------------------------------------------------

export interface ConsumerCreditAccount {
  consumerId: ConsumerId
  /** Pre-deposited $AXQ balance in μAXQ */
  balanceMicroAxq: MicroAXQ
  /** Queries used in the current 24h rolling window (for free tier tracking) */
  queriesThisPeriod: number
  /** UNIX ms when the 24h window started */
  periodStartMs: number
  /** Total μAXQ spent all-time */
  totalSpent: MicroAXQ
  createdAt: number
}

// ---------------------------------------------------------------------------
// IB-5: Settlement
// ---------------------------------------------------------------------------

export interface SettlementBatch {
  batchId: string
  indexerId: IndexerId
  /** Period covered by this settlement */
  periodStartMs: number
  periodEndMs: number
  /** Total queries in this period */
  queryCount: number
  /** Total μAXQ collected from consumers */
  totalCollected: MicroAXQ
  /** After protocol cut (if any) */
  netToIndexer: MicroAXQ
  settledAt: number
  txHash: string
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export type IndexerBillingErrorCode =
  | "INDEXER_NOT_FOUND"
  | "CONSUMER_NOT_FOUND"
  | "INSUFFICIENT_CREDITS"
  | "INDEXER_SUSPENDED"
  | "QUOTA_EXCEEDED"

export class IndexerBillingError extends Error {
  constructor(
    message: string,
    public readonly code: IndexerBillingErrorCode,
    public readonly indexerId?: IndexerId,
    public readonly consumerId?: ConsumerId,
  ) {
    super(message)
    this.name = "IndexerBillingError"
  }
}
