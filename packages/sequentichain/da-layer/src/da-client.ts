/**
 * @file da-client.ts
 * DA Client — Module 12.4
 *
 * Unified interface for:
 *  - Submitting blobs to internal storage or external DA providers
 *  - Triggering erasure encoding + shard distribution
 *  - Running DAS checks with the configured sampler
 *  - Computing fee quotes before submission
 *
 * Phase 1: internal provider uses BlobStore + ErasureCoder in-process.
 * Phase 2: celestia/eigenda providers wire to gRPC/HTTP submission endpoints.
 */
import type { Blob, BlobId, DAFeeQuote, DAProvider, SamplingResult } from "./types.js"
import { DEFAULT_ERASURE_CONFIG } from "./types.js"
import { BlobStore, BlobValidationError } from "./blob-store.js"
import { ErasureCoder } from "./erasure-coding.js"
import { DASampler, localShardFetcher } from "./das.js"
import { buildFeeParams, estimateFee, DEFAULT_BASE_FEE_PER_KB } from "./fee-model.js"

// ---------------------------------------------------------------------------
// DAClientConfig
// ---------------------------------------------------------------------------

export interface DAClientConfig {
  /** Which backend to use for blob submission */
  provider: DAProvider
  /** RPC endpoint for external providers (Celestia / EigenDA) */
  rpcUrl: string
  /** Erasure coding parameters — defaults to k=32, m=32 */
  erasureConfig?: { dataShards: number; parityShards: number }
  /** Maximum blob queue depth used for fee congestion calculation */
  maxQueueCapacity?: number
}

// ---------------------------------------------------------------------------
// DAClient
// ---------------------------------------------------------------------------

export class DAClient {
  private readonly config: Required<DAClientConfig>
  private readonly store: BlobStore
  private readonly coder: ErasureCoder
  private readonly sampler: DASampler
  /** Simulated pending queue depth — Phase 2: read from network state */
  private pendingCount = 0

  constructor(config: DAClientConfig) {
    this.config = {
      ...config,
      erasureConfig: config.erasureConfig ?? DEFAULT_ERASURE_CONFIG,
      maxQueueCapacity: config.maxQueueCapacity ?? 1_000,
    }
    this.store = new BlobStore()
    this.coder = new ErasureCoder(this.config.erasureConfig)
    this.sampler = new DASampler()
  }

  // ---------------------------------------------------------------------------
  // Fee estimation
  // ---------------------------------------------------------------------------

  /**
   * Estimate the DA fee for a blob before submission.
   * Useful for Sequencers to decide batch sizing.
   */
  estimateFee(blobId: BlobId, sizeBytes: number): DAFeeQuote {
    const params = buildFeeParams(
      this.pendingCount,
      this.config.maxQueueCapacity,
      DEFAULT_BASE_FEE_PER_KB,
    )
    return estimateFee(blobId, sizeBytes, params)
  }

  // ---------------------------------------------------------------------------
  // Submission
  // ---------------------------------------------------------------------------

  /**
   * Submit a blob for data availability.
   *
   * Steps:
   *   1. Validate + store the blob in hot storage
   *   2. Erasure-encode into (k+m) shards
   *   3. Attach the shard set to the blob store
   *   4. [Phase 2] Broadcast BlobAnnouncementMessage to DA network peers
   *   5. Return the blob commitment hash
   *
   * @throws {BlobValidationError} on duplicate or oversized blob
   */
  async submit(blob: Blob): Promise<BlobId> {
    if (this.config.provider === "internal") {
      return this._submitInternal(blob)
    }
    // Phase 2: dispatch to Celestia / EigenDA gRPC
    // return this._submitExternal(blob)
    return blob.id
  }

  private async _submitInternal(blob: Blob): Promise<BlobId> {
    const stored = this.store.put(blob)
    const encoded = this.coder.encode(stored.id, stored.data)
    this.store.putShards(encoded)
    this.pendingCount++
    // Phase 2: gossip BlobAnnouncementMessage to peers
    return stored.id
  }

  // ---------------------------------------------------------------------------
  // Sampling
  // ---------------------------------------------------------------------------

  /**
   * Run a DAS check on a previously submitted blob.
   *
   * Phase 1: uses the local shard store as the "peer network".
   * Phase 2: replace localShardFetcher with a real P2P transport fetcher.
   *
   * @param blobId       - Target blob
   * @param sampleCount  - Override default DAS_SAMPLE_COUNT (20) if needed
   */
  async sample(blobId: BlobId, sampleCount?: number): Promise<SamplingResult> {
    const encoded = this.store.getShards(blobId)
    if (!encoded) {
      // Blob not in local store — Phase 2: fetch announcement from network
      return {
        blobId,
        available: false,
        sampledChunks: sampleCount ?? 20,
        successfulChunks: 0,
        missProbability: 1,
        sampledAt: Math.floor(Date.now() / 1000),
      }
    }

    const sampler = sampleCount ? new DASampler({ sampleCount }) : this.sampler
    const fetcher = localShardFetcher(encoded)
    return sampler.sample(
      blobId,
      encoded.shards.length,
      encoded.dataShards,
      encoded.merkleRoot,
      fetcher,
    )
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Trigger hot→cold archival for all expired blobs.
   * In production this is called by the DA Node daemon on each new block.
   *
   * @param currentBlock - Current L2 block number
   * @returns Array of archived blobIds
   */
  archiveCold(currentBlock: number): BlobId[] {
    const ids = this.store.archiveCold(currentBlock)
    this.pendingCount = Math.max(0, this.pendingCount - ids.length)
    return ids
  }

  /**
   * Evict cold blobs past the secondary retention window.
   *
   * @param currentBlock         - Current L2 block number
   * @param coldRetentionBlocks  - Extra blocks after cold archival before eviction
   */
  evictCold(currentBlock: number, coldRetentionBlocks?: number): BlobId[] {
    return this.store.evictCold(currentBlock, coldRetentionBlocks)
  }

  // ---------------------------------------------------------------------------
  // Diagnostics
  // ---------------------------------------------------------------------------

  getProvider(): DAProvider { return this.config.provider }
  hotBlobCount(): number { return this.store.countHot() }
  pendingQueueDepth(): number { return this.pendingCount }
}
