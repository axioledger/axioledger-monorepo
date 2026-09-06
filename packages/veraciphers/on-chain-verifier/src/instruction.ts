/**
 * @file instruction.ts
 * Builds a SVM instruction for calling the on-chain verifier program.
 * Module 5.3 — On-Chain Verifier Contracts.
 */
import type { VerifyParams } from "./types.js"

/** Opaque SVM instruction object (mirrors @solana/web3.js TransactionInstruction shape) */
export interface SVMInstruction {
  programId: string
  keys: Array<{ pubkey: string; isSigner: boolean; isWritable: boolean }>
  data: Uint8Array
}

/**
 * Build an SVM instruction to call the Veraciphers on-chain verifier program.
 *
 * Phase 1: constructs a minimal instruction with serialized params.
 * Phase 2: wire to actual program ABI / Borsh serialization.
 */
export function buildVerifyInstruction(
  params: VerifyParams,
  verifierProgramId: string,
  callerPubkey: string,
): SVMInstruction {
  // Encode params as JSON bytes for Phase 1 (Phase 2: Borsh)
  const data = new TextEncoder().encode(JSON.stringify(params))
  return {
    programId: verifierProgramId,
    keys: [{ pubkey: callerPubkey, isSigner: true, isWritable: false }],
    data,
  }
}
