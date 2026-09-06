/**
 * CandlestickChart — AXQ Design System
 * Inventory: #80 · Group 7 Charts & Financial Analytics · Phase 3 🔵
 *
 * OHLC Candlestick chart — Green/Red candles.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    status/success-default → #00D68F (bullish / green candle body)
//           status/error-default   → #FF3D71 (bearish / red candle body)
//           bg/primary             → #FFFFFF (chart background)
//           text/tertiary          → #8F9BB3 (axis labels)
// spacing:  candle width 8px · wick width 1px

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CandlestickDataPoint {
  /** Timestamp (epoch ms) */
  timestamp: number
  /** Open price */
  open: number
  /** High price */
  high: number
  /** Low price */
  low: number
  /** Close price */
  close: number
}

export interface CandlestickChartProps {
  /** Dữ liệu OHLC */
  data?: CandlestickDataPoint[]
  /** Chiều cao chart. Mặc định: 260 */
  height?: number
  /** Đang tải */
  isLoading?: boolean
  /** Callback khi nhấn vào nến */
  onCandlePress?: (point: CandlestickDataPoint) => void
  /** Hiển thị volume bars */
  showVolume?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CandlestickChart: React.FC<CandlestickChartProps> = (_props) => {
  return <div data-testid="axq-80" />
}

CandlestickChart.displayName = "CandlestickChart"
