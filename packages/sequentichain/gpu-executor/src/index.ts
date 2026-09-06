/**
 * @sequentichain/gpu-executor — Public API
 *
 * GPU-Accelerated ZK Proof Executor — Layer 3 (Execution & Sequencer Layer)
 *
 * Manages a fleet of GPU worker nodes and dispatches ZK proof generation
 * tasks to them. Targets < 100ms proof time on mobile-class hardware and
 * < 10ms on dedicated GPU server clusters.
 *
 * Architecture:
 *   GpuCluster  — fleet of GpuNode workers
 *   GpuNode     — individual GPU device (CUDA/OpenCL/WebGPU)
 *   ProofJob    — a ZK proof generation request assigned to a node
 */

export { GpuCluster }   from "./cluster.js"
export { GpuNode }      from "./node.js"
export { ProofJobQueue } from "./job-queue.js"

export type {
  GpuNodeSpec,
  GpuBackend,
  ProofJob,
  ProofJobResult,
  ClusterStats,
} from "./types.js"
