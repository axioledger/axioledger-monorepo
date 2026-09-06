/**
 * @file das.ts
 * Data Availability Sampling — Module 12.2
 *
 * Implements random chunk sampling against the DA node network.
 * Light Nodes and Validators run this to verify data availability
 * without downloading full blob data.
 *
 * Protocol:
 *   1. Randomly select t = DAS_SAMPLE_COUNT distinct shard indices
 *   2. Request each shard from a peer DA node via ShardRequest
 *   3. Verify the returned shard's checksum against the committed Merkle root
 *   4. Compute P(miss) — theoretical probability of missing hidden shards
 *
 * Phase 1: peer I/O is stubbed; shard verification logic is real.
 * Phase 2: connect `fetchShard` to the P2P gossip/libp2p transport layer.
 */
import { createHash } from "node:crypto"
import type {
  BlobId,
  EncodedBlob,
  Hash256,
  Shard,
  SamplingResult,
  ShardResponse,
} from "./types.js"
import { DAS_SAMPLE_COUNT } from "./types.js"
import { verifyMerkleProof } from "./erasure-coding.js"

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function sha256hex(data: string): Hash256 {
  return createHash("sha256").update(data, "utf8").digest("hex")
}

/**
 * Draw `count` distinct random integers from [0, max).
 * Uses Fisher-Yates partial shuffle for O(count) performance.
 */
function sampleIndices(max: number, count: number): number[] {
  const pool = Array.from({ length: max }, (_, i) => i)
  const sampled: number[] = []
  for (let i = 0; i < Math.min(count, max); i++) {
    const j = i + Math.floor(Math.random() * (max - i))
    const tmp = pool[i] ?? i
    pool[i] = pool[j] ?? j
    pool[j] = tmp
    sampled.push(pool[i] ?? i)
  }
  return sampled
}

/**
 * Compute P(miss) — probability that hidden data is not detected.
 * Formula: P(miss) = ((N - k) / N) ^ t
 *
 * @param totalShards N — total shards (k + m)
 * @param dataShards  k — minimum shards needed for reconstruction
 * @param samples     t — number of random samples taken
 */
export function computeMissProbability(
  totalShards: number,
  dataShards: number,
  samples: number
): number {
  if (totalShards <= 0 || dataShards <= 0) return 1
  const p = (totalShards - dataShards) / totalShards
  return Math.pow(p, samples)
}

// ---------------------------------------------------------------------------
// Peer fetch interface (Phase 2 will inject a real transport)
// ---------------------------------------------------------------------------

export type ShardFetcher = (
  blobId: BlobId,
  shardIndex: number
) => Promise<ShardResponse | null>

/**
 * Phase-1 stub fetcher: resolves shards from a locally-provided EncodedBlob.
 * Replaces with a libp2p/TCP transport in Phase 2.
 */
export function localShardFetcher(encoded: EncodedBlob): ShardFetcher {
  return async (blobId, shardIndex) => {
    if (blobId !== encoded.blobId) return null
    const shard = encoded.shards[shardIndex]
    if (!shard) return null
    const leaves = encoded.shards.map((s) => s.checksum)
    const proof = buildSimpleProof(leaves, shardIndex)
    return { blobId, shard, proof }
  }
}

/** Minimal proof builder for localShardFetcher (replicates merkleProof logic inline) */
function buildSimpleProof(leaves: readonly Hash256[], index: number): Hash256[] {
  const padded = [...leaves]
  while ((padded.length & (padded.length - 1)) !== 0) padded.push(padded[padded.length - 1] ?? "")
  const tree: Hash256[] = new Array(padded.length * 2 - 1).fill("") as Hash256[]
  const offset = padded.length - 1
  for (let i = 0; i < padded.length; i++) tree[offset + i] = padded[i] ?? ""
  for (let i = offset - 1; i >= 0; i--) {
    tree[i] = createHash("sha256").update((tree[2 * i + 1] ?? "") + (tree[2 * i + 2] ?? "")).digest("hex")
  }
  const proof: Hash256[] = []
  let pos = offset + index
  while (pos > 0) {
    const sibling = pos % 2 === 0 ? pos - 1 : pos + 1
    proof.push(tree[sibling] ?? "")
    pos = Math.floor((pos - 1) / 2)
  }
  return proof
}

// ---------------------------------------------------------------------------
// DAS Sampler
// ---------------------------------------------------------------------------

export interface DASamplerConfig {
  /** Number of random shard samples per check. Default: DAS_SAMPLE_COUNT (20) */
  sampleCount?: number
  /** Millisecond timeout per individual shard fetch. Default: 5000 */
  fetchTimeoutMs?: number
}

export class DASampler {
  private readonly sampleCount: number
  private readonly fetchTimeoutMs: number

  constructor(config: DASamplerConfig = {}) {
    this.sampleCount = config.sampleCount ?? DAS_SAMPLE_COUNT
    this.fetchTimeoutMs = config.fetchTimeoutMs ?? 5_000
  }

  /**
   * Perform a DAS check on a blob.
   *
   * @param blobId    - Target blob identifier
   * @param totalShards - Total shard count (k + m)
   * @param dataShards  - Minimum reconstruction threshold (k)
   * @param merkleRoot  - Committed Merkle root for shard proof verification
   * @param fetcher   - Peer shard fetch function
   * @returns SamplingResult with availability verdict and miss probability
   */
  async sample(
    blobId: BlobId,
    totalShards: number,
    dataShards: number,
    merkleRoot: Hash256,
    fetcher: ShardFetcher,
  ): Promise<SamplingResult> {
    const indices = sampleIndices(totalShards, this.sampleCount)
    let successfulChunks = 0

    await Promise.all(
      indices.map(async (shardIndex) => {
        try {
          const result = await Promise.race([
            fetcher(blobId, shardIndex),
            new Promise<null>((resolve) =>
              setTimeout(() => resolve(null), this.fetchTimeoutMs)
            ),
          ])
          if (!result) return

          const { shard, proof } = result
          // Verify shard data integrity
          const computedChecksum = sha256hex(shard.data)
          if (computedChecksum !== shard.checksum) return

          // Verify Merkle inclusion proof
          const valid = verifyMerkleProof(shard.checksum, proof, shardIndex, merkleRoot)
          if (valid) successfulChunks++
        } catch {
          // Treat fetch errors as unavailable
        }
      })
    )

    const sampledChunks = indices.length
    const available = successfulChunks === sampledChunks
    const missProbability = computeMissProbability(totalShards, dataShards, sampledChunks)

    return {
      blobId,
      available,
      sampledChunks,
      successfulChunks,
      missProbability,
      sampledAt: Math.floor(Date.now() / 1000),
    }
  }
}
