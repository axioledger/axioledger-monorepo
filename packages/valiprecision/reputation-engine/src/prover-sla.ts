/**
 * @file prover-sla.ts
 * @valiprecision/reputation-engine — Prover SLA Extension
 *
 * Extends the existing Validator slashing model to cover **Prover Nodes**
 * operating in the @sequentichain/proving-marketplace.
 *
 * Design:
 *  - ProverSlaTracker maintains per-prover SLA metrics (latency, timeout rate)
 *  - ProverSlashingConditions defines thresholds → auto-slash triggers
 *  - Integrates with existing SlashingEngine via `SlashEvent` (same interface)
 *  - ProverReputationScore extends ReputationScore with prover-specific fields
 *
 * Slash conditions (all DAO-governable via SlaThresholds):
 *   1. deadline_exceeded:  proof delivered after job.deadlineMs
 *   2. invalid_proof:      delivered proof fails on-chain ZK verification
 *   3. provider_offline:   prover disconnected without delivering proof
 *   4. latency_sla_breach: p99 latency over rolling 24h > maxP99LatencyMs
 */
import { randomUUID } from "node:crypto"
import type { SlashEvent, ValidatorRecord } from "./types.js"

// ---------------------------------------------------------------------------
// Prover-specific types
// ---------------------------------------------------------------------------

export type ProverNodeId = string

export type ProverSlashReason =
  | "deadline_exceeded"
  | "invalid_proof"
  | "provider_offline"
  | "latency_sla_breach"
  | "downtime"        // re-use from validator model

export interface ProverSlaRecord {
  proverId: ProverNodeId
  /** Staked $VRQ in micro-VRQ */
  stakeVrq: bigint
  /** Total jobs completed successfully */
  completedJobs: number
  /** Total jobs that violated SLA */
  failedJobs: number
  /** Cumulative amount slashed in μVRQ */
  totalSlashed: bigint
  /** p99 proof latency over the last rolling window (ms) */
  p99LatencyMs: number
  /** Raw latency samples (ring buffer, last N=100) */
  latencySamples: number[]
  /** UNIX ms of last successful proof delivery */
  lastActiveAt: number
  /** Whether prover is currently suspended */
  suspended: boolean
  registeredAt: number
}

/**
 * SLA thresholds — all values are DAO-governable.
 */
export interface SlaThresholds {
  /** Max allowed p99 proof latency over rolling window (ms) */
  maxP99LatencyMs: number
  /** Slash percentage (0-100) for deadline_exceeded */
  deadlineSlashPct: number
  /** Slash percentage for invalid_proof */
  invalidProofSlashPct: number
  /** Slash percentage for provider_offline */
  offlineSlashPct: number
  /** Slash percentage for latency_sla_breach */
  latencyBreachSlashPct: number
  /** Suspend after this many SLA violations in rollingWindowMs */
  suspendAfterViolations: number
  rollingWindowMs: number
}

export const DEFAULT_PROVER_SLA_THRESHOLDS: SlaThresholds = {
  maxP99LatencyMs:        30_000,     // 30 seconds
  deadlineSlashPct:       50,
  invalidProofSlashPct:   100,
  offlineSlashPct:        25,
  latencyBreachSlashPct:  10,
  suspendAfterViolations: 3,
  rollingWindowMs:        7 * 24 * 60 * 60 * 1000,
}

const LATENCY_SAMPLE_WINDOW = 100  // ring buffer size

/** Per-event SLA violation log */
export interface ProverSlaViolation {
  violationId: string
  proverId: ProverNodeId
  reason: ProverSlashReason
  slashAmountVrq: bigint
  detectedAt: number
  jobId: string | undefined
}

/** Extended reputation score for prover nodes */
export interface ProverReputationScore {
  proverId: ProverNodeId
  /** Base score 0–100 (mirrors validator scoring formula) */
  baseScore: number
  /** Deduction from SLA violations (0–40) */
  slaViolationPenalty: number
  /** Bonus from sustained low latency (0–20) */
  latencyBonus: number
  /** Bonus from high job completion rate (0–20) */
  completionBonus: number
  /** Final composite score 0–100 */
  finalScore: number
  p99LatencyMs: number
  completionRate: number
  lastCalculated: number
}

// ---------------------------------------------------------------------------
// ProverSlaTracker
// ---------------------------------------------------------------------------

export class ProverSlaTracker {
  private readonly records = new Map<ProverNodeId, ProverSlaRecord>()
  private readonly violations: ProverSlaViolation[] = []
  private readonly thresholds: SlaThresholds

  constructor(
    thresholds: SlaThresholds = DEFAULT_PROVER_SLA_THRESHOLDS,
    private readonly nowMs: () => number = () => Date.now(),
  ) {
    this.thresholds = thresholds
  }

  // ---------------------------------------------------------------------------
  // Registration
  // ---------------------------------------------------------------------------

  registerProver(proverId: ProverNodeId, stakeVrq: bigint): ProverSlaRecord {
    const record: ProverSlaRecord = {
      proverId,
      stakeVrq,
      completedJobs: 0,
      failedJobs: 0,
      totalSlashed: 0n,
      p99LatencyMs: 0,
      latencySamples: [],
      lastActiveAt: this.nowMs(),
      suspended: false,
      registeredAt: this.nowMs(),
    }
    this.records.set(proverId, record)
    return record
  }

  getProver(proverId: ProverNodeId): ProverSlaRecord {
    const r = this.records.get(proverId)
    if (!r) throw new Error(`Prover "${proverId}" not found in SLA tracker`)
    return r
  }

  // ---------------------------------------------------------------------------
  // Proof delivery recording
  // ---------------------------------------------------------------------------

  /**
   * Record a successful proof delivery with its actual latency.
   * Updates p99 latency ring buffer and completion counter.
   */
  recordSuccess(proverId: ProverNodeId, latencyMs: number): void {
    const r = this.getProver(proverId)
    r.completedJobs++
    r.lastActiveAt = this.nowMs()
    r.latencySamples.push(latencyMs)
    if (r.latencySamples.length > LATENCY_SAMPLE_WINDOW) {
      r.latencySamples.shift()
    }
    r.p99LatencyMs = this._computeP99(r.latencySamples)

    // Check if new p99 exceeds threshold → latency SLA breach
    if (r.p99LatencyMs > this.thresholds.maxP99LatencyMs) {
      this._applyViolation(r, "latency_sla_breach", undefined)
    }
  }

  // ---------------------------------------------------------------------------
  // SLA violation handlers (called by proving-marketplace events)
  // ---------------------------------------------------------------------------

  recordDeadlineExceeded(proverId: ProverNodeId, jobId: string): ProverSlaViolation {
    const r = this.getProver(proverId)
    r.failedJobs++
    return this._applyViolation(r, "deadline_exceeded", jobId)
  }

  recordInvalidProof(proverId: ProverNodeId, jobId: string): ProverSlaViolation {
    const r = this.getProver(proverId)
    r.failedJobs++
    return this._applyViolation(r, "invalid_proof", jobId)
  }

  recordOffline(proverId: ProverNodeId, jobId: string): ProverSlaViolation {
    const r = this.getProver(proverId)
    r.failedJobs++
    return this._applyViolation(r, "provider_offline", jobId)
  }

  // ---------------------------------------------------------------------------
  // Reputation scoring
  // ---------------------------------------------------------------------------

  /**
   * Compute a composite ProverReputationScore.
   *
   * Formula:
   *   baseScore        = uptimeComponent (40)
   *   slaViolationPenalty = min(violations × 10, 40)
   *   latencyBonus       = max(0, 20 × (1 - p99 / maxP99))
   *   completionBonus    = min(completionRate × 20, 20)
   *   finalScore         = clamp(baseScore - slaViolationPenalty + latencyBonus + completionBonus, 0, 100)
   */
  computeScore(proverId: ProverNodeId): ProverReputationScore {
    const r = this.getProver(proverId)
    const now = this.nowMs()

    const recentViolations = this.violations.filter(
      (v) => v.proverId === proverId &&
             v.detectedAt >= now - this.thresholds.rollingWindowMs
    ).length

    const totalJobs = r.completedJobs + r.failedJobs
    const completionRate = totalJobs > 0 ? r.completedJobs / totalJobs : 1

    const baseScore = 40   // Represents "online and operating"
    const slaViolationPenalty = Math.min(recentViolations * 10, 40)
    const latencyBonus = r.p99LatencyMs > 0
      ? Math.max(0, 20 * (1 - r.p99LatencyMs / this.thresholds.maxP99LatencyMs))
      : 20   // No data → full bonus (new prover, benefit of doubt)
    const completionBonus = Math.min(completionRate * 20, 20)

    const finalScore = Math.max(0, Math.min(100,
      baseScore - slaViolationPenalty + latencyBonus + completionBonus
    ))

    return {
      proverId,
      baseScore,
      slaViolationPenalty,
      latencyBonus: Math.round(latencyBonus * 10) / 10,
      completionBonus: Math.round(completionBonus * 10) / 10,
      finalScore: Math.round(finalScore * 10) / 10,
      p99LatencyMs: r.p99LatencyMs,
      completionRate: Math.round(completionRate * 1000) / 1000,
      lastCalculated: now,
    }
  }

  // ---------------------------------------------------------------------------
  // Conversion to existing validator SlashEvent format
  // ---------------------------------------------------------------------------

  /**
   * Convert a ProverSlaViolation to the legacy SlashEvent interface
   * so it can be fed into the existing SlashingEngine without modification.
   */
  toSlashEvent(violation: ProverSlaViolation): SlashEvent {
    return {
      id:          violation.violationId,
      validatorId: violation.proverId,
      reason:      violation.reason === "deadline_exceeded" ? "downtime"
                 : violation.reason === "invalid_proof"     ? "invalid_block"
                 : "downtime",
      amount:      violation.slashAmountVrq,
      timestamp:   violation.detectedAt,
      evidence:    `prover_sla:${violation.reason}:job=${violation.jobId ?? "n/a"}`,
    }
  }

  getViolations(proverId?: ProverNodeId): ProverSlaViolation[] {
    return proverId
      ? this.violations.filter((v) => v.proverId === proverId)
      : [...this.violations]
  }

  list(): ProverSlaRecord[] { return [...this.records.values()] }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  private _applyViolation(
    r: ProverSlaRecord,
    reason: ProverSlashReason,
    jobId: string | undefined,
  ): ProverSlaViolation {
    const pct =
      reason === "deadline_exceeded"  ? this.thresholds.deadlineSlashPct :
      reason === "invalid_proof"      ? this.thresholds.invalidProofSlashPct :
      reason === "provider_offline"   ? this.thresholds.offlineSlashPct :
                                        this.thresholds.latencyBreachSlashPct

    const slashAmountVrq = (r.stakeVrq * BigInt(pct)) / 100n
    r.stakeVrq = r.stakeVrq > slashAmountVrq ? r.stakeVrq - slashAmountVrq : 0n
    r.totalSlashed += slashAmountVrq

    const now = this.nowMs()
    const recentCount = this.violations.filter(
      (v) => v.proverId === r.proverId && v.detectedAt >= now - this.thresholds.rollingWindowMs
    ).length + 1

    if (recentCount >= this.thresholds.suspendAfterViolations) {
      r.suspended = true
    }

    const violation: ProverSlaViolation = {
      violationId: randomUUID(),
      proverId: r.proverId,
      reason,
      slashAmountVrq,
      detectedAt: now,
      jobId,
    }
    this.violations.push(violation)
    return violation
  }

  private _computeP99(samples: number[]): number {
    if (samples.length === 0) return 0
    const sorted = [...samples].sort((a, b) => a - b)
    const idx = Math.ceil(sorted.length * 0.99) - 1
    return sorted[Math.max(0, idx)] ?? 0
  }
}
