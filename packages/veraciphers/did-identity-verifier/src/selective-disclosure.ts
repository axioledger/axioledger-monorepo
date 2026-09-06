/**
 * @file selective-disclosure.ts
 * SelectiveDisclosure — ZK proof of attribute possession without raw data revelation.
 * Module 9.2 — Zero-Knowledge Selective Disclosure.
 */
import type { DisclosureRequest, DisclosureProof } from "./types.js"

let _reqSeq = 1

export class SelectiveDisclosure {
  /**
   * Generate a ZK proof that proves the holder possesses the requested
   * credential attributes without revealing their raw values.
   *
   * Phase 1: returns a stub proof containing only public signals (non-sensitive).
   * Phase 2: builds a Halo2 circuit witness from the credential's private inputs
   *          and calls the @veraciphers/zk-prover-runtime to generate a real proof.
   */
  async prove(
    request:         DisclosureRequest,
    _credentialProof: string,   // The holder's raw credential ZK proof (private)
  ): Promise<DisclosureProof> {
    const requestId = `sd-req-${String(_reqSeq++)}`

    // Phase 2: construct circuit witness from _credentialProof + request.attributes
    // and call ProverClient.prove()
    return {
      requestId,
      holderDid:      request.holderDid,
      credentialType: request.credentialType,
      zkProof:        `sd-stub-${requestId}`,
      publicSignals:  Object.fromEntries(
        request.attributes.map((attr) => [attr, "verified"])
      ),
      generatedAt: Date.now(),
    }
  }

  /**
   * Verify a DisclosureProof submitted by a holder.
   * Phase 1: accepts any non-empty proof.
   * Phase 2: delegates to @veraciphers/on-chain-verifier.
   */
  verify(proof: DisclosureProof): boolean {
    return proof.zkProof.length > 0 && !proof.zkProof.startsWith("invalid-")
  }
}
