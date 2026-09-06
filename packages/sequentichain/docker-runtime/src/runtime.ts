/**
 * @file runtime.ts
 * ContainerRuntime — wraps the Sequencer lifecycle inside a containerized
 * HTTP health server for Docker HEALTHCHECK and orchestration probes.
 *
 * Phase 1: minimal HTTP server + Sequencer integration.
 * Phase 2: add Prometheus /metrics endpoint + graceful shutdown.
 */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http"
import { Sequencer }          from "@sequentichain/sequencer-node"
import { loadRuntimeConfig }  from "./config.js"
import type { HealthStatus }  from "./types.js"

export class ContainerRuntime {
  private readonly sequencer: Sequencer
  private startedAt = 0
  private server: ReturnType<typeof createServer> | null = null

  constructor() {
    const cfg = loadRuntimeConfig()
    this.sequencer = new Sequencer({
      maxBatchSize:    cfg.maxBatchSize,
      maxBatchDelayMs: cfg.maxBatchDelayMs,
      sequencerAccount: cfg.sequencerAccount,
    })
  }

  /** Start the sequencer + HTTP health server. */
  start(): void {
    const cfg = loadRuntimeConfig()
    this.startedAt = Date.now()

    this.sequencer.start((batch) => {
      // Phase 2: forward sealed batches to zk-batcher for SNARK commitment
      void batch
    })

    this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
      if (req.url === "/health") {
        const health = this.getHealth()
        res.writeHead(health.healthy ? 200 : 503, { "Content-Type": "application/json" })
        res.end(JSON.stringify(health))
      } else {
        res.writeHead(404)
        res.end("Not found")
      }
    })

    this.server.listen(cfg.port, () => {
      console.info(`[docker-runtime] Sequencer running on :${cfg.port}`)
    })
  }

  /** Gracefully stop the sequencer and HTTP server. */
  async stop(): Promise<void> {
    this.sequencer.stop()
    await new Promise<void>((resolve) => {
      if (this.server) this.server.close(() => resolve())
      else resolve()
    })
  }

  getHealth(): HealthStatus {
    return {
      healthy:    this.sequencer.isRunning(),
      uptime:     Math.floor((Date.now() - this.startedAt) / 1000),
      queueDepth: this.sequencer.queueDepth(),
      batchCount: (this.sequencer as unknown as { batchNumber: number }).batchNumber ?? 0,
    }
  }
}
