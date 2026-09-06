/**
 * @sequentichain/docker-runtime — Public API
 *
 * Docker Container Runtime Manager for the L2 Sequencer.
 *
 * Exposes:
 *   - ContainerRuntime: lifecycle management (start/stop/health)
 *   - RuntimeConfig:    environment variable schema
 *   - entrypoint:       Node.js process entry (src/entrypoint.ts)
 */

export { ContainerRuntime }  from "./runtime.js"
export { loadRuntimeConfig } from "./config.js"

export type { RuntimeConfig, HealthStatus } from "./types.js"
