/**
 * @sequentichain/da-layer — Public API
 *
 * Data Availability Layer — Module 12
 *
 *   12.1  Blob Data Format, Size Guard & Erasure Coding (Reed-Solomon k=32, m=32)
 *   12.2  Data Availability Sampling (DAS) — random t=20 shard checks
 *   12.3  Retention Policy — hot (7-day) → cold archival → pruned eviction
 *   12.4  Dynamic Fee Model — $AXQ, congestion-adjusted
 *   12.5  P2P Gossip types — BlobAnnouncementMessage, ShardRequest/Response
 *   12.6  Challenge & Proof-of-Retrievability (PoR) — 12-block window
 *   12.7  DA Node Registry types — on-chain interface
 */

// — Core types & constants —
export type {
  Blob,
  BlobId,
  BlobLifecycleEntry,
  BlobPhase,
  BlobAnnouncementMessage,
  ChallengeResponse,
  ChallengeStatus,
  DAFeeParams,
  DAFeeQuote,
  DANodeRecord,
  DAProvider,
  EncodedBlob,
  ErasureConfig,
  Hash256,
  NodeId,
  NodeStatus,
  RetrievalChallenge,
  SamplingResult,
  Shard,
  ShardRequest,
  ShardResponse,
} from "./types.js"

export {
  CHALLENGE_WINDOW_BLOCKS,
  DAS_SAMPLE_COUNT,
  DEFAULT_ERASURE_CONFIG,
  HOT_RETENTION_BLOCKS,
  MAX_BLOB_SIZE_BYTES,
} from "./types.js"

// — Blob Store (12.1 + 12.3) —
export { BlobStore, BlobValidationError } from "./blob-store.js"

// — Erasure Coding + Merkle (12.1) —
export { ErasureCoder, merkleProof, verifyMerkleProof } from "./erasure-coding.js"

// — DAS Sampler (12.2) —
export { DASampler, computeMissProbability, localShardFetcher } from "./das.js"
export type { DASamplerConfig, ShardFetcher } from "./das.js"

// — Fee Model (12.4) —
export { estimateFee, buildFeeParams, DEFAULT_BASE_FEE_PER_KB } from "./fee-model.js"

// — Challenge Protocol (12.6) —
export { ChallengeManager } from "./challenge.js"

// — Unified DA Client (12.4 orchestrator) —
export { DAClient } from "./da-client.js"
export type { DAClientConfig } from "./da-client.js"
