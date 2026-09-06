/**
 * @file blob-store.ts
 * Blob Store — Module 12.1 & 12.3
 *
 * Responsibilities:
 *  - Hot in-memory storage for raw blobs (7-day retention window)
 *  - Lifecycle management: hot → cold → pruned transitions
 *  - Shard index: blobId → EncodedBlob (for DAS and challenge protocol)
 *  - Size guard: rejects blobs exceeding MAX_BLOB_SIZE_BYTES (128 KB)
 */
import type {
  Blob,
  BlobId,
  BlobLifecycleEntry,
  BlobPhase,
  EncodedBlob,
  Hash256,
} from "./types.js"
import { HOT_RETENTION_BLOCKS, MAX_BLOB_SIZE_BYTES } from "./types.js"

// ---------------------------------------------------------------------------
// BlobValidationError — typed error for consumer error-handling
// ---------------------------------------------------------------------------

export class BlobValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "BlobValidationError"
  }
}

// ---------------------------------------------------------------------------
// BlobStore
// ---------------------------------------------------------------------------

export class BlobStore {
  /** Raw blob objects, keyed by blobId */
  private readonly blobs = new Map<BlobId, Blob>()

  /** Erasure-encoded shard sets, keyed by blobId */
  private readonly shardSets = new Map<BlobId, EncodedBlob>()

  /** Lifecycle registry: tracks hot/cold/pruned phase per blob */
  private readonly lifecycle = new Map<BlobId, BlobLifecycleEntry>()

  // ---------------------------------------------------------------------------
  // Write path
  // ---------------------------------------------------------------------------

  /**
   * Persist a blob in hot storage.
   *
   * The blob's `expiresAt` is auto-computed as `blockNumber + HOT_RETENTION_BLOCKS`
   * if not already set (i.e., equals 0).
   *
   * @throws {BlobValidationError} on duplicate ID or oversized payload
   */
  put(blob: Blob): Blob {
    if (this.blobs.has(blob.id)) {
      throw new BlobValidationError(`Blob ${blob.id} already exists in store`)
    }
    const decoded = Buffer.from(blob.data, "base64")
    if (decoded.byteLength > MAX_BLOB_SIZE_BYTES) {
      throw new BlobValidationError(
        `Blob ${blob.id} exceeds 128 KB limit: ${decoded.byteLength} bytes`
      )
    }

    const stored: Blob = {
      ...blob,
      expiresAt: blob.expiresAt === 0
        ? blob.blockNumber + HOT_RETENTION_BLOCKS
        : blob.expiresAt,
    }
    this.blobs.set(stored.id, stored)
    this.lifecycle.set(stored.id, {
      blobId: stored.id,
      phase: "hot",
      phaseStartBlock: stored.blockNumber,
    })
    return stored
  }

  /**
   * Store an erasure-encoded shard set alongside the blob.
   * Call after `put()` to attach shards for DAS/challenge use.
   *
   * @throws {BlobValidationError} if the blob has not been stored yet
   */
  putShards(encoded: EncodedBlob): void {
    if (!this.blobs.has(encoded.blobId)) {
      throw new BlobValidationError(
        `Cannot store shards: blob ${encoded.blobId} not found`
      )
    }
    this.shardSets.set(encoded.blobId, encoded)
  }

  // ---------------------------------------------------------------------------
  // Read path
  // ---------------------------------------------------------------------------

  /** Retrieve a raw blob by ID. Returns undefined if not found. */
  get(id: BlobId): Blob | undefined {
    return this.blobs.get(id)
  }

  /** Retrieve the encoded shard set for a blob. Returns undefined if not available. */
  getShards(id: BlobId): EncodedBlob | undefined {
    return this.shardSets.get(id)
  }

  /** Retrieve the lifecycle entry for a blob. Returns undefined if unknown. */
  getLifecycle(id: BlobId): BlobLifecycleEntry | undefined {
    return this.lifecycle.get(id)
  }

  /** Current storage phase for a blob */
  phase(id: BlobId): BlobPhase | undefined {
    return this.lifecycle.get(id)?.phase
  }

  // ---------------------------------------------------------------------------
  // Lifecycle transitions
  // ---------------------------------------------------------------------------

  /**
   * Transition blobs whose `expiresAt <= currentBlock` from "hot" to "cold".
   *
   * In production, this triggers an async archival job that:
   *   1. Computes the Merkle root of all shard checksums
   *   2. Writes that root to L1 via the `TreasuryEscrowContract`
   *   3. Removes raw bytes from hot storage
   *
   * Phase 1: performs the in-memory transition and sets archivedMerkleRoot.
   *
   * @returns Array of blobIds that were transitioned
   */
  archiveCold(currentBlock: number): BlobId[] {
    const archived: BlobId[] = []
    for (const [id, entry] of this.lifecycle) {
      if (entry.phase !== "hot") continue
      const blob = this.blobs.get(id)
      if (!blob || blob.expiresAt > currentBlock) continue

      const shards = this.shardSets.get(id)
      const merkleRoot: Hash256 = shards?.merkleRoot ?? ""

      this.lifecycle.set(id, {
        ...entry,
        phase: "cold",
        phaseStartBlock: currentBlock,
        archivedMerkleRoot: merkleRoot,
      })
      // Remove raw bytes from hot memory; shard set stays for retrieval challenges
      this.blobs.delete(id)
      archived.push(id)
    }
    return archived
  }

  /**
   * Fully evict "cold" blobs older than `coldRetentionBlocks` additional blocks
   * past their archival transition. Removes shards from memory entirely.
   *
   * @returns Array of blobIds that were evicted
   */
  evictCold(currentBlock: number, coldRetentionBlocks = 302_400): BlobId[] {
    const evicted: BlobId[] = []
    for (const [id, entry] of this.lifecycle) {
      if (entry.phase !== "cold") continue
      if (entry.phaseStartBlock + coldRetentionBlocks > currentBlock) continue
      this.lifecycle.set(id, { ...entry, phase: "pruned" })
      this.shardSets.delete(id)
      evicted.push(id)
    }
    return evicted
  }

  // ---------------------------------------------------------------------------
  // Diagnostic helpers
  // ---------------------------------------------------------------------------

  /** Number of blobs currently in hot storage */
  countHot(): number {
    return [...this.lifecycle.values()].filter((e) => e.phase === "hot").length
  }

  /** Total number of blobs tracked (any phase) */
  count(): number {
    return this.lifecycle.size
  }

  /** All blobIds in the given phase */
  ids(phase?: BlobPhase): BlobId[] {
    if (!phase) return [...this.lifecycle.keys()]
    return [...this.lifecycle.entries()]
      .filter(([, e]) => e.phase === phase)
      .map(([id]) => id)
  }
}
