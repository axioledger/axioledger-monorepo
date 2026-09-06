# AXQ Component Inventory — 201 Components

> Design System toàn diện cho **AxioPass** · Banking · Crypto · iOS-first  
> Phiên bản: v1.0 · Platform: iOS 375×812 · Grid: 8px · Font: Work Sans  
> Source: Cashie FinTech UI Kit analysis + Axioledger product requirements

---

## Mục Lục

| # | Nhóm | Số lượng |
|---|---|---|
| 1 | [Navigation & Bars](#1-navigation--bars) | 9 |
| 2 | [Inputs, Selectors & Controls](#2-inputs-selectors--controls) | 14 |
| 3 | [Data Display & Visual Cards](#3-data-display--visual-cards) | 17 |
| 4 | [Buttons, Badges & Chips](#4-buttons-badges--chips) | 14 |
| 5 | [Modals, Drawers & Popups](#5-modals-drawers--popups) | 11 |
| 6 | [Lists, Cells & Structure](#6-lists-cells--structure) | 12 |
| 7 | [Charts & Financial Analytics](#7-charts--financial-analytics) | 8 |
| 8 | [Feedback, System States & Banners](#8-feedback-system-states--banners) | 15 |
| 9 | [Onboarding, Auth & Security](#9-onboarding-auth--security) | 8 |
| 10 | [eKYC & Verification](#10-ekyc--verification) | 7 |
| 11 | [Crypto & Web3 Specific](#11-crypto--web3-specific) | 9 |
| 12 | [Transfer, Payments & Receipts](#12-transfer-payments--receipts) | 9 |
| 13 | [Card Management](#13-card-management) | 7 |
| 14 | [Messaging, Support & FAQ](#14-messaging-support--faq) | 6 |
| 15 | [Miscellaneous & Specialized](#15-miscellaneous--specialized) | 55 |
| | **TỔNG** | **201** |

---

## Ký hiệu trạng thái

| Symbol | Nghĩa |
|---|---|
| ✅ | Có trong kit / Đã documented |
| 🔲 | Chưa có — cần thiết kế mới |
| ⚡ | Ưu tiên cao — Phase 1–2 |
| 🔵 | Ưu tiên trung — Phase 3 |
| ⬜ | Ưu tiên thấp — Phase 4+ |

---

## 1. Navigation & Bars

> **Observed in screens:** `Profile.png` → 5-tab bottom bar · `Home v1/v2.png` → header · `FAQ.png` → segmented control · `Payments.png` → top nav with back

| # | Component | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|
| 1 | **Status Bar iOS** — Light/Dark/Transparent | — (OS-native) | Global | ✅ | ⚡ |
| 2 | **Top Navigation Bar Standard** — Title + Back + Action icon | `text/h5` (20px) · `icon/primary` · `surface/default` | All | ✅ | ⚡ |
| 3 | **Top Navigation Bar Search** — Inline search field | `input/border` · `text/tertiary` · `bg/secondary` | 3,6,7 | 🔲 | ⚡ |
| 4 | **Top Navigation Bar Avatar** — Avatar + Greeting + Quick actions | `avatar/size-sm` · `text/h6` · `text/secondary` | 3 | ✅ partial | ⚡ |
| 5 | **Top Navigation Bar Crypto Detail** — Ticker + Favorite star + Share | `text/h5` · `icon/secondary` · `brand/yellow` | 5 | 🔲 | 🔵 |
| 6 | **Sub-Header / Section Header** — Title + "See All" link | `text/body-sm` · `text/link` · `gap/lg` | 3,5,6 | 🔲 | ⚡ |
| 7 | **Contextual Action Bar** — Multi-select: Delete, Export, Share | `bg/brand` · `text/inverse` · `icon/inverse` | 6,7 | 🔲 | ⬜ |
| 8 | **Segmented Control Bar** — 1D/1W/1M/1Y/ALL | `chip/bg` · `chip/bg-active` · `chip/text-active` · `radius/full` | 5 | ✅ | ⚡ |
| 9 | **Progress Top Bar** — Onboarding/eKYC steps | `status/info-default` · `bg/tertiary` · `radius/full` | 1,2 | 🔲 | ⚡ |

**Bottom Navbar (5 tabs — confirmed from `Profile.png`):**

```
Tab 1: Home      → icon/bold/home.svg
Tab 2: Crypto    → icon/bold/empty-wallet.svg (or chart)
Tab 3: Card      → icon/bold/card.svg
Tab 4: Cashback  → icon/bold/reward.svg (or gift)
Tab 5: More      → icon/bold/more.svg (3 dots) → Profile / Settings / FAQ / Notifications
```

---

## 2. Inputs, Selectors & Controls

> **Observed in screens:** `Registration default/filled.png` → phone input · `Search bill ID.png` → bill ID input · `Transfer to.png` → amount numpad · `Edit profile.png` → form fields with error state

| # | Component | States | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|---|
| 10 | **Text Input Standard** | Default, Focus, Active, Error, Disabled | `input/border` · `input/border-focus` · `input/border-error` · `radius/input` (12px) | All | ✅ | ⚡ |
| 11 | **Text Input Password** | Default + Show/Hide toggle | `input/*` · `icon/tertiary` · `eye.svg` / `eye-slash.svg` | 1,7 | 🔲 | ⚡ |
| 12 | **Text Input Amount / Currency** | Large center-aligned + "Max" button | `text/h2` (60px) · `text/tertiary` · `brand/teal` | 5,6 | ✅ partial | ⚡ |
| 13 | **Text Input Search Bar** | Default + Active + Clear button | `input/bg` · `input/placeholder` · `icon/tertiary` | 3,5,6 | ✅ partial | ⚡ |
| 14 | **Text Area / Multiline** | Default + Focus + Character count | `input/*` · `radius/input` · `text/tertiary` | 6,7 | 🔲 | 🔵 |
| 15 | **OTP / PIN Input Grid** | 4–6 cells, Focus border, Filled state | `border/focus` · `radius/md` · `text/primary` · `bg/secondary` | 1 | ✅ | ⚡ |
| 16 | **Dropdown / Select Box** | Closed + Open + Selected | `input/*` · `radius/input` · `arrow-down.svg` | 1,2,5 | 🔲 | ⚡ |
| 17 | **Checkbox Standard** | Unchecked, Checked, Indeterminate, Disabled | `status/info-default` · `border/default` · `radius/sm` | 2,7 | 🔲 | 🔵 |
| 18 | **Radio Button Group** | Unselected, Selected, Disabled | `status/info-default` · `border/default` · `radius/full` | 2,4 | 🔲 | 🔵 |
| 19 | **Slider Horizontal** | Default + Active thumb | `bg/brand` · `bg/tertiary` · `radius/full` | 4,5 | 🔲 | 🔵 |
| 20 | **Range Slider** | Dual-thumb range | `bg/brand` · `bg/tertiary` · `radius/full` | 5 | 🔲 | ⬜ |
| 21 | **Stepper Input** | +/− buttons + value display | `button/ghost-border` · `text/primary` · `radius/md` | 5,6 | 🔲 | 🔵 |
| 22 | **Keypad Numeric In-App** — Custom numpad | Digit keys + FaceID key + Delete key | `bg/secondary` · `text/primary` · `radius/full` · `finger-scan.svg` | 1,4,6 | ✅ | ⚡ |
| 23 | **Upload File / Image Picker Box** | Default + Uploading + Done | `border/default` dashed · `text/tertiary` · `icon/tertiary` | 2 | 🔲 | 🔵 |

**Key observations from screens:**
- **Keypad** (`Transfer to.png`, `Set PIN.png`, `Search bill ID.png`): phone-style 3×4 grid, `1` top-left, `0` bottom-center, `⌫` bottom-right
- **Amount input** (`Transfer to.png`): large center display `$0` placeholder → `$3000` filled, red "Exceeds $2500.70" inline
- **Error state** (`Edit profile.png`): pink bg `#FFF0F3` + red border `#FF3D71` + red helper text "Email will not be empty"

---

## 3. Data Display & Visual Cards

> **Observed:** `Home v1/v2.png` · `Card.png` · `Card flipped.png` · `Cashback.png` · `Crypto.png` · `Wallet details.png`

| # | Component | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|
| 24 | **Balance Card Hero Standard** — Balance + hide toggle + quick actions | `text/h1` (96px) → `text/h2` (60px) · `eye.svg` · `surface/default` | 3 | ✅ | ⚡ |
| 25 | **Balance Card Gradient/Dark** — VIP/Crypto dark variant | `greyscale/800` bg · `text/inverse` · `brand/teal` accent | 5 | 🔲 | 🔵 |
| 26 | **Virtual Card Snapshot Small** — Minicard in list | `brand/green` bg · `text/primary` · `radius/xl` (16px) | 4 | 🔲 | 🔵 |
| 27 | **Physical Card Tracking Status Card** — Delivery progress | `status/info-default` · `ProgressBar` · `card/radius` | 4 | 🔲 | ⬜ |
| 28 | **Crypto Asset Row Item** — Icon + Name + Ticker + Price + 24h% + Balance | `text/primary` · `text/secondary` · `status/success-text` / `status/error-text` | 5 | ✅ | ⚡ |
| 29 | **Crypto Mini Portfolio Card** — Sparkline + Total | `brand/teal` · `text/h5` · `card/bg` · `card/radius` | 3,5 | 🔲 | 🔵 |
| 30 | **Cashback / Rewards Progress Card** — Points + Amount earned | `status/success-default` · `ProgressBar` · `card/bg` | 3 | ✅ (Cashback.png) | ⚡ |
| 31 | **Loyalty Tier Badge / Card** — Silver/Gold/Platinum/Diamond | `brand/yellow` · `brand/purple` · `brand/pink` · `badge/radius` | 3 | 🔲 | 🔵 |
| 32 | **Bank Account Item / Card** — Linked account row | `text/primary` · `text/tertiary` · `card/border` | 7 | 🔲 | 🔵 |
| 33 | **NFT Asset Card Grid** — Image + Collection + Token ID + Floor price | `card/radius` · `text/secondary` · `brand/purple` | 5 | 🔲 | ⬜ |
| 34 | **NFT Asset Card List** — Row detail view | `text/primary` · `card/border` · `text/secondary` | 5 | 🔲 | ⬜ |
| 35 | **Staking / Yield Earn Card** — Pool + APY% + Duration + Staked | `status/success-bg` · `status/success-default` · `card/padding` | 5 | 🔲 | 🔵 |
| 36 | **Merchant / Store Card** — Logo + % Cashback + Expiry | `brand/green` bg · `badge/font-size` · `card/radius` | 3 | 🔲 | 🔵 |
| 37 | **Utility Bill Card** — Upcoming bill + Amount + Pay button | `status/warning-bg` · `status/warning-default` · `card/padding` | 6 | ✅ (Pay service debt.png) | ⚡ |
| 38 | **Contact Avatar Card / Circle** — Quick transfer contact | `avatar/radius` · `text/caption` · `avatar/size-md` | 6 | ✅ (Transfer.png) | ⚡ |
| 39 | **Address Book Row Item** — Crypto address + Tag + Network | `text/primary` · `badge/info-bg` · `text/tertiary` | 5 | 🔲 | 🔵 |
| 40 | **QR Code Presentation Card** — QR + Address + Copy | `surface/default` · `card/radius` · `brand/black` · `icon/secondary` | 5 | 🔲 | ⚡ |

**Key observations:**
- **Card visual** (`Card.png`, `Add balance.png`): VISA card · green bg `#BEFF6C` · black abstract art + pink blob · radius 16px · number `0000 0000 0000 0000` placeholder
- **Card flipped** (`Card flipped.png`): dark side · number `0823 4567 8900 2345` · EXPIRY `11/27` · CVV `234` · MASTERCARD logo
- **Cashback screen** (`Cashback.png`): dedicated tab — rewards summary, merchant offers
- **Crypto** (`Crypto.png`): `$840.20` balance · `+3.9%` chip · action row (Receive/Send/Swap/Buy/Sell) · token list rows
- **Wallet details** (`Wallet details.png`): ANS domain display · multi-chain balances

---

## 4. Buttons, Badges & Chips

> **Observed:** `Success.png` → OK button · `Transfer to.png` → Send button + Quick Amount chips · `Home v1.png` → Token percentage chips

| # | Component | Sizes | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|---|
| 41 | **Button Secondary / Outlined** | Giant/Large/Medium/Small | `button/ghost-bg` · `button/ghost-border` · `button/ghost-border-hover` | All | ✅ | ⚡ |
| 42 | **Button Icon-Only** | 40px / 48px round | `radius/full` · `bg/secondary` · `icon/primary` | All | ✅ | ⚡ |
| 43 | **Button Floating Action (FAB)** | 56px circle | `bg/brand` · `icon/inverse` · `radius/full` · shadow | All | 🔲 | 🔵 |
| 44 | **Button Loading State** | Primary + Secondary variants | `bg/disabled` · Spinner animation · `text/disabled` | All | 🔲 | ⚡ |
| 45 | **Button Social Login** | Apple / Google / Facebook / Passkey | `surface/default` · `border/default` · provider brand colors | 1 | 🔲 | 🔵 |
| 46 | **Button Text-Only / Link** | Regular / Destructive | `text/link` · `status/error-default` · no bg | All | 🔲 | 🔵 |
| 47 | **Status Badge Success** | Sm / Md | `badge/success-bg` (#F0FFF5) · `badge/success-text` (#00997A) · `radius/sm` | All | ✅ | ⚡ |
| 48 | **Status Badge Pending** | Sm / Md | `badge/warning-bg` (#FFFDF2) · `badge/warning-text` (#B86E00) | All | 🔲 | ⚡ |
| 49 | **Status Badge Error/Failed** | Sm / Md | `badge/error-bg` (#FFF2F2) · `badge/error-text` (#B81D5B) | All | ✅ | ⚡ |
| 50 | **Status Badge Neutral/Info** | Sm / Md | `badge/info-bg` (#F2F8FF) · `badge/info-text` (#0057C2) | All | ✅ | ⚡ |
| 51 | **Filter Chip / Pill Filter** | Inactive/Active | `chip/bg` (#EDF1F7) / `chip/bg-active` (#000) · `radius/full` | 3,5,6 | ✅ | ⚡ |
| 52 | **Network Selector Chip** | ERC20/TRC20/BEP20/Polygon/Solana | `chip/bg` · `chip/font-size` (14px) · network brand color | 5 | 🔲 | ⚡ |
| 53 | **Percentage Quick Pick Chips** | 25%/50%/75%/100% | `chip/bg` · `chip/text` · `radius/full` | 5 | 🔲 | 🔵 |
| 54 | **Quick Amount Chips** | +$5/+$25/+$50/+$100 | `chip/bg` · `chip/text` · `radius/full` | 4,6 | ✅ (Transfer to.png) | ⚡ |

**Key observations from screens:**
- Quick amount chips (`Transfer to.png`): `$5` `$25` `$50` `$100` — pill shape, grey bg, `text/primary`, same-size row
- "Exceeds $2500.70" (`Transfer to Filled.png`): **inline warning text** in `status/error-default` (#FF3D71) below the amount — not a badge, not a modal
- Token chips (`Home v1.png`): `12.7% BTC` (black) · `3.1% ETH` (teal) · `0.84% GLD` (neon green) — 3 different brand colors

---

## 5. Modals, Drawers & Popups

> **Observed:** `Search bill ID.png` → bottom sheet overlay · `App language.png` · `Appearance.png` → action sheet bottom

| # | Component | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|
| 55 | **Bottom Sheet Standard / Draggable** — Pull handle + content | `surface/default` · `border/default` · `radius/3xl` (32px) top-only | All | ✅ (Search bill ID.png) | ⚡ |
| 56 | **Bottom Sheet Confirmation** — Tx summary: Amount + Fee + Confirm | `surface/default` · `text/primary` · `button/primary-bg` · `card/gap` | 6 | 🔲 | ⚡ |
| 57 | **Bottom Sheet Biometric Prompt** — FaceID / TouchID request | `surface/default` · `finger-scan.svg` / `3d-cube-scan.svg` · `text/h5` | 1,4,6 | 🔲 | ⚡ |
| 58 | **Bottom Sheet Network Selection** — Blockchain network list | `surface/default` · network icon · `text/primary` · radio dot | 5 | 🔲 | ⚡ |
| 59 | **Modal Dialog Success** — Fullscreen / centered popup | `surface/default` · `status/success-default` · `brand/green` illustration | 6 | ✅ (Success.png) | ⚡ |
| 60 | **Modal Dialog Error / Alert** | `status/error-default` · `shield-cross.svg` · `text/primary` | 8 | 🔲 | ⚡ |
| 61 | **Modal Dialog Confirmation / Destructive** — Delete / Block | `status/error-bg` · `status/error-default` · 2-button layout | 4,7 | 🔲 | ⚡ |
| 62 | **Modal Dynamic Onboarding / Tooltip** — Feature hint | `bg/brand` · `text/inverse` · `radius/2xl` | 1,3 | 🔲 | 🔵 |
| 63 | **Action Sheet iOS Standard** — Photo Library / Camera / Cancel | `surface/default` · `text/primary` · `text/link` · `radius/3xl` top | 2,7 | ✅ (App language.png) | ⚡ |
| 64 | **Full-Screen Modal** — Terms & Conditions / Privacy Policy | `bg/primary` · `text/primary` · `text/secondary` scrollable | 1 | 🔲 | ⚡ |
| 65 | **Pop-over Menu** — 3-dot overflow menu | `surface/raised` · `border/subtle` · `radius/md` · `text/primary` | All | 🔲 | 🔵 |

**Key observations:**
- `Search bill ID.png`: bottom sheet slides up over blurred bg — `radius/3xl` top corners, drag handle bar `4×36px` `border/strong` centered
- `App language.png`: bottom sheet with flat list + radio dot + flag emoji
- `Appearance.png`: 3-option segmented bottom sheet — `System ✦` · `☀ Light` · `☾ Dark`

---

## 6. Lists, Cells & Structure

> **Observed:** `Payments.png` · `Home services.png` · `Notifications.png` · `FAQ.png` · `Settings.png` · `Transfer.png`

| # | Component | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|
| 66 | **List Item Standard Single Line** — Icon + Label + Arrow | `text/primary` · `icon/secondary` · `border/subtle` | All | ✅ | ⚡ |
| 67 | **List Item Two-Line Label** — Title + Subtitle | `text/primary` · `text/secondary` · `text/caption` · `gap/xs` | All | ✅ | ⚡ |
| 68 | **List Item Settings Switch** — Name + Toggle | `text/primary` · toggle tokens · `border/subtle` | 7 | ✅ (Settings.png) | ⚡ |
| 69 | **List Item Settings Value** — Name + Current value + Arrow | `text/primary` · `text/tertiary` · `arrow-right.svg` | 7 | ✅ (Settings.png) | ⚡ |
| 70 | **Transaction Item Pending** | `status/warning-default` badge · `money-time.svg` | 3,6 | 🔲 | ⚡ |
| 71 | **Transaction Item Refund / Cashback** | `status/success-text` amount · `money-recive.svg` · green `+` | 3,6 | 🔲 | ⚡ |
| 72 | **Transaction Item Crypto Buy/Sell** | Buy: `badge/success` · Sell: `badge/error` · token icon | 5 | 🔲 | ⚡ |
| 73 | **Transaction Group Divider** — "Today" / "Yesterday" / "Aug 2026" | `text/tertiary` · `type/caption` · `border/subtle` | 3,6 | 🔲 | 🔵 |
| 74 | **Notification Item Unread** — Blue dot + Content + Time | `status/info-default` 8px dot · `text/primary` · `text/tertiary` | 7 | ✅ (Notifications.png) | ⚡ |
| 75 | **Notification Item Read** — No dot, muted | `text/secondary` · `text/tertiary` | 7 | ✅ (Notifications.png) | ⚡ |
| 76 | **FAQ / Accordion Item** — Q + expand/collapse | `text/primary` · `add.svg` / `minus.svg` · `border/subtle` | 7 | ✅ (FAQ.png) | 🔵 |
| 77 | **Device Management Row** — Device name + Location + Logout | `text/primary` · `text/tertiary` · `status/error-default` logout btn | 7 | 🔲 | 🔵 |

**Key observations from screens:**
- `Payments.png`: category list — colored circle icon (teal/blue/orange/yellow) + Name + Merchant count + arrow chevron · `background/secondary` purple header
- `Home services.png`: merchant logo circle + name · teal header bg · scroll list
- `Notifications.png`: **New / Old** section dividers · brand logo circles · title + subtitle · pink header bg
- `FAQ.png`: **All | Card | Refund | Crypto** segmented tabs (pills) · accordion rows · 3rd row open (shows body text) · `+ / −` indicator icons
- `Settings.png`: orange header · colorful circle icons per row · toggle on (teal) / off (grey)

---

## 7. Charts & Financial Analytics

> **Observed:** `Crypto.png` → token price list with implied sparklines · `Wallet details.png` → portfolio breakdown

| # | Component | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|
| 78 | **Line Chart Sparkline Mini** — No axis, inline | `brand/green` / `status/error-default` · `stroke-width: 1.5` | 3,5 | ✅ | ⚡ |
| 79 | **Line Chart Standard Interactive** — With tooltip crosshair | `brand/teal` stroke · `surface/raised` tooltip · `radius/md` | 5 | 🔲 | ⚡ |
| 80 | **Candlestick Chart (Nến Nhật)** — Green/Red candles | `status/success-default` · `status/error-default` · white bg | 5 | 🔲 | 🔵 |
| 81 | **Donut / Pie Chart Portfolio** — Asset allocation | 5 token brand colors · `surface/default` center | 3,5 | ✅ | ⚡ |
| 82 | **Bar Chart Spending Analytics** — Monthly comparison | `brand/teal` / `brand/purple` · `bg/secondary` · `radius/sm` | 3 | 🔲 | 🔵 |
| 83 | **Chart Tooltip Callout Box** — Exact value on tap | `bg/inverse` · `text/inverse` · `radius/md` · `text/caption` | 5 | 🔲 | 🔵 |
| 84 | **Chart Legend Item** — Color dot + Label | brand color dot 8px · `text/secondary` · `type/caption` | 5 | 🔲 | 🔵 |
| 85 | **Depth Chart** — Buy/Sell orderbook depth | `status/success-default` fill · `status/error-default` fill | 5 | 🔲 | ⬜ |

---

## 8. Feedback, System States & Banners

> **Observed:** `Success.png` → full-screen success state · `PIN is wrong.png` → error state · `Notification details.png` → detail modal

| # | Component | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|
| 86 | **Toast Notification In-App** — Floating top banner | `bg/inverse` · `text/inverse` / `status/*/bg` · `radius/2xl` | Global | 🔲 | ⚡ |
| 87 | **In-App Banner Info** — Blue info | `status/info-bg` · `status/info-default` · `status/info-text` | All | 🔲 | ⚡ |
| 88 | **In-App Banner Warning** — Yellow "KYC needed" | `status/warning-bg` · `status/warning-default` · `status/warning-text` | 2,3 | 🔲 | ⚡ |
| 89 | **In-App Banner Critical / Error** — Red maintenance | `status/error-bg` · `status/error-default` · `status/error-text` | 8 | 🔲 | ⚡ |
| 90 | **In-App Banner Promo** — Marketing + CTA | `brand/pink` bg · `text/primary` · image + button | 3 | 🔲 | 🔵 |
| 91 | **Empty State — No Transactions** | `brand/green` illustration · `text/h5` · `text/secondary` | 3,6 | 🔲 | ⚡ |
| 92 | **Empty State — No Crypto** | `brand/teal` illustration · `text/h5` · `text/secondary` | 5 | 🔲 | ⚡ |
| 93 | **Empty State — No Search Results** | `brand/grey` illustration · `text/secondary` | All | 🔲 | ⚡ |
| 94 | **Error State — Network / Offline** | `status/error-default` · `wifi.svg` slash · retry button | 8 | 🔲 | ⚡ |
| 95 | **Error State — 500 Server Error** | `status/error-bg` · `text/h5` · support link | 8 | 🔲 | ⚡ |
| 96 | **Error State — Session Expired** | `security-time.svg` · `text/h5` · login button | 8 | 🔲 | ⚡ |
| 97 | **Skeleton Loading Line / Text** | `bg/tertiary` animated · `radius/sm` | All | 🔲 | ⚡ |
| 98 | **Skeleton Loading Card** | `bg/tertiary` animated · `card/radius` | All | 🔲 | ⚡ |
| 99 | **Skeleton Loading Avatar** | `bg/tertiary` animated · `radius/full` | All | 🔲 | ⚡ |
| 100 | **Spinner Loading Indicator** | `brand/teal` or `bg/brand` · iOS-native style | All | 🔲 | ⚡ |

**Key observations:**
- `Success.png`: **brand/green asterisk `*` illustration** (flat, large center) · "Congrats!!!" bold H4 · "Your transaction sent succesfully" body · "OK" black pill button
- `PIN is wrong.png`: face scan illustration + error indication · shake animation implied

---

## 9. Onboarding, Auth & Security

> **Observed:** `Onboarding v1/v2.png` · `Splash v1/v2.png` · `App language-1.png` (onboarding context)

| # | Component | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|
| 101 | **Onboarding Carousel Slide** — 3D Illustration + Title + Subtitle | `bg/primary` or brand color bg · `text/h4` · `text/secondary` | 1 | ✅ (Onboarding v1/v2.png) | ⚡ |
| 102 | **Pagination Dots Indicator** — Active/inactive dots | `bg/brand` active 8px · `bg/tertiary` inactive 6px · `radius/full` | 1 | ✅ | ⚡ |
| 103 | **Passkey Integration Box** — Activate Passkey card | `card/bg` · `key.svg` · `text/h6` · `text/secondary` | 1 | 🔲 | ⚡ |
| 104 | **Biometric Scan FaceID** — 3D face scan graphic | `brand/teal` outline · animated ring · `3d-cube-scan.svg` | 1,4 | 🔲 | ⚡ |
| 105 | **Biometric Scan TouchID** — Fingerprint graphic | `brand/teal` · `finger-scan.svg` large · animated pulse | 1 | ✅ (PIN is wrong.png) | ⚡ |
| 106 | **Security Level Meter** — Password strength | `status/error-default` (Weak) · `status/warning-default` (Medium) · `status/success-default` (Strong) | 1 | 🔲 | 🔵 |
| 107 | **2FA Code Copy Box** — Emergency backup codes | `surface/sunken` · `text/primary` monospace · copy icon | 7 | 🔲 | 🔵 |
| 108 | **Device Permission Request Card** — Camera / Notification | `card/bg` · `icon/primary` large · `text/h6` · `text/secondary` | 1,2 | 🔲 | ⚡ |

**Key observations:**
- `Onboarding v1.png`: purple bg · 3D coin+globe illustration center · "Get better with Banky" title · CTA button
- `Onboarding v2.png`: same layout + **"English ▼" language dropdown** = language selection during onboarding
- `App language-1.png`: purple bg visible behind the bottom sheet — this is the **onboarding context** language picker (Skip button visible top-right)
- `Splash v1.png`: pink bg `#FD9FDD` · logo centered · star/diamond/sun decorative shapes
- `Splash v2.png`: white bg · logo centered · minimal

---

## 10. eKYC & Verification

> Corresponds to Zone 2 screens (not individually shown but referenced in image 13/14 analysis)

| # | Component | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|
| 109 | **Document Type Selection Card** — CCCD/Passport/License | `card/bg` · `card/radius` · `personalcard.svg` | 2 | 🔲 | ⚡ |
| 110 | **Camera Overlay Guide (ID Card)** — Rectangle frame guide | `brand/teal` border · `frame.svg` corners · `text/inverse` guidance | 2 | 🔲 | ⚡ |
| 111 | **Camera Overlay Guide (Liveness Face)** — Oval frame | `brand/teal` oval border · animated pulse · `3d-cube-scan.svg` | 2 | 🔲 | ⚡ |
| 112 | **Photo Quality Warning Tag** — Blur/Glare/Angle alerts | `status/warning-default` · `warning-2.svg` · `text/caption` | 2 | 🔲 | ⚡ |
| 113 | **eKYC Step Process Bar** — 3 steps | `status/info-default` active · `status/info-bg` inactive · `text/caption` | 2 | 🔲 | ⚡ |
| 114 | **Proof of Address Upload Card** — Upload utility bill | `border/default` dashed · `document-upload.svg` · `text/secondary` | 2 | 🔲 | 🔵 |
| 115 | **Tax Residency Declaration Box** — FATCA form | `card/bg` · `card/radius` · `Checkbox` + `Input` components | 2 | 🔲 | 🔵 |

---

## 11. Crypto & Web3 Specific

> **Observed:** `Swap.png` · `Crypto.png` · `Wallet details.png` · `Crypto start trade.png`

| # | Component | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|
| 116 | **Swap Input/Output Container** — Pay/Receive connected | `card/bg` · `arrow-swap.svg` circle center · `input/border` | 5 | ✅ (Swap.png) | ⚡ |
| 117 | **Swap Rate Lock Countdown** — 15s timer | `text/secondary` · `clock.svg` · `status/warning-default` at <5s | 5 | 🔲 | 🔵 |
| 118 | **Slippage Tolerance Setting** — 0.1%/0.5%/1%/Custom | `chip/bg` · `chip/bg-active` · `Stepper Input` custom | 5 | 🔲 | 🔵 |
| 119 | **Gas Fee Speed Selector** — Slow/Market/Fast | `card/bg` · 3-option segmented · `text/secondary` ETA | 5 | 🔲 | 🔵 |
| 120 | **Orderbook Row Bid (Green)** — Price + Qty + Depth bar | `status/success-bg` depth · `status/success-text` price | 5 | 🔲 | ⬜ |
| 121 | **Orderbook Row Ask (Red)** — Price + Qty + Depth bar | `status/error-bg` depth · `status/error-text` price | 5 | 🔲 | ⬜ |
| 122 | **Wallet Connect Banner** — MetaMask/Trust connected | `card/bg` · wallet brand icon · `status/success-default` dot | 5 | 🔲 | 🔵 |
| 123 | **Contract Address Copy Widget** — Address + Copy + Explorer | `surface/sunken` · `text/tertiary` monospace · `copy.svg` | 5 | 🔲 | 🔵 |
| 124 | **Staking Unbonding Alert** — Cooldown period warning | `status/warning-bg` · `status/warning-default` · `lock.svg` | 5 | 🔲 | 🔵 |

**Key observations:**
- `Swap.png`: `2.00 ETH` input → `2679.62 USDT` output · arrow-swap center icon · teal bg header · PIN numpad below
- `Crypto start trade.png`: purple/violet bg · star decorative · "Trade crypto, Earn money, Spend easily" · "Start trade" black pill button
- `Wallet details.png`: ANS domain visible · multi-chain token balance rows

---

## 12. Transfer, Payments & Receipts

> **Observed:** `Transfer.png` · `Transfer to.png` · `Transfer to Filled.png` · `Adding amount.png` · `Success.png` · `Payments.png` · `Home services.png` · `Search bill ID.png` · `Pay service debt.png`

| # | Component | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|
| 125 | **Recipient Info Header Cell** — Avatar + Name + Account/Wallet | `avatar/size-lg` (56px) · `text/h5` · `text/secondary` | 6 | ✅ (Transfer to.png) | ⚡ |
| 126 | **Payment Method Selector Row** — Wallet/Crypto/Debit card | `card/bg` · `card-coin.svg` · `radio dot` active | 6 | ✅ (Adding amount.png) | ⚡ |
| 127 | **Quick Transfer Contact List** — Horizontal scroll circles | `avatar/size-md` (40px) · `text/caption` · `gap/lg` horizontal | 6 | ✅ (Transfer.png) | ⚡ |
| 128 | **Transaction Review Summary Table** — All details pre-confirm | `card/bg` · `text/secondary` label · `text/primary` value · `border/subtle` rows | 6 | 🔲 | ⚡ |
| 129 | **Digital Receipt Header** — Logo + ✓ Success | `status/success-default` tick circle · `brand/green` bg | 6 | ✅ (Success.png) | ⚡ |
| 130 | **Digital Receipt Detail Row** — TxID, Time, Fee, Note | `text/secondary` label · `text/primary` value · `border/subtle` | 6 | 🔲 | ⚡ |
| 131 | **Receipt Action Bar** — Share PDF / Save Image / Repeat | 3 icon-text buttons · `text/link` · `gap/xl` | 6 | 🔲 | 🔵 |
| 132 | **QR Code Scanner Viewfinder** — Camera frame area | `brand/teal` corners · `scan-barcode.svg` · `text/inverse` guide | 5,6 | 🔲 | ⚡ |
| 133 | **QR Code Generator Preview** — QR + Center logo | `bg/primary` white bg · `bg/brand` QR modules · `AXQLogo` center | 5 | 🔲 | ⚡ |

**Key observations from screens:**
- `Transfer.png`: purple header bg · search bar · "Recently sent" section · avatar list (C / photo / person) · names · **"Enter card number"** pill button at bottom
- `Transfer to.png` / `Transfer to Filled.png`: teal header · recipient avatar card center · large `$0`/`$3000` amount · quick chips `$5 $25 $50 $100` · balance info · Send button · numpad
- `Adding amount.png`: purple header · "From" card pill with `1234 5678 9012 3456` · `$0` amount · "Top up" button · numpad
- `Pay service debt.png`: teal header · merchant logo center · "Current debt: $38.00" in orange `#FC7339` · balance · Send button · numpad
- `Search bill ID.png`: bottom sheet over teal bg · "Bill ID: 459684|" · "Search bill" button · numpad

---

## 13. Card Management

> **Observed:** `Card.png` · `Card flipped.png` · `Card scroll.png` (referenced) · `Add balance default/filled.png`

| # | Component | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|
| 134 | **Card Flip View Interactive** — Front / Back 3D flip | `brand/green` front · `greyscale/800` back · `radius/xl` (16px) | 4 | ✅ (Card flipped.png) | ⚡ |
| 135 | **Card CVV Reveal Overlay** — Requires FaceID | `surface/default` blur overlay · `lock.svg` large · `eye.svg` | 4 | 🔲 | ⚡ |
| 136 | **Card Frozen Overlay** — Freeze state | `greyscale/300` overlay 60% · `lock.svg` · `text/disabled` | 4 | 🔲 | ⚡ |
| 137 | **Apple Wallet Integration Button** | Apple-spec button · `bg/brand` · Apple Wallet icon | 4 | 🔲 | 🔵 |
| 138 | **Card Spending Limit Meter** — $3500/$5000 | `status/info-default` fill · `bg/tertiary` track · `text/caption` labels | 4 | 🔲 | 🔵 |
| 139 | **Card Customization Theme Picker** — Color/skin options | `card/radius` · brand color swatches · selected ring | 4 | 🔲 | ⬜ |
| 140 | **ATM Location Finder Row** — Nearest ATM + km | `bank.svg` · `text/primary` · `text/tertiary` distance | 4 | 🔲 | ⬜ |

---

## 14. Messaging, Support & FAQ

> **Observed:** `FAQ.png` — accordion Q&A · `Settings.png` → support entry point · `Notifications.png`

| # | Component | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|
| 141 | **Chat Bubble User (Sent)** — Right-aligned | `bg/brand` (#000) · `text/inverse` · `radius/2xl` (24px) no bottom-right | 7 | 🔲 | 🔵 |
| 142 | **Chat Bubble Support (Received)** — Left-aligned | `bg/secondary` (#EDF1F7) · `text/primary` · `radius/2xl` no bottom-left | 7 | 🔲 | 🔵 |
| 143 | **Chat Time Divider** | `text/tertiary` · `type/caption` · centered `border/subtle` lines | 7 | 🔲 | 🔵 |
| 144 | **Chat Quick Reply Chips** — Suggested answers | `chip/bg` · `chip/text` · `radius/full` | 7 | 🔲 | 🔵 |
| 145 | **Support Ticket Status Row** — Ticket ID + Status | `badge/info-bg` · `text/primary` · `status/*/default` | 7 | 🔲 | ⬜ |
| 146 | **Live Chat Floating Widget** — Bottom corner button | `bg/brand` · `icon/inverse` · `radius/full` · 56px FAB | 7 | 🔲 | ⬜ |

---

## 15. Miscellaneous & Specialized

| # | Component | AXQ Tokens | Zone | Status | Priority |
|---|---|---|---|---|---|
| 147 | **Divider Line Horizontal** — 1px separator | `border/subtle` (#EDF1F7) | All | ✅ | ⚡ |
| 148 | **Divider Line Vertical** — Column separator | `border/subtle` | All | 🔲 | 🔵 |
| 149 | **Avatar Group Stack** — Overlapping avatars | `avatar/*` · `-8px` overlap · `border/default` ring | 6 | 🔲 | 🔵 |
| 150 | **Badge Icon Small** — Notification dot on avatar | `status/error-default` 8px · `radius/full` | All | 🔲 | ⚡ |
| 151 | **Calendar Date Picker** | `surface/default` · `status/info-default` selected · `text/primary` | 6,7 | 🔲 | 🔵 |
| 152 | **Time Picker Scroll View** — iOS drum roll | `surface/default` · `text/primary` · blur top/bottom | 6 | 🔲 | ⬜ |
| 153 | **Audio / Voice Note Bar** | `bg/secondary` · `brand/teal` waveform · record button | 7 | 🔲 | ⬜ |
| 154 | **Attachment Preview Box** — PDF/Image | `surface/sunken` · `document.svg` · `text/secondary` | 7 | 🔲 | ⬜ |
| 155 | **App Version Badge** — v2.4.0 | `text/tertiary` · `type/caption` · bottom of Settings | 7 | 🔲 | ⬜ |
| 156 | **Terms & Condition Checkbox Container** | `surface/sunken` · scrollable text · `Checkbox` at bottom | 1 | 🔲 | ⚡ |
| 157 | **Language Selector Item** — Flag + Language | flag emoji · `text/primary` · radio dot | 7 | ✅ (App language.png) | ⚡ |
| 158 | **Dark Mode Toggle Row** — System/Light/Dark | segmented 3-option · `icon/*` · `text/primary` | 7 | ✅ (Appearance.png) | ⚡ |
| 159 | **Referral Code Share Box** — Code + Copy + Social | `surface/sunken` · `text/primary` · copy icon · share icons | 7 | 🔲 | 🔵 |
| 160 | **KYC Level Progress Steps** — Level 1→2→3 | `status/info-default` active · `bg/tertiary` inactive · `text/caption` | 2,3 | 🔲 | ⚡ |
| 161 | **Push Notification Setting Row** — Per-category toggle | `text/primary` · `text/secondary` · toggle tokens | 7 | 🔲 | 🔵 |
| 162 | **Gas Tracker Live Widget** — gwei realtime | `text/secondary` monospace · `brand/teal` dot · `type/caption` | 5 | 🔲 | 🔵 |
| 163 | **Token Search History Chip** — Recent searches | `chip/bg` · `chip/text` · `close.svg` × | 5 | 🔲 | 🔵 |
| 164 | **Transaction Fee Breakdown Table** | `text/secondary` label · `text/primary` value · `border/subtle` | 5,6 | 🔲 | ⚡ |
| 165 | **Crypto Watchlist Star Button** | `brand/yellow` filled star · `icon/tertiary` empty | 5 | 🔲 | 🔵 |
| 166 | **Currency Converter Row** — FIAT↔Crypto | `convert.svg` center · `text/primary` amounts | 3,5 | 🔲 | 🔵 |
| 167 | **Tax Report Export Card** — CSV/PDF download | `card/bg` · `document.svg` · `button/ghost-border` | 7 | 🔲 | ⬜ |
| 168 | **Address Scanner Camera View** — OCR scan | `brand/teal` frame · `scan.svg` · `text/inverse` | 5 | 🔲 | 🔵 |
| 169 | **Security Audit Status Tag** — Smart Contract audit | `badge/success-bg` · `shield-tick.svg` · `text/caption` | 5 | 🔲 | ⬜ |
| 170 | **Hardware Wallet Connect Row** — Ledger/Trezor | `card/bg` · device icon · `status/info-default` connect btn | 5 | 🔲 | ⬜ |
| 171 | **Pill Tag Active Filter Count** — "Filters (3)" | `bg/brand` · `text/inverse` · `radius/full` | 3,5,6 | 🔲 | 🔵 |
| 172 | **Quick Contact Action Drawer** — Swipe: Transfer/Request/Block | `surface/default` · swipe-action bg colors | 6 | 🔲 | 🔵 |
| 173 | **In-App Rating Prompt Card** — 5-star review | `card/bg` · `brand/yellow` stars · `text/h6` | 8 | 🔲 | ⬜ |
| 174 | **Update Force Modal** — Mandatory update | `surface/default` · `status/warning-default` · App Store link | 8 | 🔲 | ⚡ |
| 175 | **Maintenance Screen** — System downtime | `bg/primary` · maintenance illustration · `text/h4` | 8 | 🔲 | ⚡ |
| 176 | **Jailbreak Warning Alert** | `status/error-bg` · `shield-cross.svg` · full-screen block | 8 | 🔲 | ⚡ |
| 177 | **Session Timeout Warning Popup** — 30s countdown | `modal/*` · `security-time.svg` · countdown `text/h4` | 8 | 🔲 | ⚡ |
| 178 | **Merchant POS Payment Banner** | `brand/teal` bg · `card-pos.svg` · `text/inverse` | 6 | 🔲 | 🔵 |
| 179 | **Cashback History Category Row** | `brand/green` amount · category icon · `text/primary` | 3 | 🔲 | 🔵 |
| 180 | **Voucher Code Input Field** | `input/*` · `ticket.svg` · apply button | 3 | 🔲 | 🔵 |
| 181 | **Coupon Item Card** — Claimed/Unclaimed | `brand/pink` bg · `status/success-default` claimed badge | 3 | 🔲 | 🔵 |
| 182 | **Gift Transfer Card** — Lì xì / Crypto gift | `brand/pink` or `brand/yellow` · `gift.svg` · `text/h5` | 6 | 🔲 | ⬜ |
| 183 | **Recurring Payment Setup Row** | `calendar.svg` · `text/primary` · frequency label | 6 | 🔲 | ⬜ |
| 184 | **Subscription Management Item** | service logo · `text/primary` · amount/month · toggle | 7 | 🔲 | ⬜ |
| 185 | **Credit Score Meter Widget** | `status/success-default` (High) · `status/warning-default` (Med) · arc gauge | 3 | 🔲 | ⬜ |
| 186 | **Investment Risk Profile Selector** | `brand/green` Low · `brand/yellow` Med · `brand/orange` High | 5 | 🔲 | ⬜ |
| 187 | **Asset Lockup Countdown Timer** | `lock.svg` · countdown `text/h4` · `status/warning-default` | 5 | 🔲 | 🔵 |
| 188 | **Airdrop Reward Claim Card** | `brand/teal` bg · `airdrop.svg` · CTA button | 5 | 🔲 | ⬜ |
| 189 | **Bridge Token Network Selector** | source/target network chips · `arrow-right.svg` center | 5 | 🔲 | 🔵 |
| 190 | **Liquidity Pool Pair Row** | token A icon + token B icon overlap · APY · `text/primary` | 5 | 🔲 | ⬜ |
| 191 | **Yield Farming APY Badge** | `status/success-bg` · `%` text bold · `brand/green` | 5 | 🔲 | ⬜ |
| 192 | **Limit Order Price Input** | `input/border-focus` · price input + expiry select | 5 | 🔲 | ⬜ |
| 193 | **Stop-Loss / Take-Profit Box** | `status/error-default` SL · `status/success-default` TP | 5 | 🔲 | ⬜ |
| 194 | **Market News Row Item** | source logo · headline `text/body-sm` · time `text/caption` | 5 | 🔲 | ⬜ |
| 195 | **Economic Calendar Item** | `calendar-tick.svg` · event name · impact badge | 5 | 🔲 | ⬜ |
| 196 | **Price Alert Setup Row** | `alarm.svg` · `brand/yellow` threshold · toggle | 5 | 🔲 | 🔵 |
| 197 | **Address Book Tag Selector** | tag chips: "Exchange" / "Cold wallet" / "Friend" | 5 | 🔲 | 🔵 |
| 198 | **Multi-Sig Wallet Approval Row** | multi-avatar + approval count `2/3` · `shield-tick.svg` | 5 | 🔲 | ⬜ |
| 199 | **Fiat On-Ramp Provider Card** — MoonPay/Banxa/Transak | provider logo · fee % · `button/ghost-border` | 5 | 🔲 | 🔵 |
| 200 | **Fiat Off-Ramp Withdrawal Method** — Bank withdrawal | `bank.svg` · bank name · processing time | 6 | 🔲 | 🔵 |
| 201 | **System Health Indicator Dots** — Server/Network status | `status/success-default` 8px · `status/warning-default` · `status/error-default` · `text/caption` | 8 | 🔲 | 🔵 |

---

## Summary by Priority

| Priority | Count | Scope |
|---|---|---|
| ⚡ Critical (Phase 1–2) | **72** | Auth, Core wallet, Transfer, Card, Feedback, Security |
| 🔵 Medium (Phase 3) | **79** | Crypto advanced, Settings, Messaging, Analytics |
| ⬜ Low (Phase 4+) | **50** | Trading, DeFi, NFT, CRM, Advanced features |

## Summary by Status

| Status | Count |
|---|---|
| ✅ Already in kit / documented | **31** |
| 🔲 New — needs design | **170** |

---

## AXQ Primitive Tokens Reference (Quick Lookup)

```
Radius:   button=24px · card=16px · input=12px · modal=24px · chip=9999px
Spacing:  inset-sm=8px · inset-md=16px · inset-lg=24px · gap-sm=8px · gap-md=12px
Typography: h1=96 · h2=60 · h4=34 · h5=24 · h6=20 · body=16 · body-sm=14 · caption=12 · overline=10
Colors:   brand/black=#000 · brand/teal=#49DBC8 · brand/green=#BEFF6C
          success=#00D68F · warning=#FFAA00 · error=#FF3D71 · info=#0095FF
```
```
<div data-layer="Preview link" className="PreviewLink w-[3600px] h-[2700px] relative bg-violet-500 overflow-hidden">
  <div data-layer="Preview product link:" className="PreviewProductLink left-[317px] top-[1397px] absolute text-center justify-start text-white text-9xl font-semibold font-['Work_Sans']">Preview product link:</div>
  <div data-layer="website all Wallet, FinTech, Banking Crypto, Blockchain Mobile UI kits" className="WebsiteAllWalletFintechBankingCryptoBlockchainMobileUiKits left-[258px] top-[578.10px] absolute justify-start text-white text-8xl font-medium font-['Work_Sans'] leading-[134.10px]">website all Wallet, FinTech, Banking <br/>Crypto, Blockchain Mobile UI kits</div>
  <div data-layer="Price" className="Price w-[611.54px] h-64 px-24 py-16 left-[2470.18px] top-[1202.92px] absolute origin-top-left rotate-[-1.69deg] bg-rose-500 rounded-[89.27px] shadow-[24.173063278198242px_24.173063278198242px_0px_0px_rgba(0,0,0,1.00)] outline outline-[12.09px] outline-white inline-flex justify-center items-center gap-5">
    <div data-layer="NEWS!" className="News w-[474.71px] h-32 origin-top-left rotate-[-1.27deg] justify-start text-white text-8xl font-medium font-['Work_Sans'] leading-[134.10px]">NEWS!</div>
  </div>
  <div data-svg-wrapper data-layer="Subtract" className="Subtract left-[1703.55px] top-[1894px] absolute">
    <svg width="483" height="468" viewBox="0 0 483 468" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="path-1-inside-1_202_153" fill="white">
    <path d="M482.164 364.675L97.7143 467.688L0 103.013L384.45 -1.19146e-05L482.164 364.675ZM260.131 90.4777C239.656 95.964 222.825 108.068 211.557 123.656C194.006 115.79 173.377 113.723 152.903 119.209C107.405 131.401 79.8957 176.27 91.4598 219.428C96.6639 238.85 108.895 254.614 124.919 264.97C116.219 281.95 113.509 301.719 118.713 321.14C130.278 364.298 176.536 389.402 222.034 377.211C242.509 371.724 259.339 359.619 270.607 344.031C288.158 351.897 308.787 353.965 329.262 348.479C374.76 336.288 402.269 291.418 390.705 248.26C385.501 228.838 373.27 213.074 357.245 202.718C365.945 185.737 368.656 165.97 363.452 146.548C351.888 103.39 305.63 78.2865 260.131 90.4777Z"/>
    </mask>
    <path d="M482.164 364.675L97.7143 467.688L0 103.013L384.45 -1.19146e-05L482.164 364.675ZM260.131 90.4777C239.656 95.964 222.825 108.068 211.557 123.656C194.006 115.79 173.377 113.723 152.903 119.209C107.405 131.401 79.8957 176.27 91.4598 219.428C96.6639 238.85 108.895 254.614 124.919 264.97C116.219 281.95 113.509 301.719 118.713 321.14C130.278 364.298 176.536 389.402 222.034 377.211C242.509 371.724 259.339 359.619 270.607 344.031C288.158 351.897 308.787 353.965 329.262 348.479C374.76 336.288 402.269 291.418 390.705 248.26C385.501 228.838 373.27 213.074 357.245 202.718C365.945 185.737 368.656 165.97 363.452 146.548C351.888 103.39 305.63 78.2865 260.131 90.4777Z" fill="#19BCFE"/>
    <path d="M482.164 364.675L482.682 366.607L484.614 366.089L484.096 364.157L482.164 364.675ZM97.7143 467.688L95.7824 468.205L96.3001 470.137L98.2319 469.62L97.7143 467.688ZM0 103.013L-0.517638 101.081L-2.44949 101.599L-1.93185 103.531L0 103.013ZM384.45 -1.19146e-05L386.382 -0.51765L385.864 -2.4495L383.932 -1.93186L384.45 -1.19146e-05ZM260.131 90.4777L259.613 88.5459V88.5459L260.131 90.4777ZM211.557 123.656L210.739 125.481L212.225 126.146L213.178 124.827L211.557 123.656ZM152.903 119.209L152.385 117.278V117.278L152.903 119.209ZM91.4598 219.428L89.528 219.946L89.528 219.946L91.4598 219.428ZM124.919 264.97L126.699 265.882L127.524 264.272L126.005 263.29L124.919 264.97ZM118.713 321.14L116.782 321.658L116.782 321.658L118.713 321.14ZM222.034 377.211L222.552 379.143L222.552 379.143L222.034 377.211ZM270.607 344.031L271.425 342.206L269.939 341.54L268.986 342.859L270.607 344.031ZM329.262 348.479L329.78 350.411V350.411L329.262 348.479ZM390.705 248.26L392.637 247.742L392.637 247.742L390.705 248.26ZM357.245 202.718L355.465 201.806L354.64 203.416L356.159 204.398L357.245 202.718ZM363.452 146.548L365.384 146.031L365.384 146.031L363.452 146.548ZM482.164 364.675L481.646 362.743L97.1967 465.756L97.7143 467.688L98.2319 469.62L482.682 366.607L482.164 364.675ZM97.7143 467.688L99.6462 467.17L1.93185 102.495L0 103.013L-1.93185 103.531L95.7824 468.205L97.7143 467.688ZM0 103.013L0.517638 104.945L384.967 1.93184L384.45 -1.19146e-05L383.932 -1.93186L-0.517638 101.081L0 103.013ZM384.45 -1.19146e-05L382.518 0.517626L480.232 365.192L482.164 364.675L484.096 364.157L386.382 -0.51765L384.45 -1.19146e-05ZM260.131 90.4777L259.613 88.5459C238.688 94.1528 221.469 106.529 209.936 122.484L211.557 123.656L213.178 124.827C224.18 109.607 240.624 97.7752 260.649 92.4096L260.131 90.4777ZM211.557 123.656L212.375 121.831C194.41 113.78 173.31 111.671 152.385 117.278L152.903 119.209L153.421 121.141C173.445 115.776 193.602 117.801 210.739 125.481L211.557 123.656ZM152.903 119.209L152.385 117.278C105.917 129.729 77.6525 175.626 89.528 219.946L91.4598 219.428L93.3917 218.911C82.1388 176.914 108.892 133.073 153.421 121.141L152.903 119.209ZM91.4598 219.428L89.528 219.946C94.8684 239.876 107.419 256.042 123.834 266.649L124.919 264.97L126.005 263.29C110.37 253.186 98.4594 237.823 93.3917 218.911L91.4598 219.428ZM124.919 264.97L123.139 264.058C114.228 281.451 111.441 301.727 116.782 321.658L118.713 321.14L120.645 320.622C115.578 301.71 118.211 282.45 126.699 265.882L124.919 264.97ZM118.713 321.14L116.782 321.658C128.657 365.977 176.084 391.593 222.552 379.143L222.034 377.211L221.517 375.279C176.988 387.21 131.898 362.618 120.645 320.622L118.713 321.14ZM222.034 377.211L222.552 379.143C243.477 373.536 260.695 361.158 272.228 345.203L270.607 344.031L268.986 342.859C257.984 358.079 241.541 369.913 221.517 375.279L222.034 377.211ZM270.607 344.031L269.789 345.856C287.754 353.907 308.855 356.018 329.78 350.411L329.262 348.479L328.745 346.547C308.72 351.913 288.562 349.886 271.425 342.206L270.607 344.031ZM329.262 348.479L329.78 350.411C376.248 337.96 404.512 292.062 392.637 247.742L390.705 248.26L388.774 248.778C400.026 290.774 373.273 334.616 328.745 346.547L329.262 348.479ZM390.705 248.26L392.637 247.742C387.297 227.812 374.745 211.646 358.331 201.038L357.245 202.718L356.159 204.398C371.795 214.502 383.706 229.865 388.774 248.778L390.705 248.26ZM357.245 202.718L359.025 203.63C367.937 186.237 370.724 165.961 365.384 146.031L363.452 146.548L361.52 147.066C366.587 165.979 363.954 185.238 355.465 201.806L357.245 202.718ZM363.452 146.548L365.384 146.031C353.508 101.711 306.081 76.0949 259.613 88.5459L260.131 90.4777L260.649 92.4096C305.178 80.4782 350.267 105.07 361.52 147.066L363.452 146.548Z" fill="black" mask="url(#path-1-inside-1_202_153)"/>
    </svg>
  </div>
  <div data-svg-wrapper data-layer="Union" className="Union left-[746px] top-[2130px] absolute">
    <svg width="232" height="232" viewBox="0 0 232 232" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="path-1-inside-1_202_160" fill="white">
    <path d="M140.167 58.0576L181.309 16.916L215.485 51.0928L174.744 91.834H232V140.167H174.06L215.143 181.25L180.966 215.427L140.167 174.628V232H91.833V174.745L51.4365 215.142L17.2598 180.965L58.0576 140.167H0V91.834H57.373L16.917 51.3779L51.0938 17.2012L91.833 57.9404V0H140.167V58.0576Z"/>
    </mask>
    <path d="M140.167 58.0576L181.309 16.916L215.485 51.0928L174.744 91.834H232V140.167H174.06L215.143 181.25L180.966 215.427L140.167 174.628V232H91.833V174.745L51.4365 215.142L17.2598 180.965L58.0576 140.167H0V91.834H57.373L16.917 51.3779L51.0938 17.2012L91.833 57.9404V0H140.167V58.0576Z" fill="#FFF172"/>
    <path d="M140.167 58.0576H138.167V62.886L141.581 59.4718L140.167 58.0576ZM181.309 16.916L182.723 15.5018L181.309 14.0876L179.894 15.5018L181.309 16.916ZM215.485 51.0928L216.9 52.507L218.314 51.0928L216.9 49.6786L215.485 51.0928ZM174.744 91.834L173.33 90.4198L169.916 93.834H174.744V91.834ZM232 91.834H234V89.834H232V91.834ZM232 140.167V142.167H234V140.167H232ZM174.06 140.167V138.167H169.231L172.645 141.581L174.06 140.167ZM215.143 181.25L216.557 182.664L217.971 181.25L216.557 179.836L215.143 181.25ZM180.966 215.427L179.552 216.841L180.966 218.255L182.38 216.841L180.966 215.427ZM140.167 174.628L141.581 173.214L138.167 169.799V174.628H140.167ZM140.167 232V234H142.167V232H140.167ZM91.833 232H89.833V234H91.833V232ZM91.833 174.745H93.833V169.917L90.4188 173.331L91.833 174.745ZM51.4365 215.142L50.0223 216.556L51.4365 217.97L52.8507 216.556L51.4365 215.142ZM17.2598 180.965L15.8456 179.551L14.4313 180.965L15.8456 182.379L17.2598 180.965ZM58.0576 140.167L59.4718 141.581L62.886 138.167H58.0576V140.167ZM0 140.167H-2V142.167H0V140.167ZM0 91.834V89.834H-2V91.834H0ZM57.373 91.834V93.834H62.2015L58.7873 90.4198L57.373 91.834ZM16.917 51.3779L15.5028 49.9637L14.0886 51.3779L15.5028 52.7921L16.917 51.3779ZM51.0938 17.2012L52.508 15.787L51.0938 14.3727L49.6795 15.787L51.0938 17.2012ZM91.833 57.9404L90.4188 59.3546L93.833 62.7689V57.9404H91.833ZM91.833 0V-2H89.833V0H91.833ZM140.167 0H142.167V-2H140.167V0ZM140.167 58.0576L141.581 59.4718L182.723 18.3302L181.309 16.916L179.894 15.5018L138.753 56.6434L140.167 58.0576ZM181.309 16.916L179.894 18.3302L214.071 52.507L215.485 51.0928L216.9 49.6786L182.723 15.5018L181.309 16.916ZM215.485 51.0928L214.071 49.6786L173.33 90.4198L174.744 91.834L176.158 93.2482L216.9 52.507L215.485 51.0928ZM174.744 91.834V93.834H232V91.834V89.834H174.744V91.834ZM232 91.834H230V140.167H232H234V91.834H232ZM232 140.167V138.167H174.06V140.167V142.167H232V140.167ZM174.06 140.167L172.645 141.581L213.728 182.664L215.143 181.25L216.557 179.836L175.474 138.753L174.06 140.167ZM215.143 181.25L213.728 179.836L179.552 214.013L180.966 215.427L182.38 216.841L216.557 182.664L215.143 181.25ZM180.966 215.427L182.38 214.013L141.581 173.214L140.167 174.628L138.753 176.042L179.552 216.841L180.966 215.427ZM140.167 174.628H138.167V232H140.167H142.167V174.628H140.167ZM140.167 232V230H91.833V232V234H140.167V232ZM91.833 232H93.833V174.745H91.833H89.833V232H91.833ZM91.833 174.745L90.4188 173.331L50.0223 213.727L51.4365 215.142L52.8507 216.556L93.2472 176.159L91.833 174.745ZM51.4365 215.142L52.8507 213.727L18.674 179.551L17.2598 180.965L15.8456 182.379L50.0223 216.556L51.4365 215.142ZM17.2598 180.965L18.674 182.379L59.4718 141.581L58.0576 140.167L56.6434 138.753L15.8456 179.551L17.2598 180.965ZM58.0576 140.167V138.167H0V140.167V142.167H58.0576V140.167ZM0 140.167H2V91.834H0H-2V140.167H0ZM0 91.834V93.834H57.373V91.834V89.834H0V91.834ZM57.373 91.834L58.7873 90.4198L18.3312 49.9637L16.917 51.3779L15.5028 52.7921L55.9588 93.2482L57.373 91.834ZM16.917 51.3779L18.3312 52.7921L52.508 18.6154L51.0938 17.2012L49.6795 15.787L15.5028 49.9637L16.917 51.3779ZM51.0938 17.2012L49.6795 18.6154L90.4188 59.3546L91.833 57.9404L93.2472 56.5262L52.508 15.787L51.0938 17.2012ZM91.833 57.9404H93.833V0H91.833H89.833V57.9404H91.833ZM91.833 0V2H140.167V0V-2H91.833V0ZM140.167 0H138.167V58.0576H140.167H142.167V0H140.167Z" fill="black" mask="url(#path-1-inside-1_202_160)"/>
    </svg>
  </div>
  <div data-svg-wrapper data-layer="Star 3" className="Star3 left-[1908px] top-[901px] absolute">
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M80.1709 20.7393C81.3527 41.6418 106.167 51.9202 121.783 37.9756L124.037 35.9619L122.024 38.2168C108.08 53.8328 118.358 78.6473 139.261 79.8291L142.284 80L139.261 80.1709C118.358 81.3527 108.08 106.167 122.024 121.783L124.037 124.037L121.783 122.024C106.167 108.08 81.3527 118.358 80.1709 139.261L80 142.284L79.8291 139.261C78.6473 118.358 53.8328 108.08 38.2168 122.024L35.9619 124.037L37.9756 121.783C51.9202 106.167 41.6418 81.3527 20.7393 80.1709L17.7148 80L20.7393 79.8291C41.6418 78.6473 51.9202 53.8328 37.9756 38.2168L35.9619 35.9619L38.2168 37.9756C53.8328 51.9202 78.6473 41.6418 79.8291 20.7393L80 17.7148L80.1709 20.7393Z" fill="#BEFF6C" stroke="black" stroke-width="2"/>
    </svg>
  </div>
</div>
```
---

> **Tài liệu liên quan:**
> - [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Token system 3 lớp đầy đủ
> - [`../asset/ICON_SYSTEM.md`](../asset/ICON_SYSTEM.md) — 1898 SVG icon library
> - [`../logic/draft/DRAFT_ANALYSIS.md`](../logic/draft/DRAFT_ANALYSIS.md) — Screen-by-screen analysis
> - [`../AXIOLEDGER_ROADMAP.md`](../AXIOLEDGER_ROADMAP.md) — Master project roadmap

---

*AXQ Component Inventory v1.0 · 201 components · 15 groups · iOS 375×812 · Work Sans*
