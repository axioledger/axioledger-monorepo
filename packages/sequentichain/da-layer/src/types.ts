/**
 * @file types.ts
 * Core types for the DA Layer — @sequentichain/da-layer
 *
 * Covers all sub-modules:
 *   - 12.1  Blob Data Format & Encoding
 *   - 12.2  Data Availability Sampling (DAS)
 *   - 12.3  Retention Policy & Lifecycle
 *   - 12.4  Fee Model (dynamic, congestion-adjusted)
 *   - 12.5  P2P Gossip & Shard Distribution
 *   - 12.6  Challenge & Proof-of-Retrievability (PoR)
 *   - 12.7  DA Node Registry (on-chain interface)
 */

// ---------------------------------------------------------------------------
// 12.1 — Blob
// ---------------------------------------------------------------------------

/** Content-addressed blob identifier — SHA-256 hex or KZG commitment hex */
export type BlobId = string

/** Hex-encoded public key of a DA Node operator */
export type NodeId = string

/** 64-hex-char Blake2b-256 hash used for Merkle roots and commitments */
export type Hash256 = string

/** Maximum allowed raw blob payload: 128 KB */
export const MAX_BLOB_SIZE_BYTES = 131_072 // 128 × 1024

/**
 * A single L2 data blob submitted for availability.
 *
 * The `commitment` field holds a KZG polynomial commitment when the
 * full RS prover is wired in (Phase 2); in Phase 1 it mirrors `id`.
 */
export interface Blob {
  /** Content-addressed identifier (SHA-256 of raw bytes, hex) */
  id: BlobId
  /** KZG commitment (Phase 2) or SHA-256 commitment (Phase 1) */
  commitment: Hash256
  /** Raw byte payload (base64url-encoded, max 128 KB) */
  data: string
  /** Byte size of the decoded payload */
  size: number
  /** Unix timestamp (seconds) of submission */
  createdAt: number
  /** L2 block number this blob was produced for */
  blockNumber: number
  /**
   * L1/L2 block number after which the blob may be pruned from hot storage.
   * Corresponds to createdAt + HOT_RETENTION_BLOCKS (≈ 7 days of blocks).
   */
  expiresAt: number
  /** L2 Sequencer node that submitted this blob */
  submittedBy: NodeId
}

// ---------------------------------------------------------------------------
// 12.1 — Erasure Coding
// ---------------------------------------------------------------------------

/** Reed-Solomon codec configuration — 2D RS, k=32, m=32 by default */
export interface ErasureConfig {
  /** Number of data shards (k). Default: 32 */
  dataShards: number
  /** Number of parity shards (m). Default: 32 */
  parityShards: number
}

/** Default production configuration: k=32, m=32 (50% loss tolerance) */
export const DEFAULT_ERASURE_CONFIG: ErasureConfig = {
  dataShards: 32,
  parityShards: 32,
}

/** A shard produced by the RS encoder */
export interface Shard {
  /** Global shard index within the encoded blob (0 … k+m-1) */
  index: number
  /** true for data shards (index < k); false for parity shards */
  isData: boolean
  /** base64url-encoded shard bytes */
  data: string
  /** SHA-256 of the shard bytes — used as Merkle leaf */
  checksum: Hash256
}

/** Result of encoding a single blob */
export interface EncodedBlob {
  blobId: BlobId
  shards: readonly Shard[]
  dataShards: number
  parityShards: number
  /** Merkle root of all shard checksums — anchored on-chain */
  merkleRoot: Hash256
}

// ---------------------------------------------------------------------------
// 12.2 — Data Availability Sampling (DAS)
// ---------------------------------------------------------------------------

/** Minimum random samples required per check: t = 20 */
export const DAS_SAMPLE_COUNT = 20

/**
 * Probability of missing hidden data given t samples out of N total shards
 * with k required.  P(miss) = ((N-k)/N)^t
 */
export interface SamplingResult {
  blobId: BlobId
  /** True when all t samples responded successfully */
  available: boolean
  /** Number of shard indices sampled */
  sampledChunks: number
  /** Number of chunks that returned valid data + checksum */
  successfulChunks: number
  /** Computed miss probability based on the sampling outcome */
  missProbability: number
  /** Timestamp of the sampling run */
  sampledAt: number
}

// ---------------------------------------------------------------------------
// 12.3 — Retention Policy
// ---------------------------------------------------------------------------

/**
 * Hot storage duration: 7 days expressed in L2 blocks.
 * Assumes ~2-second block time → 7 × 24 × 3600 / 2 = 302,400 blocks.
 */
export const HOT_RETENTION_BLOCKS = 302_400

/** Blob storage lifecycle phases */
export type BlobPhase = "hot" | "cold" | "pruned"

export interface BlobLifecycleEntry {
  blobId: BlobId
  phase: BlobPhase
  /** Block at which the current phase started */
  phaseStartBlock: number
  /** Merkle root archived to L1 when phase transitions to "cold" */
  archivedMerkleRoot?: Hash256
}

// ---------------------------------------------------------------------------
// 12.4 — Fee Model
// ---------------------------------------------------------------------------

/**
 * Dynamic DA fee calculation parameters.
 *
 * Fee = sizeKB × baseFee × (1 + queueLoad / maxCapacity)
 * Paid in $AXQ (expressed as integer micro-AXQ units: 1 AXQ = 1e6 μAXQ).
 */
export interface DAFeeParams {
  /** Base fee per KB in micro-AXQ */
  baseFeePerKb: bigint
  /** Current pending blob queue depth (0 … maxCapacity) */
  currentQueueLoad: number
  /** Maximum queue capacity (used for congestion multiplier) */
  maxCapacity: number
}

export interface DAFeeQuote {
  blobId: BlobId
  sizeKb: number
  baseFeePerKb: bigint
  congestionMultiplier: number
  /** Total fee in micro-AXQ */
  totalFee: bigint
}

// ---------------------------------------------------------------------------
// 12.5 — P2P Shard Distribution
// ---------------------------------------------------------------------------

/**
 * A gossip message broadcast when a new encoded blob is ready for distribution.
 * DA Nodes subscribe to this and fetch/store assigned shards.
 */
export interface BlobAnnouncementMessage {
  type: "BLOB_ANNOUNCE"
  blobId: BlobId
  merkleRoot: Hash256
  totalShards: number
  blockNumber: number
  /** Submitter's NodeId for direct fetch fallback */
  origin: NodeId
}

/** Request sent P2P to fetch a specific shard from a peer */
export interface ShardRequest {
  blobId: BlobId
  shardIndex: number
}

/** Response to a ShardRequest */
export interface ShardResponse {
  blobId: BlobId
  shard: Shard
  /** Merkle proof path for shard verification */
  proof: readonly Hash256[]
}

// ---------------------------------------------------------------------------
// 12.6 — Challenge & Proof-of-Retrievability (PoR)
// ---------------------------------------------------------------------------

/** Challenge window: 12 blocks (~24 seconds at 2s/block) */
export const CHALLENGE_WINDOW_BLOCKS = 12

export type ChallengeStatus = "pending" | "resolved" | "expired" | "slashed"

/** A retrieval challenge issued to a DA Node */
export interface RetrievalChallenge {
  challengeId: string
  blobId: BlobId
  /** Specific shard index demanded */
  shardIndex: number
  /** Node being challenged */
  challengedNode: NodeId
  /** Node that issued the challenge (or "network" for automated challenges) */
  challenger: NodeId
  /** Block number the challenge was issued */
  issuedAtBlock: number
  /** Block number by which response must arrive */
  deadlineBlock: number
  status: ChallengeStatus
}

/** A node's response to a RetrievalChallenge */
export interface ChallengeResponse {
  challengeId: string
  shard: Shard
  proof: readonly Hash256[]
  respondedAtBlock: number
}

// ---------------------------------------------------------------------------
// 12.7 — DA Node Registry (on-chain interface types)
// ---------------------------------------------------------------------------

export type NodeStatus = "active" | "suspended" | "slashed" | "exited"

/**
 * On-chain DA Node registration record.
 * Stored in `DANodeRegistry.sol` / `da_node_registry` Rust program.
 */
export interface DANodeRecord {
  nodeId: NodeId
  /** $AXQ stake in micro-AXQ (minimum: 10,000 AXQ = 10_000_000_000 μAXQ) */
  stakeAmount: bigint
  /** Peer-to-peer endpoint (multiaddr format) */
  endpoint: string
  /** Total shards currently stored by this node */
  shardCount: number
  /** Cumulative slashing amount in micro-AXQ */
  slashedAmount: bigint
  status: NodeStatus
  registeredAt: number
}

/** Supported external DA provider identifiers */
export type DAProvider = "internal" | "celestia" | "eigenda"
