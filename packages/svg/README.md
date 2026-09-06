# @axioledger/svg

> Draw SVG with plain functions.

## Installation

```console
npm install @axioledger/svg
```

```js
import { svg, circle, rect, path, text as svgText } from "@axioledger/svg"
```

Or without a build step:

```html
<script type="module">
  import { svg, circle, path } from "https://unpkg.com/@axioledger/svg?module"
</script>
```

## License

[MIT](../../LICENSE.md)

---

## Axioledger — SVG trong AXQ Design System & DApp UI

> `@axioledger/svg` được dùng trong Axioledger để vẽ **biểu đồ portfolio**, **progress indicators**, **brand icons** cho 5 token, và **QR code display** trong AxioPass Wallet.

### AXQ Brand Colors (Primitive Tokens)

```js
// Các màu brand chính của Axioledger — dùng trong SVG icons & charts
const AXQ_COLORS = {
  black:  "#000000",  // brand/black — $AXQ primary
  teal:   "#49DBC8",  // brand/teal  — highlight, success accent
  green:  "#BEFF6C",  // brand/green — yield, reward
  orange: "#FC7339",  // brand/orange — warning
  pink:   "#FD9FDD",  // brand/pink  — governance highlight
  purple: "#AF96FB",  // brand/purple — $VRQ, DAO
  yellow: "#FFF172",  // brand/yellow — staking reward
  // Status tokens
  info:    "#0095FF", // info/500  — $VPX blue
  success: "#00D68F", // success/500 — $SQX green
  warning: "#FFAA00", // warning/500 — $KPX yellow
  error:   "#FF3D71", // error/500  — danger
}
```

### 1. Token Portfolio Pie Chart (Zone 5 — Crypto)

```js
import { svg, circle, text as svgText } from "@axioledger/svg"

// Pie chart hiển thị phân bổ danh mục 5 token
const PortfolioPieChart = ({ balances, total }) => {
  const tokens = [
    { sym: "AXQ", value: parseFloat(balances.axq), color: AXQ_COLORS.black  },
    { sym: "VPX", value: parseFloat(balances.vpx), color: AXQ_COLORS.info   },
    { sym: "SQX", value: parseFloat(balances.sqx), color: AXQ_COLORS.success },
    { sym: "KPX", value: parseFloat(balances.kpx), color: AXQ_COLORS.warning },
    { sym: "VRQ", value: parseFloat(balances.vrq), color: AXQ_COLORS.purple  },
  ]

  let offset = 0
  const cx = 60, cy = 60, r = 50
  const circumference = 2 * Math.PI * r

  return svg({ viewBox: "0 0 120 120", width: "200", height: "200" }, [
    // Vẽ từng slice của pie chart
    ...tokens.map(({ value, color }) => {
      const fraction = value / total
      const dashArray = `${fraction * circumference} ${circumference}`
      const dashOffset = -offset * circumference
      offset += fraction

      return circle({
        cx, cy, r,
        fill: "none",
        stroke: color,
        "stroke-width": "16",
        "stroke-dasharray": dashArray,
        "stroke-dashoffset": dashOffset,
        transform: "rotate(-90 60 60)",
      })
    }),
    // Center text — tổng giá trị
    svgText({
      x: "60", y: "58",
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      "font-size": "10",
      "font-family": "Work Sans, sans-serif",
      fill: "#101426",  // text/primary — greyscale/900
    }, ["Portfolio"]),
  ])
}
```

### 2. ZK-Proof Progress Ring (ZK Verification UI)

```js
import { svg, circle } from "@axioledger/svg"

// Progress ring hiển thị tiến độ generate ZK-Proof (mục tiêu < 1s mobile)
const ZKProofProgressRing = ({ progress }) => {
  const r = 40
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference * (1 - progress)

  return svg({ viewBox: "0 0 100 100", width: "100", height: "100" }, [
    // Track (nền)
    circle({
      cx: "50", cy: "50", r,
      fill: "none",
      stroke: "#EDF1F7",        // greyscale/100
      "stroke-width": "8",
    }),
    // Progress (teal brand)
    circle({
      cx: "50", cy: "50", r,
      fill: "none",
      stroke: AXQ_COLORS.teal,  // brand/teal — #49DBC8
      "stroke-width": "8",
      "stroke-dasharray": circumference,
      "stroke-dashoffset": dashOffset,
      "stroke-linecap": "round",
      transform: "rotate(-90 50 50)",
    }),
  ])
}
```

### 3. Validator Uptime Gauge (DAO Dashboard)

```js
import { svg, path, text as svgText } from "@axioledger/svg"

// Gauge chart hiển thị Validator uptime % — cảnh báo ngưỡng Slashing
const ValidatorUptimeGauge = ({ uptime }) => {
  // uptime: 0-100 (%)
  // Ngưỡng: > 99% = success, 95-99% = warning, < 95% = error (Slashing risk!)
  const color = uptime >= 99 ? AXQ_COLORS.success
               : uptime >= 95 ? AXQ_COLORS.warning
               : AXQ_COLORS.error

  return svg({ viewBox: "0 0 100 60", width: "150", height: "90" }, [
    // Gauge arc — semi-circle
    path({
      d: "M 10 50 A 40 40 0 0 1 90 50",
      fill: "none",
      stroke: "#E4E9F2",        // greyscale/200
      "stroke-width": "10",
      "stroke-linecap": "round",
    }),
    path({
      d: "M 10 50 A 40 40 0 0 1 90 50",
      fill: "none",
      stroke: color,
      "stroke-width": "10",
      "stroke-linecap": "round",
      "stroke-dasharray": `${(uptime / 100) * 126} 126`,
    }),
    svgText({
      x: "50", y: "48",
      "text-anchor": "middle",
      "font-size": "14",
      "font-weight": "600",
      "font-family": "Work Sans, sans-serif",
      fill: "#101426",
    }, [`${uptime.toFixed(1)}%`]),
    svgText({
      x: "50", y: "58",
      "text-anchor": "middle",
      "font-size": "8",
      "font-family": "Work Sans, sans-serif",
      fill: "#8F9BB3",           // greyscale/400 — text/tertiary
    }, ["UPTIME"]),
  ])
}
```

### 4. Status Icons — 5 Token Badges

```js
import { svg, circle, path } from "@axioledger/svg"

// Checkmark icon (success) — dùng trong transaction receipt
const CheckmarkIcon = ({ size = 24 }) =>
  svg({
    width: size, height: size,
    viewBox: "0 0 24 24",
    fill: "none",
  }, [
    circle({
      cx: "12", cy: "12", r: "11",
      fill: AXQ_COLORS.success + "22",  // success/100 bg
      stroke: AXQ_COLORS.success,
      "stroke-width": "1.5",
    }),
    path({
      d: "M7 12l3.5 3.5L17 8.5",
      stroke: AXQ_COLORS.success,
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    }),
  ])

// AXQ Logo icon
const AXQLogo = ({ size = 32 }) =>
  svg({
    width: size, height: size,
    viewBox: "0 0 32 32",
    fill: "none",
  }, [
    circle({ cx: "16", cy: "16", r: "16", fill: "#000000" }),
    path({
      d: "M9 22L16 10L23 22M11.5 18H20.5",
      stroke: AXQ_COLORS.teal,    // brand/teal — #49DBC8
      "stroke-width": "2",
      "stroke-linecap": "round",
    }),
  ])
```

### SVG Use Cases trong Axioledger DApp

| Component | SVG Element | Token màu | Zone |
|---|---|---|---|
| Portfolio Pie Chart | `circle` stroke-dasharray | 5 token colors | Zone 5 Crypto |
| ZK-Proof Progress Ring | `circle` progress arc | `brand/teal` (#49DBC8) | KYC + Auth |
| Validator Uptime Gauge | `path` semi-arc | success/warning/error | DAO Dashboard |
| Transaction Success | `circle` + `path` checkmark | `success/500` (#00D68F) | Zone 6 Transfer |
| AXQ Brand Logo | `circle` + `path` | `black` + `brand/teal` | Header, Splash |
| Cashback Chart | `path` line chart | `brand/green` (#BEFF6C) | Zone 3 Home |
| Staking APY Bar | `rect` bar chart | `brand/yellow` (#FFF172) | Zone 5 Crypto |

### Tham Khảo Thêm

- [`@axioledger/html`](../html) — HTML wrappers cho layout xung quanh SVG charts
- [Design System](../../docs/ui/design-system-roadmap.md) — Brand Colors · Status Colors · greyscale tokens
- [Architecture: Views](../../docs/architecture/views.md) — `memo()` để lazy render charts tốn kém
- [Master Roadmap](../../docs/AXIOLEDGER_ROADMAP.md) — Zone 3 Home · Zone 5 Crypto · DAO Dashboard

---

## Axioledger — SVG Nâng Cao & AXQ Brand Icons

> Mở rộng từ phần trước — multi-token chart, animation patterns, QR code display, và brand icon system.

### 5. Cashback Line Chart (Zone 3 — Home)

```js
import { svg, path, line, text as svgText, g } from "@axioledger/svg"

// Line chart hiển thị cashback theo tháng (12 tháng)
const CashbackLineChart = ({ monthlyData }) => {
  const W = 300, H = 120
  const PADDING = 20
  const max = Math.max(...monthlyData.map(d => d.value))
  const min = Math.min(...monthlyData.map(d => d.value))
  const range = max - min || 1

  // Chuyển đổi data → tọa độ SVG
  const points = monthlyData.map((d, i) => ({
    x: PADDING + (i / (monthlyData.length - 1)) * (W - 2 * PADDING),
    y: H - PADDING - ((d.value - min) / range) * (H - 2 * PADDING),
  }))

  // Tạo SVG path từ array of points
  const linePath = points.map((p, i) =>
    `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  ).join(" ")

  // Area fill (gradient effect)
  const areaPath = [
    `M ${points[0].x.toFixed(1)} ${H - PADDING}`,
    ...points.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
    `L ${points[points.length-1].x.toFixed(1)} ${H - PADDING}`,
    "Z",
  ].join(" ")

  return svg({ viewBox: `0 0 ${W} ${H}`, width: "100%", height: "120" }, [
    // Area fill — brand/green nhạt
    path({
      d: areaPath,
      fill: AXQ_COLORS.green + "33",  // brand/green + 20% opacity
      stroke: "none",
    }),
    // Line — brand/green
    path({
      d: linePath,
      fill: "none",
      stroke: AXQ_COLORS.green,      // brand/green — #BEFF6C
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    }),
    // Data points
    ...points.map(p =>
      svg.circle?.({  // circle dots tại mỗi điểm dữ liệu
        cx: p.x, cy: p.y, r: "3",
        fill: AXQ_COLORS.green,
        stroke: "#FFFFFF",
        "stroke-width": "1.5",
      })
    ).filter(Boolean),
  ])
}
```

### 6. QR Code Display Component (Zone 5 — Receive)

```js
import { svg, rect, g } from "@axioledger/svg"

// QR Code SVG — render từ qrcode library thành SVG shapes
// Mỗi module (1x1 cell) = 1 rect element
const QRCodeDisplay = ({ address, size = 200 }) => {
  // qrcode.toDataArray() trả về 2D boolean array
  // const modules = qrcode.toDataArray(address)
  // Ví dụ đơn giản — trong thực tế cần qrcode library
  const moduleSize = 8  // px per module

  return svg({
    viewBox: `0 0 ${size} ${size}`,
    width: size,
    height: size,
    style: { background: "#FFFFFF" },  // bg/primary — luôn trắng cho QR
  }, [
    // Background
    rect({ x: 0, y: 0, width: size, height: size, fill: "#FFFFFF" }),

    // QR border ring — sử dụng AXQ brand color
    rect({
      x: "4", y: "4",
      width: size - 8, height: size - 8,
      fill: "none",
      stroke: AXQ_COLORS.black,    // brand/black
      "stroke-width": "2",
      rx: "8",                      // radius/md
    }),

    // Center AXQ Logo (16x16)
    // g({ transform: `translate(${size/2 - 8}, ${size/2 - 8})` }, [
    //   AXQLogo({ size: 16 })
    // ]),
  ])
}
```

### 7. Staking APY Bar Chart (Zone 5 — Staking)

```js
import { svg, rect, text as svgText, g } from "@axioledger/svg"

// Bar chart so sánh APY giữa các validator
const StakingAPYChart = ({ validators }) => {
  const W = 280, H = 160
  const BAR_WIDTH = 40, BAR_GAP = 10
  const maxAPY = Math.max(...validators.map(v => v.apy))

  return svg({ viewBox: `0 0 ${W} ${H}`, width: "100%", height: "160" }, [
    ...validators.map((v, i) => {
      const barHeight = (v.apy / maxAPY) * (H - 40)
      const x = 20 + i * (BAR_WIDTH + BAR_GAP)
      const y = H - 20 - barHeight
      const color = v.uptime >= 99
        ? AXQ_COLORS.success   // success/500 — #00D68F
        : v.uptime >= 95
        ? AXQ_COLORS.warning   // warning/500 — #FFAA00
        : AXQ_COLORS.error     // error/500 — #FF3D71

      return g({}, [
        // Bar
        rect({
          x, y, width: BAR_WIDTH, height: barHeight,
          fill: color,
          rx: "4",  // radius/sm
          opacity: "0.85",
        }),
        // APY label on top
        svgText({
          x: x + BAR_WIDTH / 2, y: y - 4,
          "text-anchor": "middle",
          "font-size": "10",
          "font-family": "Work Sans, sans-serif",
          "font-weight": "600",
          fill: "#101426",  // text/primary
        }, [`${v.apy.toFixed(1)}%`]),
        // Validator name below
        svgText({
          x: x + BAR_WIDTH / 2, y: H - 5,
          "text-anchor": "middle",
          "font-size": "8",
          "font-family": "Work Sans, sans-serif",
          fill: "#8F9BB3",  // text/tertiary
        }, [v.name.slice(0, 4)]),
      ])
    }),
  ])
}
```

### 8. Token Price Mini Sparkline (Zone 3 — Dashboard)

```js
import { svg, path } from "@axioledger/svg"

// Tiny sparkline (32x20px) cho token price trong danh sách
const PriceSparkline = ({ prices, isPositive }) => {
  const W = 48, H = 20
  if (!prices || prices.length < 2) return svg({ width: W, height: H })

  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1

  const pts = prices.map((p, i) => ({
    x: (i / (prices.length - 1)) * W,
    y: H - ((p - min) / range) * H,
  }))
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")

  return svg({ viewBox: `0 0 ${W} ${H}`, width: W, height: H }, [
    path({
      d,
      fill: "none",
      stroke: isPositive ? AXQ_COLORS.success : AXQ_COLORS.error,
      "stroke-width": "1.5",
      "stroke-linecap": "round",
    }),
  ])
}
```

### SVG Component Catalog (cập nhật)

| Component | SVG Elements | AXQ Colors | Zone | `memo()`? |
|---|---|---|---|---|
| `PortfolioPieChart` | `circle` stroke-dasharray | 5 token colors | Zone 5 | ✓ |
| `ZKProofProgressRing` | `circle` animated arc | `brand/teal` | KYC + Auth | — |
| `ValidatorUptimeGauge` | `path` semi-arc | success/warning/error | DAO | ✓ |
| `CheckmarkIcon` | `circle` + `path` checkmark | `success/500` | Zone 6 | ✓ |
| `AXQLogo` | `circle` + `path` A-shape | `black` + `brand/teal` | Header | ✓ |
| `CashbackLineChart` | `path` line + area | `brand/green` | Zone 3 | ✓ |
| `QRCodeDisplay` | `rect` modules | `black` + `white` | Zone 5 | ✓ |
| `StakingAPYChart` | `rect` bars | success/warning/error | Zone 5 | ✓ |
| `PriceSparkline` | `path` mini line | success/error | Zone 3 | ✓ |

### Tham Khảo Thêm (cập nhật)

- [`@axioledger/html`](../html) — Layout wrapper xung quanh SVG charts (card container)
- [Architecture: Views](../../docs/architecture/views.md) — `memo(PortfolioPieChart, ...)` — lazy render
- [Architecture: Subscriptions](../../docs/architecture/subscriptions.md) — `onEvery(5000, RefreshPriceFeed)` trigger re-render sparkline
- [Design System](../../docs/ui/DESIGN_SYSTEM.md) — Brand Colors · Status Colors · greyscale tokens
- [Master Roadmap](../../docs/AXIOLEDGER_ROADMAP.md) — Zone 3 Home · Zone 5 Crypto · DAO Dashboard

---

## AXQ Icon System Integration

> `@axioledger/svg` kết hợp với **1898 SVG icons** tại `docs/asset/icon/` để render icon trong AxioPass Wallet.  
> Xem chi tiết: [`docs/asset/ICON_SYSTEM.md`](../../docs/asset/ICON_SYSTEM.md)

### Dùng SVG Assets với @axioledger/svg

```js
import { svg, use, defs, symbol } from "@axioledger/svg"

// Cách 1: img tag đơn giản (không cần inline)
const IconImg = ({ name, style = "bold", size = 24, alt = "" }) =>
  h("img", {
    src: `/docs/asset/icon/${style}/${name}.svg`,
    width: size, height: size,
    alt, "aria-hidden": alt === "" ? "true" : undefined,
  })

// Cách 2: Fetch + inline SVG content để control màu via CSS
// (Dùng effecter để fetch SVG text, sau đó render với h())

// Cách 3: CSS filter trick — trắng hóa icon tối trên button primary
const WhiteIcon = ({ name, size = 20 }) =>
  h("img", {
    src: `/docs/asset/icon/bold/${name}.svg`,
    width: size, height: size, alt: "",
    "aria-hidden": "true",
    style: { filter: "brightness(0) invert(1)" },  // #101426 → #FFFFFF
  })
```

### Icon Size Tokens

| Token | Value | Dùng cho |
|---|---|---|
| `icon/size/standard` | 20px | Button icon, Badge icon |
| `icon/size/nav` | 24px | Navbar icon (default SVG viewBox) |
| `icon/size/large` | 32px | Empty State illustration |

### Bold vs Linear

| Style | Path | Khi nào |
|---|---|---|
| **Bold** | `icon/bold/*.svg` | Active, CTA, selected, error/warning |
| **Linear** | `icon/linear/*.svg` | Inactive, secondary, dark mode |
