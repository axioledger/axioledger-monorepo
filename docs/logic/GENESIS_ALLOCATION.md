# Axioledger — Genesis Allocation & Operational Specs

> **Nguồn chính thức:** [`core.md`](../../core.md)  
> **Phiên bản:** v1.0 · Cập nhật: 2025  
> **Phạm vi:** Smart Contract Escrow · ZK-Jury · Tokenomics 5-Token · Node & Developer Quickstart

---

## Mục Lục

1. [Cơ Chế Smart Contract Escrow (`TreasuryEscrowContract`)](#1-cơ-chế-smart-contract-escrow-treasuryescrowcontract)
2. [Quy Chế ZK-Jury & Bồi Thẩm Đoàn (Axio-Tribunal)](#2-quy-chế-zk-jury-bồi-thẩm-đoàn-axio-tribunal)
3. [Tokenomics Chi Tiết — 5-Token Suite](#3-tokenomics-chi-tiết-—-5-token-suite)
4. [Quickstart Handbook — Node Operators](#4-quickstart-handbook-—-node-operators)
5. [SDK Quickstart — Developers](#5-sdk-quickstart-—-developers)

---

## 1. Cơ Chế Smart Contract Escrow (`TreasuryEscrowContract`)

Hợp đồng `TreasuryEscrowContract` giải ngân tự động `$AXQ` từ quỹ DAO Treasury (2.5 Nghìn tỷ) tới các dự án R&D dựa trên việc xác minh dữ liệu KPI On-chain được đính kèm ZK-Proof từ **ZK-Metrics Coprocessor Oracle**.

### Cấu Hình Tham Số Epoch & Ngưỡng Kích Hoạt

| Tham số | Giá trị | Mô tả |
|---|---|---|
| **Epoch Duration** | `100,800 blocks ≈ 7 ngày` | Đơn vị chu kỳ giải ngân |
| **Oracle Cooldown** | `1 Epoch` | Khoảng cách giữa 2 lần giải ngân liên tiếp cho cùng Grantee |
| **Tỷ lệ giải ngân tối đa** | `10% / milestone` | Tối đa 10% tổng ngân sách được cấp phép mỗi mốc KPI |
| **Min Proof Confidence** | `Absolute` | ZK-Proof Hash phải qua xác minh của Verifier Contract với độ chính xác tuyệt đối |

### Mã Nguồn Mẫu (Rust / Axio-Stateless SVM Contract)

```rust
use axioledger_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct EscrowGrantState {
    pub grantee: Pubkey,
    pub total_allocated: u64,
    pub released_amount: u64,
    pub last_epoch_released: u64,
    pub is_active: bool,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct KpiReleaseInstruction {
    pub target_epoch: u64,
    pub release_amount: u64,
    pub zk_metric_proof: Vec<u8>,
}

pub fn process_kpi_disbursement(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let escrow_acc = next_account_info(accounts_iter)?;
    let grantee_acc = next_account_info(accounts_iter)?;
    let oracle_verifier_acc = next_account_info(accounts_iter)?;

    let mut state = EscrowGrantState::try_from_slice(&escrow_acc.data.borrow())?;
    let instruction = KpiReleaseInstruction::try_from_slice(instruction_data)?;

    // 1. Kiểm tra trạng thái và thời gian Epoch
    if !state.is_active || instruction.target_epoch <= state.last_epoch_released {
        return Err(ProgramError::InvalidInstructionData);
    }

    // 2. Xác minh ZK-Proof từ Oracle Coprocessor
    let is_proof_valid = verify_zk_oracle_proof(
        oracle_verifier_acc,
        &instruction.zk_metric_proof,
        instruction.release_amount,
    )?;

    if !is_proof_valid {
        msg!("ZK-Metrics Proof Verification Failed!");
        return Err(ProgramError::InvalidArgument);
    }

    // 3. Thực hiện giải ngân tự động từ Vault sang Grantee
    state.released_amount += instruction.release_amount;
    state.last_epoch_released = instruction.target_epoch;
    state.serialize(&mut *escrow_acc.data.borrow_mut())?;

    msg!("Disbursed {} $AXQ to Grantee {}", instruction.release_amount, state.grantee);
    Ok(())
}

fn verify_zk_oracle_proof(
    _verifier: &AccountInfo,
    _proof: &[u8],
    _amount: u64,
) -> Result<bool, ProgramError> {
    // Logic gọi Verifier Circuit On-chain
    Ok(true)
}
```

---

## 2. Quy Chế ZK-Jury & Bồi Thẩm Đoàn (Axio-Tribunal)

Hệ thống ZK-Jury chịu trách nhiệm giải quyết tranh chấp, duyệt lỗi Bug Bounty, và kiểm duyệt định danh ZK-DID mà Oracle không xử lý bằng toán học thuần túy được.

### Cơ Chế Lựa Chọn Bồi Thẩm Đoàn

- **Sức mạnh bỏ phiếu (Jury Weight):** Chọn ngẫu nhiên qua VRF từ danh sách `$VPX` Node Operators có chỉ số Uptime > 99.5% và khóa tối thiểu **10,000,000 `$AXQ`**.
- **Size:** Mỗi phiên tòa gồm **15 Bồi thẩm viên (Jurors)** chọn ngẫu nhiên.

### Mô Hình Phạt / Thưởng (Slashing & Incentive Matrix)

| Hành Vi | Quyền Lợi / Hình Phạt | Tác Động Tài Sản |
|---|---|---|
| **Bỏ phiếu thuận theo Đa số (Honest Majority)** | Thưởng phí phiên tòa | +0.05% Phí vụ án (`$AXQ`) + Điểm Reputation |
| **Không tham gia / Bỏ qua lượt (Inactivity)** | Cảnh cáo & Mất Lượt | Trừ 1% `$VPX` Staking Power trong 10 Epochs |
| **Bỏ phiếu sai lệch Đa số (Malicious/Outlier Vote)** | Slashing Bồi thẩm đoàn | Khấu trừ (Slash) 2% `$AXQ` Staked |
| **Thông đồng hối lộ (Collusion — Bị ZK-MACI phát hiện)** | Tước quyền vĩnh viễn | Slash 100% tài sản thế chấp + Ban Node vĩnh viễn |

---

## 3. Tokenomics Chi Tiết — 5-Token Suite

### Phân Bổ `$AXQ` (10 Nghìn Tỷ — Nguồn cung cố định)

```
[ Bể Thanh Khoản       35% ] ───────► Locking 100% tại Mainnet Genesis
[ DAO Treasury         25% ] ─────────► Lock 12 tháng, Unlock 2%/tháng theo KPI
[ Thưởng Đồng Thuận    15% ] ────► Vesting tuyến tính trong 120 tháng (10 năm)
[ L2 Sequentichain     10% ] ─────► Lock 6 tháng, Vesting 36 tháng
[ B2B & RWA Ecosystem  10% ] ──► Lock 3 tháng, Vesting 24 tháng
[ Bug Bounty & Tribunal 5% ] ─► Mở 10% tại TGE, 90% nạp vào Escrow Vault
```

### Bảng Lộ Trình Phân Bổ & Vesting Theo Phase

| Token | Nguồn Cung | Cơ Chế Phát Hành | Lịch Unlock & Vesting |
|---|---|---|---|
| **`$AXQ`** | 10,000,000,000,000 (Cố định) | Không lạm phát. Đốt qua Buyback & Burn Matrix. | Phase 0: Lock Escrow → Phase 1: Unlock 5% → Phase 2: Unlock 15% → Phase 3: 100% Vesting Flow |
| **`$VPX`** | Mint khi Stake `$AXQ` | Phát hành tuyến tính làm thưởng Block (`$VPX` Reward) | Nhận theo Epoch (7 ngày); Slashing nếu vi phạm Uptime |
| **`$SQX`** | Mint theo L2 Gas Usage | Lạm phát dựa trên volume giao dịch L2 | Đốt 50% phí gas trả về `$AXQ`; 50% trả cho Sequencer Nodes |
| **`$KPX`** | Phân bổ Liquidity Mining | Giảm phát định kỳ 20%/năm (Halving model) | Nhận qua LP Pools; Khóa nhận `$veKPX` (1–4 năm) → nhận phí sàn |
| **`$VRQ`** | Mint theo ZK-Proof Generated | Trả theo thực tế công việc sinh bằng chứng (Pay-per-Proof) | Trả trực tiếp cho GPU/FPGA Clusters sau khi Verify Proof thành công |

---

## 4. Quickstart Handbook — Node Operators

> Dành cho Phase 1 — Vận hành Stateless Validator Node (`$VPX`)

### Yêu Cầu Phần Cứng Tối Thiểu

| Thành phần | Yêu cầu |
|---|---|
| **CPU** | 4 Cores (x86_64 hoặc ARM64) |
| **RAM** | 8 GB |
| **Lưu Trữ** | 100 GB NVMe SSD (Stateless — không cần lưu full state) |
| **Băng Thông** | 100 Mbps |

### Các Bước Khởi Chạy

**1. Tải xuống CLI Tooling:**

```bash
curl -sSfL https://get.axioledger.org/cli | sh
axio-cli --version
```

**2. Khởi Tạo Cấu Hình Nút Phân Tán:**

```bash
axio-cli node init --moniker "My-Axio-Node" --chain-id axio-testnet-1
```

**3. Thế Chấp `$AXQ` Để Nhận Quyền Đúc `$VPX` Block:**

```bash
axio-cli tx validator stake \
  --amount 10000000000000uaxq \
  --pubkey ~/.axio/config/validator_key.json \
  --from my-wallet
```

**4. Kích Hoạt Services Daemon:**

```bash
systemctl enable --now axio-valiprecision.service
```

---

## 5. SDK Quickstart — Developers

> Dành cho Phase 1 — Tích hợp `@axioledger/ans-sdk`

### Cài Đặt

```bash
pnpm add @axioledger/ans-sdk @axioledger/wallet-connector
```

### Mã Nguồn Mẫu — Phân Giải Tên Miền `.axq` & Gửi Giao Dịch

```typescript
import { AnsClient } from '@axioledger/ans-sdk';
import { AxioPassConnector } from '@axioledger/wallet-connector';

async function main() {
  // 1. Khởi tạo ANS Client
  const ans = new AnsClient({
    network: 'testnet',
    rpcUrl: 'https://rpc.testnet.axioledger.org',
  });

  // 2. Phân giải tên miền .axq sang địa chỉ Native SVM
  const domain = 'dong.axq';
  const ownerAddress = await ans.resolveName(domain);
  console.log(`Chủ sở hữu của ${domain} là:`, ownerAddress);

  // 3. Tương tác ví AxioPass (WebAuthn Sinh trắc học)
  const wallet = new AxioPassConnector();
  await wallet.connect();

  // 4. Ký giao dịch phi trạng thái (Stateless Transaction)
  const txHash = await wallet.sendTransaction({
    to: ownerAddress,
    amount: '1000000000', // 1,000 $AXQ (với precision 10^18)
    memo: 'Thanh toán chuyển khoản qua ANS',
  });

  console.log('Giao dịch thành công! Hash:', txHash);
}

main().catch(console.error);
```

### Điểm Nối Tới Tài Liệu Liên Quan

| Tài liệu | Đường dẫn |
|---|---|
| ANS SDK Package | [`packages/axioledger/ans-sdk/`](../../packages/axioledger/ans-sdk/) |
| Wallet Connector Package | [`packages/axioledger/wallet-connector/`](../../packages/axioledger/wallet-connector/) |
| Full SDK Tutorial | [`docs/tutorial.md`](../tutorial.md) |
| Tokenomics Spec | [`docs/logic/logic.md`](logic.md) |
| Cosmos Integration | [`docs/logic/COSMOS_INTEGRATION.md`](COSMOS_INTEGRATION.md) |

---

*Axioledger Genesis Allocation Spec v1.0 · Copyright © 2026 Axioledger Foundation*
