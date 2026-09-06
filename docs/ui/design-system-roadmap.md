# AXQ Design System — Lộ Trình & Tổng Quan

> Tài liệu điều hướng nhanh. Tài liệu đầy đủ: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)
> Phiên bản: v2.1 · Font: Work Sans · Mô hình 3 lớp: Primitive → Semantic → Component · Icon: 1898 SVG

---

## Cấu Trúc Tài Liệu

| Tệp | Nội dung |
|---|---|
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | **Tài liệu đầy đủ** — token tables, CSS output, Figma JSON, naming rules, icon system, Axiopass 65+ screens |
| [`../asset/ICON_SYSTEM.md`](../asset/ICON_SYSTEM.md) | **Icon Library** — 1898 SVG, Bold + Linear, danh mục theo chức năng, Zone mapping |

---

## Tóm Tắt Nhanh — 3 Lớp Token

```
Primitive  →  Giá trị gốc tuyệt đối  →  #49DBC8, 24px, 16px, Work Sans
    ↓
Semantic   →  Ý nghĩa UI cụ thể      →  bg/brand, text/primary, radius/button
    ↓
Component  →  Token theo linh kiện   →  button/primary-bg, input/border-focus, card/radius
```

## Collections Figma (7 collections)

```
AXQ / Primitive / Color           [mode: Value]
AXQ / Primitive / Spacing         [mode: Value]
AXQ / Primitive / Radius          [mode: Value]
AXQ / Primitive / Font Size       [mode: Value]
AXQ / Semantic / Color            [mode: Light, Dark]
AXQ / Semantic / Spacing+Radius   [mode: Default]
AXQ / Component                   [mode: Default]
```

## Key Tokens Nhanh

| Token | Layer | Value | Dùng cho |
|---|---|---|---|
| `greyscale/900` | Primitive | `#101426` | Brand text |
| `black` | Primitive | `#000000` | Button primary bg |
| `brand/teal` | Primitive | `#49DBC8` | Accent, highlight |
| `radius/2xl` | Primitive | `24px` | Button pill |
| `bg/brand` | Semantic | → `black` | Button fill |
| `text/inverse` | Semantic | → `white` | Button text |
| `button/primary-bg` | Component | → `bg/brand` | Button render |
| `button/radius` | Component | → `radius/button` | Button corner |

## Axiopass Wallet — Tóm Tắt Screens

| Zone | Tên | Screens | Phase |
|---|---|---|---|
| 1 | Onboarding & Authentication | 14 | Phase 1 Critical |
| 2 | KYC & Compliance | 10 | Phase 1 Critical |
| 3 | Home & Dashboard | 7 | Phase 2 High |
| 4 | Card Management | 9 | Phase 2 High |
| 5 | Crypto & Web3 | 10 | Phase 3 Medium |
| 6 | Transfer & Payments | 9 | Phase 3 Medium |
| 7 | Profile, Settings & Support | 8 | Phase 4 Polish |
| 8 | System States & Edge Cases | 8 | Phase 4 Polish |
| **Total** | | **65+** | **7 tuần** |

---

> Xem toàn bộ: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)  
> Liên kết: [Architecture Views](../architecture/views.md) · [Master Roadmap](../AXIOLEDGER_ROADMAP.md)

---

## Icon System — Tóm Tắt Nhanh

| Thông tin | Giá trị |
|---|---|
| **Tổng số** | **1898 SVG** (979 Bold + 919 Linear) |
| **Thư mục** | `docs/asset/icon/bold/` · `docs/asset/icon/linear/` |
| **Kích thước** | 24×24px — `viewBox="0 0 24 24"` |
| **Fill mặc định** | `#101426` = `Primitive/greyscale/900` = `icon/primary` |
| **Tài liệu đầy đủ** | [`../asset/ICON_SYSTEM.md`](../asset/ICON_SYSTEM.md) |

### Quy Tắc Nhanh

```
Bold  → Active, filled, CTA, selected, error/warning status
Linear → Inactive, outline, secondary, helper, dark mode

icon/size/standard = 20px  (button, badge)
icon/size/nav      = 24px  (navbar, default SVG)
icon/size/large    = 32px  (empty state)
```

### Icons Quan Trọng — Axiopass

```
Navbar:   home · empty-wallet · send-square · card · profile-circle
Auth:     finger-scan · lock · password-check · shield-security
KYC:      scan · 3d-cube-scan · verify · personalcard
Wallet:   arrow-swap · send · receive-square · money-tick
Card:     card · eye · lock-slash · card-slash
Charts:   chart · candle · trend-up · trend-down
```

---

> Xem toàn bộ: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) · [`../asset/ICON_SYSTEM.md`](../asset/ICON_SYSTEM.md)  
> Liên kết: [Architecture Views](../architecture/views.md) · [Master Roadmap](../AXIOLEDGER_ROADMAP.md)
