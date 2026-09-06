/**
 * @axioledger/indexer-billing — Public API
 *
 * Metered $AXQ query fee billing for on-chain data indexers.
 *   IB-1  Indexer Registry
 *   IB-2  Query Metering
 *   IB-3  Fee Calculator (tiered)
 *   IB-4  Consumer Credits
 *   IB-5  Settlement
 */

export { IndexerBillingEngine }  from "./indexer-billing.js"

export type {
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

export {
  DEFAULT_FEE_TIER,
  IndexerBillingError,
} from "./types.js"
