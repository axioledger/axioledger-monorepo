/**
 * @veraciphers/circuit-compiler — Public API
 *
 * ZK Circuit Compiler — Module 5 (Veraciphers ZK Cryptographic Engine)
 *   - 5.1 Halo2 / PlonKy2 Circuit compilation (TypeScript interface to Rust WASM backend)
 *   - 5.2 Off-Chain Prover GPU/FPGA cluster dispatch
 *   - Witness generation & constraint system management
 */

export { CircuitRegistry }   from "./registry.js"
export { WitnessBuilder }    from "./witness.js"
export { ProverClient }      from "./prover-client.js"

export type {
  Circuit,
  CircuitId,
  Witness,
  ProofRequest,
  ProofResponse,
  CircuitBackend,
} from "./types.js"
