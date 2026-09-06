/**
 * @file job-marketplace.ts
 * PM-2 + PM-3 + PM-4 + PM-5 — Proving Job Lifecycle
 *
 * Orchestrates: job posting → bidding → assignment → proof delivery
 *               → fee distribution → escrow settlement / slashing
 */
import { randomUUID } from "node:crypto"
import type {
  CircuitType,
  EscrowRecord,
  EscrowStatus,
  FeeDistribution,
  JobId,
  JobStatus,
  MicroVRQ,
  ProviderBid,
  ProviderId,
  ProofJob,
  SlaConfig,
  SlaViolation,
  SlaViolationReason,
} from "./marketplace-types.js"
import {
  DEFAULT_SLA_CONFIG,
  MarketplaceError,
  PROVIDER_FEE_SHARE,
  TREASURY_FEE_SHARE,
} from "./marketplace-types.js"
import { ProviderRegistry } from "./provider-registry.js"

// ---------------------------------------------------------------------------
// PostJobParams
// ---------------------------------------------------------------------------

export interface PostJobParams {
  circuitId: string
  circuitType: CircuitType
  witnessBytes: string
  /** Maximum fee submitter will pay (μVRQ) */
  maxFee: MicroVRQ
  /** Absolute proof deadline (UNIX ms) */
  deadlineMs: number
  submittedBy: string
}

// ---------------------------------------------------------------------------
// JobMarketplace
// ---------------------------------------------------------------------------

export class JobMarketplace {
  private readonly jobs     = new Map<JobId, ProofJob>()
  private readonly bids     = new Map<JobId, ProviderBid[]>()
  private readonly escrows  = new Map<JobId, EscrowRecord>()
  private readonly feeHistory: FeeDistribution[] = []
  private readonly violations: SlaViolation[] = []

  constructor(
    private readonly registry: ProviderRegistry,
    private readonly slaConfig: SlaConfig = DEFAULT_SLA_CONFIG,
    /** Simulated "now" function — injectable for deterministic tests */
    private readonly nowMs: () => number = () => Date.now(),
  ) {}

  // -------------------------------------------------------------------------
  // PM-2: Job Posting
  // -------------------------------------------------------------------------

  /**
   * Post a new proof job to the marketplace.
   * The job is open for bids until `deadlineMs` or until manually assigned.
   */
  postJob(params: PostJobParams): ProofJob {
    const jobId = randomUUID()
    const job: ProofJob = {
      jobId,
      circuitId:     params.circuitId,
      circuitType:   params.circuitType,
      witnessBytes:  params.witnessBytes,
      maxFee:        params.maxFee,
      deadlineMs:    params.deadlineMs,
      status:        "open",
      assignedTo:    undefined,
      createdAt:     this.nowMs(),
      completedAt:   undefined,
      proofBytes:    undefined,
      publicSignals: undefined,
      submittedBy:   params.submittedBy,
    }
    this.jobs.set(jobId, job)
    this.bids.set(jobId, [])
    return job
  }

  getJob(jobId: JobId): ProofJob {
    const job = this.jobs.get(jobId)
    if (!job) throw new MarketplaceError(`Job "${jobId}" not found`, "JOB_NOT_FOUND", jobId)
    return job
  }

  // -------------------------------------------------------------------------
  // PM-2: Bidding
  // -------------------------------------------------------------------------

  /**
   * A provider submits a bid on an open job.
   *
   * @throws {MarketplaceError} JOB_NOT_OPEN if the job is not open for bids
   * @throws {MarketplaceError} BID_EXCEEDS_MAX_FEE if bidPrice > job.maxFee
   * @throws {MarketplaceError} PROVIDER_SUSPENDED / PROVIDER_AT_CAPACITY
   */
  submitBid(providerId: ProviderId, jobId: JobId, bidPrice: MicroVRQ, estimatedProofMs: number): ProviderBid {
    const job = this.getJob(jobId)
    if (job.status !== "open") {
      throw new MarketplaceError(`Job "${jobId}" is not open (status: ${job.status})`, "JOB_NOT_OPEN", jobId, providerId)
    }
    if (bidPrice > job.maxFee) {
      throw new MarketplaceError(
        `Bid ${bidPrice} μVRQ exceeds job max fee ${job.maxFee} μVRQ`,
        "BID_EXCEEDS_MAX_FEE", jobId, providerId,
      )
    }
    // Validate provider is eligible (throws if suspended/at-capacity)
    const provider = this.registry.get(providerId)
    if (provider.status === "suspended" || provider.status === "slashed") {
      throw new MarketplaceError(`Provider "${providerId}" is ${provider.status}`, "PROVIDER_SUSPENDED", jobId, providerId)
    }

    const bid: ProviderBid = {
      jobId,
      providerId,
      bidPrice,
      estimatedProofMs,
      bidAt: this.nowMs(),
    }
    const jobBids = this.bids.get(jobId) ?? []
    jobBids.push(bid)
    this.bids.set(jobId, jobBids)
    return bid
  }

  getBids(jobId: JobId): ProviderBid[] {
    return this.bids.get(jobId) ?? []
  }

  // -------------------------------------------------------------------------
  // PM-2: Assignment (best-bid auto-select)
  // -------------------------------------------------------------------------

  /**
   * Auto-assign the job to the best bid:
   *   1. Lowest bid price wins (cost efficiency)
   *   2. Tie-break: lowest estimatedProofMs
   *
   * Locks per-job escrow on the submitter's $VRQ.
   */
  assignBestBid(jobId: JobId): ProofJob {
    const job = this.getJob(jobId)
    if (job.status !== "open") {
      throw new MarketplaceError(`Job "${jobId}" is not open`, "JOB_NOT_OPEN", jobId)
    }
    const bids = this.bids.get(jobId) ?? []
    if (bids.length === 0) {
      throw new MarketplaceError(`No bids for job "${jobId}"`, "JOB_NOT_OPEN", jobId)
    }

    // Sort: lowest price, then lowest estimated time
    const best = [...bids].sort((a, b) => {
      if (a.bidPrice !== b.bidPrice) return a.bidPrice < b.bidPrice ? -1 : 1
      return a.estimatedProofMs - b.estimatedProofMs
    })[0]!

    this.registry.occupySlot(best.providerId)

    job.status = "assigned"
    job.assignedTo = best.providerId

    // Lock escrow
    this.escrows.set(jobId, {
      jobId,
      providerId: best.providerId,
      lockedAmount: best.bidPrice,
      status: "locked",
      lockedAt: this.nowMs(),
      settledAt: undefined,
    })

    return job
  }

  /**
   * Manually assign a job to a specific provider (admin/direct-hire path).
   */
  assignDirectly(jobId: JobId, providerId: ProviderId, agreedFee: MicroVRQ): ProofJob {
    const job = this.getJob(jobId)
    if (job.status !== "open") throw new MarketplaceError(`Job "${jobId}" is not open`, "JOB_NOT_OPEN", jobId)

    this.registry.occupySlot(providerId)
    job.status = "assigned"
    job.assignedTo = providerId
    this.escrows.set(jobId, {
      jobId,
      providerId,
      lockedAmount: agreedFee,
      status: "locked",
      lockedAt: this.nowMs(),
      settledAt: undefined,
    })
    return job
  }

  // -------------------------------------------------------------------------
  // PM-2: Proof Delivery
  // -------------------------------------------------------------------------

  /**
   * Provider delivers the completed proof.
   *
   * Steps:
   *   1. Validate deadline not passed
   *   2. Mark job completed
   *   3. Release escrow → trigger fee distribution (70/30)
   */
  deliverProof(
    jobId: JobId,
    providerId: ProviderId,
    proofBytes: string,
    publicSignals: Record<string, string>,
  ): FeeDistribution {
    const job = this.getJob(jobId)
    const now = this.nowMs()

    if (job.status === "completed") {
      throw new MarketplaceError(`Job "${jobId}" proof already delivered`, "PROOF_ALREADY_DELIVERED", jobId, providerId)
    }
    if (job.assignedTo !== providerId) {
      throw new MarketplaceError(`Provider "${providerId}" is not assigned to job "${jobId}"`, "JOB_NOT_FOUND", jobId, providerId)
    }
    if (now > job.deadlineMs) {
      // Mark as failed — SLA engine will slash
      job.status = "failed"
      this._recordViolation(jobId, providerId, "deadline_exceeded", now)
      throw new MarketplaceError(`Job "${jobId}" deadline passed`, "DEADLINE_PASSED", jobId, providerId)
    }

    job.status = "completed"
    job.proofBytes = proofBytes
    job.publicSignals = publicSignals
    job.completedAt = now

    this.registry.releaseSlot(providerId)

    return this._settleEscrow(jobId, "released")
  }

  // -------------------------------------------------------------------------
  // PM-3: SLA Enforcement
  // -------------------------------------------------------------------------

  /**
   * Scan all assigned/proving jobs and process expired deadlines.
   * Call periodically (e.g., on each new L2 block).
   *
   * @returns Array of SlaViolations recorded in this sweep
   */
  processExpiredDeadlines(): SlaViolation[] {
    const now = this.nowMs()
    const newViolations: SlaViolation[] = []

    for (const job of this.jobs.values()) {
      if ((job.status === "assigned" || job.status === "proving") && now > job.deadlineMs) {
        job.status = "failed"
        if (job.assignedTo) {
          const v = this._recordViolation(job.jobId, job.assignedTo, "deadline_exceeded", now)
          newViolations.push(v)
          this.registry.releaseSlot(job.assignedTo)  // free up capacity regardless
        }
      }
    }
    return newViolations
  }

  /** Mark a job as failed due to invalid proof (after on-chain verification fails). */
  reportInvalidProof(jobId: JobId): SlaViolation {
    const job = this.getJob(jobId)
    if (job.status !== "completed" || !job.assignedTo) {
      throw new MarketplaceError(`Job "${jobId}" cannot report invalid proof in state ${job.status}`, "JOB_NOT_FOUND", jobId)
    }
    job.status = "failed"
    job.proofBytes = undefined
    return this._recordViolation(jobId, job.assignedTo, "invalid_proof", this.nowMs())
  }

  getAllViolations(): SlaViolation[] { return [...this.violations] }
  getViolationsFor(providerId: ProviderId): SlaViolation[] {
    return this.violations.filter((v) => v.providerId === providerId)
  }

  // -------------------------------------------------------------------------
  // PM-4 + PM-5: Fee Distribution & Escrow
  // -------------------------------------------------------------------------

  getFeeHistory(): FeeDistribution[] { return [...this.feeHistory] }
  getEscrow(jobId: JobId): EscrowRecord | undefined { return this.escrows.get(jobId) }

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  private _slashAmount(reason: SlaViolationReason, lockedAmount: MicroVRQ): MicroVRQ {
    const pct =
      reason === "deadline_exceeded"  ? this.slaConfig.deadlineSlashPct :
      reason === "invalid_proof"      ? this.slaConfig.invalidProofSlashPct :
                                        this.slaConfig.offlineSlashPct
    return (lockedAmount * BigInt(pct)) / 100n
  }

  private _recordViolation(
    jobId: JobId,
    providerId: ProviderId,
    reason: SlaViolationReason,
    now: number,
  ): SlaViolation {
    const escrow = this.escrows.get(jobId)
    const locked = escrow?.lockedAmount ?? 0n
    const slashAmount = this._slashAmount(reason, locked)

    // Slash provider's stake
    this.registry.slash(providerId, slashAmount)

    // Mark escrow as slashed
    if (escrow) {
      escrow.status = "slashed"
      escrow.settledAt = now
    }

    // Check rolling violation count → auto-suspend
    const windowStart = now - this.slaConfig.rollingWindowMs
    const recentCount = this.violations.filter(
      (v) => v.providerId === providerId && v.detectedAt >= windowStart
    ).length + 1  // +1 for current violation

    if (recentCount >= this.slaConfig.suspendAfterViolations) {
      this.registry.update(providerId, { status: "suspended" })
    }

    const violation: SlaViolation = {
      violationId: randomUUID(),
      jobId,
      providerId,
      reason,
      slashAmount,
      detectedAt: now,
    }
    this.violations.push(violation)
    return violation
  }

  private _settleEscrow(jobId: JobId, newStatus: EscrowStatus): FeeDistribution {
    const escrow = this.escrows.get(jobId)
    const job = this.jobs.get(jobId)
    if (!escrow || !job?.assignedTo) {
      throw new MarketplaceError(`Cannot settle escrow for job "${jobId}"`, "JOB_NOT_FOUND", jobId)
    }

    escrow.status = newStatus
    escrow.settledAt = this.nowMs()

    const total = escrow.lockedAmount
    const providerShare = (total * BigInt(Math.round(PROVIDER_FEE_SHARE * 1000))) / 1000n
    const treasuryShare = total - providerShare

    const dist: FeeDistribution = {
      jobId,
      totalFee: total,
      providerShare,
      treasuryShare,
      providerId: job.assignedTo,
      distributedAt: this.nowMs(),
    }
    this.feeHistory.push(dist)
    return dist
  }
}
