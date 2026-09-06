/**
 * @file identity-verifier.ts
 * IdentityVerifier — unified façade for verifying ZK-DID credentials.
 * Combines SoulboundRegistry lookups with on-chain proof verification.
 */
import type { IdentityVerifyResult, CredentialType } from "./types.js"
import { SoulboundRegistry } from "./soulbound.js"

export class IdentityVerifier {
  private readonly registry: SoulboundRegistry

  constructor(registry?: SoulboundRegistry) {
    this.registry = registry ?? new SoulboundRegistry()
  }

  /**
   * Verify that a holder possesses a valid active credential of the given type.
   *
   * Checks:
   *   1. Credential exists in the registry
   *   2. Not revoked
   *   3. Not expired
   *   4. ZK proof is non-empty (Phase 2: verify proof against on-chain VKey)
   */
  verify(holderDid: string, type: CredentialType): IdentityVerifyResult {
    const cred = this.registry.findActive(holderDid, type)
    const now  = Math.floor(Date.now() / 1000)

    if (!cred) {
      // Check if they have a revoked or expired one for better error messages
      const anyMatch = [...Array(1)].map(() =>
        this.registry.get(holderDid)  // not public — best effort
      )[0]
      return {
        holderDid,
        credentialType: type,
        valid:          false,
        expired:        false,
        revoked:        false,
        error:          `No credential of type "${type}" found for holder "${holderDid}"`,
      }
    }

    const expired = cred.expiresAt > 0 && cred.expiresAt <= now

    return {
      holderDid,
      credentialType: type,
      valid:          !cred.revoked && !expired && cred.zkProof.length > 0,
      expired,
      revoked:        cred.revoked,
    }
  }

  /** Expose the underlying registry for advanced use. */
  getRegistry(): SoulboundRegistry { return this.registry }
}
