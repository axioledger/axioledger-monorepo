# Axioledger — Phân Tích Draft UI Kit (image 7–15)

> Nguồn tham khảo: **Cashie FinTech Mobile UI Kit** (AXQ)  
> Phân tích bởi: Bob · Ngày cập nhật: 2025  
> Mục đích: Chuẩn hóa AxioPass Design System từ kit tham khảo thực tế

---

## Mục Lục

1. [Tổng Quan Kit](#tổng-quan-kit)
2. [Color Palette — Xác Nhận Chính Thức](#color-palette--xác-nhận-chính-thức)
3. [Typography — Work Sans Confirmed](#typography--work-sans-confirmed)
4. [Icon System — 6 Styles](#icon-system--6-styles)
5. [UI Components Observed](#ui-components-observed)
6. [Screen List Đầy Đủ (AXQ Layer Panel)](#screen-list-đầy-đủ-AXQ-layer-panel)
7. [Navigation — 5-Tab Bottom Bar](#navigation--5-tab-bottom-bar)
8. [Screens Chi Tiết theo Zone](#screens-chi-tiết-theo-zone)
9. [Gap Analysis — Kit vs AXQ DS Hiện Tại](#gap-analysis--kit-vs-axq-ds-hiện-tại)
10. [Action Items](#action-items)

---

## Tổng Quan Kit

| Thông tin | Giá trị |
|---|---|
| **Tên kit** | Cashie FinTech Mobile UI Kit |
| **Platform** | iOS (375×812) |
| **Tổng screens** | 40+ iOS screens |
| **AXQ pages** | iOS - UI screens · Style guide · Icon set |
| **Font** | **Work Sans** (Google Fonts) — xác nhận |
| **Grid** | 8px dimension system (iOS guidelines) |
| **Style** | Neubrutal — bold outlines, flat colors, playful decorative elements |
| **Customization** | Fully customizable qua Design System |

### 6 Tính Năng Chính (image 7)
1. **iOS** — Designed for iOS 375×812
2. **Design system** — All color, typography styled; UI kit & Icon set componented
3. **Free font** — Work Sans (Google font) included
4. **Fully customizable** — All design changeable from design system
5. **Pixel perfect** — iOS guidelines, 8× dimension size
6. **Awesome layout** — All sections layouted, grouped, named

---

## Color Palette — Xác Nhận Chính Thức

> Source: image 8 — "Color palette · Styled to Brand, Info, Success, Warning, Error, Greyscale, White tones and between 100–900s"

### Brand Colors (9 màu)

| Tên trong Kit | Hex | AXQ Token | Trạng thái |
|---|---|---|---|
| **Dark** | `#000000` | `brand/black` | ✅ Đã có |
| **Grey** | `#EFEFEF` | `brand/grey` | ✅ Đã có |
| **Blue** | `#49DBC8` | `brand/teal` | ✅ Đã có (tên khác) |
| **Greeny** | `#BEFF6C` | `brand/green` | ✅ Đã có (tên khác) |
| **Yellow** | `#FFF172` | `brand/yellow` | ✅ Đã có |
| **Magenta** | `#FD9FDD` | `brand/pink` | ✅ Đã có (hex match) |
| **Violet** | `#AF96FB` | `brand/purple` | ✅ Đã có (tên khác) |
| **Orange** | `#FC7339` | `brand/orange` | ✅ Đã có |

> **Ghi chú tên:** Kit dùng "Blue/Greeny/Magenta/Violet" — AXQ DS dùng "teal/green/pink/purple". Cả 2 trỏ về cùng hex. Cần document mapping này cho dev handoff.

### AXQ Color Styles Structure (image 8 — panel phải)
```
Color styles:
├── White
├── Brand color
│   ├── Dark    (#000000)
│   ├── Grey    (#EFEFEF)
│   ├── Blue    (#49DBC8)
│   ├── Greeny  (#BEFF6C)
│   ├── Yellow  (#FFF172)
│   ├── Magenta (#FD9FDD)
│   ├── Violet  (#AF96FB)
│   └── Orange  (#FC7339)
├── Greyscale (100–900)
├── Error     (100–900)
├── Warning   (100–900)
├── Info      (100–900)
└── Success   (100–900)
```

**→ Mapping vào AXQ DS Collections:**
```
AXQ / Primitive / Color:
  white         = #FFFFFF
  black         = #000000
  brand/teal    = #49DBC8  [kit: "Blue"]
  brand/green   = #BEFF6C  [kit: "Greeny"]
  brand/yellow  = #FFF172  [kit: "Yellow"]
  brand/pink    = #FD9FDD  [kit: "Magenta"]
  brand/purple  = #AF96FB  [kit: "Violet"]
  brand/orange  = #FC7339  [kit: "Orange"]
  brand/grey    = #EFEFEF  [kit: "Grey"]
```

---

## Typography — Work Sans Confirmed

> Source: image 9 — "Font family · Work Sans (Google Font)"

**Xác nhận đầy đủ:** Work Sans là font chính thức cho toàn bộ AxioPass.

### Text Styles (image 9 + image 12 panel)
```
Text styles:
├── Headline   (H1 → H6)
├── Subtitle   (S1, S2)
├── Body       (B1, B2)
├── Button-AA  (Uppercase — AA accessibility)
├── Button-Aa  (Title case)
├── Caption
└── Other
```

**Mapping vào AXQ Typography table:** ✅ Đã có đầy đủ trong `DESIGN_SYSTEM.md` — không cần thay đổi.

---

## Icon System — 6 Styles

> Source: image 10 — "6000+ Icons set · Linear, Bold, Outline, Broken, Bulk, Two tone"

### Hiện trạng vs Kit tham khảo

| Style | Kit tham khảo | Hiện có trong `docs/asset/` |
|---|---|---|
| **Linear** | ✅ | ✅ 919 SVG |
| **Bold** | ✅ | ✅ 979 SVG |
| **Outline** | ✅ | ❌ chưa có |
| **Broken** | ✅ | ❌ chưa có |
| **Bulk** | ✅ | ❌ chưa có |
| **Two tone** | ✅ | ❌ chưa có |
| **Tổng** | 6000+ | **1898** (Bold + Linear) |

> **Kết luận:** Bộ hiện tại (1898 SVG) là **subset** của kit đầy đủ. Đủ cho Phase 1 (Auth + KYC). Phase 3–4 cần mở rộng thêm Outline (cho decorative) và Two-tone (cho Empty State illustrations).

### Icon Use Cases theo Style
| Style | Khi nào dùng trong AxioPass |
|---|---|
| **Bold** | Active tab, CTA button, error/success indicator |
| **Linear** | Inactive tab, secondary, helper text |
| **Outline** | *(Kế hoạch)* Card illustrations, decorative header |
| **Broken** | *(Kế hoạch)* Loading/skeleton placeholder |
| **Bulk** | *(Kế hoạch)* Large icons trong Empty State |
| **Two-tone** | *(Kế hoạch)* Brand illustrations, onboarding |

---

## UI Components Observed

> Source: image 11 — "UI kits · Fully auto layouted and componented kit in iOS"

### Components Đã Thấy

#### Toggle
- On state: teal/green fill (`#49DBC8`)
- Off state: grey fill
- Disabled: muted grey
- Shape: pill (radius/full = 9999px)

#### Button
- **Filled/Primary**: black bg (#000000), white text, pill radius (24px)
- **Ghost/Secondary**: white bg, black border, black text, pill radius (24px)
- **Close button**: black circle, X icon (white)

#### Crypto Chips (pill badges)
- Format: `[%] [TOKEN]` — ví dụ: `12.7% BTC`, `3.1% ETH`, `0.84% GLD`
- Black bg, white text, pill radius
- Colors: black (#000), teal (#49DBC8), light green (#BEFF6C)

#### Card Visual
- VISA card (green + pink abstract art, black accents)
- Flip animation → dark card side (card number, expiry, CVV)
- Dimensions: credit card ratio (85.6×54mm = ~343×216px at 4×)

#### Transaction List Row
- Icon (colored circle logo) + Name + Subtitle
- Amount (right, green for positive)
- Separator line

#### Bottom Navbar (5 tabs)
- **Home · Crypto · Card · Cashback · More**
- Active: bold icon + colored dot/indicator
- Inactive: linear icon + grey label

#### Tab Component (segmented)
- Pill shape tabs
- Active: dark fill, white text
- Inactive: transparent, grey text

---

## Screen List Đầy Đủ (AXQ Layer Panel)

> Source: image 12 — Layer panel trái của AXQ file

```
iOS - UI screens:
├── Splash screen v1           [Zone 1]
├── Splash screen v2           [Zone 1]
├── Onboarding v1              [Zone 1]
├── Onboarding v2              [Zone 1]
├── App language               [Zone 7]
├── Registration default       [Zone 1]
├── Registration filled        [Zone 1]
├── Confirm OTP default        [Zone 1]
├── Confirm OTP filled         [Zone 1]
├── Set PIN default            [Zone 1]
├── Setting PIN code           [Zone 1]
├── Enter PIN                  [Zone 1]
├── PIN is wrong               [Zone 1]
├── Home v1                    [Zone 3]
├── Card flipped               [Zone 4]
├── Home v2                    [Zone 3]
├── Transfer                   [Zone 6]
├── Transfer to                [Zone 6]
├── Transfer to Filled amount  [Zone 6]
├── Success                    [Zone 6]
├── Card                       [Zone 4]
├── Card scroll                [Zone 4]
├── Payments                   [Zone 6]
├── Home services              [Zone 6]
├── Search bill ID             [Zone 6]
├── Pay service debt           [Zone 6]
└── ... (+ các screens tiếp theo thấy trong thumbnails)
    ├── Add balance             [Zone 4]
    ├── Add balance filled      [Zone 4]
    ├── Top up                  [Zone 4]
    ├── Crypto splash           [Zone 5]
    ├── Crypto home             [Zone 5]
    ├── Crypto chart (BTC)      [Zone 5]
    ├── Swap                    [Zone 5]
    ├── Profile                 [Zone 7]
    ├── Edit Profile            [Zone 7]
    ├── Notifications           [Zone 7]
    ├── Notification detail     [Zone 7]
    ├── FAQ                     [Zone 7]
    ├── Settings                [Zone 7]
    ├── App language (settings) [Zone 7]
    └── Appearance              [Zone 7]
```

**Tổng đếm: ~40 screens** (khớp với "40+ iOS screens" trong kit description)

---

## Navigation — 5-Tab Bottom Bar

> Source: image 11 (bottom navbar component) + image 14 (screens)

### Cấu Trúc Tab Bar Thực Tế

| Tab | Icon | Trang |
|---|---|---|
| **Home** | `home` (bold/linear) | Wallet dashboard, balance, history |
| **Crypto** | `empty-wallet` hoặc chart icon | Crypto portfolio, chart |
| **Card** | `card` | Card center, card management |
| **Cashback** | `receipt` hoặc gift icon | Cashback overview, rewards |
| **More** | `more` (3 dots) | Profile, Settings, FAQ, Notifications |

> **Sửa lại từ tài liệu cũ:** `docs/architecture/views.md` và `DESIGN_SYSTEM.md` đang dùng "Profile" cho tab thứ 5, nhưng thực tế kit dùng "**More**" (overflow menu dẫn đến Profile/Settings).

---

## Screens Chi Tiết theo Zone

### Zone 1 — Onboarding & Auth (image 13)

| # | Screen | Nội dung quan sát được |
|---|---|---|
| 1 | Splash v1 | Pink bg (#FD9FDD), logo "Cashie" center, decorative shapes (star, diamond, sun) |
| 2 | Splash v2 | White bg, logo "Cashie" center |
| 3 | Onboarding 1 | "Get better with Banky", coin+globe 3D illustration, "Next" button |
| 4 | Onboarding 2 | Giống onboarding 1, thêm "English ▼" language picker |
| 5 | Onboarding 3 | "Get started" button đen (CTA chính) |
| 6 | Registration default | "+1" country code + phone input, numpad, "Continue" disabled |
| 7 | Registration filled | "+1 202 555 0105", "Continue" enabled (black) |
| 8 | Confirm OTP (empty) | 4 dot OTP, "Didn't get code? 1:48 Resend", "Confirm" disabled |
| 9 | Confirm OTP (filled) | 4 filled dots, "Confirm" enabled |
| 10 | Set PIN (empty) | 4 circles, numpad, "Forgot password?" link |
| 11 | Set PIN (filling) | 3 filled + 1 empty, digit 4 pressed |
| 12 | Enter PIN | 4 filled dots, full numpad |

**Key observations:**
- OTP: **4 digits** (không phải 6 như AxioPass spec) — cần điều chỉnh cho AxioPass dùng 6 digits
- PIN: **4 digits** trong kit — AxioPass có thể dùng 6 dots (đã documented)
- Numpad: dùng phone-style layout (1-2-3 / 4-5-6 / 7-8-9 / * 0 ⌫)
- "Forgot password?" hiển thị dưới PIN entry

### Zone 3 — Home & Dashboard (image 14)

| Screen | Nội dung |
|---|---|
| Home v1 | `$2500.70`, card flip (teal chip), BTC/ETH/SQX/GLD percentage chips, History list |
| Home v2 | Giống v1 + pink header background (`#FD9FDD`) |
| Home v3 (pink full) | `$2500.70`, 3 quick actions: **Top up · Transfer · Payments** |

**Crypto chips (pill badges):**
- `12.7% BTC` — black bg
- `3.1% ETH` — teal bg (#49DBC8)
- `0.84% GLD` — neon green (#BEFF6C)
- `↑ +$22.680` — positive trend chip

### Zone 4 — Card Management (image 14)

| Screen | Nội dung |
|---|---|
| Card | VISA green card, "$2500.70", "Ulvin Omarov", bottom action list |
| Card flipped | Dark bg: Card number `0823 4567 8900 2345`, EXPIRY `11/27`, CVV `234` |
| Card settings | Transfer money, Set Apple pay, Block card, Change PIN code, Security settings, Monthly limit, Send the extract |
| Add balance (default) | VISA card placeholder `0000 0000 0000 0000`, CVV, numpad |
| Add balance (filled) | Card `1234 5678 9012 3456`, EXPIRY 07/25, numpad |

### Zone 5 — Crypto (image 14, 15)

| Screen | Nội dung |
|---|---|
| Crypto splash | Purple bg, star illustrations, "Trade crypto, Earn money, Spend easily", "Start trade" |
| Crypto home | `$840.20`, `+3.9% (+$16.80)`, Receive/Send/Swap/Buy/Sell action row, token list |
| Crypto chart | `$38,049` BTC chart, line chart với D/W/M/6M/Y/All selector, wallet list (BTC $2.3876/+14.29%, Tether USD $0.3201, Solana $4.4980) |
| Swap | `2.00 ETH` ↔ `2679.62 USDT`, PIN-style numpad |

### Zone 6 — Transfer & Payments (image 14)

| Screen | Nội dung |
|---|---|
| Transfer | Search name/card, Recently sent list (Chris Hemston, Charlie Peter, Hey man, Jordan Miraz, Mina, Paul Julio, Mrs. Bahar, Mehran Omarov) |
| Transfer to (default) | Avatar "Mina", `$0`, Quick amounts: $5/$25/$50/$100, "Send" disabled |
| Transfer to (filled) | `$3000` (red "Exceeds $3500.75" warning), "Send" enabled |
| Success | Neon starburst illustration, "Congrats!!! Your transaction sent succesfully", "OK" |
| Payments | Category grid: Home services, E-commerce, Healthcare, Photo services, Insurance, Tickets, Transport, Online shopping, Education |
| Home services search | List: Pacific Gas, California Edison, Florida Light & Power, Consolidation Power Corp, Georgia Power, Dominion Energy, DTE Energy, Bisleri Water |
| Home service detail | "Pacific Gas & Electric", Current status: $26.00, "$0" input, "Send" |
| Bill result | "$48.50", "Send to card" button, history list below |

### Zone 7 — Profile, Settings & Support (image 15)

| Screen | Nội dung |
|---|---|
| Profile | Avatar (Ulvin Omarov), phone (+99451748S175), email, Tariffs, Notifications, FAQ, Settings, Log out |
| Edit Profile | Personal details: Name (Ulvin), Surname (Omarov), Email (error state — "Email will not be empty"), Phone (+41 566 978 800 24) |
| Notifications | New/Old sections, promotional items: "Bonus week - %20", "Buy 2, pay for 1", "Black Friday discounts coming", "Free delivery for first 3 orders", "New loyal card", "%10-30-50 on Gloria Jeans", "Don't miss this opportunity" |
| Notification detail | "Bonus week - %20" with image, body text |
| FAQ | Tab bar (All/Card/Refund/Crypto), accordion: "How to change mobile phone?", "I lost my card and phone", "The card damaged, what can I do?", "Where can I see card tariffs?", "Is there Apple pay support?", "Is there possibility to open card in other currencies?" |
| Settings | App language, Face ID (toggle), Push notifications (toggle off), Appearance, Download content, Email updates (toggle on) |
| App language | English ✓, French, Spanish, Chinese, Japanese, Azerbaijani, Russian |
| Appearance | System/Light/Dark selector (3-option segmented) |

---

## Gap Analysis — Kit vs AXQ DS Hiện Tại

### ✅ Đã chuẩn — không cần sửa
- Font: Work Sans — khớp
- Color palette: 9 brand colors — khớp hex
- Button: pill radius 24px, black primary — khớp
- Card radius: 16px — khớp
- Input radius: 12px — khớp

### ⚠️ Cần điều chỉnh / bổ sung

| Gap | Mô tả | Ưu tiên |
|---|---|---|
| **Tab 5 = "More"** | AXQ DS ghi "Profile" cho tab 5, kit dùng "More" (overflow) | High |
| **OTP: 4 digits trong kit** | AxioPass spec dùng 6 digits — phải giữ 6 (bảo mật cao hơn) | Ghi chú |
| **PIN: 4 circles trong kit** | AxioPass dùng 6 dots — phải giữ 6 | Ghi chú |
| **Numpad layout** | Kit dùng phone numpad (không phải full keyboard) | Medium |
| **Quick amounts chips** | $5/$25/$50/$100 trong Transfer to — thêm vào Amount Input screen | Medium |
| **Exceed limit warning** | Red warning khi nhập vượt hạn mức — cần component | Medium |
| **Icon styles 3–6** | Outline/Broken/Bulk/Two-tone chưa có — cần cho Phase 3+ | Low |
| **Cashback tab** | Kit có tab "Cashback" — AxioPass đang thiếu dedicated tab | High |
| **Notification center** | Separate screen với New/Old sections | Medium |
| **Language picker in Settings** | Multi-language list (6 ngôn ngữ) | Low |
| **Appearance toggle (3 options)** | System/Light/Dark — hiện tại chỉ có Light/Dark | Low |
| **Card art** | Abstract art (green + pink blob) on VISA card visual | Design |

### 🆕 Components mới phát hiện (cần build)

| Component | Zone | Priority |
|---|---|---|
| `CryptoChip` — pill badge với % và token symbol | Zone 3, 5 | High |
| `QuickAmountChip` — $5/$25/$50/$100 preset | Zone 6 | High |
| `ExceedLimitWarning` — red inline alert | Zone 6 | High |
| `TransactionSuccessScreen` — full-screen congrats | Zone 6 | High |
| `CardVisual` — 3D flip, abstract art | Zone 4 | High (existing) |
| `PaymentCategoryGrid` — icon grid layout | Zone 6 | Medium |
| `NotificationList` — New/Old grouped | Zone 7 | Medium |
| `FAQAccordion` — collapsible Q&A | Zone 7 | Medium |
| `AppearanceSelector` — 3-option segmented | Zone 7 | Low |

---

## Action Items

### Cần cập nhật ngay trong tài liệu

- [ ] **`DESIGN_SYSTEM.md`** — Thêm mapping tên Kit → AXQ token (Blue=teal, Greeny=green, Magenta=pink, Violet=purple)
- [ ] **`DESIGN_SYSTEM.md`** — Sửa Navbar tab 5 từ "Profile" → "**More**" (overflow tab)
- [ ] **`DESIGN_SYSTEM.md`** — Thêm component `CryptoChip` và `QuickAmountChip`
- [ ] **`ICON_SYSTEM.md`** — Ghi chú: kit full có 6000+/6 styles; hiện tại 1898/2 styles; roadmap cho 4 styles còn lại
- [ ] **`docs/architecture/views.md`** — Cập nhật `TAB_ICONS` mapping thêm `cashback` tab
- [ ] **Zone mapping** — Zone 7 bao gồm cả "More" tab: Profile, Settings, Notifications, FAQ, App Language, Appearance

### Không thay đổi (keep as-is)
- OTP: giữ 6 digits (bảo mật tốt hơn kit gốc 4 digits)
- PIN: giữ 6 dots (tăng cường bảo mật)
- Brand name: AxioPass (không phải Cashie)

---

> **Tài liệu liên quan:**
> - [`../ui/DESIGN_SYSTEM.md`](../ui/DESIGN_SYSTEM.md) — Token system đầy đủ
> - [`../asset/ICON_SYSTEM.md`](../asset/ICON_SYSTEM.md) — Icon library
> - [`../AXIOLEDGER_ROADMAP.md`](../AXIOLEDGER_ROADMAP.md) — Master roadmap
> - [`../../packages/html/README.md`](../../packages/html/README.md) — HTML components

---

*Phân tích từ draft images 7–15 · Cashie FinTech Mobile UI Kit · AxioPass Reference*
