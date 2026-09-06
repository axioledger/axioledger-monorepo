/**
 * reputation-engine — Tests
 */
import { describe, it, expect } from "vitest"
import { StakeTracker }    from "../stake-tracker.js"
import { SlashingEngine, MINIMUM_STAKE } from "../slashing.js"
import { calculateReputationScore } from "../scoring.js"
import { ReputationEngine, ReputationEngineError } from "../index.js"
import type { ValidatorRecord, SlashEvent } from "../types.js"

const makeRecord = (id: string, stake = BigInt("5000000000"), uptime = 99): ValidatorRecord => ({
  validatorId:   id,
  stake,
  status:        "active",
  joinedAt:      Date.now() - 365 * 24 * 60 * 60 * 1000,  // 1 năm trước
  slashCount:    0,
  uptimePercent: uptime,
})

const makeSlash = (validatorId: string): SlashEvent => ({
  id: `slash-${Date.now()}`, validatorId,
  reason: "double_sign", amount: BigInt("100000000"), timestamp: Date.now(), evidence: "block-evidence",
})

describe("StakeTracker", () => {
  it("register và get hoạt động", () => {
    const t = new StakeTracker()
    t.register(makeRecord("v1"))
    expect(t.get("v1").validatorId).toBe("v1")
  })

  it("updateStake cộng/trừ stake", () => {
    const t = new StakeTracker()
    t.register(makeRecord("v2", BigInt("1000")))
    t.updateStake("v2", BigInt("500"))
    expect(t.get("v2").stake).toBe(BigInt("1500"))
    t.updateStake("v2", -BigInt("200"))
    expect(t.get("v2").stake).toBe(BigInt("1300"))
  })

  it("getTopValidators sort theo stake giảm dần", () => {
    const t = new StakeTracker()
    t.register(makeRecord("a", BigInt("100")))
    t.register(makeRecord("b", BigInt("500")))
    t.register(makeRecord("c", BigInt("300")))
    const top = t.getTopValidators(2)
    expect(top[0]!.validatorId).toBe("b")
    expect(top[1]!.validatorId).toBe("c")
  })
})

describe("SlashingEngine", () => {
  it("slash giảm stake và tăng slashCount", () => {
    const t = new StakeTracker()
    t.register(makeRecord("v3"))
    const s = new SlashingEngine(t)
    s.slash(makeSlash("v3"))
    expect(t.get("v3").slashCount).toBe(1)
  })

  it("jail validator sau 3 lần slash", () => {
    const t = new StakeTracker()
    t.register(makeRecord("v4"))
    const s = new SlashingEngine(t)
    s.slash(makeSlash("v4")); s.slash(makeSlash("v4")); s.slash(makeSlash("v4"))
    expect(t.get("v4").status).toBe("jailed")
  })
})

describe("calculateReputationScore", () => {
  it("score nằm trong 0–100", () => {
    const score = calculateReputationScore(makeRecord("v5"), [])
    expect(score.score).toBeGreaterThanOrEqual(0)
    expect(score.score).toBeLessThanOrEqual(100)
  })

  it("score giảm sau khi bị slash", () => {
    const rec   = makeRecord("v6")
    const base  = calculateReputationScore(rec, [])
    const after = calculateReputationScore(rec, [makeSlash("v6"), makeSlash("v6")])
    expect(after.score).toBeLessThan(base.score)
  })
})

describe("ReputationEngine", () => {
  it("getScore throw VALIDATOR_NOT_FOUND khi chưa đăng ký", () => {
    const engine = new ReputationEngine()
    expect(() => engine.getScore("unknown")).toThrow(ReputationEngineError)
  })
})
