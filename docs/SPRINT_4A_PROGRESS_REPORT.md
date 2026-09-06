# BÁO CÁO TIẾN ĐỘ SPRINT 4A — ZK-DID eKYC PIPELINE
## Gửi Ban Cố Vấn Chiến Lược (Advisory Board)

> **Người lập báo cáo:** Kiến trúc sư trưởng — Axioledger Foundation  
> **Sprint:** 4A — ZK-DID Identity Verification (Module 9 · $VRQ)  
> **Ngày:** 2026-02  
> **Phân loại:** Tài liệu nội bộ — Báo cáo lộ trình & checklist triển khai  
> **Trạng thái tổng thể:** ✅ Sprint 4A **HOÀN TẤT** — Sẵn sàng bàn giao Sprint 4B

---

## 1. TÓM TẮT ĐIỀU HÀNH

Sprint 4A đã thông tuyến **toàn bộ luồng ZK-DID eKYC** từ lớp giao diện người dùng (`KYCFlow.tsx`) xuống lớp ZK-proof SDK (`@veraciphers/did-identity-verifier`). Kiến trúc được thiết lập theo nguyên tắc **Fail-Visible** và **phân tách trách nhiệm tuyệt đối** giữa ba tầng: UI Orchestrator → State Machine → SDK Adapter.

Tất cả 7 deliverable cốt lõi đã được triển khai và vượt qua kiểm tra typecheck. Codebase sẵn sàng để Sprint 4B tích hợp ML liveness engine và Phase 2 hoàn thiện ZK circuit thật.

---

## 2. CHECKLIST DELIVERABLE — SPRINT 4A

### 2.1 Tầng UI Kit (`@axioledger/ui-kit`)

| # | Hạng mục | Trạng thái | Ghi chú kỹ thuật |
|:---:|---|:---:|---|
| U-01 | Nâng cấp `AXQIcon.tsx` — Hybrid Rendering Strategy | ✅ Hoàn tất | 21 icon inline + SVG Sprite fallback cho 1877+ icon còn lại |
| U-02 | Thêm `IconSize` token (`standard/nav/large`) | ✅ Hoàn tất | Khoá cứng 20/24/32px theo Primitive Token; loại bỏ giá trị tuỳ tiện |
| U-03 | Thêm `colorToken` semantic prop (`primary/secondary/…/brand`) | ✅ Hoàn tất | Map sang CSS class `.axq-icon--{token}`; không cho phép mã màu hardcode |
| U-04 | SVG Sprite fallback branch | ✅ Hoàn tất | `<use href="/icons/axq-sprites.svg#{name}-{variant}">` |
| U-05 | Backward-compatible với `style`/`color`/`label` (deprecated) | ✅ Hoàn tất | Không có breaking change — consumer hiện tại không cần sửa |
| U-06 | Cập nhật `axq-tokens.css` — thêm `.axq-icon` base class | ✅ Hoàn tất | `display: inline-block; flex-shrink: 0; transition: color 0.2s` |
| U-07 | Thêm `.axq-icon--tertiary` vào utility classes | ✅ Hoàn tất | Đã có `--axq-icon-tertiary` trong Semantic layer nhưng thiếu class |
| U-08 | Export `AXQIconSize`, `AXQIconColor` ra public API | ✅ Hoàn tất | `index.ts` đã cập nhật |
| U-09 | Toàn bộ 52 unit tests của ui-kit pass | ✅ Xác nhận | `vitest run` — 8 test files, 52 tests, 0 failures |

### 2.2 Sprite Builder Script (`scripts/`)

| # | Hạng mục | Trạng thái | Ghi chú kỹ thuật |
|:---:|---|:---:|---|
| S-01 | Tạo `scripts/build-svg-sprites.mjs` | ✅ Hoàn tất | Node.js ESM script, zero dependencies ngoài Node built-ins |
| S-02 | Đọc `docs/asset/icon/bold/` và `docs/asset/icon/linear/` | ✅ Hoàn tất | Map subfolder → variant; có alias `filled/→bold`, `outline/→linear` |
| S-03 | Rewrite `fill="#101426"` → `fill="currentColor"` | ✅ Hoàn tất | Đảm bảo icon kế thừa màu từ CSS token |
| S-04 | Output `public/icons/axq-sprites.svg` một file duy nhất | ✅ Hoàn tất | `<svg style="display:none">` + `<symbol>` per icon |
| S-05 | CLI args `--src` / `--out` + env vars | ✅ Hoàn tất | Cấu hình linh hoạt cho môi trường CI/CD |

### 2.3 ZK-DID Error Layer (`@veraciphers/did-identity-verifier`)

| # | Hạng mục | Trạng thái | Ghi chú kỹ thuật |
|:---:|---|:---:|---|
| E-01 | Tạo `src/errors.ts` — abstract base `DIDError` | ✅ Hoàn tất | `abstract readonly code: string`; stack trace đúng trên V8 |
| E-02 | `DIDCredentialNotFoundError` | ✅ Hoàn tất | Fields: `holderDid`, `credentialType` · code: `CREDENTIAL_NOT_FOUND` |
| E-03 | `DIDCredentialDuplicateError` | ✅ Hoàn tất | Fields: `holderDid`, `credentialType`, `existingId` · code: `DUPLICATE_CREDENTIAL` |
| E-04 | `DIDCredentialExpiredError` | ✅ Hoàn tất | Fields: `expiredAt` (Unix seconds) · code: `CREDENTIAL_EXPIRED` |
| E-05 | `DIDCredentialRevokedError` | ✅ Hoàn tất | Fields: `credentialId`, `holderDid` · code: `CREDENTIAL_REVOKED` |
| E-06 | `DIDCredentialLookupError` | ✅ Hoàn tất | Fields: `credentialId` · code: `CREDENTIAL_NOT_FOUND` |
| E-07 | `DIDProverCapacityError` | ✅ Hoàn tất | Fields: `current`, `max` · code: `PROVER_BUSY` |
| E-08 | `DIDProofTimeoutError` | ✅ Hoàn tất | Fields: `deadlineMs`, `elapsedMs` · code: `PROVER_TIMEOUT` |
| E-09 | `DIDInvalidWitnessError` | ✅ Hoàn tất | Fields: `circuitId`, `field?` · code: `INVALID_PROOF_INPUT` |
| E-10 | `DIDProofVerificationError` | ✅ Hoàn tất | Fields: `requestId?` · code: `PROOF_VERIFICATION_FAILED` |
| E-11 | `DIDMaciNoVotesError` | ✅ Hoàn tất | Fields: `proposalId` · code: `MACI_NO_VOTES` |
| E-12 | Type guards: `isDIDError`, `isCredentialError`, `isProofError` | ✅ Hoàn tất | Cho phép consumer bắt theo nhóm mà không cần liệt kê từng class |
| E-13 | Wire throw sites: `soulbound.ts`, `maci.ts` | ✅ Hoàn tất | Thay `new Error(string)` bằng typed error class tương ứng |
| E-14 | Export toàn bộ error API ra `index.ts` | ✅ Hoàn tất | 10 classes + 3 type guards |
| E-15 | 9 unit tests vẫn pass sau khi đổi throw sites | ✅ Xác nhận | `instanceof` tương thích với `toThrow()` matcher của vitest |

### 2.4 KYC State Machine (`apps/wallet-web`)

| # | Hạng mục | Trạng thái | Ghi chú kỹ thuật |
|:---:|---|:---:|---|
| K-01 | Tạo `src/features/kyc/useKYCStore.ts` | ✅ Hoàn tất | `useReducer` FSM — 7 states, 7 actions, 0 side effects |
| K-02 | Sơ đồ trạng thái đầy đủ với guard conditions | ✅ Hoàn tất | Mọi transition sai state đều silently ignored — không crash |
| K-03 | Export đầy đủ `KYCState`, `KYCStoreState`, `KYCStoreActions` | ✅ Hoàn tất | Typed public interface cho consumer |

### 2.5 KYC Orchestrator (`apps/wallet-web`)

| # | Hạng mục | Trạng thái | Ghi chú kỹ thuật |
|:---:|---|:---:|---|
| O-01 | Tạo `src/features/kyc/KYCFlow.tsx` | ✅ Hoàn tất | `switch(currentState)` — 1 state = 1 màn hình duy nhất |
| O-02 | `IDLE` → Button "Bắt đầu định danh (eKYC)" | ✅ Hoàn tất | Dùng `<Button variant="primary" size="lg">` từ ui-kit |
| O-03 | `CAMERA_REQUESTED` → `LivenessFrame` chờ cấp quyền | ✅ Hoàn tất | `onStatusChange("active")` → `onCameraReady()` |
| O-04 | `LIVENESS_SCANNING` → `LivenessFrame` active + nút giả lập | ✅ Hoàn tất | Nút giả lập score 0.97 — Sprint 4B thay bằng ML signal |
| O-05 | `PROOF_GENERATING` → **Lock overlay bảo mật UX** | ✅ Hoàn tất | `role="dialog"` không có nút tắt + `<Spinner>` + cảnh báo |
| O-06 | `PROOF_FAILED` → `ModalError` + nút "Thử Lại" | ✅ Hoàn tất | `errorMessage` từ store; `onRetry={reset}` |
| O-07 | `DID_REGISTERED` → `useEffect` gọi `completeFATCA()` (bypass) | ✅ Hoàn tất | Sprint 4C sẽ thay bằng FATCA form thực |
| O-08 | `COMPLETED` → `useEffect` gọi `onComplete()` | ✅ Hoàn tất | Điều hướng về WalletDashboard |
| O-09 | Wire `useDIDVerifier` — thay thế TODO comment | ✅ Hoàn tất | `useEffect` giám sát `PROOF_GENERATING` là điểm tích hợp duy nhất |

### 2.6 SDK Adapter (`apps/wallet-web`)

| # | Hạng mục | Trạng thái | Ghi chú kỹ thuật |
|:---:|---|:---:|---|
| D-01 | Tạo `src/features/kyc/useDIDVerifier.ts` | ✅ Hoàn tất | Nhận `onSuccess`/`onError` làm params — đúng store instance |
| D-02 | `normalizePayload()` — `Uint8Array \| string` → base64 | ✅ Hoàn tất | Phase 2: thêm SHA-256 hash trước khi vào witness |
| D-03 | `buildDisclosureRequest()` — tạo `DisclosureRequest` + `credentialProof` | ✅ Hoàn tất | Phase 1: stub holderDid từ payload slice; Phase 2: từ wallet key pair |
| D-04 | Gọi `sd.prove()` — async pipeline | ✅ Hoàn tất | `DisclosureProof { zkProof, publicSignals }` — payload cho on-chain |
| D-05 | Xác minh cục bộ `sd.verify()` trước khi đẩy lên chain | ✅ Hoàn tất | Ném `DIDProofVerificationError` nếu fail |
| D-06 | `extractDIDFromProof()` → `didId` string | ✅ Hoàn tất | Phase 2: parse DID Document từ `publicSignals` |
| D-07 | `mapErrorToMessage()` — ánh xạ 10 error class → tiếng Việt | ✅ Hoàn tất | Ordered từ specific → generic; KHÔNG re-throw |
| D-08 | Khai báo `@veraciphers/did-identity-verifier` trong `package.json` | ✅ Hoàn tất | `workspace:*` — resolve đúng source local |
| D-09 | Typecheck clean — 0 lỗi liên quan KYC | ✅ Xác nhận | `tsc --noEmit` — chỉ còn lỗi môi trường istanbul pre-existing |

---

## 3. KIẾN TRÚC LUỒNG ZK-DID — SƠ ĐỒ TỔNG QUAN

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  apps/wallet-web/src/features/kyc/                                          │
│                                                                             │
│  ┌─────────────┐    actions    ┌───────────────────────────────────────┐   │
│  │  KYCFlow    │◄─────────────►│         useKYCStore (FSM)             │   │
│  │ (Render UI) │               │                                       │   │
│  │             │               │  IDLE → CAMERA_REQUESTED              │   │
│  │  switch     │               │       → LIVENESS_SCANNING             │   │
│  │  (state)    │               │       → PROOF_GENERATING              │   │
│  │             │               │       → DID_REGISTERED                │   │
│  │  useEffect  │               │       → COMPLETED                     │   │
│  │  ──────────►│               │       → PROOF_FAILED → IDLE           │   │
│  │  PROOF_GEN  │               └───────────────────────────────────────┘   │
│  │     │       │                                                            │
│  │     ▼       │  onSuccess(didId)          onError(message)               │
│  │ useDIDVerifier ─────────────────────────────────────────────────────►   │
│  │  generateDID()                                                          │
│  └──────┬──────┘                                                           │
└─────────┼───────────────────────────────────────────────────────────────────┘
          │
          ▼ (async pipeline)
┌─────────────────────────────────────────────────────────────────────────────┐
│  @veraciphers/did-identity-verifier                                         │
│                                                                             │
│  BiometricPayload                                                           │
│      → normalizePayload()     → base64 string                              │
│      → buildDisclosureRequest()  → DisclosureRequest + credentialProof     │
│      → SelectiveDisclosure.prove()  → DisclosureProof                      │
│           { zkProof: string, publicSignals: Record<string,string> }        │
│      → sd.verify()            → boolean                                    │
│      → extractDIDFromProof()  → didId string                               │
│                                                                             │
│  catch(err) → mapErrorToMessage() → onError(friendlyMessage)               │
│  (KHÔNG re-throw — Fail-Visible pattern)                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. MA TRẬN LỖI — ERROR MAPPING TABLE

| Error Class | `.code` | Thông báo người dùng (VI) | Gợi ý hành động |
|---|---|---|---|
| `DIDProverCapacityError` | `PROVER_BUSY` | Hệ thống đang xử lý quá tải (N/M proofs) | Thử lại sau vài phút |
| `DIDProofTimeoutError` | `PROVER_TIMEOUT` | Tạo bằng chứng quá thời gian (Xms) | Thử lại |
| `DIDProofVerificationError` | `PROOF_VERIFICATION_FAILED` | Bằng chứng ZK không hợp lệ | Quét lại khuôn mặt |
| `DIDInvalidWitnessError` | `INVALID_PROOF_INPUT` | Dữ liệu sinh trắc học không đúng định dạng | Thử lại |
| `DIDCredentialNotFoundError` | `CREDENTIAL_NOT_FOUND` | Không tìm thấy thông tin định danh | Liên hệ hỗ trợ |
| `DIDCredentialExpiredError` | `CREDENTIAL_EXPIRED` | Thông tin định danh đã hết hạn | Cấp lại credential |
| `DIDCredentialRevokedError` | `CREDENTIAL_REVOKED` | Thông tin định danh đã bị thu hồi | Liên hệ issuer |
| `DIDCredentialDuplicateError` | `DUPLICATE_CREDENTIAL` | Đã tồn tại định danh cùng loại | Không cần action |
| `DIDMaciNoVotesError` | `MACI_NO_VOTES` | Không có phiếu bầu cho proposal | Kiểm tra proposalId |
| `DIDError` (generic) | `[dynamic]` | Lỗi ZK-DID [{code}] | Thử lại |
| `Error` (non-DID) | — | Lỗi hệ thống không mong đợi | Liên hệ hỗ trợ kỹ thuật |

---

## 5. CÁC GAP ĐÃ XÁC NHẬN — DÀNH CHO SPRINT TIẾP THEO

### 5.1 Gap Kỹ Thuật Phase 1 → Phase 2

| ID | Mô tả Gap | Vị trí | Sprint giải quyết |
|:---:|---|---|:---:|
| G-01 | `SelectiveDisclosure.prove()` đang trả về **stub proof** — chưa gọi Rust halo2/plonky2 backend | `selective-disclosure.ts` | Sprint 5 (Phase 2) |
| G-02 | `holderDid` đang được sinh từ slice của payload thay vì từ **wallet key pair** thực | `useDIDVerifier.ts:buildDisclosureRequest()` | Sprint 5 |
| G-03 | `normalizePayload()` chưa hash SHA-256 payload trước khi đưa vào witness | `useDIDVerifier.ts` | Sprint 5 |
| G-04 | `LivenessFrame` chưa có prop `onScanSuccess(score: number)` — ML signal chưa tích hợp | `ui-kit/LivenessFrame.tsx` | Sprint 4B |
| G-05 | Nút giả lập "Scan thành công (score 0.97)" cần xóa trước production | `KYCFlow.tsx:LIVENESS_SCANNING` | Sprint 4B |
| G-06 | `completeFATCA()` đang bypass FATCA form | `KYCFlow.tsx:DID_REGISTERED` | Sprint 4C |
| G-07 | `ProverRuntime` / `ProverClient` chưa kết nối gRPC endpoint thật | `zk-prover-runtime/prover-runtime.ts` | Sprint 5 |
| G-08 | `SoulboundRegistry` đang in-memory — chưa có on-chain persistence | `soulbound.ts` | Phase 2 |

### 5.2 Gap Đã Phát Hiện Khi Audit SDK

> *Phát hiện khi audit `@veraciphers/did-identity-verifier` — Sprint 4A audit session*

| ID | Mô tả | Trạng thái |
|:---:|---|:---:|
| A-01 | SDK **không có input sinh trắc học** (Base64/Uint8Array/ImageData) — đây là Credential Management layer, không phải Liveness Engine | ✅ Đã ghi nhận — thiết kế đúng |
| A-02 | Không có `minConfidence` threshold — sẽ nằm ở Liveness Engine layer riêng | ✅ Đã ghi nhận |
| A-03 | `IdentityVerifier.verify()` trả về `IdentityVerifyResult.error?: string` — không throw | ✅ Đã ghi nhận — pattern tốt |
| A-04 | Toàn bộ error trước Sprint 4A là `new Error(string)` thuần — đã được thay thế | ✅ Đã khắc phục |

---

## 6. CÁC SPRINT TIẾP THEO — PHẠM VI VÀ ĐỘ ƯU TIÊN

```
Sprint 4B  [Độ ưu tiên: CAO]
  ├── Tích hợp ML Liveness Engine → LivenessFrame.onScanSuccess(score)
  ├── Xóa nút giả lập trong LIVENESS_SCANNING
  └── Kết nối useDIDVerifier với frame bytes thực từ canvas

Sprint 4C  [Độ ưu tiên: TRUNG BÌNH]
  ├── FATCA Form — thay thế completeFATCA() bypass
  ├── Lưu DID vào wallet storage (localStorage / Secure Enclave)
  └── KYC Level Progress UI (KYCLevelProgress component)

Sprint 5   [Độ ưu tiên: CAO — Phase 2 Gate]
  ├── ZK Prover backend thật (Rust/WASM halo2)
  ├── holderDid từ wallet secp256k1 key pair
  ├── SHA-256 hash biometric payload trước witness
  ├── SoulboundRegistry on-chain (Stateless SVM)
  └── @veraciphers/on-chain-verifier tích hợp đầy đủ
```

---

## 7. CHỮ KÝ XÁC NHẬN

| Vai trò | Họ tên | Trạng thái |
|---|---|:---:|
| Kiến trúc sư trưởng | *(Chief Architect)* | ✅ Đã duyệt |
| Ban Cố vấn Chiến lược | *(Advisory Board)* | ⬜ Chờ xác nhận |
| Trưởng nhóm Bảo mật | *(Security Lead)* | ⬜ Chờ review |
| Trưởng nhóm ZK Protocol | *(ZK Protocol Lead)* | ⬜ Chờ review |

---

## 8. PHỤ LỤC — DANH SÁCH FILE ĐÃ TẠO/THAY ĐỔI

| File | Loại thay đổi | Package |
|---|:---:|---|
| `packages/axioledger/ui-kit/src/components/AXQIcon.tsx` | 🔄 Sửa đổi | `@axioledger/ui-kit` |
| `packages/axioledger/ui-kit/src/tokens/generated/axq-tokens.css` | 🔄 Sửa đổi | `@axioledger/ui-kit` |
| `packages/axioledger/ui-kit/src/index.ts` | 🔄 Sửa đổi | `@axioledger/ui-kit` |
| `scripts/build-svg-sprites.mjs` | 🆕 Tạo mới | Root monorepo |
| `packages/veraciphers/did-identity-verifier/src/errors.ts` | 🆕 Tạo mới | `@veraciphers/did-identity-verifier` |
| `packages/veraciphers/did-identity-verifier/src/soulbound.ts` | 🔄 Sửa đổi | `@veraciphers/did-identity-verifier` |
| `packages/veraciphers/did-identity-verifier/src/maci.ts` | 🔄 Sửa đổi | `@veraciphers/did-identity-verifier` |
| `packages/veraciphers/did-identity-verifier/src/index.ts` | 🔄 Sửa đổi | `@veraciphers/did-identity-verifier` |
| `apps/wallet-web/src/features/kyc/useKYCStore.ts` | 🆕 Tạo mới | `@axioledger/wallet-web` |
| `apps/wallet-web/src/features/kyc/KYCFlow.tsx` | 🆕 Tạo mới | `@axioledger/wallet-web` |
| `apps/wallet-web/src/features/kyc/useDIDVerifier.ts` | 🆕 Tạo mới | `@axioledger/wallet-web` |
| `apps/wallet-web/package.json` | 🔄 Sửa đổi | `@axioledger/wallet-web` |

---

*Axioledger Foundation · Sprint 4A Progress Report · Module 9 ($VRQ) ZK-DID eKYC Pipeline · 2026*
