/**
 * @veraciphers/on-chain-verifier — Public API
 *
 * On-Chain ZK Proof Verifier — Module 5.3
 * Executes lightweight proof-verification logic inside the Axio-Stateless SVM.
 *
 * This package provides:
 *   - The TypeScript interface for calling the on-chain verifier program
 *   - Proof validation utilities (format validation, public signal checks)
 *   - Instruction builder for the SVM verifier contract call
 *   - ChainRegistry: type-safe query engine over chains.json for deployment targeting
 */

export { ProofVerifier }          from "./verifier.js"
export { buildVerifyInstruction } from "./instruction.js"
export { ChainRegistry }          from "./chain-registry.js"

export type {
  VerifyParams,
  VerifyResult,
  VerificationKey,
} from "./types.js"

export type {
  ChainRecord,
  ChainFeature,
  ChainExplorer,
  ChainNativeCurrency,
  ChainFilter,
  ChainParent,
  ChainEns,
  EvmFeature,
  ResolvedRpcEndpoint,
  VerifierDeploymentTarget,
} from "./chain-types.js"
