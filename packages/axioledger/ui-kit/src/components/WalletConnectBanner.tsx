/**
 * WalletConnectBanner — AXQ Design System
 * Inventory: #122 · Group 11 Crypto & Web3 Specific · Phase 3 🔵
 *
 * WalletConnect session banner — MetaMask / Trust Wallet connected indicator.
 */

import React from "react"

// ─── Token Map ────────────────────────────────────────────────────────────────
// color:    card/bg               → #FFFFFF (banner background)
//           status/success-default → #00D68F (connected dot)
//           text/primary          → #101426 (wallet name)
//           text/secondary        → #8F9BB3 (connection status)
//           status/error-default  → #FF3D71 (disconnect button text)
// radius:   radius/card (16px)
// spacing:  inset/md (16px) padding

// ─── Types ────────────────────────────────────────────────────────────────────

export type WalletConnectProvider = "metamask" | "trustwallet" | "coinbase" | "walletconnect"

export interface WalletConnectBannerProps {
  /** Nhà cung cấp ví kết nối */
  provider?: WalletConnectProvider
  /** Tên ví hiển thị */
  walletName?: string
  /** Địa chỉ ví (sẽ bị truncate) */
  address?: string
  /** Đang kết nối */
  isConnected?: boolean
  /** Callback khi nhấn Disconnect */
  onDisconnect?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const WalletConnectBanner: React.FC<WalletConnectBannerProps> = (_props) => {
  return <div data-testid="axq-122" />
}

WalletConnectBanner.displayName = "WalletConnectBanner"
