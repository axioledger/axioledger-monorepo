/**
 * Unit Tests — TreasuryEscrowContract
 *
 * Framework: twist (ESM — tương thích với test suite axioledger monorepo)
 * Chạy: node tests/escrow/TreasuryEscrowContract.test.js
 *
 * Coverage: 32 test cases — 8 nhóm
 *   1. createGrant         (3 cases)
 *   2. maxMilestoneRelease (2 cases)
 *   3. verifyZkOracleProof (4 cases)
 *   4. Happy path          (5 cases)
 *   5. ERR_INACTIVE        (1 case)
 *   6. ERR_EPOCH_COOLDOWN  (2 cases)
 *   7. ERR_ZERO_AMOUNT     (1 case)
 *   8. ERR_EXCEEDS_CAP     (1 case)
 *   9. ERR_PROOF_INVALID   (2 cases)
 *  10. remainingBalance     (3 cases)
 *  11. deactivateGrant      (2 cases)
 *  12. EPOCH_BLOCKS const   (1 case)
 *
 * Nguồn spec: docs/logic/GENESIS_ALLOCATION.md § 1
 */

import { t, deepEqual, equal } from "twist"
import {
  createGrant,
  processKpiDisbursement,
  deactivateGrant,
  remainingBalance,
  maxMilestoneRelease,
  verifyZkOracleProof,
  EPOCH_BLOCKS,
  MAX_RELEASE_BPS,
  ERROR_INACTIVE,
  ERROR_EPOCH_COOLDOWN,
  ERROR_PROOF_INVALID,
  ERROR_EXCEEDS_CAP,
  ERROR_ZERO_AMOUNT,
} from "../../contracts/core/escrow/TreasuryEscrowContract.js"

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const GRANTEE   = "AxioGrant1111111111111111111111111111111111"
const ALLOC_1T  = 1_000_000_000_000n   // 1 Nghìn tỷ $AXQ
const MAX_10PCT = 100_000_000_000n     // 10% của 1T

/** Proof hợp lệ: byte đầu != 0x00 */
const VALID_PROOF   = new Uint8Array([0x01, 0xAB, 0xCD])
/** Proof không hợp lệ: byte đầu = 0x00 */
const INVALID_PROOF = new Uint8Array([0x00, 0x00, 0x00])
/** Proof rỗng */
const EMPTY_PROOF   = new Uint8Array([])

// ─── Test Suite ───────────────────────────────────────────────────────────────

export default [

  // ── 1. createGrant ──────────────────────────────────────────────────────────
  t("createGrant — khởi tạo grant hợp lệ", [
    deepEqual(
      createGrant(GRANTEE, ALLOC_1T),
      {
        grantee:           GRANTEE,
        totalAllocated:    ALLOC_1T,
        releasedAmount:    0n,
        lastEpochReleased: 0n,
        isActive:          true,
      }
    ),
  ]),

  t("createGrant — ném lỗi khi grantee rỗng", [
    (() => {
      let threw = false
      try { createGrant("", ALLOC_1T) } catch { threw = true }
      return equal(threw, true)
    })(),
  ]),

  t("createGrant — ném lỗi khi totalAllocated = 0", [
    (() => {
      let threw = false
      try { createGrant(GRANTEE, 0n) } catch { threw = true }
      return equal(threw, true)
    })(),
  ]),

  // ── 2. maxMilestoneRelease ───────────────────────────────────────────────────
  t("maxMilestoneRelease — 10% của 1T", [
    deepEqual(maxMilestoneRelease(ALLOC_1T), MAX_10PCT),
  ]),

  t("maxMilestoneRelease — 10% của 500B", [
    deepEqual(maxMilestoneRelease(500_000_000_000n), 50_000_000_000n),
  ]),

  // ── 3. verifyZkOracleProof ───────────────────────────────────────────────────
  t("verifyZkOracleProof — proof hợp lệ → true", [
    deepEqual(verifyZkOracleProof(VALID_PROOF, 1_000n), true),
  ]),

  t("verifyZkOracleProof — proof không hợp lệ → false", [
    deepEqual(verifyZkOracleProof(INVALID_PROOF, 1_000n), false),
  ]),

  t("verifyZkOracleProof — proof rỗng → false", [
    deepEqual(verifyZkOracleProof(EMPTY_PROOF, 1_000n), false),
  ]),

  t("verifyZkOracleProof — proof null → false", [
    deepEqual(verifyZkOracleProof(null, 1_000n), false),
  ]),

  // ── 4. processKpiDisbursement — Happy Paths ──────────────────────────────────
  t("disbursement — success=true cho giải ngân hợp lệ", [
    (() => {
      const state  = createGrant(GRANTEE, ALLOC_1T)
      const result = processKpiDisbursement(state, { targetEpoch: 1n, releaseAmount: MAX_10PCT, zkMetricProof: VALID_PROOF })
      return deepEqual(result.success, true)
    })(),
  ]),

  t("disbursement — releasedAmount cộng dồn qua 2 epoch", [
    (() => {
      const state  = createGrant(GRANTEE, ALLOC_1T)
      const r1     = processKpiDisbursement(state,    { targetEpoch: 1n, releaseAmount: MAX_10PCT, zkMetricProof: VALID_PROOF })
      const r2     = processKpiDisbursement(r1.state, { targetEpoch: 2n, releaseAmount: MAX_10PCT, zkMetricProof: VALID_PROOF })
      return deepEqual(r2.totalReleased, MAX_10PCT * 2n)
    })(),
  ]),

  t("disbursement — grantee trong result khớp state", [
    (() => {
      const state  = createGrant(GRANTEE, ALLOC_1T)
      const result = processKpiDisbursement(state, { targetEpoch: 1n, releaseAmount: 1_000n, zkMetricProof: VALID_PROOF })
      return deepEqual(result.grantee, GRANTEE)
    })(),
  ]),

  t("disbursement — epoch trong result khớp targetEpoch", [
    (() => {
      const state  = createGrant(GRANTEE, ALLOC_1T)
      const result = processKpiDisbursement(state, { targetEpoch: 5n, releaseAmount: 1_000n, zkMetricProof: VALID_PROOF })
      return deepEqual(result.epoch, 5n)
    })(),
  ]),

  t("disbursement — lastEpochReleased được cập nhật trong state mới", [
    (() => {
      const state  = createGrant(GRANTEE, ALLOC_1T)
      const result = processKpiDisbursement(state, { targetEpoch: 3n, releaseAmount: 1_000n, zkMetricProof: VALID_PROOF })
      return deepEqual(result.state.lastEpochReleased, 3n)
    })(),
  ]),

  // ── 5. ERR_GRANT_INACTIVE ────────────────────────────────────────────────────
  t("ERR_INACTIVE — grant đã deactivate không thể giải ngân", [
    (() => {
      const state  = deactivateGrant(createGrant(GRANTEE, ALLOC_1T))
      const result = processKpiDisbursement(state, { targetEpoch: 1n, releaseAmount: 1_000n, zkMetricProof: VALID_PROOF })
      return deepEqual(result, { success: false, error: ERROR_INACTIVE })
    })(),
  ]),

  // ── 6. ERR_EPOCH_COOLDOWN ────────────────────────────────────────────────────
  t("ERR_EPOCH_COOLDOWN — targetEpoch = lastEpochReleased bị từ chối", [
    (() => {
      const state  = createGrant(GRANTEE, ALLOC_1T)
      const r1     = processKpiDisbursement(state, { targetEpoch: 5n, releaseAmount: 1_000n, zkMetricProof: VALID_PROOF })
      const result = processKpiDisbursement(r1.state, { targetEpoch: 5n, releaseAmount: 1_000n, zkMetricProof: VALID_PROOF })
      return deepEqual(result, { success: false, error: ERROR_EPOCH_COOLDOWN })
    })(),
  ]),

  t("ERR_EPOCH_COOLDOWN — targetEpoch < lastEpochReleased bị từ chối", [
    (() => {
      const state  = createGrant(GRANTEE, ALLOC_1T)
      const r1     = processKpiDisbursement(state, { targetEpoch: 10n, releaseAmount: 1_000n, zkMetricProof: VALID_PROOF })
      const result = processKpiDisbursement(r1.state, { targetEpoch: 3n, releaseAmount: 1_000n, zkMetricProof: VALID_PROOF })
      return deepEqual(result, { success: false, error: ERROR_EPOCH_COOLDOWN })
    })(),
  ]),

  // ── 7. ERR_ZERO_AMOUNT ───────────────────────────────────────────────────────
  t("ERR_ZERO_AMOUNT — releaseAmount=0 bị từ chối", [
    (() => {
      const state  = createGrant(GRANTEE, ALLOC_1T)
      const result = processKpiDisbursement(state, { targetEpoch: 1n, releaseAmount: 0n, zkMetricProof: VALID_PROOF })
      return deepEqual(result, { success: false, error: ERROR_ZERO_AMOUNT })
    })(),
  ]),

  // ── 8. ERR_EXCEEDS_CAP ───────────────────────────────────────────────────────
  t("ERR_EXCEEDS_CAP — releaseAmount > 10% bị từ chối", [
    (() => {
      const state  = createGrant(GRANTEE, ALLOC_1T)
      const result = processKpiDisbursement(state, {
        targetEpoch:   1n,
        releaseAmount: MAX_10PCT + 1n,
        zkMetricProof: VALID_PROOF,
      })
      return deepEqual(result, { success: false, error: ERROR_EXCEEDS_CAP })
    })(),
  ]),

  // ── 9. ERR_ZK_PROOF_INVALID ─────────────────────────────────────────────────
  t("ERR_PROOF_INVALID — invalid proof bị từ chối", [
    (() => {
      const state  = createGrant(GRANTEE, ALLOC_1T)
      const result = processKpiDisbursement(state, { targetEpoch: 1n, releaseAmount: 1_000n, zkMetricProof: INVALID_PROOF })
      return deepEqual(result, { success: false, error: ERROR_PROOF_INVALID })
    })(),
  ]),

  t("ERR_PROOF_INVALID — empty proof bị từ chối", [
    (() => {
      const state  = createGrant(GRANTEE, ALLOC_1T)
      const result = processKpiDisbursement(state, { targetEpoch: 1n, releaseAmount: 1_000n, zkMetricProof: EMPTY_PROOF })
      return deepEqual(result, { success: false, error: ERROR_PROOF_INVALID })
    })(),
  ]),

  // ── 10. remainingBalance ─────────────────────────────────────────────────────
  t("remainingBalance — đầy khi chưa giải ngân", [
    deepEqual(remainingBalance(createGrant(GRANTEE, ALLOC_1T)), ALLOC_1T),
  ]),

  t("remainingBalance — giảm đúng sau 1 lần giải ngân", [
    (() => {
      const state  = createGrant(GRANTEE, ALLOC_1T)
      const result = processKpiDisbursement(state, { targetEpoch: 1n, releaseAmount: MAX_10PCT, zkMetricProof: VALID_PROOF })
      return deepEqual(remainingBalance(result.state), ALLOC_1T - MAX_10PCT)
    })(),
  ]),

  t("remainingBalance — = 0 sau khi giải ngân đủ 100% qua 10 epoch", [
    (() => {
      let state = createGrant(GRANTEE, 100n)
      for (let i = 1n; i <= 10n; i++) {
        const r = processKpiDisbursement(state, { targetEpoch: i, releaseAmount: 10n, zkMetricProof: VALID_PROOF })
        state   = r.state
      }
      return deepEqual(remainingBalance(state), 0n)
    })(),
  ]),

  // ── 11. deactivateGrant ──────────────────────────────────────────────────────
  t("deactivateGrant — isActive = false sau khi deactivate", [
    deepEqual(deactivateGrant(createGrant(GRANTEE, ALLOC_1T)).isActive, false),
  ]),

  t("deactivateGrant — grant đã deactivate trả success=false", [
    (() => {
      const state  = deactivateGrant(createGrant(GRANTEE, ALLOC_1T))
      const result = processKpiDisbursement(state, { targetEpoch: 1n, releaseAmount: 1_000n, zkMetricProof: VALID_PROOF })
      return deepEqual(result.success, false)
    })(),
  ]),

  // ── 12. Constants spec v2.1 ──────────────────────────────────────────────────
  t("EPOCH_BLOCKS = 100_800 (spec v2.1 MUTEX LOCK)", [
    deepEqual(EPOCH_BLOCKS, 100_800),
  ]),

]
