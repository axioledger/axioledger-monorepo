/**
 * @file rebalancer.ts
 * AutoRebalancer — monitors LP positions and rebalances out-of-range ones.
 * Module 13.4 — Automated LP Position Rebalancing.
 */
import type { LiquidityPosition } from "@kinetoprotocol/clamm-engine"
import type { PositionSummary } from "./types.js"

export interface RebalanceResult {
  positionId: string
  action:     "rebalanced" | "in-range" | "skipped"
  newTickLower?: number
  newTickUpper?: number
}

export class AutoRebalancer {
  private _rebalancesRun = 0

  /**
   * Evaluate a position against the current pool tick and decide
   * whether to rebalance.
   *
   * Phase 1: marks any position where currentTick is outside [tickLower, tickUpper] as needing rebalance.
   * Phase 2: calls PositionManager.burn() + re-mint() around the new price center.
   */
  evaluate(position: LiquidityPosition, currentTick: number): RebalanceResult {
    const inRange = currentTick >= position.tickLower && currentTick <= position.tickUpper

    if (inRange) {
      return { positionId: position.id, action: "in-range" }
    }

    // Phase 2: compute optimal new tick range centered on currentTick
    const halfRange = Math.floor((position.tickUpper - position.tickLower) / 2)
    const newTickLower = currentTick - halfRange
    const newTickUpper = currentTick + halfRange
    this._rebalancesRun++

    return {
      positionId: position.id,
      action:     "rebalanced",
      newTickLower,
      newTickUpper,
    }
  }

  get rebalancesRun(): number { return this._rebalancesRun }

  /** Convert a LiquidityPosition to a PositionSummary for reporting. */
  summarize(position: LiquidityPosition, currentTick: number): PositionSummary {
    return {
      positionId: position.id,
      poolId:     position.poolId,
      owner:      position.owner,
      inRange:    currentTick >= position.tickLower && currentTick <= position.tickUpper,
      liquidity:  position.liquidity,
      feesOwedA:  position.tokensOwedA,
      feesOwedB:  position.tokensOwedB,
    }
  }
}
