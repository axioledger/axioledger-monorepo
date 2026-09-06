/**
 * @file types.ts
 * @sequentichain/proving-marketplace — Core types
 *
 * Proving Marketplace: external GPU/FPGA providers bid on ZK-proof generation
 * jobs, lock $VRQ escrow per job, and get slashed on SLA breach.
 *
 * Modules:
 *   PM-1  Provider Registry — register, stake $VRQ, set capacity
 *   PM-2  Job Auction       — ask/bid price discovery, job assignment
 *   PM-3  SLA Contract      — deadline tracking, slash on timeout
 *   PM-4  Fee Distribution  — 70% provider / 30% treasury
 *   PM-5  Escrow            — per-job $VRQ lock/release/slash
 */

// ---------------------------------------------------------------------------
// Identifiers
// ---------------------------------------------------------------------------

/** Hex-encoded public key of a Proving Provider */
export type ProviderId = string

/** Unique job identifier (UUID v4) */
export type JobId = string

/** Token amount in micro-VRQ (1 VRQ = 1_000_000 μVRQ) */
export type MicroVRQ = bigint

// ---------------------------------------------------------------------------
// PM-1 — Provider Registry
// ---------------------------------------------------------------------------

export type ProviderStatus = "active" | "busy" | "suspended" | "slashed" | "exited"

/** Hardware tier classification for providers */
export type HardwareTier =
  | "gpu-consumer"     // RTX 30xx/40xx class — light ZK circuits
  | "gpu-datacenter"   // A100/H100 class — production Halo2/Plonky2
  | "fpga"             // FPGA accelerator — ultra-low latency

/**
 * A registered proving provider.
 * Providers stake $VRQ as collateral; slashed on SLA breach.
 */
export interface ProviderRecord {
  providerId: ProviderId
  /** Display name for marketplace UI */
  name: string
  tier: HardwareTier
  /** Staked $VRQ in micro-VRQ (minimum: 10_000 VRQ = 10_000_000_000 μVRQ) */
  stakeAmount: MicroVRQ
  /** Maximum concurrent jobs this provider can handle */
  maxConcurrentJobs: number
  /** Currently active job count */
  activeJobCount: number
  /** Cumulative slashed amount in μVRQ */
  slashedAmount: MicroVRQ
  status: ProviderStatus
  /** UNIX timestamp (ms) when provider registered */
  registeredAt: number
  /** Provider's P2P endpoint for direct job delivery */
  endpoint: string
  /** SLA: maximum milliseconds the provider guarantees for proof generation */
  slaDeadlineMs: number
  /** Total jobs completed (for reputation scoring) */
  completedJobs: number
  /** Total jobs failed/slashed */
  failedJobs: number
}

// ---------------------------------------------------------------------------
// PM-2 — Job Auction
// ---------------------------------------------------------------------------

/** ZK circuit type determines hardware requirements */
export type CircuitType = "halo2" | "plonky2" | "groth16"

export type JobStatus =
  | "open"        // Accepting bids
  | "assigned"    // Assigned to a provider
  | "proving"     // Provider is generating the proof
  | "completed"   // Proof delivered and verified
  | "failed"      // Provider failed / slashed
  | "cancelled"   // Cancelled by submitter

/**
 * A proof generation job posted to the marketplace.
 * The submitter (L2 Sequencer or Circuit Registry) posts the job;
 * providers bid on it.
 */
export interface ProofJob {
  jobId: JobId
  /** Circuit identifier from @veraciphers/circuit-compiler */
  circuitId: string
  circuitType: CircuitType
  /** Encoded witness data (base64) */
  witnessBytes: string
  /** Maximum fee the submitter is willing to pay (μVRQ) */
  maxFee: MicroVRQ
  /** Absolute deadline by which proof must be delivered (UNIX ms) */
  deadlineMs: number
  status: JobStatus
  /** Provider assigned to this job */
  assignedTo: ProviderId | undefined
  /** UNIX ms when job was posted */
  createdAt: number
  /** UNIX ms when proof was delivered (or undefined) */
  completedAt: number | undefined
  /** Delivered proof bytes (base64, undefined until completed) */
  proofBytes: string | undefined
  /** Public signals from the circuit (undefined until completed) */
  publicSignals: Record<string, string> | undefined
  /** Submitter's node ID (for result delivery) */
  submittedBy: string
}

/**
 * A bid from a provider on an open job.
 */
export interface ProviderBid {
  jobId: JobId
  providerId: ProviderId
  /** Offered price in μVRQ (must be ≤ job.maxFee) */
  bidPrice: MicroVRQ
  /** Estimated proof time in milliseconds */
  estimatedProofMs: number
  /** UNIX ms when the bid was placed */
  bidAt: number
}

// ---------------------------------------------------------------------------
// PM-3 — SLA & Slashing
// ---------------------------------------------------------------------------

export type SlaViolationReason =
  | "deadline_exceeded"   // Proof not delivered by deadlineMs
  | "invalid_proof"       // Delivered proof fails on-chain verification
  | "provider_offline"    // Provider disconnected before delivery

export interface SlaViolation {
  violationId: string
  jobId: JobId
  providerId: ProviderId
  reason: SlaViolationReason
  /** Amount slashed in μVRQ */
  slashAmount: MicroVRQ
  detectedAt: number
}

/**
 * SLA configuration for the marketplace (DAO-governable).
 */
export interface SlaConfig {
  /** Slash percentage of provider's per-job escrow on deadline_exceeded (0–100) */
  deadlineSlashPct: number
  /** Slash percentage on invalid_proof */
  invalidProofSlashPct: number
  /** Slash percentage on provider_offline */
  offlineSlashPct: number
  /** Provider suspended after this many violations in rollingWindowMs */
  suspendAfterViolations: number
  /** Rolling window for violation count (ms) */
  rollingWindowMs: number
}

export const DEFAULT_SLA_CONFIG: SlaConfig = {
  deadlineSlashPct: 50,
  invalidProofSlashPct: 100,
  offlineSlashPct: 25,
  suspendAfterViolations: 3,
  rollingWindowMs: 7 * 24 * 60 * 60 * 1000,  // 7 days
}

// ---------------------------------------------------------------------------
// PM-4 — Fee Distribution
// ---------------------------------------------------------------------------

/**
 * How proving fees are split after a successful job.
 * 70% → provider, 30% → treasury (matches Axioledger tokenomics §6)
 */
export interface FeeDistribution {
  jobId: JobId
  totalFee: MicroVRQ
  providerShare: MicroVRQ   // 70%
  treasuryShare: MicroVRQ  // 30%
  providerId: ProviderId
  distributedAt: number
}

export const PROVIDER_FEE_SHARE = 0.70
export const TREASURY_FEE_SHARE = 0.30

// ---------------------------------------------------------------------------
// PM-5 — Escrow
// ---------------------------------------------------------------------------

export type EscrowStatus = "locked" | "released" | "slashed"

/**
 * Per-job escrow record.
 * The marketplace locks the submitter's $VRQ on assignment;
 * releases to provider on completion, or slashes on violation.
 */
export interface EscrowRecord {
  jobId: JobId
  providerId: ProviderId
  /** Amount locked in μVRQ */
  lockedAmount: MicroVRQ
  status: EscrowStatus
  lockedAt: number
  settledAt: number | undefined
}

// ---------------------------------------------------------------------------
// Marketplace-level errors
// ---------------------------------------------------------------------------

export type MarketplaceErrorCode =
  | "PROVIDER_NOT_FOUND"
  | "JOB_NOT_FOUND"
  | "INSUFFICIENT_STAKE"
  | "JOB_NOT_OPEN"
  | "BID_EXCEEDS_MAX_FEE"
  | "PROVIDER_AT_CAPACITY"
  | "PROVIDER_SUSPENDED"
  | "PROOF_ALREADY_DELIVERED"
  | "DEADLINE_PASSED"

export class MarketplaceError extends Error {
  constructor(
    message: string,
    public readonly code: MarketplaceErrorCode,
    public readonly jobId?: JobId,
    public readonly providerId?: ProviderId,
  ) {
    super(message)
    this.name = "MarketplaceError"
  }
}
