import React, { useEffect, useState } from "react"
import { BalanceCardHero }  from "@axioledger/ui-kit"
import { StatusBadge }      from "@axioledger/ui-kit"
import { BottomNavBar }     from "@axioledger/ui-kit"
import type { NavTabKey }   from "@axioledger/ui-kit"

// ─── Mock data — replace with real wallet state in Phase 2 ───────────────────

const MOCK_TRANSACTIONS = [
  { id: "1", merchant: "Starbucks",  category: "Coffee",     amount: "$6.30",  status: "success" as const, color: "#49DBC8", emoji: "☕" },
  { id: "2", merchant: "Apple",      category: "Technology", amount: "$5,400", status: "success" as const, color: "#FFAA00", emoji: "🍎" },
  { id: "3", merchant: "Cabify",     category: "Taxi",       amount: "$7.82",  status: "success" as const, color: "#AF96FB", emoji: "🚕" },
  { id: "4", merchant: "McDonalds",  category: "Fast food",  amount: "$13.50", status: "pending" as const, color: "#FC7339", emoji: "🍟" },
  { id: "5", merchant: "7Eleven",    category: "Supermarket",amount: "$0.90",  status: "success" as const, color: "#BEFF6C", emoji: "🏪" },
]

const MOCK_CRYPTO_CHIPS = [
  { label: "12.7% BTC", bg: "#BEFF6C" },
  { label: "12.7% ETH", bg: "#49DBC8" },
  { label: "0.84% GLD", bg: "#AF96FB" },
]

// ─── Inline SVG Quick-Action Icons ───────────────────────────────────────────

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)
const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

// ─── Home Screen ─────────────────────────────────────────────────────────────

function HomeScreen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Balance Card */}
      <BalanceCardHero
        balance="2,500"
        balanceDecimal="70"
        quickActions={[
          { label: "Top up",   icon: <PlusIcon />,   onClick: () => {} },
          { label: "Transfer", icon: <ArrowRight />, onClick: () => {} },
          { label: "Payments", icon: <GridIcon />,   onClick: () => {} },
        ]}
      />

      {/* Crypto allocation chips */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {MOCK_CRYPTO_CHIPS.map((chip) => (
          <span
            key={chip.label}
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          "6px",
              padding:      "6px 14px",
              borderRadius: "9999px",
              background:   chip.bg,
              color:        "#000",
              fontSize:     "13px",
              fontWeight:   600,
              border:       "1.5px solid #000",
              boxShadow:    "2px 2px 0 #000",
            }}
          >
            {chip.label}
          </span>
        ))}
      </div>

      {/* Transaction History */}
      <div
        style={{
          background:   "#FFFFFF",
          borderRadius: "16px",
          border:       "1px solid #EDF1F7",
          overflow:     "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            padding:        "16px 20px 12px",
          }}
        >
          <span style={{ fontSize: "17px", fontWeight: 700, color: "#101426" }}>
            History
          </span>
          <button
            type="button"
            aria-label="Filter history"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#8F9BB3" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
          </button>
        </div>

        {/* "Today" section label */}
        <div style={{ padding: "0 20px 8px", fontSize: "12px", fontWeight: 600, color: "#49DBC8" }}>
          Today
        </div>

        {/* Transaction rows */}
        {MOCK_TRANSACTIONS.map((tx, i) => (
          <div
            key={tx.id}
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "12px",
              padding:        "10px 20px",
              borderTop:      i === 0 ? "none" : "1px solid #EDF1F7",
            }}
          >
            {/* Merchant icon */}
            <span
              aria-hidden="true"
              style={{
                width:        "40px",
                height:       "40px",
                borderRadius: "50%",
                background:   tx.color,
                display:      "flex",
                alignItems:   "center",
                justifyContent: "center",
                fontSize:     "18px",
                flexShrink:   0,
              }}
            >
              {tx.emoji}
            </span>

            {/* Merchant info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#101426", lineHeight: 1.3 }}>
                {tx.merchant}
              </div>
              <div style={{ fontSize: "12px", color: "#8F9BB3", marginTop: "2px" }}>
                {tx.category}
              </div>
            </div>

            {/* Amount + status */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "#101426" }}>
                {tx.amount}
              </span>
              {tx.status === "pending" && (
                <StatusBadge variant="pending" label="Pending" size="sm" />
              )}
            </div>
          </div>
        ))}

        {/* Yesterday divider */}
        <div style={{ padding: "8px 20px", fontSize: "12px", fontWeight: 600, color: "#49DBC8", borderTop: "1px solid #EDF1F7" }}>
          Yesterday
        </div>
        <div style={{ padding: "10px 20px", fontSize: "14px", color: "#8F9BB3", fontStyle: "italic" }}>
          Load more transactions…
        </div>
      </div>
    </div>
  )
}

// ─── Placeholder Screens ──────────────────────────────────────────────────────

function PlaceholderScreen({ name, accentColor }: { name: string; accentColor: string }) {
  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        gap:            "12px",
        padding:        "60px 24px",
        textAlign:      "center",
      }}
    >
      <div
        style={{
          width:        "64px",
          height:       "64px",
          borderRadius: "50%",
          background:   accentColor,
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
          fontSize:     "28px",
          border:       "2px solid #000",
          boxShadow:    "3px 3px 0 #000",
        }}
      >
        🚧
      </div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#101426", margin: 0 }}>
        {name}
      </h2>
      <p style={{ fontSize: "14px", color: "#8F9BB3", margin: 0, maxWidth: "240px", lineHeight: 1.5 }}>
        This screen is in active development. Coming in Phase 2.
      </p>
      <StatusBadge variant="info" label="Phase 2" />
    </div>
  )
}

// ─── WebAuthn Consent Modal ───────────────────────────────────────────────────

/**
 * ConsentModal — Hiển thị một lần duy nhất trước khi người dùng đăng ký Passkey.
 *
 * Yêu cầu GDPR Art. 9: Thu thập dữ liệu sinh trắc học (biometric) qua WebAuthn
 * phải có đồng ý tường minh, tự nguyện và có thể rút lại.
 *
 * Trạng thái đồng ý được lưu trong localStorage với key "axiopass_consent_v1".
 * Người dùng có thể rút lại đồng ý bất kỳ lúc nào tại Cài đặt > Quyền riêng tư.
 *
 * SECURITY: Modal này là điều kiện tiên quyết (gate) trước khi gọi bất kỳ
 * API WebAuthn nào. Không được bỏ qua hoặc auto-dismiss.
 */
const CONSENT_STORAGE_KEY = "axiopass_consent_v1"

function ConsentModal({ onAccept }: { onAccept: () => void }): React.JSX.Element {
  const [checked, setChecked] = useState(false)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         9999,
        display:        "flex",
        alignItems:     "flex-end",
        justifyContent: "center",
        background:     "rgba(0,0,0,0.55)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          background:     "#FFFFFF",
          borderRadius:   "20px 20px 0 0",
          padding:        "28px 24px 36px",
          width:          "100%",
          maxWidth:       "390px",
          boxShadow:      "0 -4px 32px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span
            aria-hidden="true"
            style={{
              fontSize:     "24px",
              width:        "44px",
              height:       "44px",
              borderRadius: "50%",
              background:   "#AF96FB",
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              border:       "2px solid #000",
              flexShrink:   0,
            }}
          >
            🔐
          </span>
          <div>
            <h2
              id="consent-title"
              style={{ fontSize: "17px", fontWeight: 700, color: "#101426", margin: 0, lineHeight: 1.3 }}
            >
              Đăng ký AxioPass Passkey
            </h2>
            <p style={{ fontSize: "12px", color: "#8F9BB3", margin: "2px 0 0" }}>
              Yêu cầu đồng ý — GDPR Art. 9
            </p>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            background:   "#F4F5F8",
            borderRadius: "12px",
            padding:      "14px 16px",
            marginBottom: "18px",
            fontSize:     "13px",
            color:        "#1C2340",
            lineHeight:   1.6,
          }}
        >
          <p style={{ margin: "0 0 10px" }}>
            AxioPass sử dụng <strong>WebAuthn / Passkey</strong> (Face ID, Touch ID, hoặc PIN thiết bị)
            để xác thực giao dịch mà không cần seed phrase.
          </p>
          <ul style={{ margin: 0, paddingLeft: "18px" }}>
            <li style={{ marginBottom: "6px" }}>
              Dữ liệu sinh trắc học <strong>không rời khỏi Secure Enclave</strong> của thiết bị bạn.
            </li>
            <li style={{ marginBottom: "6px" }}>
              Chúng tôi chỉ lưu <strong>Credential ID</strong> và <strong>Public Key</strong> tương ứng.
            </li>
            <li>
              Bạn có thể <strong>xóa Passkey</strong> bất kỳ lúc nào tại Cài đặt → Bảo mật.
            </li>
          </ul>
        </div>

        {/* Checkbox consent */}
        <label
          style={{
            display:    "flex",
            alignItems: "flex-start",
            gap:        "10px",
            cursor:     "pointer",
            marginBottom: "20px",
            fontSize:   "13px",
            color:      "#1C2340",
            lineHeight: 1.5,
          }}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            aria-describedby="consent-description"
            style={{
              marginTop:   "2px",
              width:       "18px",
              height:      "18px",
              cursor:      "pointer",
              accentColor: "#49DBC8",
              flexShrink:  0,
            }}
          />
          <span id="consent-description">
            Tôi đã đọc và đồng ý với{" "}
            <a
              href="/TERMS_OF_SERVICE.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#6C4FE8", fontWeight: 600, textDecoration: "underline" }}
            >
              Điều khoản Dịch vụ
            </a>{" "}
            và{" "}
            <a
              href="/PRIVACY_POLICY.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#6C4FE8", fontWeight: 600, textDecoration: "underline" }}
            >
              Chính sách Bảo mật
            </a>
            , bao gồm việc xử lý dữ liệu sinh trắc học theo GDPR Art. 9.
          </span>
        </label>

        {/* CTA */}
        <button
          type="button"
          disabled={!checked}
          onClick={onAccept}
          aria-disabled={!checked}
          style={{
            width:        "100%",
            padding:      "14px",
            borderRadius: "12px",
            border:       checked ? "2px solid #000" : "2px solid #D0D5DD",
            background:   checked ? "#49DBC8" : "#F4F5F8",
            color:        checked ? "#000" : "#8F9BB3",
            fontSize:     "15px",
            fontWeight:   700,
            cursor:       checked ? "pointer" : "not-allowed",
            boxShadow:    checked ? "3px 3px 0 #000" : "none",
            transition:   "all 0.15s ease",
          }}
        >
          Xác nhận & Tiếp tục
        </button>

        <p style={{ margin: "12px 0 0", fontSize: "11.5px", color: "#8F9BB3", textAlign: "center", lineHeight: 1.4 }}>
          Đây là đồng ý tự nguyện. Bạn vẫn có thể dùng xác thực truyền thống nếu không muốn dùng Passkey.
        </p>
      </div>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────

/**
 * AxioPass Wallet — Root Application Component
 *
 * Phase 1 shell: renders a full Home screen with mock data using
 * the AXQ UI Kit components: BalanceCardHero, StatusBadge, BottomNavBar.
 *
 * Phase 2 (wallet-web roadmap):
 *   - WebAuthn Passkey onboarding (Module 7.1) — gated behind ConsentModal
 *   - Multi-chain balance dashboard (AXQ / VPX / SQX / KPX / VRQ)
 *   - Transfer & Swap flows via @axioledger/wallet-connector
 *   - ANS .axq domain resolution via @axioledger/ans-sdk
 *   - Gas-free UX via Sponsor Paymaster (Module 10.3)
 */
export function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<NavTabKey>("home")

  // ── Consent gate — phải đồng ý trước khi bất kỳ WebAuthn API nào được gọi ──
  const [consentGiven, setConsentGiven] = useState<boolean>(() => {
    try {
      return localStorage.getItem(CONSENT_STORAGE_KEY) === "1"
    } catch {
      return false
    }
  })

  const handleConsentAccept = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, "1")
    } catch {
      // localStorage có thể bị blocked trong private browsing — vẫn cho phép tiếp tục
    }
    setConsentGiven(true)
  }

  // Đảm bảo body không scroll khi modal đang hiển thị
  useEffect(() => {
    if (!consentGiven) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [consentGiven])

  const screenByTab: Record<NavTabKey, React.ReactNode> = {
    home:     <HomeScreen />,
    crypto:   <PlaceholderScreen name="Crypto"   accentColor="#49DBC8" />,
    card:     <PlaceholderScreen name="Card"     accentColor="#BEFF6C" />,
    cashback: <PlaceholderScreen name="Cashback" accentColor="#FD9FDD" />,
    more:     <PlaceholderScreen name="More"     accentColor="#AF96FB" />,
  }

  return (
    <>
      {/* Consent gate — rendered above all content until user accepts */}
      {!consentGiven && <ConsentModal onAccept={handleConsentAccept} />}

    <div
      style={{
        fontFamily:     "var(--axq-font-family, 'Work Sans', system-ui, sans-serif)",
        background:     "var(--axq-bg-secondary, #F4F5F8)",
        minHeight:      "100vh",
        display:        "flex",
        flexDirection:  "column",
        // Simulate mobile width in browser for development
        maxWidth:       "390px",
        margin:         "0 auto",
        position:       "relative",
        boxShadow:      "0 0 60px rgba(0,0,0,0.12)",
      }}
    >
      {/* ── Top Bar ── */}
      <header
        style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          padding:        "16px 20px 8px",
          background:     "#FFFFFF",
          borderBottom:   "1px solid #EDF1F7",
        }}
      >
        <div>
          <div style={{ fontSize: "12px", color: "#8F9BB3", fontWeight: 500 }}>
            Good morning 👋
          </div>
          <div style={{ fontSize: "17px", fontWeight: 700, color: "#101426" }}>
            AxioPass Wallet
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <StatusBadge variant="success" label="Mainnet" size="sm" />
          {/* Avatar placeholder */}
          <div
            aria-label="Profile"
            style={{
              width:        "36px",
              height:       "36px",
              borderRadius: "50%",
              background:   "#AF96FB",
              border:       "2px solid #000",
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              fontSize:     "14px",
              fontWeight:   700,
              color:        "#000",
              cursor:       "pointer",
              boxShadow:    "2px 2px 0 #000",
            }}
          >
            U
          </div>
        </div>
      </header>

      {/* ── Screen Content ── */}
      <main
        style={{
          flex:       1,
          overflowY:  "auto",
          padding:    "16px",
          paddingBottom: "8px",
        }}
      >
        {screenByTab[activeTab]}
      </main>

      {/* ── Bottom Navigation ── */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          // Add a badge to "More" tab to demo the notification count
          { key: "home",     label: "Home",     iconBold: <span style={{ fontSize: "20px" }}>🏠</span>, iconLinear: <span style={{ fontSize: "20px", opacity: 0.4 }}>🏠</span> },
          { key: "crypto",   label: "Crypto",   iconBold: <span style={{ fontSize: "20px" }}>💎</span>, iconLinear: <span style={{ fontSize: "20px", opacity: 0.4 }}>💎</span> },
          { key: "card",     label: "Card",     iconBold: <span style={{ fontSize: "20px" }}>💳</span>, iconLinear: <span style={{ fontSize: "20px", opacity: 0.4 }}>💳</span> },
          { key: "cashback", label: "Cashback", iconBold: <span style={{ fontSize: "20px" }}>🎁</span>, iconLinear: <span style={{ fontSize: "20px", opacity: 0.4 }}>🎁</span> },
          { key: "more",     label: "More",     iconBold: <span style={{ fontSize: "20px" }}>⋯</span>,  iconLinear: <span style={{ fontSize: "20px", opacity: 0.4 }}>⋯</span>,  badge: 3 },
        ]}
      />
    </div>
    </>
  )
}
