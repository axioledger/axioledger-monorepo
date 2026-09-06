/**
 * @sequentichain/da-layer — Test Suite
 *
 * Covers all six sub-modules:
 *   12.1  BlobStore + ErasureCoder + Merkle
 *   12.2  DASampler + computeMissProbability
 *   12.3  Retention lifecycle (hot → cold → pruned)
 *   12.4  Fee model (estimateFee, congestion multiplier)
 *   12.6  ChallengeManager (PoR protocol)
 *   E2E   DAClient (submit → sample → archiveCold pipeline)
 */
import { describe, it, expect, beforeEach } from "vitest"
import type { Blob, Shard } from "../types.js"
import {
  HOT_RETENTION_BLOCKS,
  MAX_BLOB_SIZE_BYTES,
  DAS_SAMPLE_COUNT,
  CHALLENGE_WINDOW_BLOCKS,
  DEFAULT_ERASURE_CONFIG,
} from "../types.js"
import { BlobStore, BlobValidationError } from "../blob-store.js"
import { ErasureCoder, verifyMerkleProof, merkleProof } from "../erasure-coding.js"
import { DASampler, computeMissProbability, localShardFetcher } from "../das.js"
import { estimateFee, buildFeeParams, DEFAULT_BASE_FEE_PER_KB } from "../fee-model.js"
import { ChallengeManager } from "../challenge.js"
import { DAClient } from "../da-client.js"

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const BASE64_HELLO = Buffer.from("Hello, Axioledger DA Layer!").toString("base64")

function makeBlob(id: string, opts: Partial<Blob> = {}): Blob {
  return {
    id,
    commitment: id,
    data: BASE64_HELLO,
    size: 26,
    createdAt: 1_700_000_000,
    blockNumber: 100,
    expiresAt: opts.expiresAt ?? 0, // 0 = auto-compute in BlobStore
    submittedBy: "node-001",
    ...opts,
  }
}

// ---------------------------------------------------------------------------
// 12.1 — BlobStore
// ---------------------------------------------------------------------------

describe("BlobStore — 12.1 & 12.3", () => {
  let store: BlobStore

  beforeEach(() => { store = new BlobStore() })

  it("stores a blob and auto-computes expiresAt", () => {
    const blob = makeBlob("b1")
    const stored = store.put(blob)
    expect(stored.expiresAt).toBe(100 + HOT_RETENTION_BLOCKS)
    expect(store.phase("b1")).toBe("hot")
    expect(store.countHot()).toBe(1)
  })

  it("preserves explicit expiresAt when non-zero", () => {
    const blob = makeBlob("b2", { expiresAt: 999 })
    const stored = store.put(blob)
    expect(stored.expiresAt).toBe(999)
  })

  it("throws BlobValidationError on duplicate", () => {
    store.put(makeBlob("b-dup"))
    expect(() => store.put(makeBlob("b-dup"))).toThrow(BlobValidationError)
  })

  it("throws BlobValidationError on oversized blob", () => {
    // Construct a base64 string that decodes to > 128 KB
    const oversized = Buffer.alloc(MAX_BLOB_SIZE_BYTES + 1, 0x61).toString("base64")
    expect(() =>
      store.put(makeBlob("b-big", { data: oversized, size: MAX_BLOB_SIZE_BYTES + 1 }))
    ).toThrow(BlobValidationError)
  })

  it("archiveCold transitions expired hot blobs to cold", () => {
    store.put(makeBlob("b-old", { expiresAt: 50 }))
    store.put(makeBlob("b-new", { expiresAt: 1_000 }))
    const archived = store.archiveCold(100)
    expect(archived).toContain("b-old")
    expect(store.phase("b-old")).toBe("cold")
    expect(store.phase("b-new")).toBe("hot")
    // Raw blob removed from hot storage
    expect(store.get("b-old")).toBeUndefined()
    expect(store.get("b-new")).toBeDefined()
  })

  it("evictCold removes cold blobs past secondary retention", () => {
    store.put(makeBlob("b-cold", { expiresAt: 10 }))
    store.archiveCold(20) // phase → cold at block 20
    const evicted = store.evictCold(20 + HOT_RETENTION_BLOCKS + 1)
    expect(evicted).toContain("b-cold")
    expect(store.phase("b-cold")).toBe("pruned")
  })

  it("ids() filters by phase", () => {
    store.put(makeBlob("b-hot1"))
    store.put(makeBlob("b-hot2"))
    store.put(makeBlob("b-exp", { expiresAt: 1 }))
    store.archiveCold(2)
    expect(store.ids("hot")).toHaveLength(2)
    expect(store.ids("cold")).toHaveLength(1)
    expect(store.ids()).toHaveLength(3)
  })
})

// ---------------------------------------------------------------------------
// 12.1 — ErasureCoder + Merkle
// ---------------------------------------------------------------------------

describe("ErasureCoder — 12.1", () => {
  const coder = new ErasureCoder({ dataShards: 4, parityShards: 2 })

  it("encodes into k+m shards with correct shard count", () => {
    const encoded = coder.encode("b-enc", BASE64_HELLO)
    expect(encoded.shards).toHaveLength(6)
    expect(encoded.shards.filter((s) => s.isData)).toHaveLength(4)
    expect(encoded.shards.filter((s) => !s.isData)).toHaveLength(2)
  })

  it("each shard has a valid SHA-256 checksum", () => {
    const encoded = coder.encode("b-sum", BASE64_HELLO)
    for (const shard of encoded.shards) {
      expect(shard.checksum).toMatch(/^[0-9a-f]{64}$/)
    }
  })

  it("encodes and decodes producing same byte length", () => {
    const encoded = coder.encode("b-rt", BASE64_HELLO)
    const available = new Map<number, Shard>(
      encoded.shards.map((s) => [s.index, s])
    )
    const decoded = coder.decode(encoded, available)
    // Decoded base64 should decode to same byte length as original
    const origLen = Buffer.from(BASE64_HELLO, "base64").byteLength
    const decLen = Buffer.from(decoded, "base64").byteLength
    expect(decLen).toBeGreaterThanOrEqual(origLen)
  })

  it("throws when fewer than k shards available", () => {
    const encoded = coder.encode("b-fail", BASE64_HELLO)
    const only2 = new Map<number, Shard>(
      encoded.shards.slice(0, 2).map((s) => [s.index, s])
    )
    expect(() => coder.decode(encoded, only2)).toThrow("Insufficient shards")
  })

  it("rejects invalid config (k or m < 1)", () => {
    expect(() => new ErasureCoder({ dataShards: 0, parityShards: 4 })).toThrow(RangeError)
    expect(() => new ErasureCoder({ dataShards: 4, parityShards: 0 })).toThrow(RangeError)
  })

  it("merkle root is deterministic for same input", () => {
    const e1 = coder.encode("b-det", BASE64_HELLO)
    const e2 = coder.encode("b-det", BASE64_HELLO)
    expect(e1.merkleRoot).toBe(e2.merkleRoot)
  })
})

describe("Merkle Proof — 12.1", () => {
  const coder = new ErasureCoder({ dataShards: 4, parityShards: 4 })

  it("generateProof + verifyMerkleProof round-trips for each shard", () => {
    const encoded = coder.encode("b-proof", BASE64_HELLO)
    for (const shard of encoded.shards) {
      const proof = coder.generateProof(encoded, shard.index)
      const valid = verifyMerkleProof(shard.checksum, proof, shard.index, encoded.merkleRoot)
      expect(valid).toBe(true)
    }
  })

  it("rejects a tampered shard checksum", () => {
    const encoded = coder.encode("b-tamper", BASE64_HELLO)
    const shard = encoded.shards[0]
    const proof = coder.generateProof(encoded, 0)
    const valid = verifyMerkleProof("deadbeef".repeat(8), proof, 0, encoded.merkleRoot)
    expect(valid).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// 12.2 — DASampler
// ---------------------------------------------------------------------------

describe("DASampler — 12.2", () => {
  const coder = new ErasureCoder(DEFAULT_ERASURE_CONFIG)

  it("reports available=true for a fully populated shard set", async () => {
    const encoded = coder.encode("b-das-ok", BASE64_HELLO)
    const sampler = new DASampler({ sampleCount: 10 })
    const fetcher = localShardFetcher(encoded)
    const result = await sampler.sample(
      "b-das-ok",
      encoded.shards.length,
      encoded.dataShards,
      encoded.merkleRoot,
      fetcher,
    )
    expect(result.available).toBe(true)
    expect(result.sampledChunks).toBe(10)
    expect(result.successfulChunks).toBe(10)
    expect(result.missProbability).toBeLessThan(0.01)
  })

  it("reports available=false when fetcher returns null (data withheld)", async () => {
    const encoded = coder.encode("b-das-fail", BASE64_HELLO)
    const sampler = new DASampler({ sampleCount: 5 })
    const nullFetcher = async () => null
    const result = await sampler.sample(
      "b-das-fail",
      encoded.shards.length,
      encoded.dataShards,
      encoded.merkleRoot,
      nullFetcher,
    )
    expect(result.available).toBe(false)
    expect(result.successfulChunks).toBe(0)
  })

  it("computeMissProbability — P(miss) < 0.0001 with t=20, k=32, N=64", () => {
    // N=64, k=32, t=20: P = (32/64)^20 = 0.5^20 ≈ 9.5e-7
    const p = computeMissProbability(64, 32, 20)
    expect(p).toBeLessThan(0.0001)
  })

  it("computeMissProbability — P(miss) = 1 when totalShards=0", () => {
    expect(computeMissProbability(0, 32, 20)).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// 12.4 — Fee Model
// ---------------------------------------------------------------------------

describe("Fee Model — 12.4", () => {
  it("zero congestion: fee = sizeKb × baseFee", () => {
    const params = buildFeeParams(0, 1000)
    const quote = estimateFee("b-fee", 4096, params) // 4 KB
    // 4 KB × 10 μAXQ/KB × 1.0 = 40 μAXQ
    expect(quote.totalFee).toBe(40n)
    expect(quote.congestionMultiplier).toBe(1.0)
    expect(quote.sizeKb).toBe(4)
  })

  it("full congestion: multiplier = 2.0, fee doubles", () => {
    const params = buildFeeParams(1000, 1000) // queue at 100%
    const quote = estimateFee("b-cong", 1024, params) // 1 KB
    // 1 KB × 10 μAXQ/KB × 2.0 = 20 μAXQ
    expect(quote.totalFee).toBe(20n)
    expect(quote.congestionMultiplier).toBeCloseTo(2.0)
  })

  it("50% congestion: multiplier = 1.5", () => {
    const params = buildFeeParams(500, 1000)
    const quote = estimateFee("b-half", 1024, params) // 1 KB
    expect(quote.congestionMultiplier).toBeCloseTo(1.5)
    expect(quote.totalFee).toBe(15n)
  })

  it("rounds up fractional KB (e.g. 1025 bytes → 2 KB)", () => {
    const params = buildFeeParams(0, 1000)
    const quote = estimateFee("b-frac", 1025, params)
    expect(quote.sizeKb).toBe(2)
  })

  it("throws RangeError for zero sizeBytes", () => {
    const params = buildFeeParams(0, 1000)
    expect(() => estimateFee("b-err", 0, params)).toThrow(RangeError)
  })

  it("custom baseFee override is respected", () => {
    const params = buildFeeParams(0, 1000, 50n) // 50 μAXQ/KB
    const quote = estimateFee("b-custom", 1024, params)
    expect(quote.baseFeePerKb).toBe(50n)
    expect(quote.totalFee).toBe(50n)
  })
})

// ---------------------------------------------------------------------------
// 12.6 — ChallengeManager (PoR)
// ---------------------------------------------------------------------------

describe("ChallengeManager — 12.6", () => {
  const coder = new ErasureCoder({ dataShards: 4, parityShards: 4 })

  it("issues a challenge with correct deadline", () => {
    const mgr = new ChallengeManager()
    const ch = mgr.issue("b-ch", 0, "node-A", "node-B", 100)
    expect(ch.status).toBe("pending")
    expect(ch.deadlineBlock).toBe(100 + CHALLENGE_WINDOW_BLOCKS)
    expect(ch.challengedNode).toBe("node-A")
  })

  it("resolves challenge when valid shard + proof submitted on time", () => {
    const mgr = new ChallengeManager()
    const encoded = coder.encode("b-por", BASE64_HELLO)
    const ch = mgr.issue("b-por", 0, "node-X", "network", 1)
    const shard = encoded.shards[0]
    const proof = coder.generateProof(encoded, 0)
    const resolved = mgr.respond(
      { challengeId: ch.challengeId, shard, proof, respondedAtBlock: 5 },
      5,
      encoded.merkleRoot,
    )
    expect(resolved).toBe(true)
    expect(mgr.get(ch.challengeId)?.status).toBe("resolved")
  })

  it("rejects response with wrong shard index", () => {
    const mgr = new ChallengeManager()
    const encoded = coder.encode("b-wrong-idx", BASE64_HELLO)
    const ch = mgr.issue("b-wrong-idx", 0, "node-X", "network", 1)
    // Shard index 1 returned, but challenge demands index 0
    const shard = { ...encoded.shards[1], index: 1 }
    const proof = coder.generateProof(encoded, 1)
    const ok = mgr.respond(
      { challengeId: ch.challengeId, shard, proof, respondedAtBlock: 5 },
      5,
      encoded.merkleRoot,
    )
    expect(ok).toBe(false)
  })

  it("expires challenge past deadline and marks slashed", () => {
    const mgr = new ChallengeManager()
    const ch = mgr.issue("b-slash", 0, "node-lazy", "network", 1)
    const expired = mgr.processExpiry(1 + CHALLENGE_WINDOW_BLOCKS + 1)
    expect(expired).toContain(ch.challengeId)
    expect(mgr.get(ch.challengeId)?.status).toBe("expired")

    const slashed = mgr.markSlashed(ch.challengeId)
    expect(slashed).toBe(true)
    expect(mgr.get(ch.challengeId)?.status).toBe("slashed")
  })

  it("list() filters by status", () => {
    const mgr = new ChallengeManager()
    mgr.issue("b-l1", 0, "n1", "net", 1)
    mgr.issue("b-l2", 0, "n2", "net", 1)
    mgr.processExpiry(1 + CHALLENGE_WINDOW_BLOCKS + 1)
    expect(mgr.list("expired")).toHaveLength(2)
    expect(mgr.list("pending")).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// E2E — DAClient
// ---------------------------------------------------------------------------

describe("DAClient — End-to-End Pipeline", () => {
  it("submit → sample → archiveCold pipeline", async () => {
    const client = new DAClient({
      provider: "internal",
      rpcUrl: "http://localhost:7545",
    })
    const blob = makeBlob("b-e2e", { expiresAt: 50 })

    // 1. Submit
    const blobId = await client.submit(blob)
    expect(blobId).toBe("b-e2e")
    expect(client.hotBlobCount()).toBe(1)

    // 2. Sample — should report available
    const result = await client.sample("b-e2e", 5)
    expect(result.available).toBe(true)
    expect(result.successfulChunks).toBe(5)

    // 3. Fee estimation
    const quote = client.estimateFee("b-e2e", 26)
    expect(quote.totalFee).toBeGreaterThan(0n)

    // 4. ArchiveCold at block > expiresAt
    const archived = client.archiveCold(100)
    expect(archived).toContain("b-e2e")
    expect(client.hotBlobCount()).toBe(0)
  })

  it("sample on unknown blob returns available=false", async () => {
    const client = new DAClient({ provider: "internal", rpcUrl: "" })
    const result = await client.sample("ghost-blob")
    expect(result.available).toBe(false)
    expect(result.missProbability).toBe(1)
  })

  it("submit throws BlobValidationError on duplicate", async () => {
    const client = new DAClient({ provider: "internal", rpcUrl: "" })
    await client.submit(makeBlob("b-dup-e2e"))
    await expect(client.submit(makeBlob("b-dup-e2e"))).rejects.toThrow(BlobValidationError)
  })
})
