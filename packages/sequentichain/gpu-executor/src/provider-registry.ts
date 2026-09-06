/**
 * @file provider-registry.ts
 * PM-1 — Proving Provider Registry
 *
 * Manages provider registration, staking, capacity tracking.
 * Providers must stake a minimum of MIN_PROVIDER_STAKE μVRQ to participate.
 */
import { randomUUID } from "node:crypto"
import type {
  HardwareTier,
  MicroVRQ,
  ProviderRecord,
  ProviderStatus,
  ProviderId,
} from "./marketplace-types.js"
import { MarketplaceError } from "./marketplace-types.js"

export const MIN_PROVIDER_STAKE: MicroVRQ = 10_000_000_000n  // 10,000 VRQ in μVRQ

export interface RegisterProviderParams {
  name: string
  tier: HardwareTier
  stakeAmount: MicroVRQ
  maxConcurrentJobs: number
  endpoint: string
  /** Provider's self-declared SLA deadline in ms. Default: 30,000 (30s) */
  slaDeadlineMs?: number
}

export class ProviderRegistry {
  private readonly providers = new Map<ProviderId, ProviderRecord>()

  /**
   * Register a new proving provider.
   * @throws {MarketplaceError} INSUFFICIENT_STAKE if stakeAmount < MIN_PROVIDER_STAKE
   */
  register(params: RegisterProviderParams): ProviderRecord {
    if (params.stakeAmount < MIN_PROVIDER_STAKE) {
      throw new MarketplaceError(
        `Stake ${params.stakeAmount} μVRQ is below minimum ${MIN_PROVIDER_STAKE} μVRQ`,
        "INSUFFICIENT_STAKE",
      )
    }
    const providerId = randomUUID()
    const record: ProviderRecord = {
      providerId,
      name: params.name,
      tier: params.tier,
      stakeAmount: params.stakeAmount,
      maxConcurrentJobs: params.maxConcurrentJobs,
      activeJobCount: 0,
      slashedAmount: 0n,
      status: "active",
      registeredAt: Date.now(),
      endpoint: params.endpoint,
      slaDeadlineMs: params.slaDeadlineMs ?? 30_000,
      completedJobs: 0,
      failedJobs: 0,
    }
    this.providers.set(providerId, record)
    return record
  }

  /**
   * Get provider by ID.
   * @throws {MarketplaceError} PROVIDER_NOT_FOUND
   */
  get(providerId: ProviderId): ProviderRecord {
    const p = this.providers.get(providerId)
    if (!p) throw new MarketplaceError(`Provider "${providerId}" not found`, "PROVIDER_NOT_FOUND", undefined, providerId)
    return p
  }

  /** Update mutable fields of a provider record in-place. */
  update(providerId: ProviderId, patch: Partial<ProviderRecord>): void {
    const p = this.get(providerId)
    Object.assign(p, patch)
  }

  /**
   * Slash a provider's stake by `amount` μVRQ.
   * If remaining stake < MIN_PROVIDER_STAKE, status → "suspended".
   */
  slash(providerId: ProviderId, amount: MicroVRQ): void {
    const p = this.get(providerId)
    p.stakeAmount = p.stakeAmount > amount ? p.stakeAmount - amount : 0n
    p.slashedAmount += amount
    p.failedJobs++
    if (p.stakeAmount < MIN_PROVIDER_STAKE) {
      p.status = "suspended"
    }
  }

  /**
   * Mark a job slot as occupied (increment activeJobCount).
   * @throws {MarketplaceError} PROVIDER_AT_CAPACITY or PROVIDER_SUSPENDED
   */
  occupySlot(providerId: ProviderId): void {
    const p = this.get(providerId)
    if (p.status === "suspended" || p.status === "slashed") {
      throw new MarketplaceError(`Provider "${providerId}" is ${p.status}`, "PROVIDER_SUSPENDED", undefined, providerId)
    }
    if (p.activeJobCount >= p.maxConcurrentJobs) {
      throw new MarketplaceError(`Provider "${providerId}" is at capacity`, "PROVIDER_AT_CAPACITY", undefined, providerId)
    }
    p.activeJobCount++
    if (p.activeJobCount >= p.maxConcurrentJobs) p.status = "busy"
  }

  /** Release a job slot (decrement activeJobCount). */
  releaseSlot(providerId: ProviderId): void {
    const p = this.providers.get(providerId)
    if (!p) return
    p.activeJobCount = Math.max(0, p.activeJobCount - 1)
    if (p.status === "busy" && p.activeJobCount < p.maxConcurrentJobs) {
      p.status = "active"
    }
    p.completedJobs++
  }

  /** List all active (non-suspended/exited) providers, sorted by stake descending. */
  listActive(): ProviderRecord[] {
    return [...this.providers.values()]
      .filter((p) => p.status === "active" || p.status === "busy")
      .sort((a, b) => (a.stakeAmount > b.stakeAmount ? -1 : 1))
  }

  get size(): number { return this.providers.size }
}
