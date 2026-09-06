# BÁO CÁO TƯ VẤN CHIẾN LƯỢC — AXIOLEDGER MONOREPO
## Phân Tích Sâu Hệ Sinh Thái theo 3 Trụ Cột: Pháp Lý · Thiết Kế · DevOps

> **Kính gửi:** Ban Cố Vấn Axioledger Foundation  
> **Tài liệu tham chiếu:** Kết quả quét toàn bộ mã nguồn tại `/root/workspage/Axioledger_Monorepo/`  
> **Phiên bản:** v1.0 · Ngày lập: 2026  
> **Phân loại:** Nội bộ — Chỉ dành cho Ban Cố Vấn & Ban Lãnh Đạo  
> **Người lập:** Hệ thống Kiểm toán Mã nguồn (AI-assisted Deep Scan)

---

## MỤC LỤC

1. [Tổng Quan Hệ Sinh Thái](#1-tổng-quan-hệ-sinh-thái)
2. [Trụ Cột I — Pháp Lý & Tuân Thủ (Legal & Compliance)](#2-trụ-cột-i--pháp-lý--tuân-thủ)
3. [Trụ Cột II — Thiết Kế & Trải Nghiệm (Design & UX)](#3-trụ-cột-ii--thiết-kế--trải-nghiệm)
4. [Trụ Cột III — Hạ Tầng & Vận Hành (DevOps & SRE)](#4-trụ-cột-iii--hạ-tầng--vận-hành)
5. [Ma Trận RACI Ánh Xạ vào Codebase Thực Tế](#5-ma-trận-raci-ánh-xạ-vào-codebase-thực-tế)
6. [Các Rủi Ro Ưu Tiên Cao — Cần Hành Động Ngay](#6-các-rủi-ro-ưu-tiên-cao--cần-hành-động-ngay)
7. [Lộ Trình Khuyến Nghị Ban Cố Vấn](#7-lộ-trình-khuyến-nghị-ban-cố-vấn)

---

## 1. TỔNG QUAN HỆ SINH THÁI

### 1.1 Định Danh Dự Án

| Thuộc tính | Giá trị |
|---|---|
| **Tên dự án** | Axioledger Monorepo |
| **Phiên bản root** | `v2.0.22` |
| **Package Manager** | `pnpm@9.0.0` |
| **Node yêu cầu** | `>= 20.0.0` |
| **Ngôn ngữ chính** | TypeScript · Rust · Go · Solidity |
| **Repository** | `github.com/axioledger/axioledger-monorepo` |
| **Giấy phép** | MIT (root) · Apache-2.0 (một số Go/Rust modules) |
| **Chain ID (Testnet)** | `axioledger-testnet-phase0` |
| **Genesis Time** | `2026-03-01T00:00:00Z` |

### 1.2 Kiến Trúc Hệ Sinh Thái 5 Tầng

```
┌──────────────────────────────────────────────────────────────┐
│  LAYER 5 — APPLICATION LAYER (6 DApps)                       │
│  wallet-web · exchange-web · craft-portal · pay-gateway      │
│  dao-dashboard · docs-site  |  Stack: React 18 + Vite        │
└───────────────────────────────┬──────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────┐
│  LAYER 4 — PROTOCOL & INTENT LAYER                           │
│  @axioledger/wallet-connector (WebAuthn + secp256k1)         │
│  @kinetoprotocol/intents-engine (@hot-labs/omni-sdk)         │
│  @axioledger/ans-sdk  (.axq domain < 10ms resolution)        │
└───────────────────────────────┬──────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────┐
│  LAYER 3 — EXECUTION & SEQUENCER LAYER                       │
│  @sequentichain/*  (600K TPS · AF_XDP · ZK-SNARK Aggregator) │
│  Stateless SVM Engine (Sealevel Parallel)                    │
└───────────────────────────────┬──────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────┐
│  LAYER 2 — VALIDATION & CRYPTOGRAPHY LAYER                   │
│  @valiprecision/reputation-engine (Slashing · Uptime)        │
│  @veraciphers/zk-prover-runtime (Halo2 · PlonKy2)            │
│  @veraciphers/did-identity-verifier (ZK-DID · MACI)          │
└───────────────────────────────┬──────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────┐
│  LAYER 1 — NETWORK & STORAGE LAYER                           │
│  @sequentichain/network-stack (smoltcp Rust · AF_XDP)        │
│  @valiprecision/worker-pool (Golem Distributed Compute)      │
│  L1 Contracts: EVM_Vault.sol · Kpx_Bridge.rs                 │
└──────────────────────────────────────────────────────────────┘
```

### 1.3 Bảng Kiểm Kê Package (42 packages + 6 apps)

| Scope | Số packages | Token tương ứng | Trạng thái |
|---|---|---|---|
| `axioledger` (core VDOM) | 6 + 5 primitives = 11 | $AXQ | ✅ Mã nguồn hiện diện |
| `@valiprecision/*` | 4 | $VPX | ⚠️ Scaffolded (chưa đầy đủ logic) |
| `@sequentichain/*` | 7 | $SQX | ⚠️ Scaffolded |
| `@kinetoprotocol/*` | 5 | $KPX | ⚠️ Scaffolded |
| `@veraciphers/*` | 6 | $VRQ | ⚠️ Scaffolded |
| `apps/*` | 6 DApps | — | ✅ Scaffolded (React+Vite shell) |
| `toolchain/*` | 3 | — | ✅ esbuild · ESLint · TSConfig |
| Cosmos-inherited (Go) | 12 repos | — | 🔄 Migration scripts có sẵn |

---

## 2. TRỤ CỘT I — PHÁP LÝ & TUÂN THỦ (Legal & Compliance)

### 2.1 Hiện Trạng Tuân Thủ — Đánh Giá Từ Mã Nguồn

#### ✅ ĐIỂM MẠNH — Đã Triển Khai Đúng

**[A] TreasuryEscrowContract — Kiểm Soát Tài Chính On-Chain**

File: `contracts/core/escrow/TreasuryEscrowContract.js` + `packages/axioledger/contracts/escrow/src/lib.rs`

Logic hợp đồng Escrow đã mã hóa cứng các tham số pháp lý quan trọng:

```
EPOCH_BLOCKS        = 100,800  (~7 ngày — chu kỳ kiểm toán)
MAX_RELEASE_BPS     = 1,000    (tối đa 10%/milestone — ngăn rút vốn đột biến)
ORACLE_COOLDOWN     = 1 Epoch  (bắt buộc khoảng cách giải ngân)
JURY_SIZE           = 15       (Bồi thẩm đoàn ZK-Jury)
MIN_JUROR_STAKE     = 10,000,000 AXQ
SLASH_COLLUSION_BPS = 10,000   (100% slash khi thông đồng — deterrence cực mạnh)
```

**Ý nghĩa pháp lý:** Các tham số này tương đương điều khoản quản trị tài chính
cứng trong charter doanh nghiệp. Cần **đảm bảo các tham số này được đưa vào văn
bản pháp lý chính thức** (Whitepaper, Operating Agreement, Token Terms).

**[B] ZK-KYC & eKYC Pipeline — Zone 2 AxioPass**

Từ roadmap (`docs/AXIOLEDGER_ROADMAP.md § 8`), 10 màn hình KYC được thiết kế:

```
Zone 2 — KYC & Compliance (10 screens):
  eKYC Flow · Document Scan · Liveness Detection · FATCA Declaration
```

**[C] Tokenomics Genesis — Phân Bổ Minh Bạch**

File `config/genesis.json` công khai tham số phân bổ $AXQ:

```json
"initial_distribution": {
  "liquidity_pool_bps":     3500,  // 35% — Thanh khoản
  "dao_treasury_bps":       2500,  // 25% — Quỹ DAO
  "consensus_reward_bps":   1500,  // 15% — Phần thưởng đồng thuận
  "l2_sequentichain_bps":   1000,  // 10% — Sequentichain L2
  "b2b_rwa_ecosystem_bps":  1000,  // 10% — B2B & RWA
  "bug_bounty_tribunal_bps": 500   // 5%  — Bug Bounty & Tribunal
}
```

**Tổng cung $AXQ: 10,000,000,000,000 (10 nghìn tỷ), KHÔNG lạm phát.**

---

#### 🔴 RỦI RO PHÁP LÝ — PHÁT HIỆN QUA QUÉT MÃ NGUỒN

**[R-L1] ZK-Proof Verifier Là STUB — Chưa Đủ Điều Kiện Sản Xuất**

File: `packages/axioledger/contracts/escrow/src/lib.rs`, dòng 332–341:

```rust
// TODO(mainnet): replace with actual @veraciphers/on-chain-verifier CPI call
Ok(proof[0] != 0x00)   // ← Stub: bất kỳ proof != 0x00 đều PASS
```

Tương tự trong `contracts/core/escrow/TreasuryEscrowContract.js`, dòng 56–61:

```javascript
// Stub: proof[0] !== 0x00 tượng trưng proof hợp lệ
return proof[0] !== 0x00
```

**ĐÁNH GIÁ:** Đây là lỗ hổng nghiêm trọng về **tính toàn vẹn tài chính**. Bất
kỳ tác nhân nào cũng có thể giả mạo ZK-Proof và kích hoạt giải ngân Treasury khi
contract được triển khai với stub còn hoạt động. Cần hoàn thiện
`@veraciphers/on-chain-verifier` và tích hợp CPI trước khi đưa lên Mainnet.

**Khuyến nghị pháp lý:** Bộ phận Legal cần có **điều khoản phát hành** (Release
Condition Clause) trong hợp đồng với các stakeholder, nêu rõ việc phát hành
Mainnet chỉ được phép khi stub này đã được thay thế và đã qua kiểm toán độc lập.

---

**[R-L2] Thiếu Tài Liệu AML/FATF Travel Rule**

Qua quét toàn bộ codebase, **không tìm thấy** module hoặc tài liệu xử lý:
- FATF Travel Rule (thông tin người gửi/nhận trong giao dịch >$1,000)
- STR (Suspicious Transaction Reporting) pipeline
- Danh sách trừng phạt (OFAC/SDN screening)

`packages/axioledger/ans-sdk/src/client.ts` có thể giải quyết domain nhưng
**không có lớp kiểm tra địa chỉ bị trừng phạt** trước khi thực hiện giao dịch.

**Khuyến nghị:** Tích hợp middleware screening vào `AnsClient.registerName()` và
`AxioPassConnector.sendTransaction()`. Cần thuê đơn vị tuân thủ AML độc lập để
thiết kế quy trình trước Phase 2.

---

**[R-L3] Vấn Đề Chứng Khoán Token (Securities Law)**

Cơ chế `Proof-of-Lock` trong `docs/AXIOLEDGER_ROADMAP.md § 6`:

```
Stake $AXQ → Nhận quyền:
  ├── Khai thác $VPX (Validator Node)
  ├── Khai thác $SQX (Sequencer Node)
  ├── Khai thác $KPX (Liquidity AMM)
  └── Khai thác $VRQ (ZK Prover)
```

Cơ chế "stake để nhận thu nhập thụ động" có thể bị phân loại là **chứng khoán
(security)** theo Howey Test tại nhiều jurisdiction (Hoa Kỳ, EU MiCA). Cần tham
vấn luật sư chuyên về tài sản kỹ thuật số trước khi TGE.

---

**[R-L4] Thiếu Privacy Policy & ToS Trong Codebase**

Quét toàn bộ `apps/` và `docs/` không tìm thấy:
- `PRIVACY_POLICY.md` hoặc `TERMS_OF_SERVICE.md`
- GDPR Data Processing Agreement (DPA) template
- Cookie Policy cho các DApp web

**Khuyến nghị:** Phòng Pháp lý cần soạn thảo và tích hợp legal documents trước
khi Testnet public ra ngoài. Đặc biệt, AxioPass Wallet (`apps/wallet-web`) thu
thập biometric data — yêu cầu **consent flow rõ ràng** theo GDPR Art. 9.

---

**[R-L5] WebAuthn COSE Key Extraction — Rủi Ro Danh Tính**

File: `packages/axioledger/wallet-connector/src/index.ts`, dòng 126–150:

```typescript
// Simple extraction: assume last 64 bytes = x || y (uncompressed form)
// Fallback: publicKey = new Uint8Array(33).fill(0)  ← zero key fallback
```

Fallback về zero public key khi không trích xuất được COSE key có nghĩa là
nhiều người dùng có thể **bị gán cùng địa chỉ ví**. Đây là rủi ro pháp lý về
tính duy nhất danh tính (identity uniqueness) trong eKYC.

---

### 2.2 Yêu Cầu Bổ Sung Từ Ban Pháp Lý

| Ưu tiên | Hành động cần thiết | Deadline đề xuất |
|---|---|---|
| 🔴 CRITICAL | Hoàn thiện ZK-Proof Verifier thực thụ (thay stub) | Trước Testnet Public |
| 🔴 CRITICAL | Soạn thảo & Publish ToS + Privacy Policy | Trước Testnet Public |
| 🟠 HIGH | Tích hợp OFAC/SDN screening vào ANS SDK | Phase 2 (Tháng 4-6) |
| 🟠 HIGH | Tham vấn Securities Law cho cơ chế Proof-of-Lock | Trước TGE |
| 🟡 MEDIUM | Thiết kế FATF Travel Rule module | Phase 3 (Tháng 7-9) |
| 🟡 MEDIUM | GDPR DPA template cho đối tác enterprise | Phase 2 |
| 🟢 LOW | Kiểm toán giấy phép mã nguồn (MIT vs Apache-2.0) | Ongoing |

---

## 3. TRỤ CỘT II — THIẾT KẾ & TRẢI NGHIỆM (Design & UX)

### 3.1 Hiện Trạng Design System

#### ✅ ĐIỂM MẠNH — Nền Tảng Thiết Kế Vững Chắc

**[A] AXQ Design System v2.0 — Kiến Trúc 3 Tầng Token**

Từ `docs/AXIOLEDGER_ROADMAP.md § 7`:

```
Primitive (Giá trị gốc)
    → Semantic (Ý nghĩa UI — Light/Dark Mode)
        → Component (Token linh kiện cụ thể)
```

Bảng màu thương hiệu đã được xác định:

| Token | Hex | Vai trò |
|---|---|---|
| `brand/teal` | `#49DBC8` | Accent chính — logo, highlight |
| `brand/green` | `#BEFF6C` | Success |
| `brand/orange` | `#FC7339` | Warning / CTA phụ |
| `brand/purple` | `#AF96FB` | Governance / DAO |
| `brand/yellow` | `#FFF172` | Reward / Yield |
| `greyscale/900` | `#101426` | Primary text |

Typography: **Work Sans** với 10 cấp độ (10px–96px), phủ đủ từ caption đến hero.

**[B] AxioPass Wallet — 65+ Màn Hình Được Lên Kế Hoạch**

8 Zones được định nghĩa rõ ràng:

| Zone | Tên | Số màn hình | Tình trạng |
|---|---|---|---|
| Zone 1 | Onboarding & Auth | 14 | 🔄 Design Phase 1 (Tuần 1-2) |
| Zone 2 | KYC & Compliance | 10 | 🔄 Design Phase 1 |
| Zone 3 | Home & Dashboard | 7 | 🔄 Design Phase 2 |
| Zone 4 | Card Management | 9 | 🔄 Design Phase 2 |
| Zone 5 | Crypto & Web3 | 10 | 🔄 Design Phase 3 |
| Zone 6 | Transfer & Payments | 9 | 🔄 Design Phase 3 |
| Zone 7 | Profile & Settings | 8 | 🔄 Design Phase 4 |
| Zone 8 | System States | 8 | 🔄 Design Phase 4 |

**[C] Icon System — Đa Dạng và Nhất Quán**

Quét `docs/asset/icon/bold/` và `docs/asset/icon/linear/` xác nhận thư viện icon
lớn bao gồm:
- Crypto icons: Bitcoin, BNB, Binance USD, Avalanche, Aave, Augur...
- UI icons: arrows, bags, calendar, camera...
- Hai phong cách: **Bold** (filled) và **Linear** (outline)

Đây là nền tảng nhất quán cho Design System.

---

#### 🟠 VẤN ĐỀ THIẾT KẾ — PHÁT HIỆN QUA KIỂM TRA

**[R-D1] Chưa Có Figma File / Design Token Export Trong Repo**

Toàn bộ codebase không chứa file Figma export, Design Token JSON, hoặc Style
Dictionary config. Mặc dù roadmap mô tả chi tiết token system, **chưa có tệp
thực thi nào** (`design-tokens.json`, `tokens.css`, `theme.ts`) trong
`packages/axioledger/ui-kit/`.

**Hệ quả:** Đội Frontend không có nguồn thật duy nhất (single source of truth)
cho design tokens, dễ dẫn đến **pixel drift** và thiếu nhất quán.

**Khuyến nghị:** Xuất Design Tokens từ Figma → JSON (dùng Tokens Studio hoặc
Style Dictionary) và lưu trong `packages/axioledger/ui-kit/src/tokens/`.

---

**[R-D2] App Shells Chưa Có UI Implementation**

Quét `apps/wallet-web/src/App.tsx`, `apps/exchange-web/src/App.tsx`, và các
apps khác cho thấy tất cả chỉ là **React boilerplate shell**:

```tsx
// apps/wallet-web/src/App.tsx — chỉ chứa scaffolding
// apps/exchange-web/src/App.tsx — chỉ chứa scaffolding
```

Không có màn hình thực tế nào được implement. Đây là bình thường ở giai đoạn
khởi đầu nhưng cần đặt vào lịch phát triển rõ ràng.

---

**[R-D3] Thiếu Accessibility (WCAG 2.1 AA) Checklist Trong Code**

Roadmap có đề cập WCAG 2.1 AA nhưng quét mã nguồn không thấy:
- `aria-*` attributes trong bất kỳ component nào
- Contrast ratio testing configuration
- Keyboard navigation testing setup

**Khuyến nghị pháp lý liên quan:** Nếu AxioPass phục vụ thị trường EU/US, WCAG
2.1 AA là yêu cầu pháp lý (EU Web Accessibility Directive, ADA Title III).

---

**[R-D4] Dark Pattern Risk — Chưa Có Cơ Chế Kiểm Tra**

Zone 2 (KYC) có `FATCA Declaration` screen nhưng không có tài liệu về:
- Cơ chế đồng ý rõ ràng (explicit consent UI patterns)
- Cảnh báo rủi ro giao dịch crypto (mandatory risk warnings)
- Quy trình opt-out dữ liệu người dùng

---

**[R-D5] GasFeeSelector — Component Chưa Được Xây Dựng**

Roadmap liệt kê 5 component mới cần xây dựng:

```
PINPad          — dot display + numpad
CardVisual      — flip 3D animation
QRDisplay       — generate + zoom
LivenessFrame   — camera overlay
GasFeeSelector  — slow/average/fast gas presets
```

**Hiện trạng:** Không tìm thấy bất kỳ component nào trong số này trong
`packages/axioledger/ui-kit/`. Cần ưu tiên `LivenessFrame` và `PINPad` cho
Zone 1 & 2 (Auth & KYC).

---

### 3.2 Yêu Cầu Bổ Sung Từ Ban Thiết Kế

| Ưu tiên | Hành động cần thiết | Deadline đề xuất |
|---|---|---|
| 🔴 CRITICAL | Xuất Design Tokens (JSON/CSS) từ Figma vào ui-kit | Sprint tiếp theo |
| 🔴 CRITICAL | Implement Zone 1 & Zone 2 screens (Auth + KYC) | Phase 1 (Tháng 1-3) |
| 🟠 HIGH | Xây dựng 5 core components: PINPad, LivenessFrame, CardVisual, QRDisplay, GasFeeSelector | Phase 1 |
| 🟠 HIGH | Thiết kế consent flow tuân thủ GDPR (Privacy by Design) | Phase 1 |
| 🟡 MEDIUM | Thêm risk warning UI theo tiêu chuẩn MiCA Art. 68 | Phase 2 |
| 🟡 MEDIUM | WCAG 2.1 AA audit và remediation | Phase 2 |
| 🟢 LOW | A/B testing framework (Zone 3 - Home Dashboard) | Phase 3 |

---

## 4. TRỤ CỘT III — HẠ TẦNG & VẬN HÀNH (DevOps & SRE)

### 4.1 Kiến Trúc Hạ Tầng Hiện Tại — Được Phát Hiện Qua Quét

#### ✅ ĐIỂM MẠNH — Nền Tảng DevOps Tốt

**[A] Monorepo Build Infrastructure — Trưởng Thành**

Toolchain hoàn chỉnh:
```
toolchain/build-scripts/bin/axio-build.js   → esbuild bundler tùy chỉnh
toolchain/eslint-config/index.js            → ESLint rules dùng chung
toolchain/tsconfig/base.json                → TypeScript baselines
toolchain/build-scripts/telescope.config.ts → Protobuf codegen
```

Build script `axio-build.js` dùng esbuild — **đúng lựa chọn** cho monorepo
blockchain (fast, tree-shaking, ESM/CJS dual output).

**[B] CI/CD Pipeline — Đã Có Template**

3 workflows được thiết kế trong `.github/workflows/`:

| Workflow | Trigger | Hành động |
|---|---|---|
| `ci-test.yml` | Push / PR | typecheck + lint + build + test + coverage |
| `publish-npm-scopes.yml` | Tag `v*` | Publish 5 scopes lên NPM Registry |
| `publish-docker.yml` | Tag `v*` | Build & push Docker images lên GHCR |

**[C] Docker Strategy — Đa Tầng Hoạt Động**

4 Docker images được xác định:
```
axioledger/sequencer      ← packages/sequentichain/docker-runtime/
axioledger/validator      ← packages/valiprecision/core-daemon/
axioledger/zk-prover      ← packages/veraciphers/zk-prover-runtime/
axioledger/liquidity-node ← packages/kinetoprotocol/liquidity-node-docker/
```

**[D] Go Workspace — Đa Module Được Cấu Hình**

`go.work` tại root hỗ trợ cross-module development cho 10 Go modules:
```
external/cosmos/cometbft · cosmos-sdk · gogoproto · iavl · ibc-go
external/cosmos/ics23 · relayer · wasmd · cosmos-proto
packages/axioledger/core-daemon
```

**[E] WSL1 Compatibility — Đã Xử Lý**

`scripts/setup-wsl.sh` giải quyết `renameat2` limitation trên WSL1 bằng cách
mount `node_modules` lên tmpfs — giải pháp thiết thực cho môi trường Windows dev.

---

#### 🔴 RỦI RO DevOps — PHÁT HIỆN QUA QUÉT MÃ NGUỒN

**[R-D1] Secrets Management — Chưa Có Cơ Chế Rõ Ràng**

Quét toàn bộ codebase không tìm thấy:
- `.env.example` hoặc `.env.template` trong bất kỳ package nào
- Vault/KMS configuration (dù `@axioledger/kms` được liệt kê)
- Secret rotation policy

`packages/axioledger/kms/package.json` chỉ là metadata shell:
```json
{
  "name": "@axioledger/kms",
  "scripts": {
    "build": "echo 'Go/Rust module — go build ./... hoặc cargo build'"
  }
}
```

**Không có implementation thực tế.** KMS là thành phần bảo mật quan trọng nhất
của hệ thống (quản lý khóa Validator, Oracle, Admin) mà hiện đang là shell rỗng.

**Khuyến nghị:** Ưu tiên implement `@axioledger/kms` sớm nhất trong Phase 1, tích
hợp với HSM (HashiCorp Vault hoặc AWS KMS) cho môi trường production.

---

**[R-D2] Validate Public RPC — Module Chưa Có Logic**

`packages/axioledger/validate-public-rpc/` được liệt kê trong cấu trúc nhưng
không có implementation. RPC endpoint validation là **bắt buộc** để ngăn MITM
attacks khi người dùng kết nối đến các node độc hại.

---

**[R-D3] Supply Chain Security — Phụ Thuộc Chưa Khóa Hoàn Toàn**

`.npmrc` có `save-exact = true` (tốt), nhưng kiểm tra `package.json` cho thấy
một số devDependencies dùng range:
```json
"@changesets/cli": "^2.27.0",    // ← chưa pin
"typescript":      "^5.3.0",     // ← chưa pin
"rimraf":          "^5.0.0"      // ← chưa pin
```

Đây là rủi ro supply chain nhỏ nhưng cần xử lý cho production.

---

**[R-D4] Chưa Có Monitoring/Observability Stack**

Không tìm thấy configuration cho:
- Prometheus metrics export (đề cập trong `@valiprecision/node-diagnostics` nhưng
  không có implementation)
- Grafana dashboard configuration
- PagerDuty/OpsGenie alert rules
- Distributed tracing (OpenTelemetry)

Để đạt SLA >= 99.9%, cần observability stack trước khi Testnet public.

---

**[R-D5] Disaster Recovery (DR) — Chưa Có Tài Liệu**

Không tìm thấy:
- Backup/Restore procedures
- Failover runbook
- RTO/RPO targets
- Multi-region deployment config

**Rủi ro:** Nếu Sequencer node bị sập mà không có DR plan, người dùng mất khả
năng truy cập assets.

---

**[R-D6] interchaintest — Framework Test Chưa Được Populate**

`packages/axioledger/interchaintest/` có `package.json` nhưng không có test
cases. Theo roadmap, cần 10,000+ TPS stress testing trước Testnet public.
`starshipjs@3.0.0` đã có trong devDependencies nhưng `tests/starship/` chưa tồn
tại trong codebase.

---

**[R-D7] WebAuthn COSE Key — Fallback Zero-Key trong Production Path**

File: `packages/axioledger/wallet-connector/src/index.ts`, dòng 226–230:

```typescript
} catch {
  // Fallback: sinh public key từ challenge và signature (mock cho testnet)
  publicKey = new Uint8Array(33).fill(0)
  publicKey[0] = 0x02   // ← Zero public key với prefix 0x02
}
```

**Nếu exception xảy ra trong production**, nhiều người dùng sẽ nhận cùng địa
chỉ ví `0x02000...000`, dẫn đến mất tài sản nghiêm trọng. Cần throw error thay
vì fallback về zero key.

---

### 4.2 Phân Tích Cosmos Integration — Trạng Thái Migration

Theo `COSMOS_AXIOLEDGER_MONOREPO_PLAN.md` và `scripts/migrate-cosmos-cores.sh`:

| Repo Cosmos | Vị trí đích | Trạng thái |
|---|---|---|
| `cosmos/cosmos-sdk` | `packages/axioledger/cosmos-sdk/` | ✅ Proto + types có sẵn |
| `cosmos/ibc-go` | `packages/axioledger/ibc-go/` | ✅ Package.json ready |
| `cosmos/cometbft` | `packages/axioledger/cometbft/` | ✅ Proto files đầy đủ |
| `cosmos/kms` | `packages/axioledger/kms/` | ⚠️ Shell only |
| `cosmos/evm` | `packages/axioledger/evm/` | ⚠️ Shell only |
| `cosmos/tokenfactory` | `packages/axioledger/tokenfactory/` | ⚠️ Shell only |
| 12 external repos | `external/cosmos/` | 🔄 Migration script ready |

---

### 4.3 Yêu Cầu Bổ Sung Từ DevOps

| Ưu tiên | Hành động cần thiết | Deadline đề xuất |
|---|---|---|
| 🔴 CRITICAL | Implement `@axioledger/kms` với HSM/Vault integration | Phase 1 |
| 🔴 CRITICAL | Fix zero-key fallback trong wallet-connector | Sprint tiếp theo |
| 🔴 CRITICAL | Setup Secrets Management (`.env` templates + Vault) | Phase 1 |
| 🟠 HIGH | Setup Prometheus + Grafana observability stack | Trước Testnet |
| 🟠 HIGH | Viết Disaster Recovery runbook | Trước Testnet |
| 🟠 HIGH | Implement `validate-public-rpc` module | Phase 1 |
| 🟠 HIGH | Populate `tests/starship/` với stress test suites | Phase 2 |
| 🟡 MEDIUM | Pin tất cả devDependencies (không dùng range ^) | Sprint tiếp theo |
| 🟡 MEDIUM | Setup PagerDuty / OpsGenie alert integration | Phase 2 |
| 🟢 LOW | Multi-region deployment config (K8s Helm charts) | Phase 3 |

---

## 5. MA TRẬN RACI ÁNH XẠ VÀO CODEBASE THỰC TẾ

| Thành phần / File Codebase | Legal | Design | DevOps |
|---|---|---|---|
| `config/genesis.json` — Tham số tokenomics | **A** (Phê duyệt) | **I** | **R** (Triển khai) |
| `contracts/core/escrow/` — TreasuryEscrow | **A** (Audit & Approve) | **I** | **R** (Deploy & Monitor) |
| `packages/axioledger/kms/` — Key Management | **A** (Policy) | **I** | **R** (Implement) |
| `packages/axioledger/wallet-connector/` — WebAuthn | **C** (Privacy review) | **R** (UX flow) | **A** (Security) |
| `packages/axioledger/ans-sdk/` — ANS Domain | **C** (Trademark TLD) | **I** | **A/R** |
| `apps/wallet-web/` — AxioPass UI | **C** (KYC/AML screens) | **A/R** (Design) | **C** (Infra) |
| `apps/dao-dashboard/` — DAO Governance | **A** (Governance rules) | **R** (UI) | **C** (Deploy) |
| `docs/AXIOLEDGER_ROADMAP.md` — Master Plan | **C** (Legal review) | **C** (Design review) | **C** (Tech review) |
| `.github/workflows/` — CI/CD | **I** | **I** | **A/R** |
| `packages/veraciphers/` — ZK Proofs | **C** (Cryptography audit) | **I** | **A** (Infrastructure) |
| `packages/kinetoprotocol/bridge-relayer/` — Bridge | **A** (Cross-border) | **I** | **R** (Implement) |
| `packages/axioledger/ui-kit/` — Design System | **I** | **A/R** | **C** (CDN/Assets) |

---

## 6. CÁC RỦI RO ƯU TIÊN CAO — CẦN HÀNH ĐỘNG NGAY

### 6.1 Ma Trận Rủi Ro Tổng Hợp

| Mã RR | Mô tả | Trụ cột | Mức độ | Tác động |
|---|---|---|---|---|
| **RR-01** | ZK-Proof stub trong TreasuryEscrow có thể bị khai thác | DevOps + Legal | 🔴 CRITICAL | Mất Treasury |
| **RR-02** | Zero public key fallback trong wallet-connector | DevOps + Legal | 🔴 CRITICAL | Mất tài sản người dùng |
| **RR-03** | Thiếu KMS implementation (shell rỗng) | DevOps | 🔴 CRITICAL | Key compromise |
| **RR-04** | Thiếu ToS + Privacy Policy trước Testnet public | Legal | 🔴 CRITICAL | Vi phạm pháp luật |
| **RR-05** | Không có AML/OFAC screening trong ANS SDK | Legal | 🟠 HIGH | Vi phạm FATF |
| **RR-06** | Securities classification của Proof-of-Lock | Legal | 🟠 HIGH | Rủi ro pháp lý TGE |
| **RR-07** | Không có Design Tokens thực thi trong ui-kit | Design | 🟠 HIGH | Thiếu nhất quán UI |
| **RR-08** | Chưa implement 5 core UI components (KYC flow) | Design | 🟠 HIGH | Không ra mắt được |
| **RR-09** | Thiếu observability/monitoring stack | DevOps | 🟠 HIGH | Không đạt SLA 99.9% |
| **RR-10** | Thiếu DR/Backup plan | DevOps | 🟠 HIGH | Mất dữ liệu khi sự cố |
| **RR-11** | Cosmos core migration scripts chưa chạy | DevOps | 🟡 MEDIUM | Chậm tiến độ Phase 1 |
| **RR-12** | WCAG accessibility chưa được implement | Design + Legal | 🟡 MEDIUM | Vi phạm ADA/EU WAD |

---

## 7. LỘ TRÌNH KHUYẾN NGHỊ BAN CỐ VẤN

### 7.1 Sprint 0 (Ngay Lập Tức — Trước Bất Kỳ Testnet Nào)

**Mục tiêu:** Giải quyết tất cả RỦI RO CRITICAL (RR-01 đến RR-04)

```
[ ] DEVOPS   — Thay ZK-Proof stub bằng @veraciphers/on-chain-verifier thực
[ ] DEVOPS   — Fix zero-key fallback (throw error thay vì return zero key)
[ ] DEVOPS   — Setup HashiCorp Vault / AWS KMS cho secrets management
[ ] LEGAL    — Soạn thảo ToS + Privacy Policy + Risk Disclaimer
[ ] LEGAL    — Xác nhận pháp lý phân loại token với luật sư chuyên ngành
[ ] DESIGN   — Export Design Tokens từ Figma vào packages/axioledger/ui-kit/
```

### 7.2 Phase 1 Bổ Sung (Tháng 1-3)

```
[ ] LEGAL    — Tích hợp OFAC screening vào AnsClient + AxioPassConnector
[ ] LEGAL    — Thiết kế FATCA Declaration screen với Legal team
[ ] DESIGN   — Implement Zone 1 (14 screens: Auth & Onboarding)
[ ] DESIGN   — Implement Zone 2 (10 screens: KYC & Compliance)
[ ] DESIGN   — Build 5 core components: PINPad · CardVisual · QRDisplay
              LivenessFrame · GasFeeSelector
[ ] DEVOPS   — Implement @axioledger/kms với HSM integration
[ ] DEVOPS   — Implement @axioledger/validate-public-rpc
[ ] DEVOPS   — Setup Prometheus + Grafana monitoring
[ ] DEVOPS   — Viết DR runbook + RTO/RPO targets
[ ] DEVOPS   — Chạy migrate-cosmos-cores.sh + install-cosmos-libs.sh
```

### 7.3 Trước Testnet Public (End of Phase 1)

**Checkpoints bắt buộc:**

```
✅ ZK-Proof Verifier: Production implementation + security audit
✅ KMS: HSM integration operational
✅ ToS + Privacy Policy: Published và localized (EN + VI)
✅ Zone 1 + Zone 2: Pixel-perfect, WCAG 2.1 AA compliant
✅ Monitoring: SLA dashboards live
✅ DR Plan: Documented + tested
✅ AML Screening: Integrated và logged
✅ Smart Contract Audit: Independent third-party audit completed
```

---

## APPENDIX A — Bản Đồ Tệp Tham Chiếu Quan Trọng

| Tệp | Tầm quan trọng | Mô tả |
|---|---|---|
| `config/genesis.json` | ⭐⭐⭐⭐⭐ | Tham số khởi nguyên — MUTEX LOCKED |
| `contracts/core/escrow/TreasuryEscrowContract.js` | ⭐⭐⭐⭐⭐ | Logic giải ngân tài chính |
| `packages/axioledger/contracts/escrow/src/lib.rs` | ⭐⭐⭐⭐⭐ | Rust on-chain contract |
| `packages/axioledger/wallet-connector/src/index.ts` | ⭐⭐⭐⭐⭐ | WebAuthn + secp256k1 signing |
| `packages/axioledger/ans-sdk/src/client.ts` | ⭐⭐⭐⭐ | ANS domain resolution |
| `docs/AXIOLEDGER_ROADMAP.md` | ⭐⭐⭐⭐⭐ | Master Architecture Blueprint |
| `docs/logic/GENESIS_ALLOCATION.md` | ⭐⭐⭐⭐⭐ | Tokenomics & Escrow Spec |
| `COSMOS_AXIOLEDGER_MONOREPO_PLAN.md` | ⭐⭐⭐⭐ | Cosmos Integration Plan |
| `package.json` (root) | ⭐⭐⭐⭐ | Dependency manifest |
| `pnpm-workspace.yaml` | ⭐⭐⭐ | Workspace configuration |

---

## APPENDIX B — Thống Kê Quét Mã Nguồn

| Chỉ số | Giá trị |
|---|---|
| Tổng số packages được quét | 42 packages + 6 apps |
| Ngôn ngữ lập trình | TypeScript · Rust · Go · JavaScript · Solidity · Proto3 |
| Files quan trọng đọc trực tiếp | 18 files |
| Rủi ro CRITICAL phát hiện | 4 |
| Rủi ro HIGH phát hiện | 8 |
| Rủi ro MEDIUM phát hiện | 4 |
| Cosmos repos được kế thừa | 12 repos (migration scripts ready) |
| Docker images được thiết kế | 4 images |
| CI/CD workflows | 3 pipelines |
| ZK-Proof stubs cần thay thế | 2 (JS + Rust) |

---

*Báo cáo này được lập dựa trên kết quả quét tự động mã nguồn tại*
*`/root/workspage/Axioledger_Monorepo/` — phiên bản `v2.0.22`.*

*Mọi phát hiện cần được xác nhận lại bởi đội ngũ kỹ thuật và pháp lý trước khi*
*thực thi bất kỳ hành động nào.*

---

**© 2026 Axioledger Foundation — TÀI LIỆU NỘI BỘ — Chỉ dành cho Ban Cố Vấn**
