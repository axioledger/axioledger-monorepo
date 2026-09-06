import React from "react"

/**
 * Axioledger Craft Portal — Developer Portal & App Studio
 *
 * Phase 1 shell. Phase 2 roadmap:
 *   - SDK Reference & Interactive Playground
 *   - create-app Project Scaffolding via @axioledger/create-app (Module 26)
 *   - Smart Contract Debugger (Module 26.4)
 *   - Localnet Simulator Framework (Module 26.3)
 *   - ZK Circuit Builder (Module 5.1)
 */
export function App(): React.JSX.Element {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", background: "#0f0f23", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Craft Portal</h1>
      <p style={{ color: "#49DBC8", margin: 0, fontSize: 13 }}>Developer Portal · SDK Docs · App Studio</p>
      <p style={{ color: "#555", fontSize: 12, margin: 0, border: "1px solid #222", padding: "8px 16px", borderRadius: 8 }}>Phase 1 — Shell Scaffold. Full portal in Phase 2.</p>
    </main>
  )
}
