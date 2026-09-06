/**
 * @file types.ts
 * Core types for the GPU Executor.
 */
import type { CircuitId } from "@veraciphers/circuit-compiler"

/** Supported GPU compute backends */
export type GpuBackend = "cuda" | "opencl" | "webgpu" | "cpu-fallback"

/** Hardware specification of a GPU node */
export interface GpuNodeSpec {
  /** Unique node identifier */
  id: string
  /** GPU backend available on this node */
  backend: GpuBackend
  /** GPU VRAM in megabytes */
  vramMb: number
  /** Number of CUDA cores / OpenCL compute units */
  computeUnits: number
  /** Endpoint for RPC communication */
  endpoint: string
  /** Maximum concurrent ZK jobs this node accepts */
  maxConcurrency: number
}

/** A ZK proof generation job */
export interface ProofJob {
  /** Unique job identifier */
  id: string
  circuitId: CircuitId
  /** Serialized witness inputs (base64 JSON) */
  witnessPayload: string
  /** Job priority (0 = lowest, 255 = highest) */
  priority: number
  /** Submission time (Unix ms) */
  submittedAt: number
}

/** Result of a completed ProofJob */
export interface ProofJobResult {
  jobId:        string
  circuitId:    CircuitId
  nodeId:       string
  /** Generated ZK proof bytes (base64) */
  proof:        string
  /** Proof generation time in milliseconds */
  proofTimeMs:  number
  success:      boolean
  error?:       string
}

/** Aggregated statistics for a GpuCluster */
export interface ClusterStats {
  totalNodes:    number
  idleNodes:     number
  busyNodes:     number
  totalJobsDone: number
  avgProofTimeMs: number
}
