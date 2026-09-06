# 📢 THÔNG BÁO CẬP NHẬT HỆ THỐNG TÀI LIỆU — Axioledger Monorepo

**Gửi:** Toàn bộ Đội ngũ R&D · Core Dev · Node Operations · DeFi Engineering  
**Từ:** Axioledger Foundation — Chief Architect Office  
**Ngày:** 2025  
**Phiên bản tài liệu:** v2.1 (Genesis Allocation Milestone)  
**Mức độ:** 🔴 **Bắt buộc đọc** — Ảnh hưởng trực tiếp đến triển khai Phase 0 & Phase 1

---

## TÓM TẮT THAY ĐỔI

Hệ thống tài liệu kỹ thuật (`docs/`) đã được đồng bộ toàn bộ nội dung từ kế hoạch chính thức **Ledger Genesis & Allocation Plan** (`core.md`). Đây là cột mốc tài liệu quan trọng trước khi Testnet Phase 0 khai trương.

---

## CÁC FILE ĐÃ THAY ĐỔI

### 🔄 Cập nhật (Updated)

| File | Thay đổi | Ảnh hưởng |
|------|----------|-----------|
| `docs/AXIOLEDGER_ROADMAP.md` | Thêm **Section 14** — Genesis Phasing (Phase 0→3) và **Section 15** — Quy Trình 6 Bước Onboarding | Tất cả teams |
| `docs/reference.md` | Bổ sung Quick Links và 3 entry mới trong bảng Tokenomics & Logic | Tất cả teams |

### 🆕 Mới (Created)

| File | Nội dung chính | Team cần đọc |
|------|---------------|--------------|
| `docs/logic/GENESIS_ALLOCATION.md` | `TreasuryEscrowContract` (spec Rust đầy đủ), cấu hình Epoch/Oracle, ZK-Jury Slashing Matrix, lịch vesting 5-Token, Node & SDK Quickstart | Core Dev · Node Ops · Security |
| `docs/logic/COSMOS_INTEGRATION.md` | Ánh xạ 14 repos Cosmos → module Axioledger, sơ đồ kiến trúc tổng thể | Protocol Eng · Bridge Team |
| `docs/logic/CONTRIBUTION_GROUPS.md` | 6 nhóm vai trò đóng góp (I–VI) với cơ chế phần thưởng token chi tiết | Ecosystem · Community · BD |

### 🆕 Contracts (Created)

| File | Mô tả | Team cần xử lý |
|------|-------|----------------|
| `contracts/core/escrow/TreasuryEscrowContract.js` | Logic simulation SVM contract (ESM) — dùng cho unit testing Localnet | Core Dev · Smart Contract |
| `contracts/core/escrow/index.js` | Re-export entry point | Core Dev |
| `tests/escrow/TreasuryEscrowContract.test.js` | **32 unit test cases** — đầy đủ happy path + error cases | QA · Core Dev |

---

## HÀNH ĐỘNG YÊU CẦU THEO TEAM

### 🔵 Core Dev Team

- [ ] **Ưu tiên cao:** Đọc `docs/logic/GENESIS_ALLOCATION.md § 1` — Review cấu hình `EPOCH_BLOCKS = 100_800` và `MAX_RELEASE_BPS = 1000` (10%)
- [ ] Chạy unit tests: `node tests/escrow/TreasuryEscrowContract.test.js`
- [ ] Chuyển đổi `TreasuryEscrowContract.js` sang Rust thực thi, đặt tại `packages/axioledger/contracts/escrow/src/lib.rs`
- [ ] Viết integration test với Localnet epoch simulation trước Phase 1

### 🟣 Node Operations Team

- [ ] Đọc `docs/logic/GENESIS_ALLOCATION.md § 4` — **Node Operator Quickstart** (phần cứng tối thiểu, CLI commands)
- [ ] Kiểm tra lại yêu cầu hardware: **4 Cores / 8 GB RAM / 100 GB NVMe SSD / 100 Mbps**
- [ ] Chuẩn bị môi trường `axio-cli` cho Phase 1 Testnet launch

### 🟡 Protocol Engineering Team

- [ ] Đọc `docs/logic/COSMOS_INTEGRATION.md` — xác nhận ánh xạ `ibc-relayer → @kinetoprotocol/bridge-relayer` và `iavl → Merkle Witness O(1)`
- [ ] Đối chiếu `cosmos-sdk` fork strategy với `Axio-Stateless SVM v2.0.22` hiện tại

### 🟢 DeFi / Liquidity Team

- [ ] Đọc `docs/logic/CONTRIBUTION_GROUPS.md § Nhóm IV` — cơ chế `$veKPX` lock, Gauge Voting, Concentrated Liquidity AMM
- [ ] Xem lịch vesting `$KPX`: Halving 20%/năm, LP Pools nhận hàng epoch

### 🔴 Security / ZK Team

- [ ] Đọc `docs/logic/GENESIS_ALLOCATION.md § 2` — **ZK-Jury Slashing Matrix**
- [ ] Review ngưỡng Slashing: Collusion → Slash 100% + Ban Node vĩnh viễn
- [ ] Xác nhận tiêu chí chọn Juror: `$VPX` Uptime > 99.5%, stake ≥ 10,000,000 `$AXQ`

### 🟠 Ecosystem / Community Team

- [ ] Đọc `docs/logic/CONTRIBUTION_GROUPS.md § Nhóm V & VI` — Bug Bounty, ZK-Jury, Proof-of-Activity, Zero-Knowledge Ads
- [ ] Chuẩn bị FAQ cho cộng đồng dựa trên 6 nhóm vai trò

---

## CÁC CON SỐ KỸ THUẬT QUAN TRỌNG CẦN GHI NHỚ

```
┌─────────────────────────────────────────────────────────────┐
│  EPOCH_BLOCKS         = 100,800 blocks  ≈ 7 ngày            │
│  MAX_RELEASE_BPS      = 1,000           = 10% / milestone    │
│  ORACLE_COOLDOWN      = 1 Epoch         giữa 2 lần giải ngân │
│  JURY_SIZE            = 15 Jurors       VRF ngẫu nhiên       │
│  SLASH_COLLUSION      = 100%            tài sản thế chấp     │
│  MIN_JUROR_STAKE      = 10,000,000 $AXQ + Uptime > 99.5%    │
│  NODE_MIN_HARDWARE    = 4C / 8GB / 100GB NVMe / 100Mbps     │
└─────────────────────────────────────────────────────────────┘
```

---

## LỊCH VESTING TOKEN — TÓM TẮT

| Token | Unlock đầu tiên | Cơ chế |
|-------|----------------|--------|
| `$AXQ` (35% LP) | Mainnet Genesis | Lock 100% |
| `$AXQ` (25% DAO) | Tháng 12 | 2%/tháng theo KPI |
| `$AXQ` (15% Rewards) | 120 tháng | Linear vesting |
| `$KPX` | Phase 2 | LP Pools → lock nhận `$veKPX` |
| `$VRQ` | Phase 1 | Pay-per-Proof ngay khi verify xong |
| `$VPX` | Phase 1 | Theo Epoch (7 ngày) |

---

## LIÊN KẾT TÀI LIỆU ĐẦY ĐỦ

| Tài liệu | Đường dẫn |
|----------|-----------|
| Master Roadmap (v2.1) | `docs/AXIOLEDGER_ROADMAP.md` |
| Genesis Allocation & Escrow | `docs/logic/GENESIS_ALLOCATION.md` |
| Cosmos Integration Map | `docs/logic/COSMOS_INTEGRATION.md` |
| Contribution Groups I–VI | `docs/logic/CONTRIBUTION_GROUPS.md` |
| Unit Tests (32 cases) | `tests/escrow/TreasuryEscrowContract.test.js` |
| Contract Logic (JS Simulation) | `contracts/core/escrow/TreasuryEscrowContract.js` |
| Full Reference | `docs/reference.md` |

---

> **Lưu ý phiên bản:** Tài liệu này phản ánh kế hoạch Phase 0–1. Mọi thay đổi thông số kỹ thuật (Epoch, Slashing %, Hardware requirements) phải thông qua DAO governance vote và cập nhật đồng thời vào `core.md` + tài liệu liên quan.

---

*Axioledger Foundation — R&D Documentation Update · v2.1 · Copyright © 2026*
