/**
 * @file server.ts
 * ProverServer — HTTP server exposing /prove and /health endpoints.
 * In Phase 2, replaced with a gRPC server for high-throughput streaming.
 */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http"
import { ProverRuntime }   from "./prover-runtime.js"
import { loadProverConfig } from "./config.js"
import type { ProofRequest } from "@veraciphers/circuit-compiler"

export class ProverServer {
  private readonly runtime: ProverRuntime
  private server: ReturnType<typeof createServer> | null = null

  constructor() {
    const cfg    = loadProverConfig()
    this.runtime = new ProverRuntime(cfg)
  }

  start(): void {
    const cfg = loadProverConfig()
    this.runtime.start()

    this.server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      if (req.method === "GET" && req.url === "/health") {
        const h = this.runtime.health()
        res.writeHead(h.healthy ? 200 : 503, { "Content-Type": "application/json" })
        res.end(JSON.stringify(h))
        return
      }

      if (req.method === "POST" && req.url === "/prove") {
        let body = ""
        req.on("data", (chunk: Buffer) => { body += chunk.toString() })
        req.on("end", async () => {
          try {
            const request = JSON.parse(body) as ProofRequest
            const response = await this.runtime.prove(request)
            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(response))
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
        return
      }

      res.writeHead(404)
      res.end("Not found")
    })

    this.server.listen(cfg.port, () => {
      console.info(`[zk-prover-runtime] ProverServer running on :${cfg.port} (${cfg.backend})`)
    })
  }

  async stop(): Promise<void> {
    await new Promise<void>((resolve) => {
      if (this.server) this.server.close(() => resolve())
      else resolve()
    })
  }

  getHealth() {
    return this.runtime.health()
  }
}
