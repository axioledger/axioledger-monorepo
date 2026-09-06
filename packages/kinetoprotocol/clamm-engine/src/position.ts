/**
 * @file position.ts
 * LP Position Manager — minting, burning, fee collection.
 * Module 13.1 / 13.4 — LP position lifecycle management.
 */
import type { LiquidityPosition } from "./types.js"

let _nextId = 1

/** Manages LP positions across CLAMM pools. */
export class PositionManager {
  private readonly positions = new Map<string, LiquidityPosition>()

  /**
   * Mint a new LP position in the specified pool and tick range.
   * Returns the newly created position.
   */
  mint(
    owner: string,
    poolId: string,
    tickLower: number,
    tickUpper: number,
    liquidity: bigint,
  ): LiquidityPosition {
    if (tickLower >= tickUpper) {
      throw new RangeError(`tickLower (${tickLower}) must be < tickUpper (${tickUpper})`)
    }
    if (liquidity <= 0n) throw new RangeError("liquidity must be > 0")

    const id = `pos-${String(_nextId++)}`
    const position: LiquidityPosition = {
      id,
      owner,
      poolId,
      tickLower,
      tickUpper,
      liquidity,
      tokensOwedA: 0n,
      tokensOwedB: 0n,
    }
    this.positions.set(id, position)
    return position
  }

  /**
   * Burn (fully close) an LP position by ID.
   * Returns the final position state before removal.
   */
  burn(positionId: string): LiquidityPosition {
    const pos = this.positions.get(positionId)
    if (!pos) throw new Error(`Position ${positionId} not found`)
    this.positions.delete(positionId)
    return pos
  }

  /** Returns a snapshot of the position or undefined if not found. */
  getPosition(positionId: string): LiquidityPosition | undefined {
    return this.positions.get(positionId)
  }

  /** Returns all active positions for a given owner. */
  getOwnerPositions(owner: string): LiquidityPosition[] {
    return [...this.positions.values()].filter((p) => p.owner === owner)
  }
}
