/**
 * @file types.ts
 * Core types for the Worker Pool.
 */

/** Task execution priority */
export type TaskPriority = "critical" | "high" | "normal" | "low"

/** Type of compute task dispatched to a worker */
export type TaskType =
  | "zk-prove"          // ZK proof generation
  | "zk-verify"         // ZK proof verification
  | "state-root"        // Merkle state root computation
  | "batch-validate"    // Batch transaction pre-validation
  | "simulation"        // Load simulation / stress test

/** The operational status of a compute worker */
export type WorkerStatus =
  | "idle"       // Available for work
  | "busy"       // Executing a task
  | "error"      // Encountered a runtime error
  | "offline"    // Not reachable

/** A unit of work dispatched to a remote or local worker */
export interface WorkerTask {
  /** Unique task identifier */
  id: string
  /** Compute task type */
  type: TaskType
  /** Serialized task payload (JSON) */
  payload: Record<string, unknown>
  /** Execution priority */
  priority: TaskPriority
  /** Deadline in Unix ms (0 = no deadline) */
  deadlineMs: number
  /** Number of retry attempts remaining */
  retries: number
}

/** The result returned after a task completes */
export interface TaskResult {
  taskId: string
  workerId: string
  /** True if the task completed successfully */
  success: boolean
  /** Serialized result data */
  output: Record<string, unknown>
  /** Execution duration in milliseconds */
  durationMs: number
  /** Error message if success = false */
  error?: string
}

/** Configuration for a single compute worker */
export interface WorkerConfig {
  /** Unique worker identifier */
  id: string
  /** Worker endpoint URL (gRPC or HTTP) */
  endpoint: string
  /** Maximum concurrent tasks this worker accepts */
  maxConcurrency: number
  /** Supported task types */
  capabilities: readonly TaskType[]
  /** Golem provider node ID (Phase 2) */
  golemNodeId?: string
}
