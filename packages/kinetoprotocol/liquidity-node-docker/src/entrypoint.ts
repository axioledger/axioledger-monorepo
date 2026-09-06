/**
 * @file entrypoint.ts
 * Docker container entry point for the Liquidity Node.
 */
import { LiquidityNode } from "./liquidity-node.js"

const node = new LiquidityNode()

process.on("SIGTERM", async () => {
  console.info("[liquidity-node] SIGTERM — shutting down")
  await node.stop()
  process.exit(0)
})

process.on("SIGINT", async () => {
  console.info("[liquidity-node] SIGINT — shutting down")
  await node.stop()
  process.exit(0)
})

node.start()
