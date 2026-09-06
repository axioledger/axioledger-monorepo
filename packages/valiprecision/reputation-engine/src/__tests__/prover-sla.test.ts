/**
 * @valiprecision/reputation-engine — ProverSlaTracker Test Suite
 */
import { describe, it, expect, beforeEach } from "vitest"
import {
  ProverSlaTracker,
  DEFAULT_PROVER_SLA_THRESHOLDS,
} from "../prover-sla.js"

let clock = 1_000_000
const nowFn = () => clock

function makeTracker() {
  clock = 1_000_000
  return new ProverSlaTracker(DEFAULT_PROVER_SLA_THRESHOLDS, nowFn)
}

const STAKE = 10_000_000_000n  // 10,000 VRQ in μVRQ

describe("ProverSlaTracker — registration", () => {
  it("registers a prover and returns initial record", () => {
    const t = makeTracker()
    const r = t.registerProver("prover-1", STAKE)
    expect(r.proverId).toBe("prover-1")
    expect(r.stakeVrq).toBe(STAKE)
    expect(r.completedJobs).toBe(0)
    expect(r.suspended).toBe(false)
  })

  it("throws when accessing unregistered prover", () => {
    const t = makeTracker()
    expect(() => t.getProver("ghost")).toThrow("not found")
  })
})

describe("ProverSlaTracker — success recording & p99 latency", () => {
  it("updates completedJobs and p99 on success", () => {
    const t = makeTracker()
    t.registerProver("p1", STAKE)
    t.recordSuccess("p1", 5_000)
    t.recordSuccess("p1", 8_000)
    t.recordSuccess("p1", 3_000)
    const r = t.getProver("p1")
    expect(r.completedJobs).toBe(3)
    expect(r.p99LatencyMs).toBeGreaterThan(0)
  })

  it("triggers latency SLA breach when p99 exceeds threshold", () => {
    const t = makeTracker()
    t.registerProver("p2", STAKE)
    // Flood with latencies above the 30s default threshold
    for (let i = 0; i < 20; i++) t.recordSuccess("p2", 40_000)
    const violations = t.getViolations("p2")
    expect(violations.some((v) => v.reason === "latency_sla_breach")).toBe(true)
  })
})

describe("ProverSlaTracker — SLA violations & slashing", () => {
  it("recordDeadlineExceeded slashes 50% of stake", () => {
    const t = makeTracker()
    t.registerProver("p3", STAKE)
    const v = t.recordDeadlineExceeded("p3", "job-1")
    expect(v.reason).toBe("deadline_exceeded")
    // 50% of STAKE
    expect(v.slashAmountVrq).toBe(STAKE / 2n)
    expect(t.getProver("p3").stakeVrq).toBe(STAKE / 2n)
    expect(t.getProver("p3").failedJobs).toBe(1)
  })

  it("recordInvalidProof slashes 100% of stake", () => {
    const t = makeTracker()
    t.registerProver("p4", STAKE)
    const v = t.recordInvalidProof("p4", "job-2")
    expect(v.reason).toBe("invalid_proof")
    expect(v.slashAmountVrq).toBe(STAKE)
    expect(t.getProver("p4").stakeVrq).toBe(0n)
  })

  it("recordOffline slashes 25% of stake", () => {
    const t = makeTracker()
    t.registerProver("p5", STAKE)
    const v = t.recordOffline("p5", "job-3")
    expect(v.reason).toBe("provider_offline")
    expect(v.slashAmountVrq).toBe(STAKE / 4n)
  })

  it("suspends prover after 3 violations in rolling window", () => {
    const t = makeTracker()
    t.registerProver("p6", STAKE * 100n)  // large stake so not drained

    for (let i = 0; i < 3; i++) {
      t.recordDeadlineExceeded("p6", `job-${i}`)
    }
    expect(t.getProver("p6").suspended).toBe(true)
  })

  it("does NOT suspend if violations are outside rolling window", () => {
    const t = makeTracker()
    t.registerProver("p7", STAKE * 100n)

    for (let i = 0; i < 2; i++) {
      t.recordDeadlineExceeded("p7", `job-${i}`)
    }
    // Advance clock beyond the 7-day rolling window
    clock += DEFAULT_PROVER_SLA_THRESHOLDS.rollingWindowMs + 1
    t.recordDeadlineExceeded("p7", "job-out")
    // Only 1 violation is in-window — not 3 — should not suspend
    expect(t.getProver("p7").suspended).toBe(false)
  })
})

describe("ProverSlaTracker — reputation scoring", () => {
  it("new prover (no data) scores near max (benefit of doubt)", () => {
    const t = makeTracker()
    t.registerProver("fresh", STAKE)
    const score = t.computeScore("fresh")
    expect(score.finalScore).toBeGreaterThanOrEqual(60)
    expect(score.latencyBonus).toBe(20)  // full bonus — no data
    expect(score.slaViolationPenalty).toBe(0)
  })

  it("violations reduce score, latency bonus increases score", () => {
    const t = makeTracker()
    t.registerProver("mixed", STAKE * 100n)
    t.recordDeadlineExceeded("mixed", "j1")  // penalty +10
    for (let i = 0; i < 10; i++) t.recordSuccess("mixed", 1_000)  // fast → latency bonus

    const score = t.computeScore("mixed")
    expect(score.slaViolationPenalty).toBe(10)
    expect(score.finalScore).toBeLessThan(80)
  })

  it("toSlashEvent converts to legacy SlashEvent format", () => {
    const t = makeTracker()
    t.registerProver("legacy", STAKE)
    const violation = t.recordDeadlineExceeded("legacy", "job-x")
    const ev = t.toSlashEvent(violation)
    expect(ev.validatorId).toBe("legacy")
    expect(ev.reason).toBe("downtime")
    expect(ev.amount).toBe(violation.slashAmountVrq)
    expect(ev.evidence).toContain("prover_sla")
  })
})
