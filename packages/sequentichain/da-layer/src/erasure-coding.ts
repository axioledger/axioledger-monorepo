/**
 * @file erasure-coding.ts
 * Erasure Coding Engine — Module 12.1
 *
 * Reed-Solomon 2D erasure coding: k=32 data shards, m=32 parity shards.
 * Any k-of-(k+m) shards can reconstruct the original data.
 *
 * Phase 1: Pure-TS implementation using XOR-based GF(2^8) simulation.
 *          Sufficient for deterministic tests and integration wiring.
 * Phase 2: Replace `_rsEncode` / `_rsDecode` with WASM binding to
 *          `leopard-rs` (a high-performance Rust RS library).
 *
 * Merkle tree over shard checksums provides per-shard proof for DAS.
 */
import { createHash } from "node:crypto"
import type {
  BlobId,
  EncodedBlob,
  ErasureConfig,
  Hash256,
  Shard,
} from "./types.js"
import { DEFAULT_ERASURE_CONFIG } from "./types.js"

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function sha256hex(data: string): Hash256 {
  return createHash("sha256").update(data, "utf8").digest("hex")
}

/**
 * Build a binary Merkle tree from an array of leaf hashes.
 * Returns an array where index 0 is the root.
 * Level-order layout: [root, left-child, right-child, …]
 */
function buildMerkleTree(leaves: readonly Hash256[]): Hash256[] {
  if (leaves.length === 0) return [""]
  const padded = [...leaves]
  // Pad to next power of two
  while ((padded.length & (padded.length - 1)) !== 0) {
    padded.push(padded[padded.length - 1] ?? "")
  }
  const tree: Hash256[] = new Array(padded.length * 2 - 1).fill("") as Hash256[]
  const offset = padded.length - 1
  for (let i = 0; i < padded.length; i++) tree[offset + i] = padded[i] ?? ""
  for (let i = offset - 1; i >= 0; i--) {
    tree[i] = sha256hex((tree[2 * i + 1] ?? "") + (tree[2 * i + 2] ?? ""))
  }
  return tree
}

/**
 * Generate a Merkle inclusion proof for leaf at `index` in an array of `total` leaves.
 * Returns the sibling hash path from leaf to root (exclusive of root).
 */
export function merkleProof(leaves: readonly Hash256[], index: number): Hash256[] {
  const tree = buildMerkleTree(leaves)
  // Nearest power of two >= leaves.length (tree leaf count)
  let size = 1
  while (size < leaves.length) size *= 2
  const offset = size - 1
  const proof: Hash256[] = []
  let pos = offset + index   // position of the target leaf in level-order tree array
  while (pos > 0) {
    // sibling: if pos is right child (even index in tree), sibling is to the left (pos-1)
    const sibling = pos % 2 === 0 ? pos - 1 : pos + 1
    proof.push(tree[sibling] ?? "")
    pos = Math.floor((pos - 1) / 2)   // move to parent
  }
  return proof
}

/**
 * Verify a Merkle inclusion proof.
 *
 * `index` is the 0-based leaf index (same as `shardIndex` passed to `merkleProof`).
 *
 * Tree layout (level-order): tree[0] = root.
 *   - Node at tree-pos p: left child = 2p+1, right child = 2p+2
 *   - Node at tree-pos p: if p is ODD  → it's a LEFT  child → sibling is p+1
 *                         if p is EVEN → it's a RIGHT child → sibling is p-1
 *
 * Hash convention (same as buildMerkleTree):
 *   parent = sha256( left_child_hash + right_child_hash )
 *   → if we're the left child (pos odd):  parent = sha256( hash + sibling )
 *   → if we're right child (pos even):    parent = sha256( sibling + hash )
 */
export function verifyMerkleProof(
  leaf: Hash256,
  proof: readonly Hash256[],
  index: number,
  root: Hash256,
): boolean {
  // Compute the tree-array position of this leaf (must match buildMerkleTree)
  let size = 1
  const totalLeaves = Math.pow(2, proof.length)   // proof length = tree depth
  while (size < totalLeaves) size *= 2
  const offset = size - 1

  let hash = leaf
  let pos = offset + index   // level-order position in the tree array
  for (const sibling of proof) {
    // pos odd  → left child  → parent = H(hash + sibling)
    // pos even → right child → parent = H(sibling + hash)
    hash = pos % 2 === 1 ? sha256hex(hash + sibling) : sha256hex(sibling + hash)
    pos = Math.floor((pos - 1) / 2)   // move to parent
  }
  return hash === root
}

// ---------------------------------------------------------------------------
// Phase-1 RS simulation: XOR-spread parity generation
// ---------------------------------------------------------------------------
// In Phase 1 we split data into k equal chunks and generate m parity chunks
// by XOR-folding pairs of data chunks.  This is NOT cryptographically sound
// RS; it exists only to wire up the data-flow pipeline so Phase 2 can drop
// in a real RS WASM codec without changing any call-sites.

function base64ToBytes(b64: string): Uint8Array {
  return Buffer.from(b64, "base64")
}

function bytesToBase64(buf: Uint8Array): string {
  return Buffer.from(buf).toString("base64")
}

function xorBuffers(a: Uint8Array, b: Uint8Array): Uint8Array {
  const len = Math.max(a.length, b.length)
  const out = new Uint8Array(len)
  for (let i = 0; i < len; i++) out[i] = (a[i] ?? 0) ^ (b[i] ?? 0)
  return out
}

function splitIntoChunks(buf: Uint8Array, k: number): Uint8Array[] {
  const chunkSize = Math.ceil(buf.length / k)
  const chunks: Uint8Array[] = []
  for (let i = 0; i < k; i++) {
    chunks.push(buf.slice(i * chunkSize, (i + 1) * chunkSize))
  }
  return chunks
}

/**
 * Phase-1 RS encode: split into k data chunks, generate m parity chunks by
 * circular XOR.
 */
function rsEncode(dataChunks: Uint8Array[], m: number): Uint8Array[] {
  const k = dataChunks.length
  const parity: Uint8Array[] = []
  for (let j = 0; j < m; j++) {
    let p = dataChunks[j % k] ?? new Uint8Array(0)
    for (let i = 1; i < k; i++) p = xorBuffers(p, dataChunks[(j + i) % k] ?? new Uint8Array(0))
    parity.push(p)
  }
  return parity
}

/**
 * Phase-1 RS decode: return the first k non-null shards concatenated.
 * In Phase 2 this is replaced by Galois-field matrix inversion.
 */
function rsDecode(shards: Array<Uint8Array | null>, k: number): Uint8Array {
  const dataShards = shards.filter((s): s is Uint8Array => s !== null).slice(0, k)
  const totalLen = dataShards.reduce((n, s) => n + s.length, 0)
  const out = new Uint8Array(totalLen)
  let offset = 0
  for (const s of dataShards) {
    out.set(s, offset)
    offset += s.length
  }
  return out
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export class ErasureCoder {
  private readonly cfg: Required<ErasureConfig>

  constructor(config: ErasureConfig = DEFAULT_ERASURE_CONFIG) {
    const { dataShards: k, parityShards: m } = config
    if (k < 1 || m < 1) throw new RangeError("dataShards and parityShards must be >= 1")
    if (k > 256 || m > 256) throw new RangeError("dataShards and parityShards must be <= 256")
    this.cfg = { dataShards: k, parityShards: m }
  }

  /**
   * Encode a blob's base64-encoded payload into (k + m) shards.
   *
   * @param blobId - Used only to populate EncodedBlob.blobId
   * @param base64Data - base64-encoded raw bytes of the blob
   * @returns EncodedBlob with shards and a Merkle root over shard checksums
   */
  encode(blobId: BlobId, base64Data: string): EncodedBlob {
    const { dataShards: k, parityShards: m } = this.cfg
    const raw = base64ToBytes(base64Data)
    const dataChunkBufs = splitIntoChunks(raw, k)
    const parityChunkBufs = rsEncode(dataChunkBufs, m)

    const shards: Shard[] = []
    for (let i = 0; i < k; i++) {
      const data = bytesToBase64(dataChunkBufs[i] ?? new Uint8Array(0))
      shards.push({ index: i, isData: true, data, checksum: sha256hex(data) })
    }
    for (let i = 0; i < m; i++) {
      const data = bytesToBase64(parityChunkBufs[i] ?? new Uint8Array(0))
      shards.push({ index: k + i, isData: false, data, checksum: sha256hex(data) })
    }

    const leaves = shards.map((s) => s.checksum)
    const tree = buildMerkleTree(leaves)
    const merkleRoot = tree[0] ?? ""

    return { blobId, shards, dataShards: k, parityShards: m, merkleRoot }
  }

  /**
   * Reconstruct the original base64-encoded payload from any k-or-more shards.
   * Missing shards should be passed as null.
   *
   * @param encoded - The EncodedBlob (shards may be partially null)
   * @param available - Map of shardIndex → Shard for the available shards
   */
  decode(encoded: Pick<EncodedBlob, "dataShards" | "parityShards">, available: Map<number, Shard>): string {
    const { dataShards: k } = encoded
    if (available.size < k) {
      throw new Error(
        `Insufficient shards for recovery: have ${available.size}, need ${k}`
      )
    }
    const shardBufs: Array<Uint8Array | null> = Array.from(
      { length: k + encoded.parityShards },
      (_, i) => {
        const s = available.get(i)
        return s ? base64ToBytes(s.data) : null
      }
    )
    const recovered = rsDecode(shardBufs, k)
    return bytesToBase64(recovered)
  }

  /**
   * Generate a Merkle inclusion proof for a specific shard index.
   * Verifiers use this to confirm a shard belongs to a committed root
   * without downloading all shards.
   */
  generateProof(encoded: EncodedBlob, shardIndex: number): readonly Hash256[] {
    const leaves = encoded.shards.map((s) => s.checksum)
    return merkleProof(leaves, shardIndex)
  }

  get dataShards(): number { return this.cfg.dataShards }
  get parityShards(): number { return this.cfg.parityShards }
  get totalShards(): number { return this.cfg.dataShards + this.cfg.parityShards }
}
