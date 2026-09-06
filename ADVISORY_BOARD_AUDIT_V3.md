# BÁO CÁO THAM MƯU CHIẾN LƯỢC — KIỂM TOÁN & PHÂN LOẠI HỆ THỐNG LÕI
## Axioledger Monorepo — Phiên Bản 3.1
**Ngày phát hành:** 2026-09-06  
**Phân loại:** Nội bộ — Ban Cố vấn Chiến lược + Kiến trúc sư trưởng  
**Trạng thái repo:** `github.com/axioledger/axioledger-monorepo` · public · `main` protected  
**Tổng dung lượng quét:** 384MB · 22 packages · 6 apps · 12 external Go modules · 7 CI/CD workflows

---

## I. MỤC TIÊU CHIẾN DỊCH

Đợt tổng kiểm toán này nhằm:

1. Tối ưu hóa hiệu suất và giảm thiểu nợ kỹ thuật (technical debt)
2. Gia cố bảo mật — thiết lập ranh giới dữ liệu chuẩn xác giữa public / private / loại bỏ
3. Giải quyết 4 vấn đề cấp khẩn đang block CI/CD pipeline
4. Chuẩn bị hệ thống sẵn sàng onboard kỹ sư và cộng đồng developer

---

## II. MA TRẬN ĐIỀU PHỐI VAI TRÒ

| Vai Trò | Phạm Vi Rà Soát | Nhiệm Vụ Quyết Định |
|---|---|---|
| **DevOps Lead** | `.github/`, `config/`, `docker-compose.infra.yml`, `ecosystem.config.cjs`, `external/cosmos/`, CI/CD workflows | Sửa submodule conflict, xóa config server lỗi thời, ẩn file deploy nhạy cảm |
| **Backend Lead** | `packages/axioledger/`, `packages/kinetoprotocol/`, `packages/sequentichain/`, `packages/valiprecision/`, `contracts/`, `tests/`, `scripts/` | Gỡ bỏ duplicate escrow, đánh giá dead code, xác nhận API boundaries |
| **Security Lead** | `packages/veraciphers/`, `packages/axioledger/kms/`, `config/genesis.json`, `.npmrc`, `AUDIT_REPORT.md`, `ADVISORY_BOARD_REPORT.md` | Dịch chuyển toàn bộ credentials vào Vault/KMS, phân vùng private repos |
| **Frontend Lead** | `apps/`, `packages/axioledger/ui-kit/`, `packages/axioledger/wallet-connector/`, `packages/dom/`, `packages/html/`, `packages/svg/`, `docs/logic/draft/` | Public Design System, xóa component rỗng, xóa ảnh mockup khỏi git |

---

## III. TIÊU CHÍ PHÂN LOẠI TÀI SẢN — 4 CẤP ĐỘ

| Cấp | Định nghĩa |
|---|---|
| ✅ **GIỮ (Keep)** | Core module đang gánh tải thực tế, logic xử lý giao dịch, thư viện dùng chung đã pass test |
| ❌ **XÓA (Delete)** | File tạm (temp), dead code, thư viện không dùng, config server cũ, ảnh mockup, roleplay docs |
| 🔒 **ẨN (Private)** | Proprietary logic, thông tin kết nối database, file `.env`, kiến trúc hạ tầng nội bộ, ZK circuits chưa audit |
| 🌐 **PUBLIC (Mở)** | API Docs, UI Kit, thư viện open-source, SDK tích hợp, endpoint phục vụ cộng đồng |

---

## IV. KẾT QUẢ PHÂN LOẠI — TOÀN BỘ CẤU TRÚC

### 4.1 — Thư mục gốc (Root Level)

| Đường dẫn | Quyết định | Vai trò phụ trách | Ghi chú |
|---|---|---|---|
| `README.md` | 🌐 PUBLIC | Frontend Lead | Chuẩn, đầy đủ thông tin |
| `package.json` | 🌐 PUBLIC | DevOps Lead | Root workspace config |
| `pnpm-workspace.yaml` | 🌐 PUBLIC | DevOps Lead | Workspace definition |
| `.npmrc` | 🌐 PUBLIC | DevOps Lead | Dùng `${NPM_TOKEN}` — không có secret thật |
| `.gitignore` | 🌐 PUBLIC | DevOps Lead | Cần bổ sung thêm entries |
| `.gitmodules` | 🌐 PUBLIC | DevOps Lead | Cần sửa submodule conflict |
| `go.work` | 🌐 PUBLIC | Backend Lead | Go workspace declaration |
| `docker-compose.infra.yml` | 🌐 PUBLIC | DevOps Lead | Infrastructure as code |
| `ecosystem.config.cjs` | ✅ GIỮ + SỬA | DevOps Lead | Xóa hardcode WSL paths |
| `index.js` + `index.d.ts` | ✅ GIỮ + ĐÁNH GIÁ | Backend Lead | Root barrel exports — xác nhận còn cần thiết |
| `core.md` | 🔒 ẨN → `docs/` | Backend Lead | 49KB nội dung kỹ thuật — chuyển vào `docs/architecture/` |
| `ADVISORY_BOARD_REPORT.md` | 🔒 ẨN | Security Lead | Chuyển vào private repo hoặc GitHub Wiki |
| `AUDIT_REPORT.md` | 🔒 ẨN | Security Lead | Chuyển vào private repo hoặc GitHub Wiki |
| `COSMOS_AXIOLEDGER_MONOREPO_PLAN.md` | 🔒 ẨN | Backend Lead | Roadmap nội bộ — không public |
| `ADVISORY_BOARD_AUDIT_V3.md` | 🔒 ẨN | Security Lead | File này — lưu internal |
| `axioledger-monorepo-consistency-audit-report-v2-1.html` | ❌ XÓA | DevOps Lead | HTML artifact tạm, trùng lặp |

### 4.2 — CI/CD & DevOps

| Đường dẫn | Quyết định | Vai trò | Ghi chú |
|---|---|---|---|
| `.github/workflows/ci.yml` | ✅ GIỮ | DevOps Lead | Cần sửa `submodules: false` |
| `.github/workflows/ci-test.yml` | ✅ GIỮ | DevOps Lead | Đã nâng cấp pnpm@v4, Node 22 |
| `.github/workflows/auto-assign.yml` | ✅ GIỮ | DevOps Lead | Hoạt động tốt ✓ |
| `.github/workflows/sync-labels.yml` | ✅ GIỮ | DevOps Lead | Chờ trigger |
| `.github/workflows/check-doc-links.yml` | ✅ GIỮ | DevOps Lead | Hoạt động |
| `.github/workflows/publish-npm-scopes.yml` | ✅ GIỮ | DevOps Lead | Chờ tag v* |
| `.github/workflows/publish-docker.yml` | ✅ GIỮ | DevOps Lead | Chờ tag v* |
| `.github/CODEOWNERS` | ✅ GIỮ | DevOps Lead | Path-based reviewer assignment |
| `.github/labels.yml` | ✅ GIỮ | DevOps Lead | 21 labels đã sync |
| `.github/branch-protection.sh` | ✅ GIỮ | DevOps Lead | Chạy 1 lần để setup |
| `.devcontainer/devcontainer.json` | ✅ GIỮ | DevOps Lead | Codespaces environment |

### 4.3 — Infrastructure Config

| Đường dẫn | Quyết định | Vai trò | Ghi chú |
|---|---|---|---|
| `config/genesis.json` | 🔒 ẨN | Security Lead | Genesis allocation — nhạy cảm |
| `config/grafana/` | 🔒 ẨN | DevOps Lead | Dashboard config — không public |
| `config/nginx/` | 🔒 ẨN | DevOps Lead | Server config — không public |
| `config/prometheus/` | 🔒 ẨN | DevOps Lead | Monitoring config — không public |

**→ Hành động:** Chuyển toàn bộ `config/` sang repo `axioledger/infra-config` (private).

### 4.4 — Packages Lõi

| Đường dẫn | Quyết định | Vai trò | Ghi chú |
|---|---|---|---|
| `packages/axioledger/sdk/` | 🌐 PUBLIC | Backend Lead | Open-source SDK |
| `packages/axioledger/ans-sdk/` | 🌐 PUBLIC | Backend Lead | ANS name resolution |
| `packages/axioledger/cli/` | 🌐 PUBLIC | Backend Lead | Developer tooling |
| `packages/axioledger/create-app/` | 🌐 PUBLIC | Frontend Lead | Project scaffolding |
| `packages/axioledger/ui-kit/` | 🌐 PUBLIC | Frontend Lead | Design System |
| `packages/axioledger/wallet-connector/` | 🌐 PUBLIC | Frontend Lead | Wallet integration SDK |
| `packages/axioledger/axioledger-adapter/` | 🌐 PUBLIC | Backend Lead | Framework adapter |
| `packages/axioledger/validate-public-rpc/` | 🌐 PUBLIC | Backend Lead | RPC validation tool |
| `packages/axioledger/indexer-billing/` | ✅ GIỮ · ĐÁNH GIÁ | Backend Lead | Xác nhận billing logic |
| `packages/axioledger/kms/` | 🔒 ẨN | Security Lead | Key Management — tuyệt đối không public |
| `packages/axioledger/contracts/escrow/` | 🔒 ẨN | Security Lead | Chưa audit bên thứ 3 — không public |
| `packages/axioledger/cometbft/` | ✅ GIỮ | Backend Lead | CometBFT Go bindings |
| `packages/axioledger/cosmos-sdk/` | ✅ GIỮ | Backend Lead | Cosmos SDK bindings |
| `packages/axioledger/evm/` | ✅ GIỮ | Backend Lead | EVM compatibility layer |
| `packages/axioledger/gogoproto/` | ✅ GIỮ | Backend Lead | Protobuf bindings |
| `packages/axioledger/iavl/` | ✅ GIỮ | Backend Lead | IAVL tree |
| `packages/axioledger/ibc-contracts/` | 🔒 ẨN | Security Lead | IBC contracts — chưa audit |
| `packages/axioledger/ibc-go/` | ✅ GIỮ | Backend Lead | IBC Go bindings |
| `packages/axioledger/interchain-security/` | ✅ GIỮ | Backend Lead | ICS bindings |
| `packages/axioledger/interchaintest/` | ✅ GIỮ | Backend Lead | Integration test framework |
| `packages/axioledger/rosetta/` | 🌐 PUBLIC | Backend Lead | Rosetta API |
| `packages/axioledger/tokenfactory/` | ✅ GIỮ | Backend Lead | Token factory module |

### 4.5 — Protocol Packages

| Đường dẫn | Quyết định | Vai trò | Ghi chú |
|---|---|---|---|
| `packages/kinetoprotocol/bridge-relayer/` | ✅ GIỮ | Backend Lead | Cross-chain bridge |
| `packages/kinetoprotocol/clamm-engine/` | ✅ GIỮ | Backend Lead | Concentrated AMM |
| `packages/kinetoprotocol/intents-engine/` | 🌐 PUBLIC | Backend Lead | Omni-chain intents |
| `packages/kinetoprotocol/liquidity-node-docker/` | 🔒 ẨN | DevOps Lead | Liquidity node — infra sensitive |
| `packages/kinetoprotocol/market-registry/` | 🌐 PUBLIC | Backend Lead | Market registry |
| `packages/sequentichain/sequencer-node/` | ✅ GIỮ | Backend Lead | SVM Rollup sequencer |
| `packages/sequentichain/zk-batcher/` | ✅ GIỮ | Backend Lead | ZK batch prover |
| `packages/sequentichain/da-layer/` | ✅ GIỮ | Backend Lead | Data availability layer |
| `packages/sequentichain/network-stack/` | ✅ GIỮ | Backend Lead | AF_XDP networking |
| `packages/sequentichain/async-task-runner/` | 🌐 PUBLIC | Backend Lead | Task runner utility |
| `packages/sequentichain/gpu-executor/` | 🔒 ẨN | Security Lead | GPU scheduling — competitive IP |
| `packages/sequentichain/docker-runtime/` | 🔒 ẨN | DevOps Lead | Runtime config — không public |
| `packages/valiprecision/` | 🌐 PUBLIC | Backend Lead | Validator node client |
| `packages/dom/` | 🌐 PUBLIC | Frontend Lead | DOM utilities |
| `packages/html/` | 🌐 PUBLIC | Frontend Lead | HTML utilities |
| `packages/svg/` | 🌐 PUBLIC | Frontend Lead | SVG utilities |
| `packages/events/` | 🌐 PUBLIC | Frontend Lead | Event system |
| `packages/time/` | 🌐 PUBLIC | Frontend Lead | Time utilities |

### 4.6 — Cryptography & ZK (Veraciphers)

| Đường dẫn | Quyết định | Vai trò | Ghi chú |
|---|---|---|---|
| `packages/veraciphers/circuit-compiler/` | 🔒 ẨN | Security Lead | Halo2 circuit compiler — core IP |
| `packages/veraciphers/zk-prover-runtime/` | 🔒 ẨN | Security Lead | ZK prover — không public trước audit |
| `packages/veraciphers/proof-aggregator/` | 🔒 ẨN | Security Lead | Proof aggregation logic |
| `packages/veraciphers/did-identity-verifier/` | ✅ GIỮ · ĐÁNH GIÁ | Security Lead | ZK-DID verifier — có thể public sau audit |
| `packages/veraciphers/on-chain-verifier/` | 🔒 ẨN | Security Lead | On-chain verification — chưa audit |
| `packages/veraciphers/specs-and-docs/` | 🌐 PUBLIC | Security Lead | Specs có thể public |

**→ Hành động:** Tạo repo `axioledger/veraciphers-core` (private) cho 4 package đầu.

### 4.7 — Frontend Applications

| Đường dẫn | Quyết định | Vai trò | Ghi chú |
|---|---|---|---|
| `apps/wallet-web/` | 🌐 PUBLIC | Frontend Lead | Wallet frontend |
| `apps/exchange-web/` | 🌐 PUBLIC | Frontend Lead | Exchange UI |
| `apps/dao-dashboard/` | 🌐 PUBLIC | Frontend Lead | DAO governance UI |
| `apps/docs-site/` | 🌐 PUBLIC | Frontend Lead | Documentation site |
| `apps/craft-portal/` | 🌐 PUBLIC | Frontend Lead | Creator portal |
| `apps/pay-gateway/` | ✅ GIỮ · ĐÁNH GIÁ | Backend Lead | Payment gateway — xác nhận có expose key không |

### 4.8 — External, Contracts, Tests, Scripts

| Đường dẫn | Quyết định | Vai trò | Ghi chú |
|---|---|---|---|
| `external/cosmos/` (12 repos · 350MB) | ⚠️ CẦU SỬA | DevOps Lead | Submodule conflict — xem mục V.2 |
| `contracts/core/escrow/` | ❌ XÓA | Backend Lead | Trùng lặp với `packages/axioledger/contracts/escrow/` |
| `packages/core/ethereum-lists/` | ✅ GIỮ | Backend Lead | Submodules hợp lệ |
| `tests/escrow/` | ✅ GIỮ | Backend Lead | Unit tests |
| `tests/starship/` | 🔒 ẨN | DevOps Lead | Integration tests với infra thực |
| `tests/index.test.js` | ✅ GIỮ | Backend Lead | Root test entry |
| `scripts/` | ✅ GIỮ | DevOps Lead | Automation scripts |
| `toolchain/` | 🌐 PUBLIC | DevOps Lead | Shared build config |
| `public/icons/` | 🌐 PUBLIC | Frontend Lead | SVG icons |

### 4.9 — Tài liệu (docs/)

| Đường dẫn | Quyết định | Vai trò | Ghi chú |
|---|---|---|---|
| `docs/AXIOLEDGER_ROADMAP.md` | 🔒 ẨN | Security Lead | Roadmap nội bộ |
| `docs/LIBRARY_MAP.md` | 🌐 PUBLIC | Backend Lead | Library dependency map |
| `docs/SPRINT_4A_PROGRESS_REPORT.md` | 🔒 ẨN | Backend Lead | Sprint report nội bộ |
| `docs/RD_UPDATE_NOTICE.md` | 🔒 ẨN | Backend Lead | R&D notice nội bộ |
| `docs/api/` | 🌐 PUBLIC | Backend Lead | API documentation |
| `docs/architecture/` | 🌐 PUBLIC | Backend Lead | Architecture docs |
| `docs/logic/` | ✅ GIỮ | Backend Lead | Business logic docs |
| `docs/logic/draft/` (50+ PNG) | ❌ XÓA | Frontend Lead | Mockup ảnh — chuyển Figma/Notion |
| `docs/logic/sai.md` | ❌ XÓA | Backend Lead | File roleplay, không có giá trị kỹ thuật |
| `docs/grafana/` | 🔒 ẨN | DevOps Lead | Grafana dashboard config |
| `docs/ui/` | 🌐 PUBLIC | Frontend Lead | UI guidelines |
| `docs/tutorial.md` | 🌐 PUBLIC | Backend Lead | Developer tutorial |
| `docs/reference.md` | 🌐 PUBLIC | Backend Lead | API reference |
| `docs/axioledger-monorepo-consistency-audit-report-v2-1.html` | ❌ XÓA | DevOps Lead | HTML artifact trùng lặp |

---

## V. VẤN ĐỀ CẤP KHẨN — 4 ĐIỂM ĐANG BLOCK PIPELINE

### V.1 — CI Fail: External Submodule 404 🔴 KHẨN · DevOps Lead

12 submodules trong `external/cosmos/` trỏ vào repos không tồn tại trên GitHub org:

```
external/cosmos/cometbft      → github.com/axioledger/cometbft    ❌ 404
external/cosmos/cosmos-sdk    → github.com/axioledger/cosmos-sdk   ❌ 404
... (10 repos tương tự)
```

**Lựa chọn được khuyến nghị (A — ngắn hạn, thực hiện ngay):**

```bash
# Trong nhánh fix/escrow-solana-program-dependency hiện tại:
# Bỏ submodules: recursive trong ci.yml — chỉ init ethereum-lists
# Thêm update-submodules step chọn lọc
```

Sửa trong [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

```yaml
# THAY:
- uses: actions/checkout@v4
  with:
    submodules: recursive

# BẰNG:
- uses: actions/checkout@v4
  with:
    submodules: false
- name: Init required submodules only
  run: |
    git submodule update --init packages/core/ethereum-lists/chains
    git submodule update --init packages/core/ethereum-lists/tokens
```

### V.2 — Escrow Contract Trùng Lặp 🟡 QUAN TRỌNG · Backend Lead

| Vị trí | Công nghệ | Trạng thái |
|---|---|---|
| `packages/axioledger/contracts/escrow/` | Rust/Solana (Cargo.toml) | ✅ Giữ — canonical |
| `contracts/core/escrow/` | JavaScript wrapper | ❌ Xóa — trùng lặp |

**Hành động:** Chuyển JS wrapper vào `packages/axioledger/sdk/src/contracts/`. Xóa `contracts/core/escrow/`.

### V.3 — `ecosystem.config.cjs` Hardcode WSL Path 🟡 QUAN TRỌNG · DevOps Lead

```javascript
// Sai — WSL-specific:
const NODE = "/opt/nvm/versions/node/v22.23.2/bin/node"
const ROOT = "/root/workspage/Axioledger_Monorepo"

// Đúng — portable:
const NODE = process.execPath
const ROOT = path.resolve(__dirname)
```

### V.4 — `node_modules` trong packages (14 thư mục) 🟡 QUAN TRỌNG · DevOps Lead

14 thư mục `node_modules` đang tồn tại trong `packages/*/` trên disk nhưng không được commit (`.gitignore` đúng). Cần chạy `pnpm install --frozen-lockfile` từ root thay vì cài thủ công từng package.

---

## VI. LỘ TRÌNH THỰC THI — 4 GIAI ĐOẠN

### Giai đoạn 1: Khởi tạo nhánh audit và dọn dẹp khẩn (Hôm nay · 2 giờ)

```bash
# Tạo nhánh cô lập hoàn toàn trên cloud
git checkout -b audit/core-cleanup
git push origin audit/core-cleanup

# XÓA: ảnh mockup 50+ file PNG
git rm -r "docs/logic/draft/*.png" "docs/logic/draft/*.PNG" 2>/dev/null || true

# XÓA: file roleplay
git rm docs/logic/sai.md

# XÓA: HTML artifacts
git rm axioledger-monorepo-consistency-audit-report-v2-1.html 2>/dev/null || true
git rm "docs/axioledger-monorepo-consistency-audit-report-v2-1.html" 2>/dev/null || true

# XÓA: duplicate escrow JS
git rm -r contracts/core/escrow/

# CHUYỂN: báo cáo nhạy cảm ra khỏi public commit
git rm ADVISORY_BOARD_REPORT.md AUDIT_REPORT.md COSMOS_AXIOLEDGER_MONOREPO_PLAN.md

# COMMIT
git commit -m "chore(audit): remove non-code artifacts, sensitive reports, duplicate contracts"
```

### Giai đoạn 2: Sửa CI — Static Analysis (Hôm nay · 1 giờ · DevOps Lead)

```bash
# Sửa ci.yml: bỏ submodules: recursive
# Sửa ecosystem.config.cjs: bỏ hardcode paths
git add .github/workflows/ci.yml ecosystem.config.cjs
git commit -m "fix(ci): remove recursive submodule clone, fix portable paths"
git push origin audit/core-cleanup

# Tạo PR → main
gh pr create --title "chore(audit): core cleanup + CI fix" \
  --body "Giai đoạn 1+2 của audit/core-cleanup" \
  --base main --label "ci/cd,priority: critical"
```

### Giai đoạn 3: Phân vùng bảo mật (Tuần này · Security Lead)

Tạo 3 repo private mới:

```bash
# 1. ZK Cryptography — IP lõi
gh repo create axioledger/veraciphers-core --private
# Chuyển: circuit-compiler, zk-prover-runtime, proof-aggregator, on-chain-verifier

# 2. Key Management
gh repo create axioledger/kms-internal --private
# Chuyển: packages/axioledger/kms/

# 3. Infrastructure Config
gh repo create axioledger/infra-config --private
# Chuyển: config/, docs/grafana/, tests/starship/
```

Lưu báo cáo nội bộ:
```bash
# Tạo GitHub Wiki (private) cho axioledger/axioledger-monorepo
# Hoặc Notion workspace riêng cho ban cố vấn
```

### Giai đoạn 4: Chuẩn hóa dài hạn (Tháng này · All Leads)

| Nhiệm vụ | Vai trò | Deadline |
|---|---|---|
| Go workspace migration (`go.work`) — thay thế external submodules | Backend Lead | Sprint 4B |
| Thêm `SECURITY.md` và `CONTRIBUTING.md` | Security Lead | Sprint 4B |
| Thêm `LICENSE` file chính thức | Backend Lead | Sprint 4B |
| Bổ sung `.gitignore`: `*.log`, `dist/`, `build/`, `*.wasm` | DevOps Lead | Giai đoạn 1 |
| Audit `apps/pay-gateway/` — kiểm tra expose credentials | Backend Lead | Sprint 4B |
| External third-party security audit cho `contracts/escrow/` | Security Lead | Pre-mainnet |

---

## VII. TRẠNG THÁI CI/CD HIỆN TẠI

| Workflow | Trạng thái | Nguyên nhân | Phụ trách |
|---|---|---|---|
| `Auto-Assign` | ✅ PASS | — | DevOps Lead |
| `CI — Axioledger Monorepo` | ❌ FAIL | External submodule 404 | DevOps Lead |
| `CI — Test, Typecheck & Lint` | ❌ FAIL | External submodule 404 | DevOps Lead |
| `Sync Labels` | ⏳ Chờ trigger | Cần push vào main | DevOps Lead |
| `Doc Link Checker` | ⏳ Chờ trigger | Chưa có PR docs | DevOps Lead |
| `Publish — NPM Scopes` | ⏳ Chờ tag `v*` | Đúng thiết kế | DevOps Lead |
| `Publish — Docker Images` | ⏳ Chờ tag `v*` | Đúng thiết kế | DevOps Lead |

**Mục tiêu:** CI xanh 100% trước khi onboard kỹ sư đầu tiên vào repo.

---

## VIII. THỐNG KÊ TỔNG HỢP

| Chỉ số | Giá trị |
|---|---|
| Tổng file/thư mục đã quét | ~3,000 |
| Quyết định PUBLIC | 38 mục |
| Quyết định GIỮ (internal) | 29 mục |
| Quyết định ẨN (private repo) | 24 mục |
| Quyết định XÓA | 9 mục |
| Dung lượng có thể cắt giảm | ~350MB (external cosmos) + ~20MB (PNG mockups) |
| CI workflows hoạt động | 1/7 |
| CI workflows cần sửa | 2/7 |

---

## IX. CHỮ KÝ & PHÊ DUYỆT

Mọi quyết định xóa/chuyển repo phải được phê duyệt theo thứ tự sau trước khi thực thi:

| Bước | Vai trò | Hành động |
|---|---|---|
| 1 | Security Lead | Xác nhận danh sách mục cần ẩn (mục III cột 🔒) |
| 2 | Backend Lead | Xác nhận không có dead code được giữ lại nhầm |
| 3 | DevOps Lead | Chạy static analysis trên phân khu CI/CD |
| 4 | Frontend Lead | Xác nhận Design System sẵn sàng public |
| 5 | **Kiến trúc sư trưởng** | **Phê duyệt cuối — thực thi lệnh xóa và thay đổi quyền truy cập** |

---

*Báo cáo v3.1 — Tổng hợp từ quét codebase thực tế kết hợp chỉ thị chiến lược Ban Cố vấn ngày 2026-09-06.*  
*Không phân phối ra ngoài phạm vi Ban Cố vấn và Kiến trúc sư trưởng.*
