/**
 * TreasuryEscrowContract — Axioledger On-chain Logic Simulation
 *
 * Mô phỏng logic của hợp đồng Rust trên Axio-Stateless SVM.
 * Dùng cho unit testing Localnet và tích hợp CI trước khi deploy lên chain.
 *
 * Nguồn spec: docs/logic/GENESIS_ALLOCATION.md § 1
 */

// ─── Constants ────────────────────────────────────────────────────────────────

export const EPOCH_BLOCKS         = 100_800          // 1 Epoch ≈ 7 ngày
export const MAX_RELEASE_BPS      = 1000             // 10% / milestone (basis points)
export const ERROR_INACTIVE       = "ERR_GRANT_INACTIVE"
export const ERROR_EPOCH_COOLDOWN = "ERR_EPOCH_COOLDOWN"
export const ERROR_PROOF_INVALID  = "ERR_ZK_PROOF_INVALID"
export const ERROR_EXCEEDS_CAP    = "ERR_EXCEEDS_RELEASE_CAP"
export const ERROR_ZERO_AMOUNT    = "ERR_ZERO_AMOUNT"

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} EscrowGrantState
 * @property {string}  grantee              — Địa chỉ ví nhận grant (Pubkey)
 * @property {bigint}  totalAllocated        — Tổng $AXQ được cấp phép
 * @property {bigint}  releasedAmount        — Tổng $AXQ đã giải ngân
 * @property {bigint}  lastEpochReleased     — Epoch cuối đã giải ngân
 * @property {boolean} isActive             — Trạng thái hoạt động
 */

/**
 * @typedef {Object} KpiReleaseInstruction
 * @property {bigint}     targetEpoch       — Epoch mục tiêu giải ngân
 * @property {bigint}     releaseAmount     — Số lượng $AXQ giải ngân
 * @property {Uint8Array} zkMetricProof     — ZK-Proof bytes từ Oracle
 */

/**
 * @typedef {Object} DisbursementResult
 * @property {boolean} success
 * @property {string}  [error]
 * @property {bigint}  [releasedAmount]
 * @property {bigint}  [totalReleased]
 * @property {string}  [grantee]
 * @property {bigint}  [epoch]
 */

// ─── ZK-Proof Verifier ────────────────────────────────────────────────────────

/**
 * Xác minh ZK-Proof từ ZK-Metrics Coprocessor Oracle.
 *
 * Luồng Production (Phase-2):
 *   Gọi @veraciphers/zk-prover-runtime verifier để xác minh proof bytes qua
 *   Halo2/PlonKy2 Verifier với VKey đã đăng ký.
 *
 * Luồng Devnet (AXIO_ENV=devnet):
 *   Cho phép kiểm tra ngắn gọn hơn để chạy unit test, nhưng vẫn yêu cầu
 *   proof có độ dài tối thiểu và byte đầu != 0x00.
 *
 * SECURITY:
 *   - Hàm này là guard cuối cùng trước khi giải ngân Treasury.
 *   - Mọi thay đổi phải qua code review bởi ít nhất 2 người.
 *   - Môi trường Production (AXIO_ENV=production) throw ngay lập tức nếu
 *     @veraciphers/zk-prover-runtime chưa được cấu hình.
 *
 * @param {Uint8Array} proof           - ZK-Proof bytes từ Oracle
 * @param {bigint}     expectedAmount  - Số lượng $AXQ cần giải ngân (để tích hợp vào public inputs)
 * @returns {boolean}
 * @throws {Error} Trong môi trường Production khi verifier chưa được cấu hình
 */
export function verifyZkOracleProof(proof, expectedAmount) {
  if (!proof || proof.length === 0) return false

  // Kiểm tra độ dài tối thiểu — ngăn trivial single-byte bypass
  // Halo2 proof tối thiểu ~256 bytes; đặt ngưỡng bảo thủ 64 bytes cho unit test
  const MIN_PROOF_LEN = 64
  if (proof.length < MIN_PROOF_LEN) {
    return false
  }

  const env = (typeof process !== "undefined" && process.env?.AXIO_ENV) ?? "devnet"

  if (env === "production" || env === "mainnet") {
    // ── Production path ───────────────────────────────────────────────────────
    // TODO(Phase-2): Import và gọi @veraciphers/zk-prover-runtime verifier.
    // Ví dụ:
    //   const { Halo2Verifier } = await import('@veraciphers/zk-prover-runtime')
    //   const vk = await loadVerifyingKey(ESCROW_CIRCUIT_VK_PATH)
    //   return await new Halo2Verifier(vk).verify(proof, [expectedAmount])
    //
    // Xem: packages/veraciphers/zk-prover-runtime/
    throw new Error(
      "CRITICAL: verifyZkOracleProof — @veraciphers/zk-prover-runtime chưa được tích hợp. " +
      "Deploy bị chặn cho đến khi Phase-2 hoàn thành. " +
      "Xem: packages/veraciphers/zk-prover-runtime/"
    )
  }

  // ── Devnet / Unit-test path ───────────────────────────────────────────────
  // Kiểm tra đơn giản: proof[0] != 0x00 và độ dài đủ lớn.
  // CHỈ chạy khi AXIO_ENV != production|mainnet.
  return proof[0] !== 0x00
}

// ─── Core Contract Logic ──────────────────────────────────────────────────────

/**
 * Tạo trạng thái grant mới cho một Grantee.
 * @param {string}  grantee
 * @param {bigint}  totalAllocated
 * @returns {EscrowGrantState}
 */
export function createGrant(grantee, totalAllocated) {
  if (!grantee || grantee.length === 0) throw new Error("ERR_INVALID_GRANTEE")
  if (totalAllocated <= 0n) throw new Error("ERR_ZERO_ALLOCATION")
  return {
    grantee,
    totalAllocated,
    releasedAmount: 0n,
    lastEpochReleased: 0n,
    isActive: true,
  }
}

/**
 * Xử lý lệnh giải ngân KPI — tương đương `process_kpi_disbursement` trong Rust.
 *
 * @param {EscrowGrantState}    state
 * @param {KpiReleaseInstruction} instruction
 * @returns {DisbursementResult}
 */
export function processKpiDisbursement(state, instruction) {
  const { targetEpoch, releaseAmount, zkMetricProof } = instruction

  // 1. Kiểm tra grant còn hoạt động
  if (!state.isActive) {
    return { success: false, error: ERROR_INACTIVE }
  }

  // 2. Kiểm tra cooldown Epoch (phải > lastEpochReleased)
  if (targetEpoch <= state.lastEpochReleased) {
    return { success: false, error: ERROR_EPOCH_COOLDOWN }
  }

  // 3. Kiểm tra amount > 0
  if (releaseAmount <= 0n) {
    return { success: false, error: ERROR_ZERO_AMOUNT }
  }

  // 4. Kiểm tra không vượt quá 10% tổng ngân sách / milestone
  const maxRelease = (state.totalAllocated * BigInt(MAX_RELEASE_BPS)) / 10_000n
  if (releaseAmount > maxRelease) {
    return { success: false, error: ERROR_EXCEEDS_CAP }
  }

  // 5. Xác minh ZK-Proof từ Oracle
  if (!verifyZkOracleProof(zkMetricProof, releaseAmount)) {
    return { success: false, error: ERROR_PROOF_INVALID }
  }

  // 6. Commit state mutation & giải ngân
  const newState = {
    ...state,
    releasedAmount:    state.releasedAmount + releaseAmount,
    lastEpochReleased: targetEpoch,
  }

  return {
    success: true,
    releasedAmount: releaseAmount,
    totalReleased:  newState.releasedAmount,
    grantee:        state.grantee,
    epoch:          targetEpoch,
    state:          newState,
  }
}

/**
 * Đóng băng grant — không thể giải ngân thêm.
 * @param {EscrowGrantState} state
 * @returns {EscrowGrantState}
 */
export function deactivateGrant(state) {
  return { ...state, isActive: false }
}

/**
 * Tính số tiền còn lại chưa giải ngân.
 * @param {EscrowGrantState} state
 * @returns {bigint}
 */
export function remainingBalance(state) {
  return state.totalAllocated - state.releasedAmount
}

/**
 * Tính tỷ lệ giải ngân tối đa cho 1 milestone (10% tổng ngân sách).
 * @param {bigint} totalAllocated
 * @returns {bigint}
 */
export function maxMilestoneRelease(totalAllocated) {
  return (totalAllocated * BigInt(MAX_RELEASE_BPS)) / 10_000n
}
