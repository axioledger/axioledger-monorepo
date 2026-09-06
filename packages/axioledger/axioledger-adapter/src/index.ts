/**
 * @axioledger/axioledger-adapter
 * Bridges axioledger v2 VDOM patterns → AXQ Blockchain Action patterns.
 *
 * Provides: dispatch wrappers, effect creators, subscription helpers
 * that map axioledger's pure functional model to blockchain async operations.
 */
import type { Dispatch } from "axioledger"

// ─── Types ───────────────────────────────────────────────────────────────────

export type AXQAction<S, P = void> = P extends void
  ? (state: S) => S | [S, ...unknown[]]
  : (state: S, payload: P) => S | [S, ...unknown[]]

export interface BlockchainEffect {
  type: "transaction" | "query" | "subscription"
  payload: unknown
}

// ─── Effect Creators ─────────────────────────────────────────────────────────

/**
 * Create a blockchain transaction effect for use inside axioledger action tuples.
 *
 * Usage:
 *   return [newState, txEffect(dispatch, { to: "alice.axq", amount: "1 AXQ" })]
 */
export function txEffect<S>(
  _dispatch: Dispatch<S>,
  _params: Record<string, unknown>
): [typeof txEffectRunner, Record<string, unknown>] {
  // TODO (Phase 2.4): wire to @axioledger/wallet-connector signTransaction
  return [txEffectRunner, _params]
}

function txEffectRunner(
  _dispatch: Dispatch<unknown>,
  _params: Record<string, unknown>
): void {
  throw new Error("txEffectRunner: not implemented — Phase 2.4")
}

/**
 * Create a query effect (read-only RPC call).
 */
export function queryEffect<S>(
  _dispatch: Dispatch<S>,
  _params: Record<string, unknown>
): [typeof queryEffectRunner, Record<string, unknown>] {
  return [queryEffectRunner, _params]
}

function queryEffectRunner(
  _dispatch: Dispatch<unknown>,
  _params: Record<string, unknown>
): void {
  throw new Error("queryEffectRunner: not implemented — Phase 2.4")
}

// ─── Subscription Helpers ─────────────────────────────────────────────────────

/**
 * WebSocket subscription for real-time on-chain events.
 * Used in axioledger `subscriptions` array.
 */
export function blockSubscription<S>(
  dispatch: Dispatch<S>,
  props: { wsUrl: string; onBlock: AXQAction<S, { blockNumber: number }> }
): () => void {
  // TODO (Phase 2.4): WebSocket connection to Sequentichain RPC
  void dispatch
  void props
  return () => { /* cleanup */ }
}
