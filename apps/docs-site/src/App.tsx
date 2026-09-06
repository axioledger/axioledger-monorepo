import React from "react"

/**
 * Axioledger Developer Documentation Site
 *
 * Phase 1 shell. Phase 2 roadmap:
 *   - Full API reference for all @axioledger/* packages
 *   - @axioledger/ans-sdk interactive playground
 *   - Stateless SVM execution model tutorials
 *   - ZK circuit development guides (Module 5.1)
 *   - Node operator setup & staking guides (Module 3)
 */
export function App(): React.JSX.Element {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", background: "#fff", color: "#111", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Axioledger Docs</h1>
      <p style={{ color: "#3b82d4", margin: 0, fontSize: 13 }}>Developer Documentation · API Reference · Tutorials</p>
      <p style={{ color: "#888", fontSize: 12, margin: 0, border: "1px solid #e5e7eb", padding: "8px 16px", borderRadius: 8 }}>Phase 1 — Shell Scaffold. Full docs site in Phase 2.</p>
    </main>
  )
}
