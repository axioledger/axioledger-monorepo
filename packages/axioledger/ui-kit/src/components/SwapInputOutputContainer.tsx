/**
 * SwapInputOutputContainer — AXQ Design System
 * Inventory: #116 · Group 11 Crypto & Web3 Specific · Phase 3 🔵
 *
 * Swap Pay/Receive connected input container.
 * Re-tagged from Phase 1–2 to Phase 3 (Zone 5 Crypto = Roadmap Phase 3).
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    card/bg        → #FFFFFF (container background)
//           input/border   → #C5CEE0 (input border)
//           text/primary   → #101426 (amount text)
//           text/secondary → #8F9BB3 (token label / balance)
//           brand/teal     → #49DBC8 (swap arrow center button bg)
// radius:   radius/card (16px) outer · radius/input (12px) inner inputs
// spacing:  inset/md (16px) · swap icon button 40×40px centered overlap

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SwapTokenInfo {
  /** Symbol token, e.g. "ETH" */
  symbol: string
  /** Logo URL */
  logoUrl?: string
  /** Số dư ví (formatted) */
  balance?: string
}

export interface SwapInputOutputContainerProps {
  /** Token đầu vào (Pay) */
  fromToken?: SwapTokenInfo
  /** Token đầu ra (Receive) */
  toToken?: SwapTokenInfo
  /** Số lượng đầu vào (string để hỗ trợ decimal) */
  fromAmount?: string
  /** Số lượng đầu ra (tính toán / ước tính) */
  toAmount?: string
  /** Callback khi đổi chiều swap */
  onSwapDirection?: () => void
  /** Callback khi thay đổi from amount */
  onFromAmountChange?: (value: string) => void
  /** Callback khi nhấn chọn from token */
  onSelectFromToken?: () => void
  /** Callback khi nhấn chọn to token */
  onSelectToToken?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SwapInputOutputContainer: React.FC<SwapInputOutputContainerProps> = (_props) => {
  return <div data-testid="axq-116" />
}

SwapInputOutputContainer.displayName = "SwapInputOutputContainer"
