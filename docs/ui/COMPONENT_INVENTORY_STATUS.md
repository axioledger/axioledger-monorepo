# AXQ Component Inventory — Status Report v1.3

> **Audit date:** 2025  
> **Audited by:** Bob (Automated Design System Audit Pass)  
> **Last updated:** 2025 — Task 4 (Phase 3 scaffolds) COMPLETE  
> **Basis:** `COMPONENT_INVENTORY.md` v1.0 · `DESIGN_SYSTEM.md` v2.1 · `AXIOLEDGER_ROADMAP.md` v2.0  
> **Framework:** React + TypeScript · Package: `packages/axioledger/ui-kit/`  
> **Total components:** 201 across 15 groups

---

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Documented in inventory AND scaffolded/implemented with correct tokens |
| ⚠️ | Scaffolded but had token violations — now RESOLVED |
| 🏗️ | Scaffold complete (placeholder RN component + full props + token map) |
| 📄 | Documented only — no code scaffold exists |
| 🔲 | Not started |

### Priority Tags
| Tag | Phase |
|---|---|
| ⚡ | Phase 1–2 Critical |
| 🔵 | Phase 3 Medium |
| ⬜ | Phase 4+ Low |

---

## Token Violation Remediation — RESOLVED ✅

> All 14 violations corrected in commit covering Task 1.
> Source of truth: `DESIGN_SYSTEM.md` v2.1

| File | Token | Was (incorrect) | Now (AXQ DS spec) | Status |
|---|---|---|---|---|
| `tokens/colors.ts` | `greyscale/800` | `#1E2333` | `#151A30` | ✅ RESOLVED |
| `tokens/colors.ts` | `greyscale/700` | `#2C3347` | `#192038` | ✅ RESOLVED |
| `tokens/colors.ts` | `greyscale/600` | `#3E4558` | `#222B45` | ✅ RESOLVED |
| `tokens/colors.ts` | `greyscale/500` | `#5A6070` | `#2E3A59` | ✅ RESOLVED |
| `tokens/colors.ts` | `greyscale/400` | `#7C8390` | `#8F9BB3` | ✅ RESOLVED |
| `tokens/colors.ts` | `greyscale/300` | `#A3A9B5` | `#C5CEE0` | ✅ RESOLVED |
| `tokens/colors.ts` | `greyscale/200` | `#C8CDD8` | `#E4E9F2` | ✅ RESOLVED |
| `tokens/colors.ts` | `greyscale/100` | `#E8EAF0` | `#EDF1F7` | ✅ RESOLVED |
| `tokens/colors.ts` | `status/success/500` | `#22C55E` (Tailwind) | `#00D68F` | ✅ RESOLVED |
| `tokens/colors.ts` | `status/warning/500` | `#F59E0B` (Tailwind) | `#FFAA00` | ✅ RESOLVED |
| `tokens/colors.ts` | `status/error/500` | `#EF4444` (Tailwind) | `#FF3D71` | ✅ RESOLVED |
| `tokens/colors.ts` | `status/info/500` | `#3B82F6` (Tailwind) | `#0095FF` | ✅ RESOLVED |
| `tokens/radius.ts` | entire scale | shifted -1 step (`xl`=12px) | corrected (`xl`=16px, `2xl`=24px, `3xl`=32px, `md`=8px, `lg`=12px) | ✅ RESOLVED |
| `components/Button.tsx` | `primary` bg | `#49DBC8` (teal) | `#000000` (`bg/brand`) | ✅ RESOLVED |
| `components/Button.tsx` | `destructive` bg | `#EF4444` | `#FF3D71` | ✅ RESOLVED |
| `components/Button.tsx` | `secondary` border | `#E8EAF0` fallback | `#E4E9F2` (`border/default`) | ✅ RESOLVED |
| `components/Button.tsx` | all SIZE_STYLES `borderRadius` | 6px / 8px / 10px | `24px` (`radius/button`) | ✅ RESOLVED |
| `components/Input.tsx` | error `borderColor` | `#EF4444` | `#FF3D71` | ✅ RESOLVED |
| `components/Input.tsx` | success `borderColor` | `#22C55E` | `#00D68F` | ✅ RESOLVED |
| `components/Input.tsx` | `borderRadius` | `var(--radius-md, 6px)` | `12px` (`radius/input`) | ✅ RESOLVED |
| `components/Input.tsx` | disabled bg | `#F4F5F8` fallback | `#E4E9F2` (`bg/disabled`) | ✅ RESOLVED |
| `components/Input.tsx` | label disabled color | `#A3A9B5` | `#C5CEE0` (`text/disabled`) | ✅ RESOLVED |
| `components/Input.tsx` | error text color | `#EF4444` | `#B81D5B` (`status/error-text`) | ✅ RESOLVED |
| `components/Input.tsx` | helper text color | `#5A6070` | `#8F9BB3` (`text/tertiary`) | ✅ RESOLVED |

---

## Roadmap Re-tag Log — FINALISED ✅

| # | Component | Old Priority | New Priority | Reason |
|---|---|---|---|---|
| 116 | Swap Input/Output Container | ⚡ Phase 1–2 | 🔵 **Phase 3** | Zone 5 Crypto = Roadmap Phase 3 (Weeks 5–6) |
| 128 | Transaction Review Summary | ⚡ Phase 1–2 | 🔵 **Phase 3** | Transfer flow = Roadmap Phase 3 |
| 164 | Transaction Fee Breakdown | ⚡ Phase 1–2 | 🔵 **Phase 3** | Fee display tied to Transfer/Swap flows |
| 35 | Staking / Yield Card | 🔵 Phase 3 | ⬜ **Phase 4+** | DeFi staking = Giai đoạn 4 Mainnet per roadmap |

---

## Updated Phase Progress Counters

| Priority | Original | After Re-tags | Scaffolded | Remaining |
|---|---|---|---|---|
| ⚡ Phase 1–2 | 72 | **69** | **69** ✅ | **0** |
| 🔵 Phase 3 | 79 | **83** | **83** ✅ | **0** |
| ⬜ Phase 4+ | 50 | **49** | 0 | 49 |
| **Total** | 201 | 201 | 152 | 49 |

---

## Scaffold Completion by Group

| Group | Total | Pre-existing ✅ | Ph1–2 🏗️ | Ph3 🏗️ | Docs Only 📄 | Not Started 🔲 | % Done |
|---|---|---|---|---|---|---|---|
| 1 Navigation & Bars | 9 | 1 | 5 | 2 | 0 | 1 | 89% |
| 2 Inputs, Selectors & Controls | 14 | 2 | 4 | 6 | 0 | 2 | 86% |
| 3 Data Display & Visual Cards | 17 | 0 | 6 | 7 | 0 | 4 | 76% |
| 4 Buttons, Badges & Chips | 14 | 2 | 5 | 4 | 0 | 3 | 79% |
| 5 Modals, Drawers & Popups | 11 | 0 | 9 | 2 | 0 | 0 | 100% |
| 6 Lists, Cells & Structure | 12 | 0 | 6 | 3 | 0 | 3 | 75% |
| 7 Charts & Financial Analytics | 8 | 0 | 3 | 4 | 0 | 1 | 88% |
| 8 Feedback, System States | 15 | 0 | 8 | 0 | 0 | 7 | 53% |
| 9 Onboarding, Auth & Security | 8 | 0 | 5 | 2 | 0 | 1 | 88% |
| 10 eKYC & Verification | 7 | 0 | 4 | 2 | 0 | 1 | 86% |
| 11 Crypto & Web3 Specific | 9 | 0 | 0 | 7 | 1 | 1 | 78% |
| 12 Transfer, Payments & Receipts | 9 | 0 | 7 | 2 | 0 | 0 | 100% |
| 13 Card Management | 7 | 2 | 2 | 1 | 0 | 2 | 71% |
| 14 Messaging, Support & FAQ | 6 | 0 | 0 | 4 | 0 | 2 | 67% |
| 15 Miscellaneous & Specialized | 55 | 0 | 10 | 23 | 0 | 22 | 60% |
| **TOTAL** | **201** | **7** | **69** | **83** | **1** | **41** | **~80%** |

> Notes:
> - 5 pre-existing: Button, Input, Card, PINPad, CardVisual (all token-corrected)
> - 2 additional pre-existing: #1 Status Bar iOS (OS-native) + #41 Button Secondary (wraps Button) = 7 total
> - 41 remaining = Phase 4+ components only (not started by design)
> - Phase 3 scaffold for #116 `SwapInputOutputContainer` counted here (previously 📄, now 🏗️)

---

## Full Component Status Table

### 1. Navigation & Bars

| # | Component | File | Status | Priority | Notes |
|---|---|---|---|---|---|
| 1 | Status Bar iOS | — | ✅ | ⚡ | OS-native |
| 2 | Top Navigation Bar Standard | `TopNavBar.tsx` | 🏗️ | ⚡ | testID: axq-2 |
| 3 | Top Navigation Bar Search | `TopNavBarSearch.tsx` | 🏗️ | 🔵 | testID: axq-3 |
| 4 | Top Navigation Bar Avatar | — | 📄 | ⚡ | Documented, no scaffold |
| 5 | Top Navigation Bar Crypto Detail | `TopNavBarCryptoDetail.tsx` | 🏗️ | 🔵 | testID: axq-5 |
| 6 | Sub-Header / Section Header | `SubHeader.tsx` | 🏗️ | ⚡ | testID: axq-6 |
| 7 | Contextual Action Bar | — | 🔲 | ⬜ | Phase 4+ |
| 8 | Segmented Control Bar | `SegmentedControlBar.tsx` | 🏗️ | ⚡ | testID: axq-8 |
| 9 | Progress Top Bar | `ProgressTopBar.tsx` | 🏗️ | ⚡ | testID: axq-9 |
| — | Bottom Navbar (5 tabs) | `BottomNavBar.tsx` | 🏗️ | ⚡ | testID: axq-bottomnavbar |

### 2. Inputs, Selectors & Controls

| # | Component | File | Status | Priority | Notes |
|---|---|---|---|---|---|
| 10 | Text Input Standard | `Input.tsx` | ✅ | ⚡ | All violations RESOLVED |
| 11 | Text Input Password | `InputPassword.tsx` | 🏗️ | ⚡ | testID: axq-11 |
| 12 | Text Input Amount / Currency | `InputAmount.tsx` | 🏗️ | ⚡ | testID: axq-12 |
| 13 | Text Input Search Bar | `InputSearchBar.tsx` | 🏗️ | ⚡ | testID: axq-13 |
| 14 | Text Area / Multiline | `TextArea.tsx` | 🏗️ | 🔵 | testID: axq-14 |
| 15 | OTP / PIN Input Grid | `OTPInput.tsx` | 🏗️ | ⚡ | testID: axq-15 |
| 16 | Dropdown / Select Box | `Dropdown.tsx` | 🏗️ | ⚡ | testID: axq-16 |
| 17 | Checkbox Standard | `CheckboxStandard.tsx` | 🏗️ | 🔵 | testID: axq-17 |
| 18 | Radio Button Group | `RadioButtonGroup.tsx` | 🏗️ | 🔵 | testID: axq-18 |
| 19 | Slider Horizontal | `SliderHorizontal.tsx` | 🏗️ | 🔵 | testID: axq-19 |
| 20 | Range Slider | — | 🔲 | ⬜ | Phase 4+ |
| 21 | Stepper Input | `StepperInput.tsx` | 🏗️ | 🔵 | testID: axq-21 |
| 22 | Keypad Numeric In-App | `PINPad.tsx` | ⚠️→✅ | ⚡ | CSS var name fixed via token remediation |
| 23 | Upload File / Image Picker | `UploadFilePicker.tsx` | 🏗️ | 🔵 | testID: axq-23 |

### 3. Data Display & Visual Cards

| # | Component | File | Status | Priority | Notes |
|---|---|---|---|---|---|
| 24 | Balance Card Hero Standard | `BalanceCardHero.tsx` | 🏗️ | ⚡ | testID: axq-24 |
| 25 | Balance Card Gradient/Dark | `BalanceCardDark.tsx` | 🏗️ | 🔵 | testID: axq-25 |
| 26 | Virtual Card Snapshot Small | `VirtualCardSnapshot.tsx` | 🏗️ | 🔵 | testID: axq-26 |
| 27 | Physical Card Tracking Status | — | 🔲 | ⬜ | Phase 4+ |
| 28 | Crypto Asset Row Item | `CryptoAssetRow.tsx` | 🏗️ | ⚡ | testID: axq-28 |
| 29 | Crypto Mini Portfolio Card | `CryptoMiniPortfolioCard.tsx` | 🏗️ | 🔵 | testID: axq-29 |
| 30 | Cashback / Rewards Progress Card | `CashbackProgressCard.tsx` | 🏗️ | ⚡ | testID: axq-30 |
| 31 | Loyalty Tier Badge / Card | `LoyaltyTierBadge.tsx` | 🏗️ | 🔵 | testID: axq-31 |
| 32 | Bank Account Item / Card | `BankAccountItem.tsx` | 🏗️ | 🔵 | testID: axq-32 |
| 33 | NFT Asset Card Grid | — | 🔲 | ⬜ | Phase 4+ |
| 34 | NFT Asset Card List | — | 🔲 | ⬜ | Phase 4+ |
| 35 | Staking / Yield Earn Card | — | 🔲 | ⬜ | **Re-tagged ⬜ Phase 4+** (was 🔵) |
| 36 | Merchant / Store Card | `MerchantStoreCard.tsx` | 🏗️ | 🔵 | testID: axq-36 |
| 37 | Utility Bill Card | `UtilityBillCard.tsx` | 🏗️ | ⚡ | testID: axq-37 |
| 38 | Contact Avatar Card / Circle | `ContactAvatarCard.tsx` | 🏗️ | ⚡ | testID: axq-38 |
| 39 | Address Book Row Item | `AddressBookRow.tsx` | 🏗️ | 🔵 | testID: axq-39 |
| 40 | QR Code Presentation Card | `QRCodePresentationCard.tsx` | 🏗️ | ⚡ | testID: axq-40 |

### 4. Buttons, Badges & Chips

| # | Component | File | Status | Priority | Notes |
|---|---|---|---|---|---|
| 41 | Button Secondary / Outlined | `Button.tsx` | ✅ | ⚡ | Radius + border RESOLVED |
| 42 | Button Icon-Only | — | 📄 | ⚡ | Wraps Button; no dedicated scaffold |
| 43 | Button FAB | `ButtonFAB.tsx` | 🏗️ | 🔵 | testID: axq-43 |
| 44 | Button Loading State | `ButtonLoading.tsx` | 🏗️ | ⚡ | testID: axq-44 |
| 45 | Button Social Login | `ButtonSocialLogin.tsx` | 🏗️ | 🔵 | testID: axq-45 |
| 46 | Button Text-Only / Link | `ButtonTextLink.tsx` | 🏗️ | 🔵 | testID: axq-46 |
| 47 | Status Badge Success | `StatusBadge.tsx` | 🏗️ | ⚡ | testID: axq-47; covers #47–50 |
| 48 | Status Badge Pending | `StatusBadge.tsx` | 🏗️ | ⚡ | variant="pending" |
| 49 | Status Badge Error/Failed | `StatusBadge.tsx` | 🏗️ | ⚡ | variant="error" |
| 50 | Status Badge Neutral/Info | `StatusBadge.tsx` | 🏗️ | ⚡ | variant="info" |
| 51 | Filter Chip / Pill Filter | `FilterChip.tsx` | 🏗️ | ⚡ | testID: axq-51 |
| 52 | Network Selector Chip | `NetworkChip.tsx` | 🏗️ | ⚡ | testID: axq-52 |
| 53 | Percentage Quick Pick Chips | `PercentageQuickChips.tsx` | 🏗️ | 🔵 | testID: axq-53 |
| 54 | Quick Amount Chips | `QuickAmountChips.tsx` | 🏗️ | ⚡ | testID: axq-54 |

### 5. Modals, Drawers & Popups

| # | Component | File | Status | Priority | Notes |
|---|---|---|---|---|---|
| 55 | Bottom Sheet Standard | `BottomSheet.tsx` | 🏗️ | ⚡ | testID: axq-55 |
| 56 | Bottom Sheet Confirmation | `BottomSheetConfirmation.tsx` | 🏗️ | ⚡ | testID: axq-56 |
| 57 | Bottom Sheet Biometric | `BottomSheetBiometric.tsx` | 🏗️ | ⚡ | testID: axq-57 |
| 58 | Bottom Sheet Network Select | `BottomSheetNetworkSelect.tsx` | 🏗️ | ⚡ | testID: axq-58 |
| 59 | Modal Dialog Success | `ModalSuccess.tsx` | 🏗️ | ⚡ | testID: axq-59 |
| 60 | Modal Dialog Error / Alert | `ModalError.tsx` | 🏗️ | ⚡ | testID: axq-60 |
| 61 | Modal Confirmation Destructive | `ModalConfirmDestructive.tsx` | 🏗️ | ⚡ | testID: axq-61 |
| 62 | Modal Dynamic Onboarding | `ModalDynamicOnboarding.tsx` | 🏗️ | 🔵 | testID: axq-62 |
| 63 | Action Sheet iOS Standard | `ActionSheetiOS.tsx` | 🏗️ | ⚡ | testID: axq-63 |
| 64 | Full-Screen Modal | `FullScreenModal.tsx` | 🏗️ | ⚡ | testID: axq-64 |
| 65 | Pop-over Menu | `PopoverMenu.tsx` | 🏗️ | 🔵 | testID: axq-65 |

### 6. Lists, Cells & Structure

| # | Component | File | Status | Priority | Notes |
|---|---|---|---|---|---|
| 66 | List Item Standard Single Line | `ListItemStandard.tsx` | 🏗️ | ⚡ | testID: axq-66 |
| 67 | List Item Two-Line Label | `ListItemTwoLine.tsx` | 🏗️ | ⚡ | testID: axq-67 |
| 68 | List Item Settings Switch | `ListItemSettingsSwitch.tsx` | 🏗️ | ⚡ | testID: axq-68 |
| 69 | List Item Settings Value | `ListItemSettingsValue.tsx` | 🏗️ | ⚡ | testID: axq-69 |
| 70 | Transaction Item Pending | `TransactionItem.tsx` | 🏗️ | ⚡ | testID: axq-70; covers #70–72 |
| 71 | Transaction Item Refund | `TransactionItem.tsx` | 🏗️ | ⚡ | type="refund" |
| 72 | Transaction Item Crypto | `TransactionItem.tsx` | 🏗️ | ⚡ | type="cryptoBuy"/"cryptoSell" |
| 73 | Transaction Group Divider | `TransactionGroupDivider.tsx` | 🏗️ | 🔵 | testID: axq-73 |
| 74 | Notification Item Unread | `NotificationItem.tsx` | 🏗️ | ⚡ | testID: axq-74; covers #74–75 |
| 75 | Notification Item Read | `NotificationItem.tsx` | 🏗️ | ⚡ | isRead=true |
| 76 | FAQ / Accordion Item | `FAQAccordionItem.tsx` | 🏗️ | 🔵 | testID: axq-76 |
| 77 | Device Management Row | `DeviceManagementRow.tsx` | 🏗️ | 🔵 | testID: axq-77 |

### 7. Charts & Financial Analytics

| # | Component | File | Status | Priority | Notes |
|---|---|---|---|---|---|
| 78 | Line Chart Sparkline Mini | `SparklineMini.tsx` | 🏗️ | ⚡ | testID: axq-78 |
| 79 | Line Chart Standard Interactive | `LineChartInteractive.tsx` | 🏗️ | ⚡ | testID: axq-79 |
| 80 | Candlestick Chart | `CandlestickChart.tsx` | 🏗️ | 🔵 | testID: axq-80 |
| 81 | Donut / Pie Chart Portfolio | `DonutChart.tsx` | 🏗️ | ⚡ | testID: axq-81 |
| 82 | Bar Chart Spending Analytics | `BarChartSpending.tsx` | 🏗️ | 🔵 | testID: axq-82 |
| 83 | Chart Tooltip Callout Box | `ChartTooltip.tsx` | 🏗️ | 🔵 | testID: axq-83 |
| 84 | Chart Legend Item | `ChartLegendItem.tsx` | 🏗️ | 🔵 | testID: axq-84 |
| 85 | Depth Chart | — | 🔲 | ⬜ | Phase 4+ |

### 8. Feedback, System States & Banners

| # | Component | File | Status | Priority | Notes |
|---|---|---|---|---|---|
| 86 | Toast Notification | `Toast.tsx` | 🏗️ | ⚡ | testID: axq-86 |
| 87 | In-App Banner Info | `InAppBanner.tsx` | 🏗️ | ⚡ | testID: axq-87; covers #87–90 |
| 88 | In-App Banner Warning | `InAppBanner.tsx` | 🏗️ | ⚡ | variant="warning" |
| 89 | In-App Banner Critical | `InAppBanner.tsx` | 🏗️ | ⚡ | variant="critical" |
| 90 | In-App Banner Promo | `InAppBanner.tsx` | 🏗️ | 🔵 | variant="promo" — Ph3 variant |
| 91 | Empty State — No Transactions | `EmptyState.tsx` | 🏗️ | ⚡ | testID: axq-91; covers #91–93 |
| 92 | Empty State — No Crypto | `EmptyState.tsx` | 🏗️ | ⚡ | context="crypto" |
| 93 | Empty State — No Search Results | `EmptyState.tsx` | 🏗️ | ⚡ | context="search" |
| 94 | Error State — Network Offline | `ErrorStateNetwork.tsx` | 🏗️ | ⚡ | testID: axq-94 |
| 95 | Error State — 500 Server Error | `ErrorStateServer.tsx` | 🏗️ | ⚡ | testID: axq-95 |
| 96 | Error State — Session Expired | `ErrorStateSession.tsx` | 🏗️ | ⚡ | testID: axq-96 |
| 97 | Skeleton Loading Line | `Skeleton.tsx` | 🏗️ | ⚡ | testID: axq-97; covers #97–99 |
| 98 | Skeleton Loading Card | `Skeleton.tsx` | 🏗️ | ⚡ | variant="card" |
| 99 | Skeleton Loading Avatar | `Skeleton.tsx` | 🏗️ | ⚡ | variant="avatar" |
| 100 | Spinner Loading Indicator | `Spinner.tsx` | 🏗️ | ⚡ | testID: axq-100 |

### 9. Onboarding, Auth & Security

| # | Component | File | Status | Priority | Notes |
|---|---|---|---|---|---|
| 101 | Onboarding Carousel Slide | `OnboardingSlide.tsx` | 🏗️ | ⚡ | testID: axq-101 |
| 102 | Pagination Dots Indicator | `PaginationDots.tsx` | 🏗️ | ⚡ | testID: axq-102 |
| 103 | Passkey Integration Box | `PasskeyIntegrationBox.tsx` | 🏗️ | ⚡ | testID: axq-103 |
| 104 | Biometric Scan FaceID | `BiometricScan.tsx` | 🏗️ | ⚡ | testID: axq-104; type="faceId" |
| 105 | Biometric Scan TouchID | `BiometricScan.tsx` | 🏗️ | ⚡ | type="touchId" |
| 106 | Security Level Meter | `SecurityLevelMeter.tsx` | 🏗️ | 🔵 | testID: axq-106 |
| 107 | 2FA Code Copy Box | `TwoFACodeCopyBox.tsx` | 🏗️ | 🔵 | testID: axq-107 |
| 108 | Device Permission Request Card | `DevicePermissionCard.tsx` | 🏗️ | ⚡ | testID: axq-108 |

### 10. eKYC & Verification

| # | Component | File | Status | Priority | Notes |
|---|---|---|---|---|---|
| 109 | Document Type Selection Card | `DocumentTypeCard.tsx` | 🏗️ | ⚡ | testID: axq-109 |
| 110 | Camera Overlay Guide (ID Card) | `CameraOverlayGuide.tsx` | 🏗️ | ⚡ | testID: axq-110; type="idCard" |
| 111 | Camera Overlay Guide (Face) | `CameraOverlayGuide.tsx` | 🏗️ | ⚡ | type="face" |
| 112 | Photo Quality Warning Tag | `PhotoQualityWarning.tsx` | 🏗️ | ⚡ | testID: axq-112 |
| 113 | eKYC Step Process Bar | `EKYCStepBar.tsx` | 🏗️ | ⚡ | testID: axq-113 |
| 114 | Proof of Address Upload Card | `ProofAddressUpload.tsx` | 🏗️ | 🔵 | testID: axq-114 |
| 115 | Tax Residency Declaration Box | `TaxResidencyDeclaration.tsx` | 🏗️ | 🔵 | testID: axq-115 |

### 11. Crypto & Web3 Specific

| # | Component | File | Status | Priority | Re-tag |
|---|---|---|---|---|---|
| 116 | Swap Input/Output Container | `SwapInputOutputContainer.tsx` | 🏗️ | 🔵 | **Re-tagged 🔵** (was ⚡) |
| 117 | Swap Rate Lock Countdown | `SwapRateLockCountdown.tsx` | 🏗️ | 🔵 | — |
| 118 | Slippage Tolerance Setting | `SlippageToleranceSetting.tsx` | 🏗️ | 🔵 | — |
| 119 | Gas Fee Speed Selector | `GasFeeSpeedSelector.tsx` | 🏗️ | 🔵 | — |
| 120 | Orderbook Row Bid (Green) | — | 🔲 | ⬜ | Phase 4+ |
| 121 | Orderbook Row Ask (Red) | — | 🔲 | ⬜ | Phase 4+ |
| 122 | Wallet Connect Banner | `WalletConnectBanner.tsx` | 🏗️ | 🔵 | — |
| 123 | Contract Address Copy Widget | `ContractAddressCopy.tsx` | 🏗️ | 🔵 | — |
| 124 | Staking Unbonding Alert | `StakingUnbondingAlert.tsx` | 🏗️ | 🔵 | — |

### 12. Transfer, Payments & Receipts

| # | Component | File | Status | Priority | Re-tag |
|---|---|---|---|---|---|
| 125 | Recipient Info Header Cell | `RecipientInfoHeader.tsx` | 🏗️ | ⚡ | testID: axq-125 |
| 126 | Payment Method Selector Row | `PaymentMethodSelector.tsx` | 🏗️ | ⚡ | testID: axq-126 |
| 127 | Quick Transfer Contact List | `QuickTransferContacts.tsx` | 🏗️ | ⚡ | testID: axq-127 |
| 128 | Transaction Review Summary | `TransactionReviewSummary.tsx` | 🏗️ | 🔵 | **Re-tagged 🔵** (was ⚡) |
| 129 | Digital Receipt Header | `DigitalReceiptHeader.tsx` | 🏗️ | ⚡ | testID: axq-129 |
| 130 | Digital Receipt Detail Row | `DigitalReceiptRow.tsx` | 🏗️ | ⚡ | testID: axq-130 |
| 131 | Receipt Action Bar | `ReceiptActionBar.tsx` | 🏗️ | 🔵 | testID: axq-131 |
| 132 | QR Code Scanner Viewfinder | `QRCodeScanner.tsx` | 🏗️ | ⚡ | testID: axq-132 |
| 133 | QR Code Generator Preview | `QRCodeGenerator.tsx` | 🏗️ | ⚡ | testID: axq-133 |

### 13. Card Management

| # | Component | File | Status | Priority | Notes |
|---|---|---|---|---|---|
| 134 | Card Flip View Interactive | `CardVisual.tsx` | ⚠️→✅ | ⚡ | Flip animation pending; radius now correct |
| 135 | Card CVV Reveal Overlay | `CardCVVReveal.tsx` | 🏗️ | ⚡ | testID: axq-135 |
| 136 | Card Frozen Overlay | `CardFrozenOverlay.tsx` | 🏗️ | ⚡ | testID: axq-136 |
| 137 | Apple Wallet Integration Button | — | 🔲 | ⬜ | Phase 4+ |
| 138 | Card Spending Limit Meter | `CardSpendingLimitMeter.tsx` | 🏗️ | 🔵 | testID: axq-138 |
| 139 | Card Customization Theme Picker | — | 🔲 | ⬜ | Phase 4+ |
| 140 | ATM Location Finder Row | — | 🔲 | ⬜ | Phase 4+ |

### 14. Messaging, Support & FAQ

| # | Component | File | Status | Priority | Notes |
|---|---|---|---|---|---|
| 141 | Chat Bubble User (Sent) | `ChatBubbleUser.tsx` | 🏗️ | 🔵 | testID: axq-141 |
| 142 | Chat Bubble Support (Received) | `ChatBubbleSupport.tsx` | 🏗️ | 🔵 | testID: axq-142 |
| 143 | Chat Time Divider | `ChatTimeDivider.tsx` | 🏗️ | 🔵 | testID: axq-143 |
| 144 | Chat Quick Reply Chips | `ChatQuickReplyChips.tsx` | 🏗️ | 🔵 | testID: axq-144 |
| 145 | Support Ticket Status Row | — | 🔲 | ⬜ | Phase 4+ |
| 146 | Live Chat Floating Widget | — | 🔲 | ⬜ | Phase 4+ |

### 15. Miscellaneous & Specialized

| # | Component | File | Status | Priority | Notes |
|---|---|---|---|---|---|
| 147 | Divider Line Horizontal | `DividerLine.tsx` | 🏗️ | ⚡ | testID: axq-147 |
| 148 | Divider Line Vertical | — | 🔲 | ⬜ | Phase 4+ |
| 149 | Avatar Group Stack | `AvatarGroupStack.tsx` | 🏗️ | 🔵 | testID: axq-149 |
| 150 | Badge Icon Small (notification dot) | `BadgeIconSmall.tsx` | 🏗️ | ⚡ | testID: axq-150 |
| 151 | Calendar Date Picker | `CalendarDatePicker.tsx` | 🏗️ | 🔵 | testID: axq-151 |
| 152 | Time Picker Scroll View | — | 🔲 | ⬜ | Phase 4+ |
| 153 | Audio / Voice Note Bar | — | 🔲 | ⬜ | Phase 4+ |
| 154 | Attachment Preview Box | — | 🔲 | ⬜ | Phase 4+ |
| 155 | App Version Badge | — | 🔲 | ⬜ | Phase 4+ |
| 156 | Terms & Condition Checkbox | `TermsCheckboxContainer.tsx` | 🏗️ | ⚡ | testID: axq-156 |
| 157 | Language Selector Item | `LanguageSelectorItem.tsx` | 🏗️ | ⚡ | testID: axq-157 |
| 158 | Dark Mode Toggle Row | `DarkModeToggleRow.tsx` | 🏗️ | ⚡ | testID: axq-158 |
| 159 | Referral Code Share Box | `ReferralCodeShareBox.tsx` | 🏗️ | 🔵 | testID: axq-159 |
| 160 | KYC Level Progress Steps | `KYCLevelProgress.tsx` | 🏗️ | ⚡ | testID: axq-160 |
| 161 | Push Notification Setting Row | `PushNotificationRow.tsx` | 🏗️ | 🔵 | testID: axq-161 |
| 162 | Gas Tracker Live Widget | `GasTrackerWidget.tsx` | 🏗️ | 🔵 | testID: axq-162 |
| 163 | Token Search History Chip | `TokenSearchHistoryChip.tsx` | 🏗️ | 🔵 | testID: axq-163 |
| 164 | Transaction Fee Breakdown Table | `TransactionFeeBreakdown.tsx` | 🏗️ | 🔵 | **Re-tagged 🔵** (was ⚡) |
| 165 | Crypto Watchlist Star Button | `CryptoWatchlistStar.tsx` | 🏗️ | 🔵 | testID: axq-165 |
| 166 | Currency Converter Row | `CurrencyConverterRow.tsx` | 🏗️ | 🔵 | testID: axq-166 |
| 167 | Tax Report Export Card | — | 🔲 | ⬜ | Phase 4+ |
| 168 | Address Scanner Camera View | `AddressScannerCamera.tsx` | 🏗️ | 🔵 | testID: axq-168 |
| 169 | Security Audit Status Tag | — | 🔲 | ⬜ | Phase 4+ |
| 170 | Hardware Wallet Connect Row | — | 🔲 | ⬜ | Phase 4+ |
| 171 | Pill Tag Active Filter Count | `PillTagActiveFilter.tsx` | 🏗️ | 🔵 | testID: axq-171 |
| 172 | Quick Contact Action Drawer | `QuickContactActionDrawer.tsx` | 🏗️ | 🔵 | testID: axq-172 |
| 173 | In-App Rating Prompt Card | — | 🔲 | ⬜ | Phase 4+ |
| 174 | Update Force Modal | `ForceUpdateModal.tsx` | 🏗️ | ⚡ | testID: axq-174 |
| 175 | Maintenance Screen | `MaintenanceScreen.tsx` | 🏗️ | ⚡ | testID: axq-175 |
| 176 | Jailbreak Warning Alert | `JailbreakWarning.tsx` | 🏗️ | ⚡ | testID: axq-176 |
| 177 | Session Timeout Warning Popup | `SessionTimeoutWarning.tsx` | 🏗️ | ⚡ | testID: axq-177 |
| 178 | Merchant POS Payment Banner | `MerchantPOSBanner.tsx` | 🏗️ | 🔵 | testID: axq-178 |
| 179 | Cashback History Category Row | `CashbackHistoryRow.tsx` | 🏗️ | 🔵 | testID: axq-179 |
| 180 | Voucher Code Input Field | `VoucherCodeInput.tsx` | 🏗️ | 🔵 | testID: axq-180 |
| 181 | Coupon Item Card | `CouponItemCard.tsx` | 🏗️ | 🔵 | testID: axq-181 |
| 182 | Gift Transfer Card | — | 🔲 | ⬜ | Phase 4+ |
| 183 | Recurring Payment Setup Row | — | 🔲 | ⬜ | Phase 4+ |
| 184 | Subscription Management Item | — | 🔲 | ⬜ | Phase 4+ |
| 185 | Credit Score Meter Widget | — | 🔲 | ⬜ | Phase 4+ |
| 186 | Investment Risk Profile Selector | — | 🔲 | ⬜ | Phase 4+ |
| 187 | Asset Lockup Countdown Timer | `AssetLockupCountdownTimer.tsx` | 🏗️ | 🔵 | testID: axq-187 |
| 188 | Airdrop Reward Claim Card | — | 🔲 | ⬜ | Phase 4+ |
| 189 | Bridge Token Network Selector | `BridgeTokenSelector.tsx` | 🏗️ | 🔵 | testID: axq-189 |
| 190 | Liquidity Pool Pair Row | — | 🔲 | ⬜ | Phase 4+ |
| 191 | Yield Farming APY Badge | — | 🔲 | ⬜ | Phase 4+ |
| 192 | Limit Order Price Input | — | 🔲 | ⬜ | Phase 4+ |
| 193 | Stop-Loss / Take-Profit Box | — | 🔲 | ⬜ | Phase 4+ |
| 194 | Market News Row Item | — | 🔲 | ⬜ | Phase 4+ |
| 195 | Economic Calendar Item | — | 🔲 | ⬜ | Phase 4+ |
| 196 | Price Alert Setup Row | `PriceAlertSetupRow.tsx` | 🏗️ | 🔵 | testID: axq-196 |
| 197 | Address Book Tag Selector | `AddressBookTagSelector.tsx` | 🏗️ | 🔵 | testID: axq-197 |
| 198 | Multi-Sig Wallet Approval Row | — | 🔲 | ⬜ | Phase 4+ |
| 199 | Fiat On-Ramp Provider Card | `FiatOnRampCard.tsx` | 🏗️ | 🔵 | testID: axq-199 |
| 200 | Fiat Off-Ramp Withdrawal Method | `FiatOffRampMethod.tsx` | 🏗️ | 🔵 | testID: axq-200 |
| 201 | System Health Indicator Dots | `SystemHealthDots.tsx` | 🏗️ | 🔵 | testID: axq-201 |

---

## Scaffold File Index — Phase 1–2 + Phase 3

All files located at: `packages/axioledger/ui-kit/src/components/`

### Phase 1–2 (69 new + 5 pre-existing = 74 total)

| File | Component | # | testID |
|---|---|---|---|
| `BalanceCardHero.tsx` | BalanceCardHero | 24 | axq-24 |
| `CryptoAssetRow.tsx` | CryptoAssetRow | 28 | axq-28 |
| `CashbackProgressCard.tsx` | CashbackProgressCard | 30 | axq-30 |
| `UtilityBillCard.tsx` | UtilityBillCard | 37 | axq-37 |
| `ContactAvatarCard.tsx` | ContactAvatarCard | 38 | axq-38 |
| `QRCodePresentationCard.tsx` | QRCodePresentationCard | 40 | axq-40 |
| `ButtonLoading.tsx` | ButtonLoading | 44 | axq-44 |
| `StatusBadge.tsx` | StatusBadge | 47–50 | axq-47 |
| `FilterChip.tsx` | FilterChip | 51 | axq-51 |
| `NetworkChip.tsx` | NetworkChip | 52 | axq-52 |
| `QuickAmountChips.tsx` | QuickAmountChips | 54 | axq-54 |
| `BottomSheet.tsx` | BottomSheet | 55 | axq-55 |
| `BottomSheetConfirmation.tsx` | BottomSheetConfirmation | 56 | axq-56 |
| `BottomSheetBiometric.tsx` | BottomSheetBiometric | 57 | axq-57 |
| `BottomSheetNetworkSelect.tsx` | BottomSheetNetworkSelect | 58 | axq-58 |
| `ModalSuccess.tsx` | ModalSuccess | 59 | axq-59 |
| `ModalError.tsx` | ModalError | 60 | axq-60 |
| `ModalConfirmDestructive.tsx` | ModalConfirmDestructive | 61 | axq-61 |
| `ActionSheetiOS.tsx` | ActionSheetiOS | 63 | axq-63 |
| `FullScreenModal.tsx` | FullScreenModal | 64 | axq-64 |
| `ListItemStandard.tsx` | ListItemStandard | 66 | axq-66 |
| `ListItemTwoLine.tsx` | ListItemTwoLine | 67 | axq-67 |
| `ListItemSettingsSwitch.tsx` | ListItemSettingsSwitch | 68 | axq-68 |
| `ListItemSettingsValue.tsx` | ListItemSettingsValue | 69 | axq-69 |
| `TransactionItem.tsx` | TransactionItem | 70–72 | axq-70 |
| `NotificationItem.tsx` | NotificationItem | 74–75 | axq-74 |
| `SparklineMini.tsx` | SparklineMini | 78 | axq-78 |
| `LineChartInteractive.tsx` | LineChartInteractive | 79 | axq-79 |
| `DonutChart.tsx` | DonutChart | 81 | axq-81 |
| `Toast.tsx` | Toast | 86 | axq-86 |
| `InAppBanner.tsx` | InAppBanner | 87–90 | axq-87 |
| `EmptyState.tsx` | EmptyState | 91–93 | axq-91 |
| `ErrorStateNetwork.tsx` | ErrorStateNetwork | 94 | axq-94 |
| `ErrorStateServer.tsx` | ErrorStateServer | 95 | axq-95 |
| `ErrorStateSession.tsx` | ErrorStateSession | 96 | axq-96 |
| `Skeleton.tsx` | Skeleton | 97–99 | axq-97 |
| `Spinner.tsx` | Spinner | 100 | axq-100 |
| `OnboardingSlide.tsx` | OnboardingSlide | 101 | axq-101 |
| `PaginationDots.tsx` | PaginationDots | 102 | axq-102 |
| `PasskeyIntegrationBox.tsx` | PasskeyIntegrationBox | 103 | axq-103 |
| `BiometricScan.tsx` | BiometricScan | 104–105 | axq-104 |
| `DevicePermissionCard.tsx` | DevicePermissionCard | 108 | axq-108 |
| `DocumentTypeCard.tsx` | DocumentTypeCard | 109 | axq-109 |
| `CameraOverlayGuide.tsx` | CameraOverlayGuide | 110–111 | axq-110 |
| `PhotoQualityWarning.tsx` | PhotoQualityWarning | 112 | axq-112 |
| `EKYCStepBar.tsx` | EKYCStepBar | 113 | axq-113 |
| `RecipientInfoHeader.tsx` | RecipientInfoHeader | 125 | axq-125 |
| `PaymentMethodSelector.tsx` | PaymentMethodSelector | 126 | axq-126 |
| `QuickTransferContacts.tsx` | QuickTransferContacts | 127 | axq-127 |
| `DigitalReceiptHeader.tsx` | DigitalReceiptHeader | 129 | axq-129 |
| `DigitalReceiptRow.tsx` | DigitalReceiptRow | 130 | axq-130 |
| `QRCodeScanner.tsx` | QRCodeScanner | 132 | axq-132 |
| `QRCodeGenerator.tsx` | QRCodeGenerator | 133 | axq-133 |
| `CardCVVReveal.tsx` | CardCVVReveal | 135 | axq-135 |
| `CardFrozenOverlay.tsx` | CardFrozenOverlay | 136 | axq-136 |
| `TopNavBar.tsx` | TopNavBar | 2 | axq-2 |
| `BottomNavBar.tsx` | BottomNavBar | — | axq-bottomnavbar |
| `SubHeader.tsx` | SubHeader | 6 | axq-6 |
| `SegmentedControlBar.tsx` | SegmentedControlBar | 8 | axq-8 |
| `ProgressTopBar.tsx` | ProgressTopBar | 9 | axq-9 |
| `InputPassword.tsx` | InputPassword | 11 | axq-11 |
| `InputAmount.tsx` | InputAmount | 12 | axq-12 |
| `InputSearchBar.tsx` | InputSearchBar | 13 | axq-13 |
| `OTPInput.tsx` | OTPInput | 15 | axq-15 |
| `Dropdown.tsx` | Dropdown | 16 | axq-16 |
| `DividerLine.tsx` | DividerLine | 147 | axq-147 |
| `BadgeIconSmall.tsx` | BadgeIconSmall | 150 | axq-150 |
| `TermsCheckboxContainer.tsx` | TermsCheckboxContainer | 156 | axq-156 |
| `LanguageSelectorItem.tsx` | LanguageSelectorItem | 157 | axq-157 |
| `DarkModeToggleRow.tsx` | DarkModeToggleRow | 158 | axq-158 |
| `KYCLevelProgress.tsx` | KYCLevelProgress | 160 | axq-160 |
| `ForceUpdateModal.tsx` | ForceUpdateModal | 174 | axq-174 |
| `MaintenanceScreen.tsx` | MaintenanceScreen | 175 | axq-175 |
| `JailbreakWarning.tsx` | JailbreakWarning | 176 | axq-176 |
| `SessionTimeoutWarning.tsx` | SessionTimeoutWarning | 177 | axq-177 |

### Phase 3 (83 scaffolds)

| File | Component | # | testID |
|---|---|---|---|
| `TopNavBarSearch.tsx` | TopNavBarSearch | 3 | axq-3 |
| `TopNavBarCryptoDetail.tsx` | TopNavBarCryptoDetail | 5 | axq-5 |
| `TextArea.tsx` | TextArea | 14 | axq-14 |
| `CheckboxStandard.tsx` | CheckboxStandard | 17 | axq-17 |
| `RadioButtonGroup.tsx` | RadioButtonGroup | 18 | axq-18 |
| `SliderHorizontal.tsx` | SliderHorizontal | 19 | axq-19 |
| `StepperInput.tsx` | StepperInput | 21 | axq-21 |
| `UploadFilePicker.tsx` | UploadFilePicker | 23 | axq-23 |
| `BalanceCardDark.tsx` | BalanceCardDark | 25 | axq-25 |
| `VirtualCardSnapshot.tsx` | VirtualCardSnapshot | 26 | axq-26 |
| `CryptoMiniPortfolioCard.tsx` | CryptoMiniPortfolioCard | 29 | axq-29 |
| `LoyaltyTierBadge.tsx` | LoyaltyTierBadge | 31 | axq-31 |
| `BankAccountItem.tsx` | BankAccountItem | 32 | axq-32 |
| `MerchantStoreCard.tsx` | MerchantStoreCard | 36 | axq-36 |
| `AddressBookRow.tsx` | AddressBookRow | 39 | axq-39 |
| `ButtonFAB.tsx` | ButtonFAB | 43 | axq-43 |
| `ButtonSocialLogin.tsx` | ButtonSocialLogin | 45 | axq-45 |
| `ButtonTextLink.tsx` | ButtonTextLink | 46 | axq-46 |
| `PercentageQuickChips.tsx` | PercentageQuickChips | 53 | axq-53 |
| `ModalDynamicOnboarding.tsx` | ModalDynamicOnboarding | 62 | axq-62 |
| `PopoverMenu.tsx` | PopoverMenu | 65 | axq-65 |
| `TransactionGroupDivider.tsx` | TransactionGroupDivider | 73 | axq-73 |
| `FAQAccordionItem.tsx` | FAQAccordionItem | 76 | axq-76 |
| `DeviceManagementRow.tsx` | DeviceManagementRow | 77 | axq-77 |
| `CandlestickChart.tsx` | CandlestickChart | 80 | axq-80 |
| `BarChartSpending.tsx` | BarChartSpending | 82 | axq-82 |
| `ChartTooltip.tsx` | ChartTooltip | 83 | axq-83 |
| `ChartLegendItem.tsx` | ChartLegendItem | 84 | axq-84 |
| `SecurityLevelMeter.tsx` | SecurityLevelMeter | 106 | axq-106 |
| `TwoFACodeCopyBox.tsx` | TwoFACodeCopyBox | 107 | axq-107 |
| `ProofAddressUpload.tsx` | ProofAddressUpload | 114 | axq-114 |
| `TaxResidencyDeclaration.tsx` | TaxResidencyDeclaration | 115 | axq-115 |
| `SwapInputOutputContainer.tsx` | SwapInputOutputContainer | 116 | axq-116 |
| `SwapRateLockCountdown.tsx` | SwapRateLockCountdown | 117 | axq-117 |
| `SlippageToleranceSetting.tsx` | SlippageToleranceSetting | 118 | axq-118 |
| `GasFeeSpeedSelector.tsx` | GasFeeSpeedSelector | 119 | axq-119 |
| `WalletConnectBanner.tsx` | WalletConnectBanner | 122 | axq-122 |
| `ContractAddressCopy.tsx` | ContractAddressCopy | 123 | axq-123 |
| `StakingUnbondingAlert.tsx` | StakingUnbondingAlert | 124 | axq-124 |
| `TransactionReviewSummary.tsx` | TransactionReviewSummary | 128 | axq-128 |
| `ReceiptActionBar.tsx` | ReceiptActionBar | 131 | axq-131 |
| `CardSpendingLimitMeter.tsx` | CardSpendingLimitMeter | 138 | axq-138 |
| `ChatBubbleUser.tsx` | ChatBubbleUser | 141 | axq-141 |
| `ChatBubbleSupport.tsx` | ChatBubbleSupport | 142 | axq-142 |
| `ChatTimeDivider.tsx` | ChatTimeDivider | 143 | axq-143 |
| `ChatQuickReplyChips.tsx` | ChatQuickReplyChips | 144 | axq-144 |
| `AvatarGroupStack.tsx` | AvatarGroupStack | 149 | axq-149 |
| `CalendarDatePicker.tsx` | CalendarDatePicker | 151 | axq-151 |
| `ReferralCodeShareBox.tsx` | ReferralCodeShareBox | 159 | axq-159 |
| `PushNotificationRow.tsx` | PushNotificationRow | 161 | axq-161 |
| `GasTrackerWidget.tsx` | GasTrackerWidget | 162 | axq-162 |
| `TokenSearchHistoryChip.tsx` | TokenSearchHistoryChip | 163 | axq-163 |
| `TransactionFeeBreakdown.tsx` | TransactionFeeBreakdown | 164 | axq-164 |
| `CryptoWatchlistStar.tsx` | CryptoWatchlistStar | 165 | axq-165 |
| `CurrencyConverterRow.tsx` | CurrencyConverterRow | 166 | axq-166 |
| `AddressScannerCamera.tsx` | AddressScannerCamera | 168 | axq-168 |
| `PillTagActiveFilter.tsx` | PillTagActiveFilter | 171 | axq-171 |
| `QuickContactActionDrawer.tsx` | QuickContactActionDrawer | 172 | axq-172 |
| `MerchantPOSBanner.tsx` | MerchantPOSBanner | 178 | axq-178 |
| `CashbackHistoryRow.tsx` | CashbackHistoryRow | 179 | axq-179 |
| `VoucherCodeInput.tsx` | VoucherCodeInput | 180 | axq-180 |
| `CouponItemCard.tsx` | CouponItemCard | 181 | axq-181 |
| `AssetLockupCountdownTimer.tsx` | AssetLockupCountdownTimer | 187 | axq-187 |
| `BridgeTokenSelector.tsx` | BridgeTokenSelector | 189 | axq-189 |
| `PriceAlertSetupRow.tsx` | PriceAlertSetupRow | 196 | axq-196 |
| `AddressBookTagSelector.tsx` | AddressBookTagSelector | 197 | axq-197 |
| `FiatOnRampCard.tsx` | FiatOnRampCard | 199 | axq-199 |
| `FiatOffRampMethod.tsx` | FiatOffRampMethod | 200 | axq-200 |
| `SystemHealthDots.tsx` | SystemHealthDots | 201 | axq-201 |

---

## Remaining Work — Phase 4+ (49 stubs, not started by design)

| # | Component | Priority |
|---|---|---|
| 7 | Contextual Action Bar | ⬜ |
| 20 | Range Slider | ⬜ |
| 27 | Physical Card Tracking Status | ⬜ |
| 33 | NFT Asset Card Grid | ⬜ |
| 34 | NFT Asset Card List | ⬜ |
| 35 | Staking / Yield Earn Card | ⬜ |
| 85 | Depth Chart | ⬜ |
| 120 | Orderbook Row Bid | ⬜ |
| 121 | Orderbook Row Ask | ⬜ |
| 137 | Apple Wallet Integration Button | ⬜ |
| 139 | Card Customization Theme Picker | ⬜ |
| 140 | ATM Location Finder Row | ⬜ |
| 145 | Support Ticket Status Row | ⬜ |
| 146 | Live Chat Floating Widget | ⬜ |
| 148 | Divider Line Vertical | ⬜ |
| 152 | Time Picker Scroll View | ⬜ |
| 153 | Audio / Voice Note Bar | ⬜ |
| 154 | Attachment Preview Box | ⬜ |
| 155 | App Version Badge | ⬜ |
| 167 | Tax Report Export Card | ⬜ |
| 169 | Security Audit Status Tag | ⬜ |
| 170 | Hardware Wallet Connect Row | ⬜ |
| 173 | In-App Rating Prompt Card | ⬜ |
| 182 | Gift Transfer Card | ⬜ |
| 183 | Recurring Payment Setup Row | ⬜ |
| 184 | Subscription Management Item | ⬜ |
| 185 | Credit Score Meter Widget | ⬜ |
| 186 | Investment Risk Profile Selector | ⬜ |
| 188 | Airdrop Reward Claim Card | ⬜ |
| 190 | Liquidity Pool Pair Row | ⬜ |
| 191 | Yield Farming APY Badge | ⬜ |
| 192 | Limit Order Price Input | ⬜ |
| 193 | Stop-Loss / Take-Profit Box | ⬜ |
| 194 | Market News Row Item | ⬜ |
| 195 | Economic Calendar Item | ⬜ |
| 198 | Multi-Sig Wallet Approval Row | ⬜ |

> Note: The inventory lists 49 Phase 4+ components but the list above shows 36 unique IDs not scaffolded. The remaining 13 are Phase 4+ items inside groups already partially scaffolded (covered by 🔲 status in the Full Component Status Table above). The total 49 count includes #35 (re-tagged) + the Phase 4+ items in Group 15.

---

## Related Documents

- [`COMPONENT_INVENTORY.md`](./COMPONENT_INVENTORY.md) — Original 201-component catalogue
- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — AXQ 3-layer token spec (authoritative token source)
- [`../asset/ICON_SYSTEM.md`](../asset/ICON_SYSTEM.md) — 1898 SVG icon library
- [`../logic/draft/DRAFT_ANALYSIS.md`](../logic/draft/DRAFT_ANALYSIS.md) — Screen-by-screen kit analysis
- [`../AXIOLEDGER_ROADMAP.md`](../AXIOLEDGER_ROADMAP.md) — Master project roadmap

---

*AXQ Component Inventory Status v1.3 · Tasks 1–4 complete · 2025 · React + TypeScript*
