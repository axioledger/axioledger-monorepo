/**
 * CardVisual component — AXQ Design System
 *
 * Hiển thị wallet card dạng credit card visual.
 * Variants: axq | vpx | sqx | kpx — mỗi loại có gradient riêng.
 * Masked address display (hiện 4 ký tự đầu và 4 ký tự cuối).
 */

import React from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type CardVisualVariant = "axq" | "vpx" | "sqx" | "kpx"

export interface CardVisualProps {
  /** Địa chỉ ví (base58 hoặc 0x...) */
  address: string
  /** Số dư hiển thị */
  balance: string
  /** Ký hiệu token. Ví dụ: "$AXQ" */
  tokenSymbol: string
  /** Tên mạng. Ví dụ: "Axioledger Mainnet" */
  networkName: string
  /** Variant màu sắc theo loại token */
  variant?: CardVisualVariant
  /** Tên chủ ví (tuỳ chọn) */
  holderName?: string
}

// ─── Gradient Map ─────────────────────────────────────────────────────────────

const GRADIENTS: Record<CardVisualVariant, string> = {
  axq: "linear-gradient(135deg, #101426 0%, #1a2a3a 50%, #49DBC8 100%)",
  vpx: "linear-gradient(135deg, #101426 0%, #1e1a2e 50%, #AF96FB 100%)",
  sqx: "linear-gradient(135deg, #101426 0%, #1a2610 50%, #BEFF6C 100%)",
  kpx: "linear-gradient(135deg, #101426 0%, #2a1a10 50%, #FC7339 100%)",
}

const ACCENT_COLORS: Record<CardVisualVariant, string> = {
  axq: "#49DBC8",
  vpx: "#AF96FB",
  sqx: "#BEFF6C",
  kpx: "#FC7339",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Rút gọn địa chỉ: hiển thị 6 ký tự đầu + "..." + 4 ký tự cuối.
 */
function maskAddress(addr: string): string {
  if (addr.length <= 12) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CardVisual: React.FC<CardVisualProps> = ({
  address,
  balance,
  tokenSymbol,
  networkName,
  variant     = "axq",
  holderName,
}) => {
  const accent = ACCENT_COLORS[variant]
  const gradient = GRADIENTS[variant]

  return (
    <div
      role="img"
      aria-label={`${tokenSymbol} wallet card — ${maskAddress(address)}`}
      style={{
        width:        "340px",
        height:       "200px",
        borderRadius: "16px",
        background:   gradient,
        padding:      "24px",
        display:      "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position:     "relative",
        overflow:     "hidden",
        userSelect:   "none",
        boxShadow:    "0 8px 32px rgba(0,0,0,0.35)",
        color:        "#ffffff",
        fontFamily:   "inherit",
      }}
    >
      {/* Decorative circle */}
      <div
        aria-hidden="true"
        style={{
          position:     "absolute",
          top:          "-40px",
          right:        "-40px",
          width:        "160px",
          height:       "160px",
          borderRadius: "50%",
          background:   `${accent}22`,
          border:       `2px solid ${accent}33`,
        }}
      />

      {/* Top row — network + symbol */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "11px", opacity: 0.6, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {networkName}
          </div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: accent, marginTop: "2px" }}>
            {tokenSymbol}
          </div>
        </div>
        {/* Chip decoration */}
        <div
          aria-hidden="true"
          style={{
            width: "36px", height: "28px",
            borderRadius: "4px",
            background: `linear-gradient(135deg, ${accent}66, ${accent}22)`,
            border: `1px solid ${accent}55`,
          }}
        />
      </div>

      {/* Balance */}
      <div>
        <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "4px" }}>Số dư</div>
        <div style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>
          {balance}
        </div>
      </div>

      {/* Bottom row — address + holder */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "2px", fontFamily: "monospace" }}>
            Địa chỉ
          </div>
          <div style={{ fontSize: "13px", fontFamily: "monospace", letterSpacing: "0.05em" }}>
            {maskAddress(address)}
          </div>
        </div>
        {holderName && (
          <div style={{ fontSize: "13px", opacity: 0.7, textAlign: "right" }}>
            {holderName}
          </div>
        )}
      </div>
    </div>
  )
}

CardVisual.displayName = "CardVisual"
