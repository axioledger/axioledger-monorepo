# Axioledger Design System — Lộ Trình Toàn Dự Án

> Tài liệu tổng hợp: AXQ Variable Token Architecture · Figma Variable Roadmap · Axiopass UI Design Plan · **AXQ Icon System**
> Phiên bản: v2.1 · Font: Work Sans · Mô hình 3 lớp: **Primitive → Semantic → Component** · Icon: **1898 SVG (Bold + Linear)**

---

## Mục Lục

1. [Kiến Trúc 3 Tầng](#kiến-trúc-3-tầng)
2. [Tổng Quan Collections](#tổng-quan-collections)
3. [BƯỚC 1 — Primitive (Giá trị gốc)](#bước-1--primitive-giá-trị-gốc)
   - [Primitive Color](#primitive-color)
   - [Primitive Spacing, Radius & Font Size](#primitive-spacing-radius--font-size)
4. [BƯỚC 2 — Semantic (Ý nghĩa sử dụng)](#bước-2--semantic-ý-nghĩa-sử-dụng)
   - [Semantic Color Tokens](#semantic-color-tokens)
   - [Semantic Radius & Spacing](#semantic-radius--spacing)
   - [Dark Mode Overrides](#dark-mode-overrides)
5. [BƯỚC 3 — Component Tokens](#bước-3--component-tokens)
   - [Button](#button)
   - [Input](#input)
   - [Card, Badge & Chip](#card-badge--chip)
   - [Toggle, Navbar, Modal, Avatar, Tooltip](#toggle-navbar-modal-avatar-tooltip)
6. [BƯỚC 4 — Typography — Work Sans](#bước-4--typography--work-sans)
7. [CSS Custom Properties Output](#css-custom-properties-output)
8. [Figma JSON Token Export](#figma-json-token-export)
9. [Naming Convention & Do/Don't Rules](#naming-convention--dodont-rules)
10. [Quy Trình Thiết Lập trong Figma](#quy-trình-thiết-lập-trong-figma)
11. [BƯỚC 5 — Icon System](#bước-5--icon-system)
12. [Axiopass Wallet — UI Design Plan](#axiopass-wallet--ui-design-plan)
    - [Lộ Trình 4 Phases](#lộ-trình-4-phases)
    - [Zone 1 — Onboarding & Authentication](#zone-1--onboarding--authentication)
    - [Zone 2 — KYC & Compliance](#zone-2--kyc--compliance)
    - [Zone 3 — Home & Dashboard](#zone-3--home--dashboard)
    - [Zone 4 — Card Management](#zone-4--card-management)
    - [Zone 5 — Crypto & Web3](#zone-5--crypto--web3)
    - [Zone 6 — Transfer & Payments](#zone-6--transfer--payments)
    - [Zone 7 — Profile, Settings & Support](#zone-7--profile-settings--support)
    - [Zone 8 — System States & Edge Cases](#zone-8--system-states--edge-cases)
    - [Component Inventory](#component-inventory)
    - [Deliverables](#deliverables)

---

## Kiến Trúc 3 Tầng

```
┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│       LAYER 1        │  -->  │       LAYER 2        │  -->  │       LAYER 3        │
│      Primitive       │       │       Semantic       │       │      Component       │
│                      │       │                      │       │                      │
│  Giá trị gốc,        │       │  Ý nghĩa sử dụng UI  │       │  Token linh kiện     │
│  tuyệt đối           │       │  — ngữ cảnh rõ ràng  │       │  cụ thể              │
│                      │       │                      │       │                      │
│  #49DBC8             │  -->  │  bg/brand            │  -->  │  button/primary-bg   │
│  greyscale/900       │  -->  │  text/primary        │  -->  │  input/text          │
│  radius/2xl          │  -->  │  radius/button       │  -->  │  button/radius       │
└──────────────────────┘       └──────────────────────┘       └──────────────────────┘
```

**Nguyên tắc vàng:** Component tokens **không bao giờ** trỏ thẳng về Primitive. Mọi thay đổi theme chỉ cần override tại Layer 2.

---

## Tổng Quan Collections

### Layer 1 — Primitive Collections

| Collection | Mode | Nội dung |
|---|---|---|
| `AXQ / Primitive / Color` | Value | white, black · greyscale/100–900 · brand × 7 · info/100–900 · success/100–900 · warning/100–900 · error/100–900 |
| `AXQ / Primitive / Spacing` | Value | space/0 → space/128 (18 steps) |
| `AXQ / Primitive / Radius` | Value | none, xs, sm, md, lg, xl, 2xl, 3xl, full |
| `AXQ / Primitive / Font Size` | Value | 10, 12, 14, 16, 20, 24, 34, 48, 60, 96 |

### Layer 2 — Semantic Collections

| Collection | Mode | Nội dung |
|---|---|---|
| `AXQ / Semantic / Color` | Light / **Dark** | bg/ · surface/ · text/ · icon/ · border/ · status/ · accent/ |
| `AXQ / Semantic / Spacing+Radius+FontSize` | Default | spacing/ · inset/ · gap/ · radius/ · type/ |

### Layer 3 — Component Collection

| Collection | Mode | Scope |
|---|---|---|
| `AXQ / Component` | Default | button/ · input/ · card/ · badge/ · chip/ · toggle/ · navbar/ · modal/ · avatar/ · tooltip/ |

---

## BƯỚC 1 — Primitive (Giá trị gốc)

> Collection này chứa các giá trị thô, **tuyệt đối không** trỏ hay liên kết đến mục đích sử dụng.

### Primitive Color

#### Greyscale

| Token | Hex | Mô tả | Dùng cho |
|---|---|---|---|
| `white` | `#FFFFFF` | Pure White | Background, inverse text |
| `black` | `#000000` | Brand Black | Brand primary, text brand |
| `greyscale/100` | `#EDF1F7` | Lightest surface | Border subtle, bg tertiary hover |
| `greyscale/200` | `#E4E9F2` | Disabled background | Disabled state, input border |
| `greyscale/300` | `#C5CEE0` | Disabled text | Placeholder, disabled label |
| `greyscale/400` | `#8F9BB3` | Tertiary text — Disable / Secondary | Placeholder active, icon inactive |
| `greyscale/500` | `#2E3A59` | Secondary text | Body secondary, icon secondary |
| `greyscale/600` | `#222B45` | Dark | Dark mode base |
| `greyscale/700` | `#192038` | Darker | Dark mode surface |
| `greyscale/800` | `#151A30` | Very dark | Dark mode elevated |
| `greyscale/900` | `#101426` | Primary text (darkest) | Body text, heading |

#### Brand Colors — AXQ Accent Palette

> **Kit name mapping** (Cashie FinTech UI Kit → AXQ DS token): Blue=`teal` · Greeny=`green` · Magenta=`pink` · Violet=`purple`

| AXQ Token | Hex | Kit Name | Role | Contrast pairing |
|---|---|---|---|---|
| `brand/teal` | `#49DBC8` | "Blue" | Accent Teal | Dark text on light bg |
| `brand/green` | `#BEFF6C` | "Greeny" | Accent Green | Dark text on light bg |
| `brand/orange` | `#FC7339` | "Orange" | Accent Orange | White text on dark bg |
| `brand/pink` | `#FD9FDD` | "Magenta" | Accent Pink | Dark text on light bg |
| `brand/purple` | `#AF96FB` | "Violet" | Accent Purple | Dark text on light bg |
| `brand/yellow` | `#FFF172` | "Yellow" | Accent Yellow | Dark text on light bg |
| `brand/grey` | `#EFEFEF` | "Grey" | Accent Grey | Dark text |

#### System Colors — Thang đầy đủ 100–900

| Token | Hex | Dùng cho |
|---|---|---|
| `blue/500` / `info/500` | `#0095FF` | **Info** — button, icon, border focus |
| `green/500` / `success/500` | `#00D68F` | **Success** — toggle active, button success |
| `yellow/500` / `warning/500` | `#FFAA00` | **Warning** — button warning |
| `red/500` / `error/500` | `#FF3D71` | **Error** — button danger, input error |

**Info thang đầy đủ:**

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `info/100` | `#F2F8FF` | | `info/600` | `#006FD6` |
| `info/200` | `#C7E2FF` | | `info/700` | `#0057C2` |
| `info/300` | `#94CBFF` | | `info/800` | `#003F8F` |
| `info/400` | `#42AAFF` | | `info/900` | `#002885` |
| `info/500` | `#0095FF` | | | |

**Success, Warning, Error** — cấu trúc tương tự: `/100` (bg nhạt) → `/500` (default) → `/900` (darkest)

---

### Primitive Spacing, Radius & Font Size

#### Radius Scale

| Token | Value | Dùng cho |
|---|---|---|
| `radius/none` | 0px | Square elements, table cells |
| `radius/xs` | 2px | Tags, tiny badges |
| `radius/sm` | 4px | Badges, tooltips, small chips |
| `radius/md` | 8px | Dropdowns, popovers, small cards |
| `radius/lg` | 12px | Inputs, text fields |
| `radius/xl` | 16px | Cards, panels |
| `radius/2xl` / `radius/pill` | **24px** | **Buttons**, modals |
| `radius/3xl` | 32px | Large modals, bottom sheets |
| `radius/full` | 9999px | Pills, chips, avatars, toggles |

#### Font Size Scale

| Token | Value | Semantic | Dùng cho |
|---|---|---|---|
| `size/10` / `fontSize/10` | 10px | Overline | Label nhỏ, metadata |
| `size/12` / `fontSize/12` | 12px | Caption | Caption, helper text, badge |
| `size/14` / `fontSize/14` | 14px | Body-sm | Body text nhỏ, label |
| `size/16` / `fontSize/16` | 16px | Body | Body text chính |
| `size/20` / `fontSize/20` | 20px | H6 | Subheading, card title |
| `size/24` / `fontSize/24` | 24px | H5 | Section heading |
| `size/34` / `fontSize/34` | 34px | H4 | Page section title |
| `size/48` / `fontSize/48` | 48px | H3 | Major section |
| `size/60` / `fontSize/60` | 60px | H2 | Hero subheading |
| `size/96` / `fontSize/96` | 96px | H1 | Hero heading |

#### Font Weight

| Token | Value |
|---|---|
| `weight/regular` | 400 |
| `weight/medium` | 500 |
| `weight/semibold` | 600 |

#### Spacing Scale — `space/*`

| Token | Value | Gợi ý dùng |
|---|---|---|
| `space/0` | 0px | Reset |
| `space/2` | 2px | Icon gap nhỏ nhất |
| `space/4` | 4px | Inline gap, badge padding |
| `space/6` | 6px | Icon-text gap nhỏ |
| `space/8` | 8px | Button padding-y `spacing/button-padding-y`, gap trong row |
| `space/12` | 12px | Card gap, list gap |
| `space/16` | 16px | Button padding-x, input padding |
| `space/20` | 20px | Section gap nhỏ |
| `space/24` | 24px | Card padding, form gap |
| `space/32` | 32px | Section padding |
| `space/40` | 40px | Page section gap |
| `space/48` | 48px | Hero padding |
| `space/64` | 64px | Page padding lớn |
| `space/80` | 80px | Section top/bottom |
| `space/96` | 96px | Hero section |
| `space/128` | 128px | Full-bleed spacing |

> **Button-specific primitives:** `spacing/button-padding-y` = 14px · `spacing/button-padding-x` = 77px · `icon/size/standard` = 20px

---

## BƯỚC 2 — Semantic (Ý nghĩa sử dụng)

> Chuyển đổi các giá trị thô sang mục đích sử dụng UI cụ thể. Hỗ trợ Light/Dark Mode.

### Semantic Color Tokens

#### Text

| Semantic Token | Alias → Primitive | Hex | Dùng cho |
|---|---|---|---|
| `color/text/primary` | `greyscale/900` | `#101426` | Body text, heading chính |
| `color/text/secondary` | `greyscale/500` | `#2E3A59` | Subtext, description, label |
| `color/text/tertiary` | `greyscale/400` | `#8F9BB3` | Placeholder, helper text, metadata |
| `color/text/disabled` | `greyscale/300` | `#C5CEE0` | Trạng thái disabled |
| `color/text/inverse` | `white` | `#FFFFFF` | Text trên bg tối (button primary) |
| `color/text/brand` | `black` | `#000000` | Logo text, brand emphasis |
| `color/text/link` | `info/700` | `#0057C2` | Link, anchor text |
| `color/text/on-color` | `white` | `#FFFFFF` | Text trên bg màu status |

#### Background & Surface

| Semantic Token | Alias → Primitive | Hex | Dùng cho |
|---|---|---|---|
| `color/bg/surface` / `color/bg/primary` | `white` | `#FFFFFF` | Trang chính, panel nền |
| `color/bg/secondary` | `greyscale/100` | `#EDF1F7` | Sidebar, nền phụ |
| `color/bg/tertiary` | `greyscale/200` | `#E4E9F2` | Toggle inactive, skeleton |
| `color/bg/inverse` | `greyscale/900` | `#101426` | Tooltip, dark overlay |
| `color/bg/brand` | `black` | `#000000` | Button primary, header brand |
| `color/bg/disabled` | `greyscale/200` | `#E4E9F2` | Input disabled, button disabled |

#### Status

| Semantic Token | Alias → Primitive | Hex | Dùng cho |
|---|---|---|---|
| `color/status/info` | `blue/500` / `info/500` | `#0095FF` | Icon, button, indicator info |
| `color/status/success` | `green/500` / `success/500` | `#00D68F` | Toggle active, button success |
| `color/status/warning` | `yellow/500` / `warning/500` | `#FFAA00` | Button warning, indicator |
| `color/status/error` | `red/500` / `error/500` | `#FF3D71` | Button danger, input error |

### Semantic Radius & Spacing

#### Semantic Radius

| Semantic Token | Value | Alias → Primitive | Dùng cho |
|---|---|---|---|
| `radius/button` | 24px | `radius/2xl` | Button, pill CTA |
| `radius/input` | 12px | `radius/lg` | Input, textarea, select |
| `radius/card` | 16px | `radius/xl` | Card, panel |
| `radius/modal` | 24px | `radius/2xl` | Modal, drawer, bottom sheet |
| `radius/chip` | 9999px | `radius/full` | Chip, tag |
| `radius/avatar` | 9999px | `radius/full` | Avatar |
| `radius/badge` | 4px | `radius/sm` | Badge nhỏ |
| `radius/tooltip` | 8px | `radius/md` | Tooltip, popover |
| `radius/dropdown` | 8px | `radius/md` | Dropdown menu |

#### Inset, Gap & Spacing

| Semantic Token | Value | Alias → Primitive |
|---|---|---|
| `inset/xs` | 4px | `space/4` |
| `inset/sm` | 8px | `space/8` |
| `inset/md` | 16px | `space/16` |
| `inset/lg` | 24px | `space/24` |
| `inset/xl` | 32px | `space/32` |
| `gap/xs` | 4px | `space/4` |
| `gap/sm` | 8px | `space/8` |
| `gap/md` | 12px | `space/12` |
| `gap/lg` | 16px | `space/16` |
| `gap/xl` | 24px | `space/24` |
| `spacing/xs` | 8px | `space/8` |
| `spacing/sm` | 12px | `space/12` |
| `spacing/md` | 16px | `space/16` |
| `spacing/lg` | 24px | `space/24` |
| `spacing/xl` | 32px | `space/32` |
| `spacing/2xl` | 40px | `space/40` |
| `spacing/3xl` | 64px | `space/64` |

### Dark Mode Overrides

> Chỉ override tại **`AXQ / Semantic / Color`** mode **Dark** — tất cả Component tokens tự thích nghi.

| Semantic Token | Light | Dark |
|---|---|---|
| `text/primary` | `#101426` | `#F4F5F7` |
| `text/secondary` | `#2E3A59` | `#B0B5C1` |
| `text/tertiary` | `#8F9BB3` | `#757D8F` |
| `text/disabled` | `#C5CEE0` | `#373D49` |
| `text/inverse` | `#FFFFFF` | `#1A1A1A` |
| `text/brand` | `#000000` | `#FFFFFF` |
| `bg/primary` | `#FFFFFF` | `#121318` |
| `bg/secondary` | `#EDF1F7` | `#1A1C23` |
| `bg/tertiary` | `#E4E9F2` | `#21242D` |
| `bg/brand` | `#000000` | `#FFFFFF` |
| `bg/disabled` | `#E4E9F2` | `#2B2E38` |
| `surface/default` | `#FFFFFF` | `#1A1C23` |
| `surface/raised` | `#FFFFFF` | `#21242D` |
| `surface/sunken` | `#EDF1F7` | `#121318` |
| `border/default` | `#E4E9F2` | `#2B2E38` |
| `border/subtle` | `#EDF1F7` | `#21242D` |
| `border/strong` | `#8F9BB3` | `#373D49` |
| `icon/primary` | `#101426` | `#F4F5F7` |
| `icon/secondary` | `#2E3A59` | `#B0B5C1` |
| `icon/brand` | `#000000` | `#FFFFFF` |

---

## BƯỚC 3 — Component Tokens

### Button

#### Layout & Structure

| Token | Value | Alias → Semantic |
|---|---|---|
| `button/radius` | 24px | `Semantic/radius/button` → `Primitive/radius/pill` |
| `button/padding/top-bottom` | 14px | `Primitive/spacing/button-padding-y` |
| `button/padding/left-right` | 77px | `Primitive/spacing/button-padding-x` |
| `button/icon/size` | 20px | `Primitive/icon/size/standard` |
| `button/padding-x` | 16px | `inset/md` |
| `button/padding-y` | 8px | `inset/sm` |
| `button/gap` | 8px | `gap/sm` |
| `button/font-size` | 16px | `type/body` |

#### Button Fill Colors (Nền Nút đặc)

| Token | Value | Alias → Primitive/Semantic |
|---|---|---|
| `button/filled/bg/brand` | `#000000` | `Primitive/greyscale/900` |
| `button/filled/bg/dark` | `#222B45` | `Primitive/greyscale/600` |
| `button/filled/bg/disabled` | `#8F9BB3` | `Primitive/greyscale/400` |
| `button/filled/bg/white` | `#FFFFFF` | `Primitive/greyscale/100` |
| `button/filled/bg/info` | `#0095FF` | `Semantic/color/status/info` |
| `button/filled/bg/success` | `#00D68F` | `Semantic/color/status/success` |
| `button/filled/bg/warning` | `#FFAA00` | `Semantic/color/status/warning` |
| `button/filled/bg/error` | `#FF3D71` | `Semantic/color/status/error` |

#### Button Text & Border

| Token | Value | Alias → Semantic |
|---|---|---|
| `button/filled/text/default` | `#FFFFFF` | `Semantic/color/text/inverse` |
| `button/filled/text/white-state` | `#222B45` | `Semantic/color/text/primary` |
| `button/outlined/bg` | `#FFFFFF` | `Primitive/greyscale/100` |
| `button/outlined/border/info` | `#0095FF` | `Semantic/color/status/info` |
| `button/outlined/border/success` | `#00D68F` | `Semantic/color/status/success` |
| `button/outlined/border/warning` | `#FFAA00` | `Semantic/color/status/warning` |
| `button/outlined/border/error` | `#FF3D71` | `Semantic/color/status/error` |
| `button/primary-bg` | `#000000` | `bg/brand` |
| `button/primary-text` | `#FFFFFF` | `text/inverse` |
| `button/disabled-bg` | `#E4E9F2` | `bg/disabled` |
| `button/disabled-text` | `#C5CEE0` | `text/disabled` |
| `button/ghost-bg` | `#FFFFFF` | `bg/primary` |
| `button/ghost-border` | `#E4E9F2` | `border/default` |
| `button/ghost-border-hover` | `#8F9BB3` | `border/strong` |

### Input

| Token | Value | Alias → Semantic | Trạng thái |
|---|---|---|---|
| `input/bg` | `#FFFFFF` | `surface/default` | default |
| `input/text` | `#101426` | `text/primary` | default |
| `input/placeholder` | `#8F9BB3` | `text/tertiary` | default |
| `input/border` | `#E4E9F2` | `border/default` | default |
| `input/border-hover` | `#8F9BB3` | `border/strong` | hover |
| `input/border-focus` | `#0095FF` | `border/focus` | focus |
| `input/border-error` | `#FF3D71` | `status/error-default` | error |
| `input/border-disabled` | `#E4E9F2` | `border/disabled` | disabled |
| `input/bg-disabled` | `#E4E9F2` | `bg/disabled` | disabled |
| `input/text-disabled` | `#C5CEE0` | `text/disabled` | disabled |
| `input/label` | `#2E3A59` | `text/secondary` | default |
| `input/helper-text` | `#8F9BB3` | `text/tertiary` | default |
| `input/error-text` | `#B81D5B` | `status/error-text` | error |
| `input/padding-x` | 16px | `inset/md` | — |
| `input/padding-y` | 8px | `inset/sm` | — |
| `input/radius` | 12px | `radius/input` | — |
| `input/font-size` | 16px | `type/body` | — |
| `input/label-size` | 12px | `type/caption` | — |

### Card, Badge & Chip

#### Card

| Token | Value | Alias → Semantic |
|---|---|---|
| `card/bg` | `#FFFFFF` | `surface/default` |
| `card/bg-hover` | `#EDF1F7` | `surface/overlay` |
| `card/border` | `#EDF1F7` | `border/subtle` |
| `card/title` | `#101426` | `text/primary` |
| `card/description` | `#2E3A59` | `text/secondary` |
| `card/metadata` | `#8F9BB3` | `text/tertiary` |
| `card/padding` | 24px | `inset/lg` |
| `card/gap` | 12px | `gap/md` |
| `card/radius` | 16px | `radius/card` |

#### Badge & Chip

| Token | Value | Alias → Semantic |
|---|---|---|
| `badge/info-bg` | `#F2F8FF` | `status/info-bg` |
| `badge/info-text` | `#0057C2` | `status/info-text` |
| `badge/success-bg` | `#F0FFF5` | `status/success-bg` |
| `badge/success-text` | `#00997A` | `status/success-text` |
| `badge/warning-bg` | `#FFFDF2` | `status/warning-bg` |
| `badge/warning-text` | `#B86E00` | `status/warning-text` |
| `badge/error-bg` | `#FFF2F2` | `status/error-bg` |
| `badge/error-text` | `#B81D5B` | `status/error-text` |
| `badge/radius` | 4px | `radius/badge` |
| `badge/font-size` | 12px | `type/caption` |
| `badge/padding-x` | 8px | `gap/sm` |
| `badge/padding-y` | 4px | `gap/xs` |
| `chip/bg` | `#EDF1F7` | `bg/secondary` |
| `chip/bg-active` | `#000000` | `bg/brand` |
| `chip/text` | `#101426` | `text/primary` |
| `chip/text-active` | `#FFFFFF` | `text/inverse` |
| `chip/border` | `#E4E9F2` | `border/default` |
| `chip/radius` | 9999px | `radius/chip` |
| `chip/font-size` | 14px | `type/body-sm` |

### Toggle, Navbar, Modal, Avatar, Tooltip

#### Toggle

| Token | Value | Alias → Semantic | Trạng thái |
|---|---|---|---|
| `toggle/active-bg` | `#00D68F` | `status/success-default` | on |
| `toggle/inactive-bg` | `#E4E9F2` | `bg/tertiary` | off |
| `toggle/thumb` | `#FFFFFF` | `bg/primary` | both |
| `toggle/disabled-bg` | `#E4E9F2` | `bg/disabled` | disabled |
| `toggle/focus-ring` | `#0095FF` | `border/focus` | focus |

#### Navbar

| Token | Value | Alias → Semantic |
|---|---|---|
| `navbar/bg` | `#FFFFFF` | `surface/default` |
| `navbar/border` | `#EDF1F7` | `border/subtle` |
| `navbar/icon-active` | `#000000` | `icon/brand` |
| `navbar/icon-inactive` | `#2E3A59` | `icon/secondary` |
| `navbar/label-active` | `#000000` | `text/brand` |
| `navbar/label-inactive` | `#2E3A59` | `text/secondary` |
| `navbar/indicator-bg` | `#000000` | `bg/brand` |
| `navbar/indicator-text` | `#FFFFFF` | `text/inverse` |
| `navbar/height` | 64px | `spacing/3xl` |

> **5-Tab Structure** (from Cashie kit reference):
> Tab 1: **Home** · Tab 2: **Crypto** · Tab 3: **Card** · Tab 4: **Cashback** · Tab 5: **More** (overflow → Profile/Settings/FAQ)

#### Modal

| Token | Value | Alias → Semantic |
|---|---|---|
| `modal/bg` | `#FFFFFF` | `surface/default` |
| `modal/overlay` | `rgba(16,20,38,0.6)` | `bg/inverse` @ 60% |
| `modal/border` | `#E4E9F2` | `border/default` |
| `modal/title` | `#101426` | `text/primary` |
| `modal/description` | `#2E3A59` | `text/secondary` |
| `modal/close-icon` | `#8F9BB3` | `icon/tertiary` |
| `modal/padding` | 32px | `inset/xl` |
| `modal/gap` | 16px | `gap/lg` |
| `modal/radius` | 24px | `radius/modal` |

#### Avatar

| Token | Value | Alias → Semantic |
|---|---|---|
| `avatar/bg-default` | `#EDF1F7` | `bg/secondary` |
| `avatar/text-default` | `#2E3A59` | `text/secondary` |
| `avatar/border` | `#FFFFFF` | `bg/primary` |
| `avatar/border-ring` | `#000000` | `bg/brand` |
| `avatar/radius` | 9999px | `radius/avatar` |
| `avatar/size-xs` | 24px | — |
| `avatar/size-sm` | 32px | — |
| `avatar/size-md` | 40px | — |
| `avatar/size-lg` | 56px | — |
| `avatar/size-xl` | 80px | — |

#### Tooltip

| Token | Value | Alias → Semantic |
|---|---|---|
| `tooltip/bg` | `#101426` | `bg/inverse` |
| `tooltip/text` | `#FFFFFF` | `text/inverse` |
| `tooltip/radius` | 8px | `radius/tooltip` |
| `tooltip/padding-x` | 12px | `gap/md` |
| `tooltip/padding-y` | 6px | `gap/xs` |
| `tooltip/font-size` | 12px | `type/caption` |
| `tooltip/arrow-size` | 6px | — |

---

## BƯỚC 4 — Typography — Work Sans

> Font Family: **Work Sans** · Google Fonts · Weights: 400 Regular / 500 Medium / 600 Semibold / 700 Bold

| Style Name | Size | Token | Weight | Line Height | Letter Spacing | Transform |
|---|---|---|---|---|---|---|
| **Headline / H1** | 96px | `size/96` / `type/h1` | 400 / 500 / 700 | 1.1 | -2px | Default |
| **Headline / H2** | 60px | `size/60` / `type/h2` | 400 / 500 / 700 | 1.15 | -1px | Default |
| **Headline / H3** | 48px | `size/48` / `type/h3` | 400 / 500 / 700 | 1.2 | -0.5px | Default |
| **Headline / H4** | 34px | `size/34` / `type/h4` | 400 / 500 / 700 | 1.25 | -0.25px | Default |
| **Headline / H5** | 24px | `size/24` / `type/h5` | 400 / 500 / 600 | 1.3 | 0 | Default |
| **Headline / H6** | 20px | `size/20` / `type/h6` | 400 / 500 / 600 | 1.4 | 0 | Default |
| **Subtitle / S1** | 16px | `size/16` | 400 / 500 | 1.6 | 0 | Default |
| **Subtitle / S2** | 14px | `size/14` | 400 / 500 | 1.6 | 0 | Default |
| **Body / B1 / Default** | 16px | `type/body` | 400 / 500 | 1.6 | 0 | Default |
| **Body / B2 / Small** | 14px | `type/body-sm` | 400 / 500 | 1.6 | 0 | Default |
| **Caption** | 12px | `type/caption` | 400 / 500 | 1.5 | 0.1px | Default |
| **Overline** | 10px | `type/overline` | 400 | 1.4 | 1.5px | **UPPERCASE** |
| **Button / Giant** | 20px | `size/20` / `type/h6` | 500 | 1.4 | 0 | **UPPERCASE** |
| **Button / Large** | 16px | `size/16` / `type/body` | 500 | 1.6 | 0 | **UPPERCASE** |
| **Button / Medium** | 14px | `size/14` / `type/body-sm` | 500 | 1.6 | 0 | **UPPERCASE** |
| **Button / Small** | 12px | `size/12` / `type/caption` | 500 | 1.5 | 0 | **UPPERCASE** |

---

## CSS Custom Properties Output

```css
/* ══════════════════════════════════════════════════
   AXQ Design System — CSS Custom Properties
   Auto-generated from Variable Token System v2.0
   ══════════════════════════════════════════════════ */

/* ── Primitive: Color ──────────────────────────── */
:root {
  --axq-white: #FFFFFF;
  --axq-black: #000000;
  --axq-grey-100: #EDF1F7;
  --axq-grey-200: #E4E9F2;
  --axq-grey-300: #C5CEE0;
  --axq-grey-400: #8F9BB3;
  --axq-grey-500: #2E3A59;
  --axq-grey-600: #222B45;
  --axq-grey-700: #192038;
  --axq-grey-800: #151A30;
  --axq-grey-900: #101426;

  --axq-brand-teal:   #49DBC8;
  --axq-brand-green:  #BEFF6C;
  --axq-brand-orange: #FC7339;
  --axq-brand-pink:   #FD9FDD;
  --axq-brand-purple: #AF96FB;
  --axq-brand-yellow: #FFF172;
  --axq-brand-grey:   #EFEFEF;

  --axq-info-100: #F2F8FF;  --axq-info-500: #0095FF;  --axq-info-700: #0057C2;
  --axq-success-100: #F0FFF5; --axq-success-500: #00D68F; --axq-success-700: #00997A;
  --axq-warning-100: #FFFDF2; --axq-warning-500: #FFAA00; --axq-warning-700: #B86E00;
  --axq-error-100: #FFF2F2;  --axq-error-500: #FF3D71;  --axq-error-700: #B81D5B;
}

/* ── Primitive: Spacing ────────────────────────── */
:root {
  --axq-space-0: 0px;   --axq-space-2: 2px;   --axq-space-4: 4px;
  --axq-space-6: 6px;   --axq-space-8: 8px;   --axq-space-12: 12px;
  --axq-space-16: 16px; --axq-space-20: 20px; --axq-space-24: 24px;
  --axq-space-32: 32px; --axq-space-40: 40px; --axq-space-48: 48px;
  --axq-space-64: 64px; --axq-space-80: 80px; --axq-space-96: 96px;
  --axq-space-128: 128px;
}

/* ── Primitive: Radius ─────────────────────────── */
:root {
  --axq-radius-none: 0px;    --axq-radius-xs:   2px;
  --axq-radius-sm:   4px;    --axq-radius-md:   8px;
  --axq-radius-lg:   12px;   --axq-radius-xl:   16px;
  --axq-radius-2xl:  24px;   --axq-radius-3xl:  32px;
  --axq-radius-full: 9999px;
}

/* ── Semantic: Color — Light Mode ─────────────── */
:root, [data-theme="light"] {
  --axq-text-primary:   var(--axq-grey-900);
  --axq-text-secondary: var(--axq-grey-500);
  --axq-text-tertiary:  var(--axq-grey-400);
  --axq-text-disabled:  var(--axq-grey-300);
  --axq-text-inverse:   var(--axq-white);
  --axq-text-brand:     var(--axq-black);
  --axq-text-link:      var(--axq-info-700);

  --axq-bg-primary:     var(--axq-white);
  --axq-bg-secondary:   var(--axq-grey-100);
  --axq-bg-tertiary:    var(--axq-grey-200);
  --axq-bg-inverse:     var(--axq-grey-900);
  --axq-bg-brand:       var(--axq-black);
  --axq-bg-disabled:    var(--axq-grey-200);

  --axq-surface-default: var(--axq-white);
  --axq-surface-raised:  var(--axq-white);
  --axq-surface-sunken:  var(--axq-grey-100);

  --axq-border-default:  var(--axq-grey-200);
  --axq-border-subtle:   var(--axq-grey-100);
  --axq-border-strong:   var(--axq-grey-400);
  --axq-border-disabled: var(--axq-grey-200);
  --axq-border-focus:    var(--axq-info-500);

  --axq-icon-primary:    var(--axq-grey-900);
  --axq-icon-secondary:  var(--axq-grey-500);
  --axq-icon-tertiary:   var(--axq-grey-400);
  --axq-icon-disabled:   var(--axq-grey-300);
  --axq-icon-inverse:    var(--axq-white);
  --axq-icon-brand:      var(--axq-black);

  --axq-radius-button:   var(--axq-radius-2xl);
  --axq-radius-input:    var(--axq-radius-lg);
  --axq-radius-card:     var(--axq-radius-xl);
  --axq-radius-modal:    var(--axq-radius-2xl);
  --axq-radius-chip:     var(--axq-radius-full);
  --axq-radius-avatar:   var(--axq-radius-full);
  --axq-radius-badge:    var(--axq-radius-sm);
  --axq-radius-tooltip:  var(--axq-radius-md);
}

/* ── Semantic: Color — Dark Mode ──────────────── */
[data-theme="dark"] {
  --axq-text-primary:    #F4F5F7;
  --axq-text-secondary:  #B0B5C1;
  --axq-text-tertiary:   #757D8F;
  --axq-text-disabled:   #373D49;
  --axq-text-inverse:    #1A1A1A;
  --axq-text-brand:      #FFFFFF;

  --axq-bg-primary:      #121318;
  --axq-bg-secondary:    #1A1C23;
  --axq-bg-tertiary:     #21242D;
  --axq-bg-inverse:      #F4F5F7;
  --axq-bg-brand:        #FFFFFF;
  --axq-bg-disabled:     #2B2E38;

  --axq-surface-default: #1A1C23;
  --axq-surface-raised:  #21242D;
  --axq-surface-sunken:  #121318;

  --axq-border-default:  #2B2E38;
  --axq-border-subtle:   #21242D;
  --axq-border-strong:   #373D49;

  --axq-icon-primary:    #F4F5F7;
  --axq-icon-secondary:  #B0B5C1;
  --axq-icon-brand:      #FFFFFF;
}

/* ── Component: Button ─────────────────────────── */
.axq-btn {
  border-radius:   var(--axq-radius-button);
  padding:         var(--axq-space-8) var(--axq-space-16);
  font-family:     'Work Sans', system-ui, sans-serif;
  font-weight:     500;
  text-transform:  uppercase;
  gap:             var(--axq-space-8);
}
.axq-btn--primary {
  background: var(--axq-bg-brand);
  color:      var(--axq-text-inverse);
}
.axq-btn--disabled {
  background: var(--axq-bg-disabled);
  color:      var(--axq-text-disabled);
  pointer-events: none;
}
```

---

## Figma JSON Token Export

```json
{
  "AXQ": {
    "primitive": {
      "color": {
        "white":  { "$value": "#FFFFFF", "$type": "color" },
        "black":  { "$value": "#000000", "$type": "color" },
        "greyscale": {
          "100": { "$value": "#EDF1F7", "$type": "color" },
          "200": { "$value": "#E4E9F2", "$type": "color" },
          "300": { "$value": "#C5CEE0", "$type": "color" },
          "400": { "$value": "#8F9BB3", "$type": "color" },
          "500": { "$value": "#2E3A59", "$type": "color" },
          "600": { "$value": "#222B45", "$type": "color" },
          "900": { "$value": "#101426", "$type": "color" }
        },
        "brand": {
          "teal":   { "$value": "#49DBC8", "$type": "color" },
          "green":  { "$value": "#BEFF6C", "$type": "color" },
          "orange": { "$value": "#FC7339", "$type": "color" },
          "pink":   { "$value": "#FD9FDD", "$type": "color" },
          "purple": { "$value": "#AF96FB", "$type": "color" },
          "yellow": { "$value": "#FFF172", "$type": "color" }
        },
        "info": {
          "500": { "$value": "#0095FF", "$type": "color" },
          "700": { "$value": "#0057C2", "$type": "color" }
        },
        "success": {
          "500": { "$value": "#00D68F", "$type": "color" }
        },
        "warning": {
          "500": { "$value": "#FFAA00", "$type": "color" }
        },
        "error": {
          "500": { "$value": "#FF3D71", "$type": "color" }
        }
      },
      "radius": {
        "sm":   { "$value": "4px",    "$type": "borderRadius" },
        "lg":   { "$value": "12px",   "$type": "borderRadius" },
        "xl":   { "$value": "16px",   "$type": "borderRadius" },
        "2xl":  { "$value": "24px",   "$type": "borderRadius" },
        "full": { "$value": "9999px", "$type": "borderRadius" }
      }
    },
    "semantic": {
      "color": {
        "text": {
          "primary":   { "$value": "{AXQ.primitive.color.greyscale.900}", "$type": "color" },
          "secondary": { "$value": "{AXQ.primitive.color.greyscale.500}", "$type": "color" },
          "disabled":  { "$value": "{AXQ.primitive.color.greyscale.300}", "$type": "color" },
          "inverse":   { "$value": "{AXQ.primitive.color.white}",         "$type": "color" },
          "brand":     { "$value": "{AXQ.primitive.color.black}",         "$type": "color" }
        },
        "bg": {
          "primary":  { "$value": "{AXQ.primitive.color.white}",         "$type": "color" },
          "brand":    { "$value": "{AXQ.primitive.color.black}",         "$type": "color" },
          "disabled": { "$value": "{AXQ.primitive.color.greyscale.200}", "$type": "color" }
        },
        "status": {
          "info":    { "$value": "{AXQ.primitive.color.info.500}",    "$type": "color" },
          "success": { "$value": "{AXQ.primitive.color.success.500}", "$type": "color" },
          "warning": { "$value": "{AXQ.primitive.color.warning.500}", "$type": "color" },
          "error":   { "$value": "{AXQ.primitive.color.error.500}",   "$type": "color" }
        },
        "border": {
          "default": { "$value": "{AXQ.primitive.color.greyscale.200}", "$type": "color" },
          "focus":   { "$value": "{AXQ.primitive.color.info.500}",      "$type": "color" }
        }
      },
      "radius": {
        "button": { "$value": "{AXQ.primitive.radius.2xl}", "$type": "borderRadius" },
        "input":  { "$value": "{AXQ.primitive.radius.lg}",  "$type": "borderRadius" },
        "card":   { "$value": "{AXQ.primitive.radius.xl}",  "$type": "borderRadius" }
      }
    },
    "component": {
      "button": {
        "primary-bg":   { "$value": "{AXQ.semantic.color.bg.brand}",    "$type": "color" },
        "primary-text": { "$value": "{AXQ.semantic.color.text.inverse}", "$type": "color" },
        "radius":       { "$value": "{AXQ.semantic.radius.button}",      "$type": "borderRadius" },
        "filled-bg-info":    { "$value": "{AXQ.semantic.color.status.info}",    "$type": "color" },
        "filled-bg-success": { "$value": "{AXQ.semantic.color.status.success}", "$type": "color" },
        "filled-bg-warning": { "$value": "{AXQ.semantic.color.status.warning}", "$type": "color" },
        "filled-bg-error":   { "$value": "{AXQ.semantic.color.status.error}",   "$type": "color" }
      },
      "input": {
        "border":       { "$value": "{AXQ.semantic.color.border.default}", "$type": "color" },
        "border-focus": { "$value": "{AXQ.semantic.color.border.focus}",   "$type": "color" },
        "radius":       { "$value": "{AXQ.semantic.radius.input}",         "$type": "borderRadius" }
      }
    }
  }
}
```

---

## Naming Convention & Do/Don't Rules

### Quy tắc đặt tên

| Quy tắc | Mô tả |
|---|---|
| **Prefix `AXQ /`** | Tất cả collection trong Figma phải bắt đầu bằng `AXQ /` |
| **Phân cấp bằng `/`** | Dùng `/` để phân cấp: `category/group/name` |
| **Lowercase, kebab-case** | Token name viết thường, dùng `-` nối: `body-sm`, `on-color` |
| **Không dùng tên màu cụ thể** | Semantic token dùng `text/primary`, **không** dùng `text/dark-blue` |
| **Không dùng giá trị trong tên** | Dùng `radius/button`, **không** dùng `radius/24px` |
| **Số trong Primitive** | Primitive dùng số: `fontSize/16`, `space/8`, `greyscale/500` |
| **Ngữ nghĩa trong Semantic** | Semantic dùng mô tả ý nghĩa: `type/body`, `inset/md` |

### ✅ Do — Nên làm

```
✅ button/primary-bg      → alias tới semantic/bg/brand
✅ text/primary           → alias tới primitive/greyscale/900
✅ radius/button          → alias tới primitive/radius/2xl
✅ status/info-default    → alias tới primitive/info/500
✅ AXQ / Semantic / Color → naming collection đúng chuẩn
```

### ❌ Don't — Không nên làm

```
❌ button/black           → dùng tên màu thay vì ngữ nghĩa
❌ button/bg → info/500   → skip layer Semantic, trỏ thẳng về Primitive
❌ text-primary           → thiếu phân cấp /
❌ Radius24               → dùng giá trị số trong tên Semantic
❌ Semantic / Color       → thiếu prefix AXQ /
❌ button/hover           → đặt trạng thái vào collection thay vì variant
```

### Token Chain Rule

```
Component token
    └── trỏ tới Semantic token
            └── trỏ tới Primitive token
                        └── giá trị thô (hex, px)
```

> **Không bao giờ** component trỏ trực tiếp tới primitive. Chain phải qua đủ 3 tầng.

---

## Quy Trình Thiết Lập trong Figma

### Bước 1 — Tạo 7 Collections

Mở bảng **Variables** (`Ctrl/Cmd + L`) → tạo tuần tự:

```
AXQ / Primitive / Color           [mode: Value]
AXQ / Primitive / Spacing         [mode: Value]
AXQ / Primitive / Radius          [mode: Value]
AXQ / Primitive / Font Size       [mode: Value]
AXQ / Semantic / Color            [mode: Light, Dark]
AXQ / Semantic / Spacing+Radius   [mode: Default]
AXQ / Component                   [mode: Default]
```

### Bước 2 — Khai báo Primitive

Nhập toàn bộ giá trị thô. **Không** alias sang collection khác ở bước này.

- Type `Color` → nhập hex
- Type `Number` → nhập giá trị px (không kèm đơn vị)

### Bước 3 — Semantic aliases từ Primitive

Chuột phải vào ô value → **"Apply alias"** → chọn Primitive token.

```
text/primary       →  AXQ / Primitive / Color / greyscale/900
bg/brand           →  AXQ / Primitive / Color / black
border/focus       →  AXQ / Primitive / Color / info/500
radius/button      →  AXQ / Primitive / Radius / 2xl
type/body          →  AXQ / Primitive / Font Size / 16
```

### Bước 4 — Semantic Color Dark Mode

Trong collection `AXQ / Semantic / Color`:
1. Click **+ Mode** → đặt tên **Dark**
2. Override các giá trị: `text/primary = #F4F5F7`, `bg/primary = #121318`, ...
3. Kiểm tra bằng cách chọn frame → đổi mode sang Dark trong panel Variables

### Bước 5 — Component tokens từ Semantic

```
button/primary-bg         →  AXQ / Semantic / Color / bg/brand
button/filled/bg/info     →  AXQ / Semantic / Color / status/info
button/filled/bg/success  →  AXQ / Semantic / Color / status/success
input/border-focus        →  AXQ / Semantic / Color / border/focus
card/radius               →  AXQ / Semantic / Spacing+Radius / radius/card
```

### Bước 6 — Gán Variable vào Master Components

1. Chọn **Master Component** của Button
2. Gán `Corner Radius` → `button/radius`
3. Gán `Padding` → `button/padding/top-bottom` và `button/padding/left-right`
4. Gán `Fill/Stroke` → chọn các variable theo từng Variant (Type = Filled/Outlined, State = Brand/Disable/Dark...)
5. Chọn layer fill/stroke → click **⬥ biểu tượng Variable** (góc phải ô màu)
6. Kiểm tra: chọn frame cha → đổi mode Light/Dark → component phải cập nhật tự động

### Bước 7 — Publish Library

1. **Assets panel** → ☁ **Publish** → tick *Variables*
2. Các file dùng chung sẽ nhận update qua **"Update to latest"**

---

---

## BƯỚC 5 — Icon System

> Thư viện **1898 SVG icons** chính thức — 2 style **Bold** (filled, active state) và **Linear** (outline, inactive state).
> Tài liệu đầy đủ: [`../asset/ICON_SYSTEM.md`](../asset/ICON_SYSTEM.md)

### Tổng Quan

| Thông tin | Giá trị |
|---|---|
| **Tổng số** | 1898 SVG |
| **Bold** | 979 icons — `docs/asset/icon/bold/` |
| **Linear** | 919 icons — `docs/asset/icon/linear/` |
| **Kích thước** | 24×24px |
| **Fill mặc định** | `#101426` — `Primitive/greyscale/900` |

### Primitive Icon Size Tokens (thêm vào Collection)

```
AXQ / Primitive / Spacing:
  icon/size/standard = 20px    ← icon trong Button, Badge
  icon/size/nav      = 24px    ← icon trong Navbar (viewBox SVG)
  icon/size/large    = 32px    ← icon Empty State
```

### Semantic Icon Color Tokens

| Semantic Token | Alias → Primitive | Hex (Light) | Hex (Dark) |
|---|---|---|---|
| `icon/primary` | `greyscale/900` | `#101426` | `#F4F5F7` |
| `icon/secondary` | `greyscale/500` | `#2E3A59` | `#B0B5C1` |
| `icon/tertiary` | `greyscale/400` | `#8F9BB3` | `#757D8F` |
| `icon/disabled` | `greyscale/300` | `#C5CEE0` | `#373D49` |
| `icon/inverse` | `white` | `#FFFFFF` | `#1A1A1A` |
| `icon/brand` | `black` | `#000000` | `#FFFFFF` |

### Quy Tắc Bold vs Linear

| Tình huống | Style | Ví dụ |
|---|---|---|
| Tab active, button icon, selected state | **Bold** | Navbar active tab |
| Tab inactive, decorative, secondary | **Linear** | Navbar inactive tab |
| Error / Warning status icon | **Bold** | `shield-cross`, `warning-2` |
| Info / Helper icon | **Linear** | `info-circle`, helper text |
| Dark Mode | Ưu tiên **Linear** | Tránh quá nặng trên bg tối |

### CSS Integration

```css
/* Icon color tự động đổi theo theme */
.axq-icon--primary  { color: var(--axq-icon-primary);   }
.axq-icon--inverse  { color: var(--axq-icon-inverse);   }
.axq-icon--brand    { color: var(--axq-icon-brand);     }
.axq-icon--disabled { color: var(--axq-icon-disabled); opacity: 0.6; }

/* Trắng hóa icon tối trên button primary (#000 bg) */
.axq-btn--primary img.axq-icon {
  filter: brightness(0) invert(1);
}
```

### Icon → Zone Mapping (tóm tắt)

| Zone | Icons chính (bold) |
|---|---|
| Zone 1 Auth | `finger-scan` · `lock` · `password-check` · `key` · `shield-security` |
| Zone 2 KYC | `scan` · `3d-cube-scan` · `verify` · `personalcard` · `shield-tick` |
| Zone 3 Home | `home` · `chart` · `trend-up` · `empty-wallet` · `money` |
| Zone 4 Card | `card` · `eye` · `lock-slash` · `card-edit` · `card-slash` |
| Zone 5 Crypto | `arrow-swap` · `candle` · `bitcoin-(btc)` · `ethereum-(eth)` · `send` |
| Zone 6 Transfer | `send-square` · `bank` · `scan-barcode` · `money-tick` · `money-time` |
| Zone 7 Profile | `profile-circle` · `shield-security` · `setting` · `24-support` |
| Zone 8 System | `shield-cross` · `security-time` · `wifi` · `close-circle` |
| Navbar | `home` · `empty-wallet` · `send-square` · `card` · `profile-circle` |

> Xem đầy đủ: [`../asset/ICON_SYSTEM.md`](../asset/ICON_SYSTEM.md) — 380 dòng, danh sách đầy đủ theo category.

---

## Axiopass Wallet — UI Design Plan

> Stack: Next.js 14 · React 18 · TypeScript  
> DS: @axioledger/axio-design-system v2.0  
> Auth: WebAuthn Passkey · Face ID · TouchID  
> Screens: **65+ màn hình** · Zones: **8 phân khu** · Platform: iOS-first · Web PWA

### Lộ Trình 4 Phases

| Phase | Tên | Nội dung | Timeline |
|---|---|---|---|
| **Phase 1 · Critical** | Auth & KYC | Splash → Onboarding → Register → OTP → PIN → Passkey → KYC full flow | Tuần 1–2 |
| **Phase 2 · High** | Home & Card | Dashboard, Balance, Cashback, Card Center, Top-up, Card Settings | Tuần 3–4 |
| **Phase 3 · Medium** | Crypto & Transfer | Portfolio, Swap, Wallet, Send/Receive, Transfer Hub, Payments, Receipt | Tuần 5–6 |
| **Phase 4 · Polish** | Profile & System | Settings, Security, FAQ, Empty States, Error Pages, Edge Cases | Tuần 7 |

---

### Zone 1 — Onboarding & Authentication

**14 screens**

| Màn hình | Scope / Trạng thái | Components DS | Ưu tiên |
|---|---|---|---|
| Splash Main | Logo animation, brand tagline, kiểm tra token phiên | `Skeleton` | Critical |
| Splash · Force Update | Modal bắt buộc cập nhật, nút "Cập nhật ngay" → App Store | `Modal` `Button` | Critical |
| Splash · Maintenance | Full-screen thông báo bảo trì, thời gian dự kiến | `EmptyState` | High |
| Onboarding 1–3 | 3 slide giá trị cốt lõi, dot indicator, nút Skip/Next | `Button` `ProgressBar` | Critical |
| Terms & Privacy Modal | Scrollable full-text, Checkbox đồng ý, nút Tiếp tục | `Modal` `Checkbox` | Critical |
| Welcome · Select Mode | Đăng nhập / Đăng ký, deep-link hỗ trợ referral | `Button` | Critical |
| Phone / Email Input | Country code picker, validation inline, keyboard auto-up | `Input` `Dropdown` | Critical |
| OTP Input | 6-digit, auto-submit, SMS/WhatsApp/Email toggle | `OTPInput` | Critical |
| OTP · Timeout / Error | Countdown timer, Resend, Call Support fallback | `Alert` `Toast` | Critical |
| Create PIN | 6-dot PIN pad, strength indicator, haptic feedback | `Input` `ProgressBar` | Critical |
| Confirm PIN | Re-entry, mismatch shake animation, retry limit | `Alert` | Critical |
| Passkey Setup | WebAuthn `navigator.credentials.create()`, iCloud Keychain, Face ID prompt | `PasskeyButton` `Modal` | Critical |
| Biometric Fallback | Chuyển sang PIN nếu FaceID/TouchID thất bại 3 lần | `Alert` `Toast` | High |
| Forgot PIN / Reset | Xác minh lại OTP → Re-create PIN flow | `OTPInput` `Input` | High |

---

### Zone 2 — KYC & Compliance

**10 screens**

| Màn hình | Scope / Trạng thái | Components DS | Ưu tiên |
|---|---|---|---|
| KYC Overview | Tier levels (Basic / Verified / Premium), hạn mức, CTA bắt đầu | `Badge` `ProgressBar` `Card` | Critical |
| Country / Residency | Searchable picker, hỗ trợ 195 quốc gia, FATF filter | `SearchBar` `Dropdown` | Critical |
| KYC Docs — Type Select | CCCD / Hộ chiếu / GPLX, guidelines modal, example images | `Modal` `Card` | Critical |
| KYC Scan — Front | Camera frame overlay, auto-capture khi căn chỉnh, torch toggle | Native Camera API | Critical |
| KYC Scan — Back | Image quality check: mờ / chói sáng / góc cắt; retry | `Alert` `Toast` | Critical |
| KYC Face / Liveness | Active liveness: chớp mắt + quay đầu + mỉm cười; passive 3D scan | Native Camera + Overlay | Critical |
| Proof of Address | Upload hóa đơn điện/nước, file type validation, size limit | `Button` `Alert` | High |
| FATCA / Tax ID | Khai báo nguồn tiền, TIN, US Person checkbox, form | `Input` `Checkbox` | High |
| KYC Status · Processing | Skeleton loading, push notification khi hoàn tất, ETA hiển thị | `Skeleton` `Toast` | Critical |
| KYC Rejected · Retry | Lý do từ chối theo mã, deep-link về đúng bước cần làm lại | `Alert` `Button` | Critical |

---

### Zone 3 — Home & Dashboard

**7 screens**

| Màn hình | Scope / Trạng thái | Components DS | Ưu tiên |
|---|---|---|---|
| Home Main | Balance hero, Quick Actions grid (4-6 lối tắt), Recent Txs feed | `Card` `Avatar` `Badge` `Skeleton` | Critical |
| Balance · Multi-Currency | Toggle VND / USD / Crypto, tỉ giá realtime, hide balance | `Toggle` `Dropdown` | High |
| Cashback Overview | Tổng hoàn tiền, tier badge, biểu đồ tháng, nút "Đổi điểm" | `Badge` `ProgressBar` `Card` | High |
| Loyalty Tier | Bronze/Silver/Gold/Platinum levels, progress to next tier | `ProgressBar` `Badge` | Medium |
| Voucher / Coupon Store | Grid ưu đãi, filter theo danh mục, modal chi tiết & đổi quà | `SearchBar` `Modal` `Badge` | Medium |
| Financial Analytics | Pie chart thu chi theo danh mục, lịch sử 3/6/12 tháng | `Card` `Dropdown` | Medium |
| Quick Actions Config | Drag & drop tùy chỉnh lối tắt trang chủ (tối đa 6) | `Toggle` `Card` | Low |

---

### Zone 4 — Card Management

**9 screens**

| Màn hình | Scope / Trạng thái | Components DS | Ưu tiên |
|---|---|---|---|
| Card Center | Virtual / Physical card gallery, flip animation, status badge | `Card` `Badge` `Skeleton` | Critical |
| Issue Card — Type | Chọn Virtual / Physical, tùy chọn màu/skin thẻ | `Card` `Button` | Critical |
| Issue Card — Delivery | Nhập địa chỉ giao, chọn tốc độ giao, phí hiển thị | `Input` `Dropdown` | High |
| Add Balance / Top-up | Chọn phương thức (Ngân hàng / Thẻ / Crypto), review confirm | `Dropdown` `Input` `Card` | Critical |
| Card Settings | Freeze toggle, hạn mức, ATM PIN, thay thẻ, báo mất | `Toggle` `Input` `Alert` | High |
| Reveal Card Details | Face ID auth → hiện CVV + số thẻ, blur lại sau 10s | `PasskeyButton` `Modal` | High |
| Spending Limits | Daily / Monthly / Per-transaction caps, slider input | `Input` `Toggle` | Medium |
| Replace / Report Lost | Lý do báo mất, xác nhận khóa tức thì, form yêu cầu thẻ mới | `Modal` `Alert` `Input` | High |
| Add to Apple Wallet | PKAddPassButton, provisioning flow, success state | Apple PassKit | Medium |

---

### Zone 5 — Crypto & Web3

**10 screens**

| Màn hình | Scope / Trạng thái | Components DS | Ưu tiên |
|---|---|---|---|
| Crypto Portfolio | Tổng tài sản USD, % biến động 24h, danh sách holdings | `CryptoComponents` `Badge` `Skeleton` | Critical |
| Asset Breakdown | Chi tiết token: price chart, send/receive/swap shortcuts | `Card` `AddressDisplay` | High |
| Swap Interface | From/To token picker, amount input, slippage settings, price impact | `Input` `Dropdown` `Alert` | Critical |
| Buy / Sell Crypto | FIAT → Crypto, on-ramp provider selection, KYC gate check | `Input` `Modal` `Badge` | High |
| Wallet Details | Multi-chain balances, ANS domain, ZK-DID identity card | `NamespaceBadge` `AddressDisplay` | Critical |
| Receive | QR code, network picker (ERC20/TRC20/BEP20), copy address | `AddressDisplay` `Dropdown` | Critical |
| Send | Nhập địa chỉ / ANS domain, network, gas fee preview, max button | `Input` `NamespaceBadge` `Alert` | Critical |
| Address Book | Lưu & quản lý địa chỉ ví, TLP safety badge, search | `SearchBar` `NamespaceBadge` `Avatar` | High |
| Staking List | APY hiển thị, thời hạn lock, estimated rewards | `Card` `Badge` `ProgressBar` | Medium |
| Stake / Unstake | Nhập số lượng, review fee, confirm flow, cooldown period | `Input` `Modal` `Alert` | Medium |

---

### Zone 6 — Transfer & Payments

**9 screens**

| Màn hình | Scope / Trạng thái | Components DS | Ưu tiên |
|---|---|---|---|
| Transfer Hub | Nội bộ / Ngân hàng trong nước / Quốc tế (SWIFT/SEPA) tabs | `Card` `Badge` | Critical |
| Select Recipient | Danh bạ / Nhập số TK / QR Code scan, recents list | `SearchBar` `Avatar` `AddressDisplay` | Critical |
| Amount Input | Numpad lớn, quick-amount chips (100K/500K/1M), note field | `Input` `Badge` | Critical |
| Home Services | Điện / Nước / Internet / TV, nhập mã khách hàng, bill preview | `Input` `Card` `Dropdown` | High |
| QR Scanner | Camera QR, torch, manual code entry fallback, TLP check | `Alert` `NamespaceBadge` | High |
| Tx Review | Toàn bộ chi tiết: người nhận, số tiền, phí, ước tính thời gian | `Card` `Badge` | Critical |
| Tx Auth | PIN / Face ID / SMS OTP / Hardware Key selector | `OTPInput` `PasskeyButton` | Critical |
| Receipt / Success | Biên nhận đẹp, nút Share/Save ảnh, "Giao dịch mới" CTA | `Card` `Button` `Toast` | Critical |
| Tx Failed | Mã lỗi, lý do thân thiện, nút Thử lại / Liên hệ hỗ trợ | `Alert` `Button` | Critical |

---

### Zone 7 — Profile, Settings & Support

**8 screens**

| Màn hình | Scope / Trạng thái | Components DS | Ưu tiên |
|---|---|---|---|
| Profile Overview | Avatar, tên, KYC tier badge, ANS domain, điểm thành viên | `Avatar` `Badge` `NamespaceBadge` | High |
| Edit Profile | Đổi avatar (camera/gallery), tên hiển thị, email | `Avatar` `Input` `Button` | High |
| Account Security | Đổi PIN/mật khẩu, danh sách thiết bị đang đăng nhập, revoke session | `Toggle` `Alert` `Badge` | High |
| Linked Bank Accounts | Danh sách TK liên kết, thêm mới, xóa liên kết | `Card` `Button` `Alert` | High |
| Settings Hub | Language, Appearance (Light/Dark/Auto), Notifications, Region | `Toggle` `Dropdown` | High |
| Notifications Prefs | Tùy chỉnh từng loại: Push / Email / SMS per-category | `Toggle` `Checkbox` | Medium |
| FAQ / Help Center | Searchable accordion FAQ, deep link từ error screens | `SearchBar` `Accordion` | Medium |
| Live Chat / Ticketing | In-app chat UI, file attachment, ticket history | `Input` `Avatar` | Low |

---

### Zone 8 — System States & Edge Cases

**8 screens**

| Màn hình | Scope / Trạng thái | Components DS | Ưu tiên |
|---|---|---|---|
| Network Error / Offline | Full-screen offline state, auto-retry khi có mạng lại | `EmptyState` `Button` | Critical |
| Server Error (500) | Mã lỗi thân thiện, nút Thử lại, liên hệ support | `EmptyState` `Alert` | Critical |
| Session Expired | Auto-logout modal, preserve context, redirect login | `Modal` `Alert` | Critical |
| Empty History | Illustration + CTA "Thực hiện giao dịch đầu tiên" | `EmptyState` `Button` | High |
| Empty Portfolio | Illustration + CTA "Mua crypto / Nhận tài sản" | `EmptyState` `Button` | High |
| Empty Cards | Illustration + CTA "Issue Card" cho người dùng mới | `EmptyState` `Button` | High |
| Jailbreak Warning | Cảnh báo toàn màn hình, không thể bypass, thoát app | `Alert` `Modal` | Critical |
| Account Blocked | Lý do khóa, hướng dẫn liên hệ hỗ trợ, thời hạn review | `Alert` `EmptyState` | Critical |

---

### Component Inventory

**@axioledger/axio-design-system v2.0**

#### Input & Forms
- Input (text, numeric, password)
- OTPInput (6-digit animated)
- Checkbox
- Toggle
- Dropdown / SearchBar

#### Feedback & Status
- Alert (info/success/warning/error)
- Toast (auto-dismiss)
- ProgressBar
- Skeleton
- EmptyState

#### Layout & Navigation
- Card (surface raised)
- Modal (sheet / dialog)
- Navbar (bottom tab + top)
- Tooltip
- Badge

#### Crypto-Specific
- AddressDisplay (truncated + copy)
- NamespaceBadge (.axq/.vrq/.kpx)
- PasskeyButton (Face ID / Touch ID)
- CryptoComponents (token row)

#### Identity
- Avatar (with status ring)
- TLP Safe / Caution / Blocked badges
- KYC Tier indicator

#### To-Build (New)
- PINPad (dot display + numpad)
- CardVisual (flip 3D)
- QRDisplay (generate + zoom)
- LivenessFrame (camera overlay)
- GasFeeSelector (slow/avg/fast)

---

### Deliverables

| # | Deliverable | Mô tả |
|---|---|---|
| 1 | Flow Map (Figma / FigJam) | Sơ đồ luồng toàn bộ 65 màn hình, kết nối navigation, phân biệt Happy Path vs Error Path |
| 2 | Low-fi Wireframes — Zone 1 & 2 | Grayscale wireframe: Auth + KYC flow (14 + 10 màn hình), annotated edge cases |
| 3 | Design System Mapping Doc | Bảng ánh xạ: mỗi màn hình → component DS, token CSS, state variations |
| 4 | Hi-fi UI Design — Zone 1 (Phase 1) | Pixel-perfect mobile screens (390×844), Light + Dark mode, iOS safe areas |
| 5 | Prototype Clickable — Auth → Home | Figma interactive prototype: Splash → KYC Approved → Home, demo cho investor |
| 6 | Component Spec Sheet | 5 new components cần build: PINPad, CardVisual, QRDisplay, LivenessFrame, GasFeeSelector |
| 7 | Security UX Checklist | Screenshot blocker, Jailbreak detection, Session timeout, Biometric fallback, WCAG 2.1 AA |
| 8 | Full Hi-fi UI — Zone 3–8 | Home, Card, Crypto, Transfer, Profile, System States — đầy đủ 51 màn hình còn lại |

---

**Summary Stats**

| Metric | Value |
|---|---|
| Tổng màn hình | 65+ |
| Phân khu (Zones) | 8 |
| Design Phases | 4 |
| Timeline dự kiến | 7 tuần |
| Variable Layers | 3 (Primitive / Semantic / Component) |
| Collections Figma | 7 |
| Font | Work Sans |
| Brand Color | `#49DBC8` Teal · `#000000` Black |

---

> **Lưu ý naming convention AXQ:** Tất cả collection đặt prefix `AXQ /` để phân biệt với các library khác trong cùng file.  
> Ví dụ: `AXQ / Primitive / Color` · `AXQ / Semantic / Color` · `AXQ / Component`
>
> **Token Chain Rule tuyệt đối:** Component → Semantic → Primitive → Raw Value. Không bao giờ skip tầng.

---

*Axioledger Design System — Lộ Trình Toàn Dự Án v2.0*  
*Gộp từ: design-system-roadmap.md v1.1 + Variable Token Architecture (Bước 1–4)*
