/**
 * @file royalty-registry.ts
 * @axioledger/ans-sdk — RoyaltyRegistry module
 *
 * On-chain SDK usage tracking and royalty fee collection.
 *
 * Problem: dApp developers build on @axioledger/ans-sdk but there is no
 * mechanism to automatically track SDK usage and distribute royalty fees
 * (0.1–0.5% of dApp revenue) to SDK contributors.
 *
 * Solution — RoyaltyRegistry:
 *   RR-1  Watermark    — each SDK operation embeds a traceable usage record
 *   RR-2  Royalty rate — per-SDK configurable rate (0.1–0.5%), DAO-governable
 *   RR-3  Accrual      — off-chain accumulator with periodic on-chain settlement
 *   RR-4  Payout       — batch claim $AXQ to registered SDK contributors
 *   RR-5  Audit trail  — immutable usage log for dispute resolution
 *
 * Integration point: AnsClient injects a UsageRecord on every registerName /
 * updateRecord / renewName call. The L2 Sequencer picks up the watermark and
 * routes royalty accrual to the registry.
 */
import { createHash, randomUUID } from "node:crypto"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** μAXQ = 1 AXQ / 1_000_000 */
export type MicroAXQ = bigint

/** SDK package identifier */
export type SdkId = string

export type UsageOperation =
  | "register_name"
  | "update_record"
  | "transfer_name"
  | "renew_name"
  | "resolve_name"
  | "batch_resolve"

/**
 * A watermarked usage record embedded in every ANS transaction.
 * The L2 Sequencer reads this from transaction metadata to route royalties.
 */
export interface UsageRecord {
  /** Auto-generated unique usage ID */
  usageId: string
  /** SDK package that generated this usage (e.g. "@axioledger/ans-sdk") */
  sdkId: SdkId
  /** SDK version at time of usage */
  sdkVersion: string
  operation: UsageOperation
  /** Address of the dApp / caller that invoked the SDK */
  callerAddress: string
  /** Transaction value in μAXQ (used to compute royalty) */
  transactionValueMicroAxq: MicroAXQ
  /** UNIX ms */
  recordedAt: number
  /** SHA-256 of (sdkId + sdkVersion + operation + callerAddress + recordedAt) */
  watermarkHash: string
}

/** Royalty rate configuration for a registered SDK */
export interface RoyaltyConfig {
  sdkId: SdkId
  /** Rate in basis points (1 bp = 0.01%). Range: 10–50 bp = 0.1–0.5% */
  rateBasispPoints: number
  /** $AXQ recipient address (SDK contributor / DAO treasury split) */
  recipientAddress: string
  /** Fraction going to SDK contributor vs. treasury (0–1). E.g. 0.8 = 80% contributor */
  contributorFraction: number
  registeredAt: number
  updatedAt: number
}

/** Accrued royalty for a specific SDK */
export interface RoyaltyAccrual {
  sdkId: SdkId
  /** Total μAXQ accrued since last payout */
  pendingMicroAxq: MicroAXQ
  /** Total μAXQ paid out to contributor */
  contributorPaidOut: MicroAXQ
  /** Total μAXQ routed to DAO treasury */
  treasuryPaidOut: MicroAXQ
  /** Total usage operations recorded */
  totalOperations: number
  lastSettledAt: number | undefined
}

/** A payout batch — settled on-chain */
export interface RoyaltyPayout {
  payoutId: string
  sdkId: SdkId
  contributorAmount: MicroAXQ
  treasuryAmount: MicroAXQ
  operationCount: number
  settledAt: number
  /** Simulated tx hash (Phase 2: real Axioledger L1 tx) */
  txHash: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum royalty rate: 0.1% = 10 basis points */
export const MIN_RATE_BPS = 10
/** Maximum royalty rate: 0.5% = 50 basis points */
export const MAX_RATE_BPS = 50
/** Default rate: 0.2% = 20 basis points */
export const DEFAULT_RATE_BPS = 20

// ---------------------------------------------------------------------------
// RoyaltyRegistry
// ---------------------------------------------------------------------------

export class RoyaltyRegistry {
  private readonly configs  = new Map<SdkId, RoyaltyConfig>()
  private readonly accruals = new Map<SdkId, RoyaltyAccrual>()
  private readonly usageLog: UsageRecord[] = []
  private readonly payouts: RoyaltyPayout[] = []

  constructor(private readonly nowMs: () => number = () => Date.now()) {}

  // -------------------------------------------------------------------------
  // RR-2: SDK Registration
  // -------------------------------------------------------------------------

  /**
   * Register an SDK for royalty tracking.
   *
   * @param sdkId             Package name e.g. "@axioledger/ans-sdk"
   * @param recipientAddress  On-chain address of the SDK contributor
   * @param rateBps           Royalty rate in basis points (10–50). Default: 20 (0.2%)
   * @param contributorFraction Fraction of royalty to contributor (0–1). Default: 0.8
   */
  registerSdk(
    sdkId: SdkId,
    recipientAddress: string,
    rateBps: number = DEFAULT_RATE_BPS,
    contributorFraction: number = 0.8,
  ): RoyaltyConfig {
    if (rateBps < MIN_RATE_BPS || rateBps > MAX_RATE_BPS) {
      throw new RangeError(`rateBps must be between ${MIN_RATE_BPS} and ${MAX_RATE_BPS}, got ${rateBps}`)
    }
    if (contributorFraction < 0 || contributorFraction > 1) {
      throw new RangeError("contributorFraction must be between 0 and 1")
    }
    const now = this.nowMs()
    const config: RoyaltyConfig = {
      sdkId,
      rateBasispPoints: rateBps,
      recipientAddress,
      contributorFraction,
      registeredAt: now,
      updatedAt: now,
    }
    this.configs.set(sdkId, config)
    this.accruals.set(sdkId, {
      sdkId,
      pendingMicroAxq: 0n,
      contributorPaidOut: 0n,
      treasuryPaidOut: 0n,
      totalOperations: 0,
      lastSettledAt: undefined,
    })
    return config
  }

  getConfig(sdkId: SdkId): RoyaltyConfig | undefined { return this.configs.get(sdkId) }

  // -------------------------------------------------------------------------
  // RR-1: Usage Watermarking
  // -------------------------------------------------------------------------

  /**
   * Record a usage event and compute the royalty accrual.
   * Called by AnsClient on every mutating operation.
   *
   * @param sdkId               Which SDK package generated the usage
   * @param sdkVersion          SDK package version (from package.json)
   * @param operation           Type of ANS operation performed
   * @param callerAddress       dApp / end-user wallet address
   * @param transactionValue    Value of the underlying transaction in μAXQ
   * @returns The UsageRecord (embed as tx metadata / L2 memo field)
   */
  recordUsage(
    sdkId: SdkId,
    sdkVersion: string,
    operation: UsageOperation,
    callerAddress: string,
    transactionValue: MicroAXQ,
  ): UsageRecord {
    const now = this.nowMs()
    const watermarkHash = createHash("sha256")
      .update(`${sdkId}:${sdkVersion}:${operation}:${callerAddress}:${now}`)
      .digest("hex")

    const record: UsageRecord = {
      usageId: randomUUID(),
      sdkId,
      sdkVersion,
      operation,
      callerAddress,
      transactionValueMicroAxq: transactionValue,
      recordedAt: now,
      watermarkHash,
    }
    this.usageLog.push(record)

    // Accrue royalty if this SDK is registered
    const config = this.configs.get(sdkId)
    if (config) {
      const royalty = this._computeRoyalty(transactionValue, config.rateBasispPoints)
      const accrual = this.accruals.get(sdkId)!
      accrual.pendingMicroAxq += royalty
      accrual.totalOperations++
    }

    return record
  }

  // -------------------------------------------------------------------------
  // RR-3: Accrual Query
  // -------------------------------------------------------------------------

  getAccrual(sdkId: SdkId): RoyaltyAccrual | undefined { return this.accruals.get(sdkId) }

  getTotalPendingAcrossAllSdks(): MicroAXQ {
    let total = 0n
    for (const a of this.accruals.values()) total += a.pendingMicroAxq
    return total
  }

  // -------------------------------------------------------------------------
  // RR-4: Payout Settlement
  // -------------------------------------------------------------------------

  /**
   * Settle all pending royalties for a specific SDK.
   * Splits the accrual between contributor and treasury per `contributorFraction`.
   *
   * Phase 1: off-chain settlement with mock tx hash.
   * Phase 2: submit to Axioledger L1 `RoyaltyVault.sol` / `royalty_vault.rs`.
   *
   * @returns RoyaltyPayout record
   */
  settle(sdkId: SdkId): RoyaltyPayout {
    const accrual = this.accruals.get(sdkId)
    const config  = this.configs.get(sdkId)
    if (!accrual || !config) throw new Error(`SDK "${sdkId}" not registered in RoyaltyRegistry`)
    if (accrual.pendingMicroAxq === 0n) throw new Error(`No pending royalties for SDK "${sdkId}"`)

    const total = accrual.pendingMicroAxq
    const contributorFrac = BigInt(Math.round(config.contributorFraction * 1_000))
    const contributorAmount = (total * contributorFrac) / 1_000n
    const treasuryAmount    = total - contributorAmount

    accrual.pendingMicroAxq = 0n
    accrual.contributorPaidOut += contributorAmount
    accrual.treasuryPaidOut    += treasuryAmount
    accrual.lastSettledAt = this.nowMs()

    const payout: RoyaltyPayout = {
      payoutId:          randomUUID(),
      sdkId,
      contributorAmount,
      treasuryAmount,
      operationCount:    accrual.totalOperations,
      settledAt:         accrual.lastSettledAt,
      txHash:            createHash("sha256").update(randomUUID()).digest("hex"),
    }
    this.payouts.push(payout)
    return payout
  }

  /** Batch settle all SDKs with pending royalties. */
  settleAll(): RoyaltyPayout[] {
    const results: RoyaltyPayout[] = []
    for (const sdkId of this.accruals.keys()) {
      const accrual = this.accruals.get(sdkId)!
      if (accrual.pendingMicroAxq > 0n) {
        results.push(this.settle(sdkId))
      }
    }
    return results
  }

  // -------------------------------------------------------------------------
  // RR-5: Audit Trail
  // -------------------------------------------------------------------------

  getUsageLog(sdkId?: SdkId): UsageRecord[] {
    return sdkId ? this.usageLog.filter((r) => r.sdkId === sdkId) : [...this.usageLog]
  }

  getPayoutHistory(sdkId?: SdkId): RoyaltyPayout[] {
    return sdkId ? this.payouts.filter((p) => p.sdkId === sdkId) : [...this.payouts]
  }

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  /**
   * Compute royalty from a transaction value.
   * royalty = value × rateBps / 10_000
   */
  private _computeRoyalty(valueMicroAxq: MicroAXQ, rateBps: number): MicroAXQ {
    return (valueMicroAxq * BigInt(rateBps)) / 10_000n
  }
}
