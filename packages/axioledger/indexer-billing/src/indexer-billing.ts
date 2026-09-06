/**
 * @file indexer-billing.ts
 * @axioledger/indexer-billing — IndexerBillingEngine
 *
 * Single orchestrator for all 5 billing sub-modules.
 */
import { createHash, randomUUID } from "node:crypto"
import type {
  ConsumerCreditAccount,
  ConsumerId,
  DatasetType,
  FeeTierConfig,
  IndexerId,
  IndexerRecord,
  IndexerStatus,
  MicroAXQ,
  QueryComplexity,
  QueryRecord,
  SettlementBatch,
} from "./types.js"
import {
  DEFAULT_FEE_TIER,
  IndexerBillingError,
} from "./types.js"

const PERIOD_DURATION_MS = 24 * 60 * 60 * 1000  // 24 hours

// ---------------------------------------------------------------------------
// IndexerBillingEngine
// ---------------------------------------------------------------------------

export class IndexerBillingEngine {
  private readonly indexers   = new Map<IndexerId, IndexerRecord>()
  private readonly consumers  = new Map<ConsumerId, ConsumerCreditAccount>()
  private readonly queryLog: QueryRecord[] = []
  private readonly settlements: SettlementBatch[] = []
  private readonly tierConfig: FeeTierConfig

  constructor(
    tierConfig: FeeTierConfig = DEFAULT_FEE_TIER,
    private readonly nowMs: () => number = () => Date.now(),
  ) {
    this.tierConfig = tierConfig
  }

  // -------------------------------------------------------------------------
  // IB-1: Indexer Registry
  // -------------------------------------------------------------------------

  /**
   * Register a new indexer operator.
   *
   * @param name            Display name
   * @param endpoint        GraphQL/REST endpoint URL
   * @param datasets        Datasets this indexer covers
   * @param baseFeePerQuery Base fee per query in μAXQ
   * @param freeQueryQuota  Free queries per consumer per 24h (default: 100)
   */
  registerIndexer(
    name: string,
    endpoint: string,
    datasets: DatasetType[],
    baseFeePerQuery: MicroAXQ,
    freeQueryQuota: number = 100,
  ): IndexerRecord {
    const indexerId = randomUUID()
    const record: IndexerRecord = {
      indexerId,
      name,
      endpoint,
      datasets,
      baseFeePerQuery,
      freeQueryQuota,
      status: "active",
      registeredAt: this.nowMs(),
      totalQueriesServed: 0,
      totalEarned: 0n,
    }
    this.indexers.set(indexerId, record)
    return record
  }

  getIndexer(indexerId: IndexerId): IndexerRecord {
    const r = this.indexers.get(indexerId)
    if (!r) throw new IndexerBillingError(`Indexer "${indexerId}" not found`, "INDEXER_NOT_FOUND", indexerId)
    return r
  }

  setIndexerStatus(indexerId: IndexerId, status: IndexerStatus): void {
    this.getIndexer(indexerId).status = status
  }

  listIndexers(dataset?: DatasetType): IndexerRecord[] {
    const all = [...this.indexers.values()].filter((i) => i.status === "active")
    return dataset ? all.filter((i) => i.datasets.includes(dataset)) : all
  }

  // -------------------------------------------------------------------------
  // IB-4: Consumer Credits
  // -------------------------------------------------------------------------

  /**
   * Open (or top-up) a consumer credit account.
   *
   * @param consumerId     Wallet address or dApp ID
   * @param depositAmount  μAXQ to deposit
   */
  depositCredits(consumerId: ConsumerId, depositAmount: MicroAXQ): ConsumerCreditAccount {
    let account = this.consumers.get(consumerId)
    if (!account) {
      account = {
        consumerId,
        balanceMicroAxq: 0n,
        queriesThisPeriod: 0,
        periodStartMs: this.nowMs(),
        totalSpent: 0n,
        createdAt: this.nowMs(),
      }
      this.consumers.set(consumerId, account)
    }
    account.balanceMicroAxq += depositAmount
    return account
  }

  getConsumer(consumerId: ConsumerId): ConsumerCreditAccount {
    const c = this.consumers.get(consumerId)
    if (!c) throw new IndexerBillingError(`Consumer "${consumerId}" not found`, "CONSUMER_NOT_FOUND", undefined, consumerId)
    return c
  }

  // -------------------------------------------------------------------------
  // IB-2 + IB-3: Query Recording + Fee Calculation
  // -------------------------------------------------------------------------

  /**
   * Record a query and deduct the fee from the consumer's credit balance.
   *
   * Fee logic:
   *   1. Reset period counter if 24h window has elapsed
   *   2. If consumer has free quota remaining → fee = 0, decrement quota
   *   3. Otherwise: fee = baseFeePerQuery × complexityMultiplier
   *   4. Deduct from consumer balance; if insufficient → throw
   *
   * @returns QueryRecord with computed fee
   *
   * @throws {IndexerBillingError} INDEXER_SUSPENDED if indexer is not active
   * @throws {IndexerBillingError} INSUFFICIENT_CREDITS if consumer balance < fee
   */
  recordQuery(
    indexerId: IndexerId,
    consumerId: ConsumerId,
    complexity: QueryComplexity,
    latencyMs: number,
  ): QueryRecord {
    const indexer = this.getIndexer(indexerId)
    if (indexer.status !== "active") {
      throw new IndexerBillingError(`Indexer "${indexerId}" is ${indexer.status}`, "INDEXER_SUSPENDED", indexerId, consumerId)
    }

    // Auto-create consumer account with 0 balance if not exists (pay-as-you-go via free tier)
    if (!this.consumers.has(consumerId)) {
      this.consumers.set(consumerId, {
        consumerId,
        balanceMicroAxq: 0n,
        queriesThisPeriod: 0,
        periodStartMs: this.nowMs(),
        totalSpent: 0n,
        createdAt: this.nowMs(),
      })
    }
    const consumer = this.consumers.get(consumerId)!

    // Reset period if expired
    const now = this.nowMs()
    if (now - consumer.periodStartMs >= PERIOD_DURATION_MS) {
      consumer.queriesThisPeriod = 0
      consumer.periodStartMs = now
    }

    // Determine fee
    let feeMicroAxq: MicroAXQ = 0n
    let usedFreeQuota = false

    if (consumer.queriesThisPeriod < indexer.freeQueryQuota) {
      // Within free tier
      usedFreeQuota = true
      consumer.queriesThisPeriod++
    } else {
      // Paid tier
      const multiplier = this._multiplier(complexity)
      feeMicroAxq = BigInt(Math.round(Number(indexer.baseFeePerQuery) * multiplier))

      if (consumer.balanceMicroAxq < feeMicroAxq) {
        throw new IndexerBillingError(
          `Insufficient credits: need ${feeMicroAxq} μAXQ, have ${consumer.balanceMicroAxq} μAXQ`,
          "INSUFFICIENT_CREDITS",
          indexerId,
          consumerId,
        )
      }
      consumer.balanceMicroAxq -= feeMicroAxq
      consumer.totalSpent += feeMicroAxq
      consumer.queriesThisPeriod++
    }

    indexer.totalQueriesServed++

    const record: QueryRecord = {
      queryId:       randomUUID(),
      indexerId,
      consumerId,
      complexity,
      feeMicroAxq,
      usedFreeQuota,
      executedAt:    now,
      latencyMs,
    }
    this.queryLog.push(record)
    return record
  }

  // -------------------------------------------------------------------------
  // IB-5: Settlement
  // -------------------------------------------------------------------------

  /**
   * Settle all unpaid queries for an indexer since `fromMs`.
   * Transfers accrued fees to the indexer's account and records the batch.
   *
   * Phase 1: off-chain accounting + mock tx hash.
   * Phase 2: submit to `IndexerBillingVault.sol` on Axioledger L1.
   */
  settle(indexerId: IndexerId, fromMs: number): SettlementBatch {
    this.getIndexer(indexerId)  // validate exists
    const toMs = this.nowMs()

    const periodQueries = this.queryLog.filter(
      (q) => q.indexerId === indexerId &&
             q.executedAt >= fromMs &&
             q.executedAt <= toMs &&
             !q.usedFreeQuota  // only paid queries
    )

    const totalCollected = periodQueries.reduce((acc, q) => acc + q.feeMicroAxq, 0n)
    // Protocol keeps 0% for indexer billing (unlike DA/ZK fees) — full amount to indexer
    const netToIndexer = totalCollected

    this.indexers.get(indexerId)!.totalEarned += netToIndexer

    const batch: SettlementBatch = {
      batchId:        randomUUID(),
      indexerId,
      periodStartMs:  fromMs,
      periodEndMs:    toMs,
      queryCount:     periodQueries.length,
      totalCollected,
      netToIndexer,
      settledAt:      toMs,
      txHash:         createHash("sha256").update(randomUUID()).digest("hex"),
    }
    this.settlements.push(batch)
    return batch
  }

  // -------------------------------------------------------------------------
  // Analytics / queries
  // -------------------------------------------------------------------------

  getQueryLog(indexerId?: IndexerId, consumerId?: ConsumerId): QueryRecord[] {
    let results = [...this.queryLog]
    if (indexerId) results = results.filter((q) => q.indexerId === indexerId)
    if (consumerId) results = results.filter((q) => q.consumerId === consumerId)
    return results
  }

  getSettlements(indexerId?: IndexerId): SettlementBatch[] {
    return indexerId
      ? this.settlements.filter((s) => s.indexerId === indexerId)
      : [...this.settlements]
  }

  /**
   * Summary of unsettled (accrued but not yet settled) fees for an indexer.
   */
  getUnsettledFees(indexerId: IndexerId): MicroAXQ {
    return this.queryLog
      .filter((q) => q.indexerId === indexerId && !q.usedFreeQuota)
      .reduce((acc, q) => acc + q.feeMicroAxq, 0n)
  }

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  private _multiplier(complexity: QueryComplexity): number {
    if (complexity === "simple")  return this.tierConfig.simpleMultiplier
    if (complexity === "medium")  return this.tierConfig.mediumMultiplier
    return this.tierConfig.complexMultiplier
  }
}
