/**
 * @axioledger/ans-sdk — RoyaltyRegistry Test Suite
 */
import { describe, it, expect, beforeEach } from "vitest"
import {
  RoyaltyRegistry,
  DEFAULT_RATE_BPS,
  MIN_RATE_BPS,
  MAX_RATE_BPS,
} from "../royalty-registry.js"

let clock = 1_000_000
const nowFn = () => clock

const SDK_ID = "@axioledger/ans-sdk"
const RECIPIENT = "0xABC123"

function makeRegistry() {
  clock = 1_000_000
  return new RoyaltyRegistry(nowFn)
}

describe("RoyaltyRegistry — RR-2 SDK Registration", () => {
  it("registers an SDK with default rate", () => {
    const r = makeRegistry()
    const config = r.registerSdk(SDK_ID, RECIPIENT)
    expect(config.rateBasispPoints).toBe(DEFAULT_RATE_BPS)
    expect(config.recipientAddress).toBe(RECIPIENT)
    expect(config.contributorFraction).toBe(0.8)
  })

  it("registers with custom rate", () => {
    const r = makeRegistry()
    const config = r.registerSdk(SDK_ID, RECIPIENT, 50)
    expect(config.rateBasispPoints).toBe(50)
  })

  it("throws on rate below minimum", () => {
    const r = makeRegistry()
    expect(() => r.registerSdk(SDK_ID, RECIPIENT, MIN_RATE_BPS - 1)).toThrow(RangeError)
  })

  it("throws on rate above maximum", () => {
    const r = makeRegistry()
    expect(() => r.registerSdk(SDK_ID, RECIPIENT, MAX_RATE_BPS + 1)).toThrow(RangeError)
  })

  it("throws on invalid contributorFraction", () => {
    const r = makeRegistry()
    expect(() => r.registerSdk(SDK_ID, RECIPIENT, 20, 1.5)).toThrow(RangeError)
  })
})

describe("RoyaltyRegistry — RR-1 Usage Watermarking", () => {
  it("recordUsage returns a record with watermarkHash", () => {
    const r = makeRegistry()
    r.registerSdk(SDK_ID, RECIPIENT)
    const rec = r.recordUsage(SDK_ID, "1.0.0", "register_name", "dapp-wallet", 10_000n)
    expect(rec.sdkId).toBe(SDK_ID)
    expect(rec.watermarkHash).toMatch(/^[0-9a-f]{64}$/)
    expect(rec.operation).toBe("register_name")
  })

  it("accrues royalty on registered SDK (0.2% of 10,000 = 2 μAXQ)", () => {
    const r = makeRegistry()
    r.registerSdk(SDK_ID, RECIPIENT, 20)  // 20 bps = 0.2%
    r.recordUsage(SDK_ID, "1.0.0", "register_name", "wallet", 10_000n)
    const accrual = r.getAccrual(SDK_ID)!
    // 10_000 × 20 / 10_000 = 20 μAXQ... wait
    // royalty = 10_000 × 20 / 10_000 = 20 μAXQ
    expect(accrual.pendingMicroAxq).toBe(20n)
    expect(accrual.totalOperations).toBe(1)
  })

  it("records usage even for unregistered SDK (no accrual)", () => {
    const r = makeRegistry()
    const rec = r.recordUsage("@unknown/sdk", "1.0.0", "resolve_name", "wallet", 5_000n)
    expect(rec.usageId).toBeDefined()
    // No accrual for unregistered SDK
    expect(r.getAccrual("@unknown/sdk")).toBeUndefined()
  })

  it("multiple operations accumulate correctly", () => {
    const r = makeRegistry()
    r.registerSdk(SDK_ID, RECIPIENT, 10)  // 10 bps = 0.1%
    // royalty = 100_000 × 10 / 10_000 = 100 μAXQ
    r.recordUsage(SDK_ID, "1.0.0", "register_name", "w1", 100_000n)
    // royalty = 50_000 × 10 / 10_000 = 50 μAXQ
    r.recordUsage(SDK_ID, "1.0.0", "renew_name",    "w2", 50_000n)
    expect(r.getAccrual(SDK_ID)!.pendingMicroAxq).toBe(150n)
  })
})

describe("RoyaltyRegistry — RR-4 Payout Settlement", () => {
  it("settle() splits 80/20 contributor/treasury", () => {
    const r = makeRegistry()
    r.registerSdk(SDK_ID, RECIPIENT, 20, 0.8)
    r.recordUsage(SDK_ID, "1.0.0", "register_name", "w", 1_000_000n)
    // royalty = 1_000_000 × 20 / 10_000 = 2_000 μAXQ

    const payout = r.settle(SDK_ID)
    expect(payout.contributorAmount + payout.treasuryAmount).toBe(2_000n)
    // 80% of 2_000 = 1_600
    expect(payout.contributorAmount).toBe(1_600n)
    expect(payout.treasuryAmount).toBe(400n)
    expect(payout.txHash).toHaveLength(64)
  })

  it("pendingMicroAxq is reset to 0 after settle", () => {
    const r = makeRegistry()
    r.registerSdk(SDK_ID, RECIPIENT)
    r.recordUsage(SDK_ID, "1.0.0", "register_name", "w", 100_000n)
    r.settle(SDK_ID)
    expect(r.getAccrual(SDK_ID)!.pendingMicroAxq).toBe(0n)
  })

  it("throws when no pending royalties", () => {
    const r = makeRegistry()
    r.registerSdk(SDK_ID, RECIPIENT)
    expect(() => r.settle(SDK_ID)).toThrow("No pending")
  })

  it("settleAll() settles multiple SDKs", () => {
    const r = makeRegistry()
    r.registerSdk(SDK_ID, RECIPIENT)
    r.registerSdk("@axioledger/ui-kit", "0xDEF")
    r.recordUsage(SDK_ID, "1.0.0", "register_name", "w", 100_000n)
    r.recordUsage("@axioledger/ui-kit", "1.0.0", "resolve_name", "w", 50_000n)
    const payouts = r.settleAll()
    expect(payouts).toHaveLength(2)
  })
})

describe("RoyaltyRegistry — RR-5 Audit Trail", () => {
  it("getUsageLog returns all logs, filterable by sdkId", () => {
    const r = makeRegistry()
    r.registerSdk(SDK_ID, RECIPIENT)
    r.recordUsage(SDK_ID, "1.0.0", "register_name", "w", 1n)
    r.recordUsage(SDK_ID, "1.0.0", "update_record", "w", 1n)
    r.recordUsage("@other/sdk", "1.0.0", "resolve_name", "w", 1n)
    expect(r.getUsageLog(SDK_ID)).toHaveLength(2)
    expect(r.getUsageLog()).toHaveLength(3)
  })

  it("getTotalPendingAcrossAllSdks aggregates correctly", () => {
    const r = makeRegistry()
    r.registerSdk(SDK_ID, RECIPIENT, 10)
    r.registerSdk("@axioledger/ui-kit", "0xDEF", 20)
    // SDK_ID: 100_000 × 10 / 10_000 = 100 μAXQ
    r.recordUsage(SDK_ID, "1.0.0", "register_name", "w", 100_000n)
    // ui-kit: 100_000 × 20 / 10_000 = 200 μAXQ
    r.recordUsage("@axioledger/ui-kit", "1.0.0", "register_name", "w", 100_000n)
    expect(r.getTotalPendingAcrossAllSdks()).toBe(300n)
  })
})
