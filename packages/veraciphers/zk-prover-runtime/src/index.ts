/**
 * @veraciphers/zk-prover-runtime — Public API
 *
 * ZK Prover Runtime — Module 5.2 (Off-Chain Prover GPU/FPGA Clusters)
 *
 * Runs as a standalone gRPC + HTTP service inside a GPU-enabled Docker container.
 * Accepts ProofRequests from @veraciphers/circuit-compiler's ProverClient
 * and returns completed proofs via the response stream.
 *
 * Target: < 100ms proof generation on mobile / < 10ms on GPU cluster.
 */

export { ProverRuntime }      from "./prover-runtime.js"
export { ProverServer }       from "./server.js"
export { loadProverConfig }   from "./config.js"

export type { ProverConfig, ProverHealth } from "./types.js"
