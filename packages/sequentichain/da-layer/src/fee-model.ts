/**
 * @file fee-model.ts
 * Dynamic DA Fee Model — Module 12.4
 *
 * Fee = sizeKB × baseFeePerKb × (1 + queueLoad / maxCapacity)
 * Paid in $AXQ, denominated in micro-AXQ (1 AXQ = 1_000_000 μAXQ).
 *
 * Design notes:
 *  - `baseFeePerKb` is a DAO-governable parameter stored on-chain.
 *  - The congestion multiplier grows linearly with queue occupancy,
 *    capping at 2× when the queue is at full capacity.
 *  - `estimateFee` is pure (no I/O); actual on-chain collection happens in
 *    the `DANodeRegistry` smart contract.
 */
import type { BlobId, DAFeeParams, DAFeeQuote } from "./types.js"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Default base fee: 10 μAXQ per KB.
 * At 128 KB blob size → 1,280 μAXQ (~0.00128 AXQ) at zero congestion.
 * DAO can adjust via governance vote.
 */
export const DEFAULT_BASE_FEE_PER_KB = 10n // μAXQ per KB

// ---------------------------------------------------------------------------
// Fee calculator
// ---------------------------------------------------------------------------

/**
 * Estimate the DA fee for a given blob size and current network state.
 *
 * @param blobId         - For traceability in the returned quote
 * @param sizeBytes      - Raw byte size of the blob payload
 * @param params         - Network fee parameters (base fee + congestion state)
 * @returns DAFeeQuote   - Fully computed fee quote (pure, no side-effects)
 *
 * @throws {RangeError} if sizeBytes is zero or negative
 */
export function estimateFee(
  blobId: BlobId,
  sizeBytes: number,
  params: DAFeeParams,
): DAFeeQuote {
  if (sizeBytes <= 0) {
    throw new RangeError(`estimateFee: sizeBytes must be > 0, got ${sizeBytes}`)
  }
  if (params.maxCapacity <= 0) {
    throw new RangeError("estimateFee: maxCapacity must be > 0")
  }

  // Round up to nearest KB
  const sizeKb = Math.ceil(sizeBytes / 1024)

  // Congestion ratio: clamp to [0, 1] to avoid fee explosion
  const load = Math.min(params.currentQueueLoad, params.maxCapacity)
  const congestionRatio = load / params.maxCapacity

  // Multiplier: 1.0 (empty queue) → 2.0 (full queue)
  const congestionMultiplier = 1 + congestionRatio

  // totalFee = sizeKb × baseFeePerKb × congestionMultiplier
  // Using BigInt arithmetic; congestionMultiplier scaled ×1000 for precision
  const multiplierScaled = BigInt(Math.round(congestionMultiplier * 1_000))
  const totalFee = (BigInt(sizeKb) * params.baseFeePerKb * multiplierScaled) / 1_000n

  return {
    blobId,
    sizeKb,
    baseFeePerKb: params.baseFeePerKb,
    congestionMultiplier,
    totalFee,
  }
}

/**
 * Compute fee params from current node state.
 * This is a convenience factory to build DAFeeParams from raw metrics.
 *
 * @param pendingBlobCount  - Number of blobs currently awaiting processing
 * @param maxQueueCapacity  - Configured maximum queue depth
 * @param baseFeeOverride   - Optional DAO-set base fee (defaults to DEFAULT_BASE_FEE_PER_KB)
 */
export function buildFeeParams(
  pendingBlobCount: number,
  maxQueueCapacity: number,
  baseFeeOverride?: bigint,
): DAFeeParams {
  return {
    baseFeePerKb: baseFeeOverride ?? DEFAULT_BASE_FEE_PER_KB,
    currentQueueLoad: pendingBlobCount,
    maxCapacity: maxQueueCapacity,
  }
}
