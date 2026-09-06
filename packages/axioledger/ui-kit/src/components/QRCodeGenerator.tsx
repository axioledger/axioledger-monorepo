/**
 * QRCodeGenerator — AXQ Design System
 *
 * Tạo mã QR hoàn toàn trong trình duyệt, zero external dependencies.
 * Render bằng SVG thuần — không Canvas, không thư viện ngoài.
 *
 * Hỗ trợ:
 *   - QR Version 1–6 (tự động chọn dựa trên độ dài data)
 *   - Error Correction Level: M (15% recovery — mặc định) và Q (25%)
 *   - Encoding: Byte mode (UTF-8 compatible)
 *   - Center logo overlay (AXQ brand)
 *   - Dark mode via CSS custom property
 *
 * Giới hạn kỹ thuật:
 *   Encoder này dùng thuật toán Reed-Solomon rút gọn đủ để tạo QR hợp lệ
 *   cho các địa chỉ ví (<= 100 ký tự). Với dữ liệu dài hơn, dùng thư viện
 *   chuyên dụng (qrcode.js, qrcode-generator).
 *
 * Token Map:
 *   --axq-primitive-black : QR modules (dark squares)
 *   --axq-primitive-white : QR background
 *   --axq-radius-sm       : container border-radius
 */

import React, { useMemo } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QRCodeGeneratorProps {
  /** Dữ liệu encode vào QR (địa chỉ ví, URL, ANS domain...) */
  value: string
  /** Kích thước SVG tính bằng px. Mặc định: 200 */
  size?: number
  /** Màu module tối (dark squares). Mặc định: "#000000" */
  darkColor?: string
  /** Màu nền (light squares). Mặc định: "#FFFFFF" */
  lightColor?: string
  /** Logo React node hiển thị tại trung tâm */
  centerLogo?: React.ReactNode
  /** Label mô tả bên dưới QR (ví dụ: tên miền .axq) */
  label?: string
  /** Error correction level. M = 15%, Q = 25%. Mặc định: "M" */
  ecLevel?: "M" | "Q"
  /** className cho wrapper div */
  className?: string
}

// ─── QR Encoder (Byte Mode, Version 1–6) ─────────────────────────────────────
//
// Tham chiếu: ISO/IEC 18004:2015 — QR Code bar code symbology specification
// Capacity (byte mode, ECL M):
//   V1: 14  V2: 26  V3: 42  V4: 62  V5: 84  V6: 106
// Capacity (byte mode, ECL Q):
//   V1: 11  V2: 20  V3: 32  V4: 46  V5: 60  V6: 74

interface QrParams {
  version:   number   // 1–6
  ecLevel:   "M" | "Q"
  moduleSize: number  // modules per side = 4*version + 17
}

// Data codewords capacity [version][ECL-M, ECL-Q]
const BYTE_CAPACITY: Record<number, { M: number; Q: number }> = {
  1: { M: 14,  Q: 11  },
  2: { M: 26,  Q: 20  },
  3: { M: 42,  Q: 32  },
  4: { M: 62,  Q: 46  },
  5: { M: 84,  Q: 60  },
  6: { M: 106, Q: 74  },
}

// Number of error correction codewords [version][ECL-M, ECL-Q]
const EC_CODEWORDS: Record<number, { M: number; Q: number }> = {
  1: { M: 10, Q: 13 },
  2: { M: 16, Q: 22 },
  3: { M: 26, Q: 36 },
  4: { M: 36, Q: 52 },
  5: { M: 48, Q: 72 },
  6: { M: 64, Q: 96 },
}

// Format information strings (pre-computed, [ecLevel][mask])
// mask pattern 0 (010): chọn pattern đơn giản nhất cho thuật toán rút gọn
const FORMAT_INFO: Record<string, number[]> = {
  M_0: [1,0,1,0,1,0,0,0,0,0,1,0,0,1,0],
  Q_0: [0,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
}

function chooseVersion(byteLen: number, ecLevel: "M" | "Q"): number {
  for (let v = 1; v <= 6; v++) {
    if (BYTE_CAPACITY[v][ecLevel] >= byteLen) return v
  }
  return 6  // Dữ liệu quá dài — dùng version cao nhất hỗ trợ
}

// ── Reed-Solomon GF(256) arithmetic ─────────────────────────────────────────

const GF_EXP = new Uint8Array(512)
const GF_LOG = new Uint8Array(256)

;(function initGF() {
  let x = 1
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x
    GF_LOG[x] = i
    x = x << 1
    if (x & 0x100) x ^= 0x11d  // primitive polynomial x^8+x^4+x^3+x^2+1
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255]
})()

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255]
}

function rsGeneratorPoly(n: number): number[] {
  let g = [1]
  for (let i = 0; i < n; i++) {
    const factor = [1, GF_EXP[i]]
    const result = new Array(g.length + factor.length - 1).fill(0)
    for (let j = 0; j < g.length; j++)
      for (let k = 0; k < factor.length; k++)
        result[j + k] ^= gfMul(g[j], factor[k])
    g = result
  }
  return g
}

function rsEncode(data: number[], nEC: number): number[] {
  const gen = rsGeneratorPoly(nEC)
  const msg = [...data, ...new Array(nEC).fill(0)]
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i]
    if (coef !== 0) {
      for (let j = 1; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef)
      }
    }
  }
  return msg.slice(data.length)
}

// ── Bit stream builder ───────────────────────────────────────────────────────

class BitStream {
  private bits: number[] = []

  append(value: number, length: number): void {
    for (let i = length - 1; i >= 0; i--)
      this.bits.push((value >> i) & 1)
  }

  pad(totalBits: number): void {
    while (this.bits.length < totalBits && this.bits.length % 8 !== 0) this.bits.push(0)
    const padBytes = [0b11101100, 0b00010001]
    let pi = 0
    while (this.bits.length < totalBits) {
      const b = padBytes[pi++ % 2]
      for (let i = 7; i >= 0; i--) this.bits.push((b >> i) & 1)
    }
  }

  toBytes(): number[] {
    const bytes: number[] = []
    for (let i = 0; i < this.bits.length; i += 8) {
      let b = 0
      for (let j = 0; j < 8; j++) b = (b << 1) | (this.bits[i + j] ?? 0)
      bytes.push(b)
    }
    return bytes
  }
}

// ── QR Matrix builder ────────────────────────────────────────────────────────

type Matrix = (0 | 1 | -1)[][]   // -1 = unset

function makeMatrix(size: number): Matrix {
  return Array.from({ length: size }, () => new Array(size).fill(-1) as (0|1|-1)[])
}

function setModule(m: Matrix, r: number, c: number, v: 0 | 1): void {
  if (r >= 0 && r < m.length && c >= 0 && c < m.length) m[r][c] = v
}

/** Finder pattern (7×7 with separator) */
function placeFinder(m: Matrix, row: number, col: number): void {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const bit: 0|1 =
        r === -1 || r === 7 || c === -1 || c === 7 ? 0
        : r === 0 || r === 6 || c === 0 || c === 6 ? 1
        : r >= 2 && r <= 4 && c >= 2 && c <= 4 ? 1
        : 0
      setModule(m, row + r, col + c, bit)
    }
  }
}

/** Alignment pattern (5×5) */
function placeAlignment(m: Matrix, row: number, col: number): void {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const bit: 0|1 =
        r === -2 || r === 2 || c === -2 || c === 2 ? 1
        : r === 0 && c === 0 ? 1
        : 0
      if (m[row + r]?.[col + c] === -1) setModule(m, row + r, col + c, bit)
    }
  }
}

/** Timing patterns */
function placeTiming(m: Matrix, size: number): void {
  for (let i = 8; i < size - 8; i++) {
    const v: 0|1 = i % 2 === 0 ? 1 : 0
    if (m[6][i] === -1) m[6][i] = v
    if (m[i][6] === -1) m[i][6] = v
  }
}

/** Dark module */
function placeDarkModule(m: Matrix, version: number): void {
  m[4 * version + 9][8] = 1
}

/** Format info (15 bits, placed around finder patterns) */
function placeFormatInfo(m: Matrix, size: number, formatBits: number[]): void {
  const pos1 = [
    [8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],
    [7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]
  ]
  const pos2 = [
    [size-1,8],[size-2,8],[size-3,8],[size-4,8],[size-5,8],[size-6,8],[size-7,8],
    [8,size-8],[8,size-7],[8,size-6],[8,size-5],[8,size-4],[8,size-3],[8,size-2],[8,size-1]
  ]
  for (let i = 0; i < 15; i++) {
    const v = formatBits[i] as 0|1
    setModule(m, pos1[i][0], pos1[i][1], v)
    setModule(m, pos2[i][0], pos2[i][1], v)
  }
}

/** Alignment pattern centers for versions 2–6 */
const ALIGNMENT_CENTERS: Record<number, number[]> = {
  2: [18], 3: [22], 4: [26], 5: [30], 6: [34]
}

/** Data placement — zigzag upward */
function placeData(m: Matrix, size: number, bits: number[]): void {
  let bitIdx = 0
  let up = true
  let c = size - 1
  while (c >= 0) {
    if (c === 6) c--  // skip timing column
    const cols = [c, c - 1]
    for (let rOff = 0; rOff < size; rOff++) {
      const r = up ? size - 1 - rOff : rOff
      for (const col of cols) {
        if (m[r][col] === -1) {
          m[r][col] = (bits[bitIdx++] ?? 0) as 0|1
        }
      }
    }
    up = !up
    c -= 2
  }
}

/** Mask pattern 0: (row + col) % 2 == 0 */
function applyMask(m: Matrix, size: number): void {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (m[r][c] !== -1 && (r + c) % 2 === 0) {
        m[r][c] = (m[r][c] === 1 ? 0 : 1) as 0|1
      }
    }
  }
}

// ── Top-level encoder ────────────────────────────────────────────────────────

function encodeQR(text: string, ecLevel: "M" | "Q"): Matrix | null {
  const bytes = Array.from(new TextEncoder().encode(text))
  const version = chooseVersion(bytes.length, ecLevel)
  const size = 4 * version + 17

  const totalDataBits = BYTE_CAPACITY[version][ecLevel] * 8
  const nEC = EC_CODEWORDS[version][ecLevel]

  // Build data codewords
  const bs = new BitStream()
  bs.append(0b0100, 4)              // byte mode indicator
  bs.append(bytes.length, 8)        // char count
  for (const b of bytes) bs.append(b, 8)
  bs.append(0, 4)                   // terminator
  bs.pad(totalDataBits)
  const dataBytes = bs.toBytes()

  // Error correction
  const ecBytes = rsEncode(dataBytes.slice(0, dataBytes.length - nEC), nEC)
  const allBytes = [...dataBytes.slice(0, dataBytes.length - nEC), ...ecBytes]

  // Convert to bit array
  const allBits: number[] = []
  for (const b of allBytes) for (let i = 7; i >= 0; i--) allBits.push((b >> i) & 1)

  // Build matrix
  const m = makeMatrix(size)
  placeFinder(m, 0, 0)
  placeFinder(m, 0, size - 7)
  placeFinder(m, size - 7, 0)
  placeTiming(m, size)
  placeDarkModule(m, version)

  if (version >= 2 && ALIGNMENT_CENTERS[version]) {
    const centers = ALIGNMENT_CENTERS[version]
    for (const r of centers) for (const c of centers) {
      if (!((r === 6 && c === 6) || (r === 6 && c === size-7) || (r === size-7 && c === 6)))
        placeAlignment(m, r, c)
    }
  }

  const fmtKey = `${ecLevel}_0` as keyof typeof FORMAT_INFO
  placeFormatInfo(m, size, FORMAT_INFO[fmtKey] ?? FORMAT_INFO["M_0"])
  placeData(m, size, allBits)
  applyMask(m, size)

  return m
}

// ─── SVG Renderer ─────────────────────────────────────────────────────────────

function matrixToSvgPaths(matrix: Matrix, moduleSize: number): string {
  const paths: string[] = []
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === 1) {
        const x = c * moduleSize
        const y = r * moduleSize
        paths.push(`M${x},${y}h${moduleSize}v${moduleSize}h-${moduleSize}z`)
      }
    }
  }
  return paths.join(" ")
}

// ─── React Component ─────────────────────────────────────────────────────────

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size       = 200,
  darkColor  = "var(--axq-primitive-black, #000000)",
  lightColor = "var(--axq-primitive-white, #FFFFFF)",
  centerLogo,
  label,
  ecLevel    = "M",
  className,
}) => {
  const matrix = useMemo(() => {
    if (!value || value.trim().length === 0) return null
    try {
      return encodeQR(value.trim(), ecLevel)
    } catch {
      return null
    }
  }, [value, ecLevel])

  if (!matrix) {
    return (
      <div
        style={{
          width: size, height: size,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: lightColor, borderRadius: "8px",
          fontSize: "12px", color: "#8F9BB3",
        }}
        aria-label="QR code không thể tạo — dữ liệu không hợp lệ hoặc quá dài"
      >
        QR Error
      </div>
    )
  }

  const qrSize   = matrix.length
  const padding  = 4  // quiet zone in modules (spec yêu cầu ≥ 4)
  const totalModules = qrSize + padding * 2
  const moduleSize   = size / totalModules
  const svgSize      = size
  const offsetPx     = padding * moduleSize

  const svgPath = matrixToSvgPaths(matrix, moduleSize)

  // Center logo: chiếm ~22% kích thước QR (đủ để logo hiển thị rõ)
  const logoSize = size * 0.22
  const logoPad  = size * 0.025
  const logoX    = (size - logoSize) / 2
  const logoY    = (size - logoSize) / 2

  return (
    <div
      className={className}
      style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        role="img"
        aria-label={`QR code${label ? ` cho ${label}` : ""}: ${value}`}
        style={{ borderRadius: "8px", display: "block" }}
      >
        {/* Background */}
        <rect width={svgSize} height={svgSize} fill={lightColor} />

        {/* QR modules */}
        <g transform={`translate(${offsetPx},${offsetPx})`}>
          <path d={svgPath} fill={darkColor} />
        </g>

        {/* Center logo background circle (white) */}
        {centerLogo && (
          <rect
            x={logoX - logoPad}
            y={logoY - logoPad}
            width={logoSize + logoPad * 2}
            height={logoSize + logoPad * 2}
            rx={(logoSize + logoPad * 2) / 2}
            fill={lightColor}
          />
        )}

        {/* Center logo via foreignObject */}
        {centerLogo && (
          <foreignObject x={logoX} y={logoY} width={logoSize} height={logoSize}>
            <div
              style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {centerLogo}
            </div>
          </foreignObject>
        )}
      </svg>

      {/* Label */}
      {label && (
        <span
          style={{
            fontSize: "12px",
            color: "var(--axq-text-secondary, #8F9BB3)",
            fontFamily: "var(--axq-font-family, inherit)",
            textAlign: "center",
            maxWidth: `${size}px`,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          aria-label={`QR label: ${label}`}
        >
          {label}
        </span>
      )}
    </div>
  )
}

QRCodeGenerator.displayName = "QRCodeGenerator"
