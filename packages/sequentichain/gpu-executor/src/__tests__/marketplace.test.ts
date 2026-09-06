/**
 * @sequentichain/gpu-executor — Proving Marketplace Test Suite
 * Covers: ProviderRegistry, JobMarketplace (PM-1 through PM-5)
 */
import { describe, it, expect, beforeEach } from "vitest"
import { ProviderRegistry, MIN_PROVIDER_STAKE } from "../provider-registry.js"
import { JobMarketplace } from "../job-marketplace.js"
import { MarketplaceError } from "../marketplace-types.js"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let clock = 1_000_000

function makeRegistry() {
  clock = 1_000_000
  return new ProviderRegistry()
}

function makeMarketplace(registry: ProviderRegistry) {
  return new JobMarketplace(registry, undefined, () => clock)
}

function registerProvider(registry: ProviderRegistry, overrides: Partial<Parameters<ProviderRegistry["register"]>[0]> = {}) {
  return registry.register({
    name: "TestProvider",
    tier: "gpu-datacenter",
    stakeAmount: MIN_PROVIDER_STAKE,
    maxConcurrentJobs: 3,
    endpoint: "https://prover.test",
    slaDeadlineMs: 30_000,
    ...overrides,
  })
}

// ---------------------------------------------------------------------------
// PM-1: ProviderRegistry
// ---------------------------------------------------------------------------

describe("ProviderRegistry — PM-1", () => {
  it("registers a provider with minimum stake", () => {
    const registry = makeRegistry()
    const p = registerProvider(registry)
    expect(p.status).toBe("active")
    expect(p.stakeAmount).toBe(MIN_PROVIDER_STAKE)
    expect(registry.size).toBe(1)
  })

  it("throws INSUFFICIENT_STAKE below minimum", () => {
    const registry = makeRegistry()
    expect(() => registerProvider(registry, { stakeAmount: 1n }))
      .toThrow(MarketplaceError)
  })

  it("occupies and releases job slots", () => {
    const registry = makeRegistry()
    const p = registerProvider(registry, { maxConcurrentJobs: 2 })
    registry.occupySlot(p.providerId)
    expect(registry.get(p.providerId).activeJobCount).toBe(1)
    expect(registry.get(p.providerId).status).toBe("active")

    registry.occupySlot(p.providerId)
    expect(registry.get(p.providerId).status).toBe("busy")

    registry.releaseSlot(p.providerId)
    expect(registry.get(p.providerId).status).toBe("active")
    expect(registry.get(p.providerId).completedJobs).toBe(1)
  })

  it("throws PROVIDER_AT_CAPACITY when full", () => {
    const registry = makeRegistry()
    const p = registerProvider(registry, { maxConcurrentJobs: 1 })
    registry.occupySlot(p.providerId)
    expect(() => registry.occupySlot(p.providerId)).toThrow(MarketplaceError)
  })

  it("slashes stake and suspends below minimum after slash", () => {
    const registry = makeRegistry()
    const p = registerProvider(registry)
    registry.slash(p.providerId, MIN_PROVIDER_STAKE)  // slash full stake
    const updated = registry.get(p.providerId)
    expect(updated.stakeAmount).toBe(0n)
    expect(updated.status).toBe("suspended")
    expect(updated.slashedAmount).toBe(MIN_PROVIDER_STAKE)
  })

  it("listActive() returns only active/busy providers sorted by stake", () => {
    const registry = makeRegistry()
    const p1 = registerProvider(registry, { stakeAmount: 20_000_000_000n })
    const p2 = registerProvider(registry, { stakeAmount: 50_000_000_000n })
    registerProvider(registry, { stakeAmount: MIN_PROVIDER_STAKE })

    registry.update(p1.providerId, { status: "suspended" })
    const active = registry.listActive()
    expect(active[0]?.providerId).toBe(p2.providerId)  // highest stake first
    expect(active.some((p) => p.providerId === p1.providerId)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// PM-2: Job Lifecycle (post → bid → assign → deliver)
// ---------------------------------------------------------------------------

describe("JobMarketplace — PM-2 Job Lifecycle", () => {
  let registry: ProviderRegistry
  let marketplace: JobMarketplace
  let providerId: string

  beforeEach(() => {
    registry = makeRegistry()
    marketplace = makeMarketplace(registry)
    providerId = registerProvider(registry).providerId
  })

  it("posts a job with status=open", () => {
    const job = marketplace.postJob({
      circuitId: "transfer-v1",
      circuitType: "halo2",
      witnessBytes: "base64witness==",
      maxFee: 1_000n,
      deadlineMs: clock + 60_000,
      submittedBy: "seq-node-1",
    })
    expect(job.status).toBe("open")
    expect(job.assignedTo).toBeUndefined()
  })

  it("submit bid → auto-assign → deliver proof", () => {
    const job = marketplace.postJob({
      circuitId: "c1", circuitType: "halo2",
      witnessBytes: "w", maxFee: 500n,
      deadlineMs: clock + 60_000,
      submittedBy: "seq",
    })

    marketplace.submitBid(providerId, job.jobId, 300n, 5_000)
    const assigned = marketplace.assignBestBid(job.jobId)
    expect(assigned.status).toBe("assigned")
    expect(assigned.assignedTo).toBe(providerId)

    const escrow = marketplace.getEscrow(job.jobId)
    expect(escrow?.lockedAmount).toBe(300n)
    expect(escrow?.status).toBe("locked")

    const dist = marketplace.deliverProof(job.jobId, providerId, "proof==", { result: "1" })
    expect(dist.providerShare).toBe(210n)   // 70% of 300
    expect(dist.treasuryShare).toBe(90n)    // 30% of 300
    expect(marketplace.getJob(job.jobId).status).toBe("completed")
  })

  it("rejects bid exceeding maxFee", () => {
    const job = marketplace.postJob({
      circuitId: "c1", circuitType: "halo2",
      witnessBytes: "w", maxFee: 100n,
      deadlineMs: clock + 60_000,
      submittedBy: "seq",
    })
    expect(() => marketplace.submitBid(providerId, job.jobId, 200n, 1_000))
      .toThrow(MarketplaceError)
  })

  it("selects lowest bid price on auto-assign", () => {
    const p2 = registerProvider(registry, { name: "Cheap" }).providerId
    const job = marketplace.postJob({
      circuitId: "c1", circuitType: "plonky2",
      witnessBytes: "w", maxFee: 1_000n,
      deadlineMs: clock + 60_000,
      submittedBy: "seq",
    })
    marketplace.submitBid(providerId, job.jobId, 500n, 10_000)
    marketplace.submitBid(p2, job.jobId, 200n, 10_000)  // cheaper

    const assigned = marketplace.assignBestBid(job.jobId)
    expect(assigned.assignedTo).toBe(p2)
  })

  it("throws PROOF_ALREADY_DELIVERED on duplicate delivery", () => {
    const job = marketplace.postJob({
      circuitId: "c1", circuitType: "halo2",
      witnessBytes: "w", maxFee: 500n,
      deadlineMs: clock + 60_000,
      submittedBy: "seq",
    })
    marketplace.submitBid(providerId, job.jobId, 300n, 5_000)
    marketplace.assignBestBid(job.jobId)
    marketplace.deliverProof(job.jobId, providerId, "proof==", {})
    expect(() => marketplace.deliverProof(job.jobId, providerId, "proof2==", {}))
      .toThrow(MarketplaceError)
  })
})

// ---------------------------------------------------------------------------
// PM-3: SLA Enforcement
// ---------------------------------------------------------------------------

describe("JobMarketplace — PM-3 SLA", () => {
  let registry: ProviderRegistry
  let marketplace: JobMarketplace
  let providerId: string

  beforeEach(() => {
    clock = 1_000_000
    registry = makeRegistry()
    marketplace = makeMarketplace(registry)
    providerId = registerProvider(registry, { stakeAmount: MIN_PROVIDER_STAKE }).providerId
  })

  it("processExpiredDeadlines slashes provider on timeout", () => {
    const job = marketplace.postJob({
      circuitId: "c1", circuitType: "halo2",
      witnessBytes: "w", maxFee: 1_000n,
      deadlineMs: clock + 5_000,  // expires 5s from now
      submittedBy: "seq",
    })
    marketplace.submitBid(providerId, job.jobId, 1_000n, 3_000)
    marketplace.assignBestBid(job.jobId)

    // Advance clock past deadline
    clock += 10_000

    const violations = marketplace.processExpiredDeadlines()
    expect(violations).toHaveLength(1)
    expect(violations[0]?.reason).toBe("deadline_exceeded")

    const updatedJob = marketplace.getJob(job.jobId)
    expect(updatedJob.status).toBe("failed")

    const updatedProvider = registry.get(providerId)
    expect(updatedProvider.slashedAmount).toBeGreaterThan(0n)
  })

  it("reportInvalidProof slashes provider on bad proof", () => {
    const job = marketplace.postJob({
      circuitId: "c1", circuitType: "halo2",
      witnessBytes: "w", maxFee: 1_000n,
      deadlineMs: clock + 60_000,
      submittedBy: "seq",
    })
    marketplace.submitBid(providerId, job.jobId, 1_000n, 3_000)
    marketplace.assignBestBid(job.jobId)
    marketplace.deliverProof(job.jobId, providerId, "bad-proof==", {})

    const violation = marketplace.reportInvalidProof(job.jobId)
    expect(violation.reason).toBe("invalid_proof")
    expect(marketplace.getJob(job.jobId).status).toBe("failed")
  })

  it("suspends provider after 3 violations within rolling window", () => {
    // Re-register with a large stake so slash doesn't drain to 0 and cause stake-based suspension
    const bigRegistry = makeRegistry()
    const bigMp = makeMarketplace(bigRegistry)
    const bigProvider = bigRegistry.register({
      name: "BigStake",
      tier: "gpu-datacenter",
      stakeAmount: MIN_PROVIDER_STAKE * 1_000n,  // 10M VRQ — won't drain from 3×50% slashes
      maxConcurrentJobs: 10,
      endpoint: "https://big.prover",
    }).providerId

    for (let i = 0; i < 3; i++) {
      // Re-activate provider if needed (each loop it gets released from busy → active)
      const p = bigRegistry.get(bigProvider)
      if (p.status === "busy") bigRegistry.update(bigProvider, { status: "active" })

      const job = bigMp.postJob({
        circuitId: "c1", circuitType: "halo2",
        witnessBytes: "w", maxFee: 500n,
        deadlineMs: clock + 1_000,
        submittedBy: "seq",
      })
      bigMp.submitBid(bigProvider, job.jobId, 500n, 500)
      bigMp.assignBestBid(job.jobId)
      clock += 2_000  // push past deadline
      bigMp.processExpiredDeadlines()
    }
    expect(bigRegistry.get(bigProvider).status).toBe("suspended")
  })
})

// ---------------------------------------------------------------------------
// PM-4 + PM-5: Fee Distribution
// ---------------------------------------------------------------------------

describe("JobMarketplace — PM-4 Fee Distribution", () => {
  it("70/30 split is correct", () => {
    const registry = makeRegistry()
    const mp = makeMarketplace(registry)
    const p = registerProvider(registry).providerId

    const job = mp.postJob({
      circuitId: "c1", circuitType: "groth16",
      witnessBytes: "w", maxFee: 1_000n,
      deadlineMs: clock + 60_000,
      submittedBy: "seq",
    })
    mp.submitBid(p, job.jobId, 1_000n, 5_000)
    mp.assignBestBid(job.jobId)
    const dist = mp.deliverProof(job.jobId, p, "proof==", {})

    expect(dist.totalFee).toBe(1_000n)
    expect(dist.providerShare + dist.treasuryShare).toBe(1_000n)
    // 70% = 700, 30% = 300
    expect(dist.providerShare).toBe(700n)
    expect(dist.treasuryShare).toBe(300n)
  })
})
