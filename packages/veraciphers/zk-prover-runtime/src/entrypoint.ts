/**
 * @file entrypoint.ts
 * Docker container entry point for the ZK Prover Runtime.
 */
import { ProverServer } from "./server.js"

const server = new ProverServer()

process.on("SIGTERM", async () => {
  console.info("[zk-prover-runtime] SIGTERM — shutting down")
  await server.stop()
  process.exit(0)
})

process.on("SIGINT", async () => {
  console.info("[zk-prover-runtime] SIGINT — shutting down")
  await server.stop()
  process.exit(0)
})

server.start()
