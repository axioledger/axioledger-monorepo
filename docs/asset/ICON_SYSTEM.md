# AXQ Icon System — Tài Liệu Tích Hợp

> Thư viện icon chính thức của **Axioledger Design System**  
> Phiên bản: v1.0 · Tổng: **1898 SVG** (979 Bold + 919 Linear) · Kích thước: 24×24px  
> Màu mặc định: `#101426` (Primitive `greyscale/900` — `text/primary`)

---

## Mục Lục

1. [Tổng Quan Icon Library](#tổng-quan-icon-library)
2. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
3. [2 Style: Bold & Linear](#2-style-bold--linear)
4. [Danh Mục Icon theo Chức Năng Axioledger](#danh-mục-icon-theo-chức-năng-axioledger)
5. [Cách Dùng trong axioledger + AXQ DS](#cách-dùng-trong-axioledger--axq-ds)
6. [Tích Hợp vào AXQ Design System](#tích-hợp-vào-axq-design-system)
7. [Figma Component — Icon Usage Rules](#figma-component--icon-usage-rules)
8. [Ánh Xạ Icon → Zone Axiopass](#ánh-xạ-icon--zone-axiopass)

---

## Tổng Quan Icon Library

| Thông tin | Giá trị |
|---|---|
| **Tổng số icon** | **1898 SVG** |
| **Bold style** | 979 icons |
| **Linear style** | 919 icons |
| **Kích thước** | 24×24px (`viewBox="0 0 24 24"`) |
| **Fill mặc định** | `#101426` — `Primitive/greyscale/900` |
| **Format** | SVG inline, có thể đổi màu qua CSS `fill` / `currentColor` |
| **Danh mục** | Crypto/DeFi · Wallet/Card · Security/Auth · Charts/Analytics · UI/Navigation · Communication · Media · System |

---

## Cấu Trúc Thư Mục

```
docs/asset/
└── icon/
    ├── bold/        ← 979 icons (filled, weight nặng — dùng cho active state, CTA)
    │   ├── wallet.svg
    │   ├── arrow-swap.svg
    │   ├── shield-tick.svg
    │   ├── bitcoin-(btc).svg
    │   └── ... (979 files)
    └── linear/      ← 919 icons (outline, weight nhẹ — dùng cho inactive, decorative)
        ├── wallet.svg
        ├── arrow-swap.svg
        ├── shield-tick.svg
        └── ... (919 files)
```

---

## 2 Style: Bold & Linear

| Style | Thư mục | Khi nào dùng | Ví dụ AXQ DS |
|---|---|---|---|
| **Bold** (filled) | `icon/bold/` | Active state, CTA button icon, selected tab, error/success indicator | Navbar tab active, Button icon, Badge icon |
| **Linear** (outline) | `icon/linear/` | Inactive state, decorative, secondary UI, dark mode | Navbar tab inactive, Helper text icon, Tooltip icon |

### Quy tắc chuyển đổi Bold ↔ Linear

```js
// Trong axioledger View — dùng style theo state
const NavIcon = ({ icon, active }) =>
  h("img", {
    src: `/docs/asset/icon/${active ? "bold" : "linear"}/${icon}.svg`,
    class: "axq-navbar__icon",
    style: {
      // Dùng CSS filter để đổi màu icon SVG (khi không inline)
      filter: active
        ? "none"                       // bold icon đã là màu brand
        : "opacity(0.6)",              // linear icon — muted
    },
    width: 24, height: 24,
    alt: icon,
  })
```

### Inline SVG với currentColor

```js
// Cách tốt nhất: inline SVG và dùng currentColor
// Cho phép đổi màu hoàn toàn qua CSS color / AXQ tokens
const InlineIcon = ({ path, size = 24, color = "currentColor" }) =>
  h("svg", {
    width: size, height: size,
    viewBox: "0 0 24 24", fill: "none",
    "aria-hidden": "true",
  }, [
    h("path", { d: path, fill: color }),
  ])
```

---

## Danh Mục Icon theo Chức Năng Axioledger

### 1. Crypto & DeFi Tokens

| Icon File | Mô tả | Dùng cho |
|---|---|---|
| `bitcoin-(btc).svg` | Bitcoin logo | BTC token badge |
| `ethereum-(eth).svg` | Ethereum logo | ETH / EVM chain |
| `solana-(sol).svg` | Solana logo | SOL chain |
| `avalanche-(avax).svg` | Avalanche logo | AVAX chain |
| `polygon-(matic).svg` | Polygon logo | MATIC chain |
| `binance-coin-(bnb).svg` | BNB logo | BSC chain |
| `cardano-(ada).svg` | Cardano logo | ADA |
| `chainlink-(link).svg` | Chainlink logo | LINK oracle |
| `polkadot-(dot).svg` | Polkadot logo | DOT parachain |
| `tether-(usdt).svg` | Tether logo | USDT stablecoin |
| `usd-coin-(usdc).svg` | USD Coin logo | USDC stablecoin |
| `aave-(aave).svg` | Aave logo | AAVE DeFi |
| `buy-crypto.svg` | Buy crypto | On-ramp button |
| `bitcoin-card.svg` | Crypto card | Card + crypto |
| `bitcoin-convert.svg` | Convert crypto | Swap interface |
| `airdrop.svg` | Airdrop | Token distribution |
| `coin.svg`, `coin-1.svg` | Generic coin | Token placeholder |

### 2. Wallet & Card Management (Zone 3, 4)

| Icon File | Mô tả | Dùng cho |
|---|---|---|
| `wallet.svg` | Wallet default | Navbar Wallet tab |
| `wallet-1.svg` | Wallet variant | AxioPass Wallet icon |
| `wallet-2.svg`, `wallet-3.svg` | Wallet variants | UI variation |
| `wallet-add.svg` | Add funds | Top-up button |
| `wallet-check.svg` | Wallet verified | Success state |
| `wallet-money.svg` | Wallet + money | Balance display |
| `wallet-remove.svg` | Remove wallet | Disconnect |
| `wallet-search.svg` | Search wallet | Address lookup |
| `empty-wallet.svg` | Empty state | No balance |
| `empty-wallet-add.svg` | Empty + add | First top-up CTA |
| `empty-wallet-tick.svg` | Empty + verified | KYC ready |
| `card.svg` | Card default | Card Center tab |
| `card-add.svg` | Add card | Issue card |
| `card-send.svg` | Send via card | Card payment |
| `card-receive.svg` | Receive to card | Card top-up |
| `card-tick.svg` | Card verified | Card active |
| `card-slash.svg` | Card blocked | Frozen card |
| `card-remove.svg` | Remove card | Cancel card |
| `card-edit.svg` | Edit card | Card settings |
| `card-pos.svg` | POS payment | In-store payment |
| `simcard.svg` | SIM / NFC card | Physical card chip |
| `personalcard.svg` | Personal card | KYC identity card |

### 3. Transfer & Payments (Zone 6)

| Icon File | Mô tả | Dùng cho |
|---|---|---|
| `send.svg`, `send-2.svg` | Send | Send button |
| `send-square.svg` | Send square | Transfer card |
| `direct-send.svg` | Direct send | Instant transfer |
| `money-send.svg` | Money send | Fiat transfer |
| `receive-square.svg` | Receive | Receive button |
| `directbox-receive.svg` | Receive box | Incoming transfer |
| `money-recive.svg` | Money receive | Fiat receive |
| `arrow-swap.svg` | Swap horizontal | Swap interface |
| `arrow-swap-horizontal.svg` | Swap | Exchange |
| `convert.svg` | Convert | Token convert |
| `recover-convert.svg` | Recovery convert | Retry swap |
| `money.svg`, `money-2.svg`–`money-4.svg` | Money | Balance, amounts |
| `money-add.svg` | Add money | Top-up |
| `money-change.svg` | Money change | Exchange rate |
| `money-tick.svg` | Money confirmed | Tx success |
| `money-time.svg` | Money pending | Tx processing |
| `money-forbidden.svg` | Money blocked | Transfer blocked |
| `bank.svg` | Bank | Bank transfer |
| `trade.svg` | Trade | DEX trading |
| `received.svg` | Received | Tx confirmed |
| `barcode.svg` | Barcode / QR | QR scanner |
| `scan-barcode.svg` | Scan barcode | QR scan |
| `scan.svg` | Scan | Camera scan |
| `frame.svg`, `frame-1.svg`, `frame-2.svg` | Frame | Camera frame overlay |

### 4. Security & Authentication (Zone 1, 8)

| Icon File | Mô tả | Dùng cho |
|---|---|---|
| `finger-scan.svg` | Fingerprint | TouchID button |
| `finger-cricle.svg` | Fingerprint circle | Biometric prompt |
| `shield-security.svg` | Shield security | Security status |
| `shield-tick.svg` | Shield verified | Verified state |
| `shield-slash.svg` | Shield blocked | Security warning |
| `shield-cross.svg` | Shield error | Security error |
| `shield-search.svg` | Shield search | Security scan |
| `security.svg` | Security | Security section |
| `security-safe.svg` | Security safe | Safe mode |
| `security-user.svg` | Security user | User security |
| `security-card.svg` | Security card | Card security |
| `security-time.svg` | Security time | Session timeout |
| `lock.svg`, `lock-1.svg` | Lock | Locked state |
| `lock-circle.svg` | Lock circle | Lock button |
| `lock-slash.svg` | Unlock | Unlock / revealed |
| `unlock.svg` | Unlock | Unlock action |
| `key.svg`, `key-square.svg` | Key / Passkey | AxioPass key |
| `password-check.svg` | Password check | PIN verified |
| `eye.svg` | Show | Reveal CVV |
| `eye-slash.svg` | Hide | Hide balance/CVV |
| `verify.svg` | Verify | KYC verification |
| `scan.svg` | Scan | Document scan |
| `3d-cube-scan.svg` | 3D scan | Liveness check |

### 5. Analytics & Charts (Zone 3, 5)

| Icon File | Mô tả | Dùng cho |
|---|---|---|
| `chart.svg`, `chart-1.svg`, `chart-2.svg` | Chart | Analytics tab |
| `chart-success.svg` | Chart up | Positive trend |
| `chart-fail.svg` | Chart down | Negative trend |
| `chart-square.svg` | Chart square | Chart card |
| `candle.svg`, `candle-2.svg` | Candlestick | Price chart |
| `graph.svg` | Graph | Portfolio graph |
| `diagram.svg` | Diagram | Data diagram |
| `presention-chart.svg` | Presentation | Analytics report |
| `favorite-chart.svg` | Favorite chart | Saved chart |
| `data.svg`, `data-2.svg` | Data | Data metrics |
| `trend-up.svg` | Trend up | Price up |
| `trend-down.svg` | Trend down | Price down |
| `home-trend-up.svg` | Home trend up | Portfolio growth |
| `home-trend-down.svg` | Home trend down | Portfolio loss |

### 6. Profile & Identity (Zone 2, 7)

| Icon File | Mô tả | Dùng cho |
|---|---|---|
| `profile-circle.svg` | Profile circle | User avatar |
| `profile-2user.svg` | Two users | Contacts |
| `profile-add.svg` | Add profile | Add contact |
| `profile-tick.svg` | Verified profile | KYC verified |
| `profile-delete.svg` | Delete profile | Remove account |
| `profile-remove.svg` | Remove profile | Block user |
| `personalcard.svg` | Personal card | ID card / KYC |
| `people.svg` | People | Community / DAO |

### 7. Navigation & UI

| Icon File | Mô tả | Dùng cho |
|---|---|---|
| `home.svg` / `home-1.svg` | Home | Home tab |
| `category.svg` | Category | Dashboard grid |
| `menu.svg` | Menu | Hamburger |
| `setting.svg` / `setting-2.svg` | Settings | Settings tab |
| `notification.svg` | Bell | Notifications |
| `search-normal.svg` | Search | Search bar |
| `close-circle.svg` | Close | Modal close |
| `close-square.svg` | Close | Dismiss |
| `add.svg` | Add | Add item |
| `add-circle.svg` | Add circle | Add button |
| `minus.svg` | Minus | Remove |
| `arrow-right.svg` | Right arrow | Navigation |
| `arrow-left.svg` | Left arrow | Back |
| `arrow-down.svg` | Down | Dropdown |
| `arrow-up.svg` | Up | Collapse |
| `more.svg` | More | Overflow menu |
| `tick-circle.svg` | Checkmark | Success |
| `info-circle.svg` | Info | Info badge |
| `warning-2.svg` | Warning | Alert |
| `slash.svg` | Slash | Disabled/blocked |

---

## Cách Dùng trong axioledger + AXQ DS

### Import SVG inline (khuyến nghị)

```js
import { h } from "axioledger"

// Hàm wrapper tái sử dụng — nhận raw SVG path string
const AXQIcon = ({ name, style = "bold", size = 20, color = "currentColor", label }) =>
  h("span", {
    class: "axq-icon",
    role: label ? "img" : "presentation",
    "aria-label": label,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${size}px`,
      height: `${size}px`,
      color: color,  // SVG sẽ dùng currentColor từ đây
    },
    // dangerouslySetInnerHTML không có trong axioledger — dùng img tag
  })

// Dùng img tag cho SVG file (không cần inline)
const AXQIconImg = ({ name, style = "bold", size = 20, alt = "" }) =>
  h("img", {
    src: `/docs/asset/icon/${style}/${name}.svg`,
    width: size,
    height: size,
    alt,
    "aria-hidden": alt === "" ? "true" : undefined,
    style: {
      // CSS filter để đổi màu khi cần thiết
      // Mặc định: #101426 (text/primary)
      // Để dùng màu khác, cần inline SVG hoặc CSS filter trick
    },
  })
```

### Sử dụng với CSS Custom Properties

```css
/* Đổi màu icon theo context */
.axq-btn--primary .axq-icon { color: var(--axq-text-inverse); }   /* #FFFFFF trên bg đen */
.axq-btn--ghost .axq-icon   { color: var(--axq-text-primary);  }   /* #101426 */
.axq-badge--success .axq-icon { color: var(--axq-status-success-default); }  /* #00D68F */
.axq-badge--error .axq-icon   { color: var(--axq-status-error-default);   }  /* #FF3D71 */

/* Inactive nav icon */
.axq-navbar__item:not(.axq-navbar__item--active) .axq-icon {
  color: var(--axq-icon-secondary);   /* #2E3A59 */
}

/* Active nav icon */
.axq-navbar__item--active .axq-icon {
  color: var(--axq-icon-brand);       /* #000000 */
}
```

### Ví dụ thực tế — Navbar Icons

```js
import { h, text } from "axioledger"

// Mapping tab → icon name (dùng bold khi active, linear khi inactive)
const TAB_ICONS = {
  home:    "home",
  crypto:  "empty-wallet",
  pay:     "send-square",
  card:    "card",
  profile: "profile-circle",
}

const NavItem = ({ tab, label, active, onclick }) =>
  h("button", {
    class: { "axq-navbar__item": true, "axq-navbar__item--active": active },
    onclick,
    "aria-current": active ? "page" : undefined,
  }, [
    h("img", {
      src: `/docs/asset/icon/${active ? "bold" : "linear"}/${TAB_ICONS[tab]}.svg`,
      width: 24, height: 24,
      alt: "",
      "aria-hidden": "true",
      style: { filter: active ? "none" : "opacity(0.5)" },
    }),
    h("span", { class: "axq-text--overline" },
      text(label.toUpperCase())
    ),
  ])
```

### Ví dụ — Button với Icon

```js
// Button Primary + Icon (arrow-right)
const SendButton = (state) =>
  h("button", {
    class: "axq-btn axq-btn--primary axq-btn--icon",
    onclick: OpenSendFlow,
    style: {
      borderRadius: "var(--axq-radius-button)",  // 24px
      display: "flex",
      alignItems: "center",
      gap: "var(--axq-gap-sm)",  // 8px — button/gap token
    },
  }, [
    h("img", {
      src: "/docs/asset/icon/bold/send.svg",
      width: 20, height: 20,  // icon/size/standard = 20px
      alt: "",
      "aria-hidden": "true",
      style: { filter: "brightness(0) invert(1)" },  // Trắng hóa icon trên bg đen
    }),
    text("GỬI TIỀN"),
  ])
```

---

## Tích Hợp vào AXQ Design System

### Icon Token Mapping

```
Primitive/icon/size/standard = 20px    ← icon trong Button, Badge
Primitive/icon/size/nav      = 24px    ← icon trong Navbar (mặc định SVG)
Primitive/icon/size/large    = 32px    ← icon trong Empty State illustration
```

### Semantic Icon Color Tokens

| Semantic Token | Hex | Dùng cho icon |
|---|---|---|
| `icon/primary` | `#101426` | Icon mặc định (= SVG fill mặc định) |
| `icon/secondary` | `#2E3A59` | Icon phụ, nav inactive |
| `icon/tertiary` | `#8F9BB3` | Icon hint, placeholder |
| `icon/disabled` | `#C5CEE0` | Icon disabled state |
| `icon/inverse` | `#FFFFFF` | Icon trên background tối (button primary) |
| `icon/brand` | `#000000` | Icon brand, nav active |

### Dark Mode — Icon Color Override

```css
[data-theme="dark"] {
  /* Icon mặc định SVG (fill #101426) → đổi sang sáng qua CSS filter */
  .axq-icon--auto { filter: brightness(0) invert(1); }  /* Trắng hóa */

  /* Hoặc dùng CSS color với currentColor SVG */
  .axq-icon { color: var(--axq-icon-primary); }  /* #F4F5F7 in dark mode */
}
```

### Figma Variable → Icon

```
Figma Component: Icon/24/[name]/[bold|linear]
    ├── Fill → AXQ / Semantic / Color / icon/primary
    └── Size → AXQ / Primitive / Spacing / space/24
```

---

## Figma Component — Icon Usage Rules

### Do ✅
```
✅ Dùng bold icon cho active state (navbar, button, selected chip)
✅ Dùng linear icon cho inactive state (secondary nav, decorative)
✅ Dùng icon/primary (#101426) làm màu mặc định
✅ Dùng icon/inverse (#FFFFFF) khi icon trên background tối
✅ Dùng kích thước 20px trong button (icon/size/standard)
✅ Dùng kích thước 24px trong navbar (icon/size/nav)
✅ Luôn đặt aria-hidden="true" khi icon chỉ decorative
✅ Đặt aria-label khi icon mang semantic meaning
```

### Don't ❌
```
❌ Mix bold và linear trong cùng một component state
❌ Hardcode màu hex trong SVG (dùng currentColor / CSS)
❌ Resize icon xuống dưới 16px (mất chi tiết)
❌ Dùng bold icon cho disabled state (dùng linear + opacity)
❌ Đặt icon không liên quan (ví dụ: dùng lock cho "send")
```

---

## Ánh Xạ Icon → Zone Axiopass

| Zone | Screen | Icon chính | Style |
|---|---|---|---|
| **Zone 1** | Splash | `wallet-1.svg` | bold |
| **Zone 1** | Passkey Setup | `finger-scan.svg` | bold |
| **Zone 1** | OTP Input | `security-safe.svg` | bold |
| **Zone 1** | PIN Create | `password-check.svg` | bold |
| **Zone 1** | Biometric | `finger-cricle.svg` `lock.svg` | bold |
| **Zone 2** | KYC Overview | `personalcard.svg` `shield-tick.svg` | bold |
| **Zone 2** | KYC Scan | `scan.svg` `frame.svg` `3d-cube-scan.svg` | bold |
| **Zone 2** | KYC Liveness | `3d-cube-scan.svg` `camera.svg` | bold |
| **Zone 2** | KYC Status | `verify.svg` `shield-security.svg` | bold |
| **Zone 3** | Home Main | `home.svg` `category.svg` | bold |
| **Zone 3** | Balance | `empty-wallet.svg` `money.svg` | bold |
| **Zone 3** | Cashback | `reward.svg` `trend-up.svg` | bold |
| **Zone 3** | Analytics | `chart.svg` `diagram.svg` | bold |
| **Zone 4** | Card Center | `card.svg` `cards.svg` | bold |
| **Zone 4** | Card Reveal | `eye.svg` `lock-slash.svg` | bold |
| **Zone 4** | Card Freeze | `lock.svg` `card-slash.svg` | bold |
| **Zone 4** | Card Settings | `setting.svg` `card-edit.svg` | bold |
| **Zone 5** | Portfolio | `chart-2.svg` `candle.svg` | bold |
| **Zone 5** | Swap | `arrow-swap.svg` `convert.svg` | bold |
| **Zone 5** | Receive | `barcode.svg` `scan.svg` | bold |
| **Zone 5** | Send | `send.svg` `direct-send.svg` | bold |
| **Zone 5** | Staking | `chart-success.svg` `lock.svg` | bold |
| **Zone 6** | Transfer Hub | `send-square.svg` `bank.svg` | bold |
| **Zone 6** | QR Scanner | `scan-barcode.svg` `camera.svg` | bold |
| **Zone 6** | Tx Review | `money-time.svg` `security-card.svg` | bold |
| **Zone 6** | Tx Success | `tick-circle.svg` `money-tick.svg` | bold |
| **Zone 6** | Tx Failed | `close-circle.svg` `money-forbidden.svg` | bold |
| **Zone 7** | Profile | `profile-circle.svg` `profile-tick.svg` | bold |
| **Zone 7** | Security | `shield-security.svg` `key.svg` | bold |
| **Zone 7** | Settings | `setting.svg` `category.svg` | linear |
| **Zone 7** | FAQ | `info-circle.svg` `24-support.svg` | linear |
| **Zone 8** | Offline | `wifi.svg` `slash.svg` | linear |
| **Zone 8** | Session Expired | `security-time.svg` `lock.svg` | bold |
| **Zone 8** | Jailbreak | `shield-cross.svg` `shield-slash.svg` | bold |
| **Navbar** | Home tab | `home.svg` | bold (active) / linear (inactive) |
| **Navbar** | Crypto tab | `empty-wallet.svg` | bold / linear |
| **Navbar** | Pay tab | `send-square.svg` | bold / linear |
| **Navbar** | Card tab | `card.svg` | bold / linear |
| **Navbar** | Profile tab | `profile-circle.svg` | bold / linear |

---

## Tham Khảo Thêm

- [DESIGN_SYSTEM.md](../ui/DESIGN_SYSTEM.md) — Token system đầy đủ (Primitive → Semantic → Component)
- [design-system-roadmap.md](../ui/design-system-roadmap.md) — Quick reference và điều hướng
- [packages/svg/README.md](../../packages/svg/README.md) — SVG chart components dùng `@axioledger/svg`
- [packages/html/README.md](../../packages/html/README.md) — HTML components dùng icon trong Button, Navbar
- [docs/architecture/views.md](../architecture/views.md) — AXQ UI Kit, `AXQButtonA11y` với icon
- [docs/AXIOLEDGER_ROADMAP.md](../AXIOLEDGER_ROADMAP.md) — Master Roadmap toàn dự án

---

*AXQ Icon System v1.0 — 1898 SVG · 24×24 · Bold + Linear · `#101426` default fill*
