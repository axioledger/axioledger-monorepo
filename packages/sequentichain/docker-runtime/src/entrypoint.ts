/**
 * @file entrypoint.ts
 * Docker container entry point — starts the ContainerRuntime and sets up
 * graceful SIGTERM/SIGINT shutdown handlers.
 */
import { ContainerRuntime } from "./runtime.js"

const runtime = new ContainerRuntime()

process.on("SIGTERM", async () => {
  console.info("[docker-runtime] SIGTERM received — shutting down gracefully")
  await runtime.stop()
  process.exit(0)
})

process.on("SIGINT", async () => {
  console.info("[docker-runtime] SIGINT received — shutting down gracefully")
  await runtime.stop()
  process.exit(0)
})

runtime.start()
