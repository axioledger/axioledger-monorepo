/**
 * @valiprecision/worker-pool — Public API
 *
 * Golem Factory Distributed Compute Grid — Layer 1 / Compute Grid Tier
 *
 * Manages a pool of remote compute workers (Golem Network providers) for:
 *   - Off-chain ZK proof generation (GPU/CPU workers)
 *   - Validator pre-flight computation tasks
 *   - Distributed simulation & stress-testing workloads
 *
 * Phase 1: local worker thread pool simulation.
 * Phase 2: wire to Golem `golem-workers` JS SDK for decentralized task dispatch.
 */

export { WorkerPool }        from "./pool.js"
export { TaskScheduler }     from "./scheduler.js"
export { WorkerRegistry }    from "./registry.js"

export type {
  WorkerTask,
  TaskResult,
  WorkerConfig,
  WorkerStatus,
  TaskPriority,
} from "./types.js"
