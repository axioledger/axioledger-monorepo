/**
 * @file liquidity-node.ts
 * LiquidityNode — main service class for the Dockerized LP node.
 */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http"
import { loadLiquidityConfig } from "./config.js"
import { AutoRebalancer }      from "./rebalancer.js"
import type { NodeHealth }     from "./types.js"

export class LiquidityNode {
  private readonly config     = loadLiquidityConfig()
  private readonly rebalancer = new AutoRebalancer()
  private _startedAt          = 0
  private _timer: ReturnType<typeof setInterval> | null = null
  private server: ReturnType<typeof createServer> | null = null

  start(): void {
    this._startedAt = Date.now()

    // Periodic rebalance loop
    this._timer = setInterval(() => {
      // Phase 2: iterate over managed positions, call rebalancer.evaluate()
      console.info(`[liquidity-node] Rebalance tick — pools: ${this.config.poolIds.join(", ")}`)
    }, this.config.rebalanceIntervalMs)

    // HTTP health server
    this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
      if (req.url === "/health") {
        const h = this._health()
        res.writeHead(h.healthy ? 200 : 503, { "Content-Type": "application/json" })
        res.end(JSON.stringify(h))
      } else {
        res.writeHead(404)
        res.end()
      }
    })
    this.server.listen(this.config.port, () => {
      console.info(`[liquidity-node] Running on :${this.config.port} (node: ${this.config.nodeId})`)
    })
  }

  async stop(): Promise<void> {
    if (this._timer) { clearInterval(this._timer); this._timer = null }
    await new Promise<void>((resolve) => {
      if (this.server) this.server!.close(() => resolve())
      else resolve()
    })
  }

  private _health(): NodeHealth {
    return {
      healthy:          this._startedAt > 0,
      nodeId:           this.config.nodeId,
      managedPools:     this.config.poolIds.length,
      activePositions:  0,   // Phase 2: track from PositionManager
      rebalancesRun:    this.rebalancer.rebalancesRun,
      uptime:           Math.floor((Date.now() - this._startedAt) / 1000),
    }
  }
}
