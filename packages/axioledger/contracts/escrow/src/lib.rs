//! # TreasuryEscrowContract — Axioledger On-Chain Escrow
//!
//! Hợp đồng giải ngân tự động `$AXQ` từ quỹ DAO Treasury dựa trên
//! xác minh ZK-Proof KPI từ **ZK-Metrics Coprocessor Oracle**.
//!
//! ## Thông số cố định (v2.1 — MUTEX LOCK)
//! - `EPOCH_BLOCKS = 100_800`   (~7 ngày, block time 6s)
//! - `MAX_RELEASE_BPS = 1_000`  (10% tối đa / milestone)
//! - `ORACLE_COOLDOWN = 1`      (epoch tối thiểu giữa 2 lần giải ngân)
//! - `JURY_SIZE = 15`           (Bồi thẩm đoàn ZK-Jury)
//! - `MIN_JUROR_STAKE = 10_000_000` ($AXQ đơn vị cơ sở)
//!
//! ## Spec nguồn
//! `docs/logic/GENESIS_ALLOCATION.md § 1`

use borsh::{BorshDeserialize, BorshSerialize};
use axioledger_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

// ─── Constants (v2.1 — MUTEX LOCK: không chỉnh sửa nếu không qua DAO vote) ────

/// Số block mỗi Epoch (~7 ngày, block time = 6s)
pub const EPOCH_BLOCKS: u64 = 100_800;

/// Giới hạn giải ngân tối đa mỗi milestone (1_000 BPS = 10%)
pub const MAX_RELEASE_BPS: u64 = 1_000;

/// Số Epoch tối thiểu giữa 2 lần giải ngân cho cùng Grantee
pub const ORACLE_COOLDOWN_EPOCHS: u64 = 1;

/// Số lượng Bồi thẩm viên ZK-Jury mỗi phiên tòa
pub const JURY_SIZE: u8 = 15;

/// Ngưỡng stake tối thiểu để trở thành Juror (đơn vị $AXQ cơ sở)
pub const MIN_JUROR_STAKE: u64 = 10_000_000;

/// Uptime tối thiểu của Juror (basis points — 9_950 = 99.50%)
pub const MIN_JUROR_UPTIME_BPS: u16 = 9_950;

/// Tỷ lệ Slash khi phát hiện Collusion qua ZK-MACI (10_000 BPS = 100%)
pub const SLASH_COLLUSION_BPS: u16 = 10_000;

pub const BASIS_POINTS_DENOMINATOR: u64 = 10_000;

// ─── Error Codes ──────────────────────────────────────────────────────────────

/// Mã lỗi đặc thù của TreasuryEscrowContract
#[derive(Debug, PartialEq)]
pub enum EscrowError {
    /// Grant đã bị deactivate, không thể giải ngân
    GrantInactive,
    /// Chưa đủ thời gian cooldown giữa 2 lần giải ngân
    EpochCooldown,
    /// Số tiền giải ngân = 0
    ZeroAmount,
    /// Số tiền vượt quá ngưỡng 10% / milestone
    ExceedsReleaseCap,
    /// ZK-Proof không hợp lệ từ Oracle
    ZkProofInvalid,
    /// Địa chỉ Grantee không hợp lệ
    InvalidGrantee,
    /// Tổng ngân sách cấp phép bằng 0
    ZeroAllocation,
    /// Tài khoản không có chữ ký hợp lệ
    MissingSignature,
    /// Dữ liệu instruction không thể deserialize
    InvalidInstructionData,
}

impl From<EscrowError> for ProgramError {
    fn from(e: EscrowError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

// ─── State ────────────────────────────────────────────────────────────────────

/// Trạng thái Grant được lưu trữ On-chain trong Escrow Account
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub struct EscrowGrantState {
    /// Đã được khởi tạo
    pub is_initialized: bool,

    /// Địa chỉ ví nhận grant
    pub grantee: Pubkey,

    /// Tổng `$AXQ` được cấp phép (đơn vị cơ sở)
    pub total_allocated: u64,

    /// Tổng `$AXQ` đã giải ngân tích lũy
    pub released_amount: u64,

    /// Epoch của lần giải ngân gần nhất (0 = chưa giải ngân lần nào)
    pub last_epoch_released: u64,

    /// Grant còn đang hoạt động
    pub is_active: bool,
}

impl EscrowGrantState {
    /// Tính số dư chưa giải ngân
    pub fn remaining_balance(&self) -> u64 {
        self.total_allocated.saturating_sub(self.released_amount)
    }

    /// Tính ngưỡng giải ngân tối đa cho 1 milestone (10% tổng ngân sách)
    pub fn max_milestone_release(&self) -> u64 {
        self.total_allocated
            .saturating_mul(MAX_RELEASE_BPS)
            / BASIS_POINTS_DENOMINATOR
    }
}

// ─── Instructions ─────────────────────────────────────────────────────────────

/// Tập lệnh hợp đồng Escrow
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum EscrowInstruction {
    /// Khởi tạo Grant mới trong Escrow
    Initialize {
        /// Địa chỉ ví Grantee
        grantee: Pubkey,
        /// Tổng `$AXQ` cấp phép
        total_allocated: u64,
    },

    /// Giải ngân milestone dựa trên ZK-KPI Proof
    ReleaseMilestone {
        /// Epoch mục tiêu
        target_epoch: u64,
        /// Số lượng `$AXQ` giải ngân
        release_amount: u64,
        /// ZK-Proof bytes từ Oracle Coprocessor (tối đa 512 bytes)
        zk_metric_proof: Vec<u8>,
    },

    /// Đóng băng Grant — không thể giải ngân thêm
    DeactivateGrant,
}

// ─── Entrypoint ───────────────────────────────────────────────────────────────

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = EscrowInstruction::try_from_slice(instruction_data)
        .map_err(|_| EscrowError::InvalidInstructionData)?;

    match instruction {
        EscrowInstruction::Initialize { grantee, total_allocated } => {
            msg!("[TreasuryEscrow] Initialize grant for {:?}", grantee);
            process_initialize(program_id, accounts, grantee, total_allocated)
        }

        EscrowInstruction::ReleaseMilestone {
            target_epoch,
            release_amount,
            zk_metric_proof,
        } => {
            msg!(
                "[TreasuryEscrow] ReleaseMilestone epoch={} amount={}",
                target_epoch,
                release_amount
            );
            process_release_milestone(
                program_id,
                accounts,
                target_epoch,
                release_amount,
                &zk_metric_proof,
            )
        }

        EscrowInstruction::DeactivateGrant => {
            msg!("[TreasuryEscrow] DeactivateGrant");
            process_deactivate(program_id, accounts)
        }
    }
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

fn process_initialize(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    grantee: Pubkey,
    total_allocated: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let escrow_account = next_account_info(accounts_iter)?;
    let admin_account  = next_account_info(accounts_iter)?;

    if !admin_account.is_signer {
        return Err(EscrowError::MissingSignature.into());
    }
    if total_allocated == 0 {
        return Err(EscrowError::ZeroAllocation.into());
    }

    let state = EscrowGrantState {
        is_initialized:    true,
        grantee,
        total_allocated,
        released_amount:    0,
        last_epoch_released: 0,
        is_active:          true,
    };

    state.serialize(&mut *escrow_account.data.borrow_mut())?;

    msg!(
        "[TreasuryEscrow] Initialized: grantee={:?} allocated={}",
        state.grantee,
        state.total_allocated
    );
    Ok(())
}

fn process_release_milestone(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    target_epoch: u64,
    release_amount: u64,
    zk_metric_proof: &[u8],
) -> ProgramResult {
    let accounts_iter       = &mut accounts.iter();
    let escrow_account      = next_account_info(accounts_iter)?;
    let grantee_account     = next_account_info(accounts_iter)?;
    let oracle_verifier_acc = next_account_info(accounts_iter)?;

    let mut state = EscrowGrantState::try_from_slice(&escrow_account.data.borrow())
        .map_err(|_| EscrowError::InvalidInstructionData)?;

    // Guard 1 — Grant phải đang hoạt động
    if !state.is_active {
        msg!("[TreasuryEscrow] ERROR: Grant is inactive");
        return Err(EscrowError::GrantInactive.into());
    }

    // Guard 2 — Epoch Cooldown
    if target_epoch <= state.last_epoch_released {
        msg!(
            "[TreasuryEscrow] ERROR: Epoch cooldown (target={} <= last={})",
            target_epoch,
            state.last_epoch_released
        );
        return Err(EscrowError::EpochCooldown.into());
    }

    // Guard 3 — Số tiền > 0
    if release_amount == 0 {
        return Err(EscrowError::ZeroAmount.into());
    }

    // Guard 4 — Không vượt 10% tổng ngân sách / milestone
    let max_release = state.max_milestone_release();
    if release_amount > max_release {
        msg!(
            "[TreasuryEscrow] ERROR: ExceedsReleaseCap (requested={} > max={})",
            release_amount,
            max_release
        );
        return Err(EscrowError::ExceedsReleaseCap.into());
    }

    // Guard 5 — Xác minh ZK-Proof từ Oracle Coprocessor
    let proof_valid = verify_zk_oracle_proof(
        oracle_verifier_acc,
        zk_metric_proof,
        release_amount,
    )?;
    if !proof_valid {
        msg!("[TreasuryEscrow] ERROR: ZK-Metrics Proof Verification Failed");
        return Err(EscrowError::ZkProofInvalid.into());
    }

    // Commit state
    state.released_amount    += release_amount;
    state.last_epoch_released = target_epoch;
    state.serialize(&mut *escrow_account.data.borrow_mut())?;

    msg!(
        "[TreasuryEscrow] Disbursed {} $AXQ to {:?} at epoch {}",
        release_amount,
        state.grantee,
        target_epoch
    );
    let _ = grantee_account; // transfer handled by token program in production
    Ok(())
}

fn process_deactivate(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let escrow_account = next_account_info(accounts_iter)?;
    let admin_account  = next_account_info(accounts_iter)?;

    if !admin_account.is_signer {
        return Err(EscrowError::MissingSignature.into());
    }

    let mut state = EscrowGrantState::try_from_slice(&escrow_account.data.borrow())
        .map_err(|_| EscrowError::InvalidInstructionData)?;

    state.is_active = false;
    state.serialize(&mut *escrow_account.data.borrow_mut())?;

    msg!("[TreasuryEscrow] Grant deactivated for {:?}", state.grantee);
    Ok(())
}

// ─── ZK-Proof Verifier ────────────────────────────────────────────────────────

/// Hằng số phân biệt môi trường build.
///
/// Trong môi trường `cfg(feature = "testnet-stub")`, logic xác minh rút gọn
/// được phép để chạy Unit Test local. Tính năng này **không bao giờ** được
/// bật trong bản build Mainnet hoặc Testnet public.
///
/// Quy tắc CI/CD:
///   - build Mainnet : `cargo build --release` (không có flag stub)
///   - build Devnet  : `cargo build --features testnet-stub` (chỉ local)
///
/// Xác minh ZK-Proof từ ZK-Metrics Coprocessor Oracle.
///
/// Luồng Production:
///   1. Deserialize `proof` thành `VerifierInstructionData`
///   2. Gọi CPI sang `@veraciphers/on-chain-verifier` program
///   3. Verifier program kiểm tra Halo2/PlonKy2 proof với VKey đã đăng ký
///   4. Trả về `Ok(true)` khi proof hợp lệ
///
/// SECURITY: Bất kỳ thay đổi nào trong hàm này phải qua Pull Request review
/// bởi ít nhất 2 Lead Engineer và 1 thành viên Security Team trước khi merge.
fn verify_zk_oracle_proof(
    verifier_account: &AccountInfo,
    proof: &[u8],
    expected_amount: u64,
) -> Result<bool, ProgramError> {
    if proof.is_empty() {
        msg!("[TreasuryEscrow] SECURITY: proof bytes rỗng — từ chối xác minh");
        return Ok(false);
    }

    // Kiểm tra độ dài tối thiểu hợp lý của proof (tránh trivial bypass)
    // Halo2 proof tối thiểu ~256 bytes; PlonKy2 tối thiểu ~128 bytes
    const MIN_PROOF_LEN: usize = 64;
    if proof.len() < MIN_PROOF_LEN {
        msg!(
            "[TreasuryEscrow] SECURITY: proof quá ngắn ({} bytes, tối thiểu {})",
            proof.len(),
            MIN_PROOF_LEN
        );
        return Ok(false);
    }

    #[cfg(feature = "testnet-stub")]
    {
        // CHỈ dùng cho unit test local — KHÔNG được build lên bất kỳ mạng nào
        msg!("[TreasuryEscrow] TESTNET-STUB: Bỏ qua CPI verification (feature = testnet-stub)");
        let _ = verifier_account;
        let _ = expected_amount;
        return Ok(proof[0] != 0x00);
    }

    #[cfg(not(feature = "testnet-stub"))]
    {
        // ── Production path ────────────────────────────────────────────────────
        // Gọi CPI sang @veraciphers/on-chain-verifier program.
        //
        // Instruction layout (Borsh):
        //   [0..4]   : discriminator = [0xAX, 0x10, 0xVF, 0x01]  (VerifyProof)
        //   [4..8]   : expected_amount: u64 (little-endian)
        //   [8..]    : proof bytes
        //
        // TODO(Phase-2): Điền VERACIPHERS_VERIFIER_PROGRAM_ID khi contract được
        // deploy và audit. Xem: packages/veraciphers/on-chain-verifier/
        //
        // Đây là guard cuối cùng trước khi giải ngân Treasury — KHÔNG được
        // bỏ qua hoặc mock trong bất kỳ môi trường non-local nào.

        msg!(
            "[TreasuryEscrow] ERROR: @veraciphers/on-chain-verifier CPI chưa được tích hợp. \
             Deploy bị chặn cho đến khi Phase-2 hoàn thành. \
             Xem: packages/veraciphers/on-chain-verifier/"
        );

        // Trả về lỗi rõ ràng để ngăn giải ngân thay vì silently fail
        let _ = verifier_account;
        let _ = expected_amount;
        Err(EscrowError::ZkProofInvalid.into())
    }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    fn make_state(total: u64) -> EscrowGrantState {
        EscrowGrantState {
            is_initialized: true,
            grantee: Pubkey::default(),
            total_allocated: total,
            released_amount: 0,
            last_epoch_released: 0,
            is_active: true,
        }
    }

    #[test]
    fn test_max_milestone_release_10_percent() {
        let state = make_state(1_000_000_000_000);
        assert_eq!(state.max_milestone_release(), 100_000_000_000);
    }

    #[test]
    fn test_remaining_balance_full_on_init() {
        let state = make_state(1_000_000);
        assert_eq!(state.remaining_balance(), 1_000_000);
    }

    #[test]
    fn test_remaining_balance_after_release() {
        let mut state = make_state(1_000_000);
        state.released_amount = 100_000;
        assert_eq!(state.remaining_balance(), 900_000);
    }

    #[test]
    fn test_constants_match_spec_v2_1() {
        assert_eq!(EPOCH_BLOCKS, 100_800);
        assert_eq!(MAX_RELEASE_BPS, 1_000);
        assert_eq!(ORACLE_COOLDOWN_EPOCHS, 1);
        assert_eq!(JURY_SIZE, 15);
        assert_eq!(MIN_JUROR_STAKE, 10_000_000);
        assert_eq!(MIN_JUROR_UPTIME_BPS, 9_950);
        assert_eq!(SLASH_COLLUSION_BPS, 10_000);
    }
}
