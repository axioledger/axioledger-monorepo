/**
 * @file soulbound.ts
 * SoulboundRegistry — issues and manages non-transferable SBT credentials.
 * Module 9.1 — Soulbound Token (SBT) Credentials.
 */
import type { SoulboundCredential, CredentialType } from "./types.js"
import {
  DIDCredentialDuplicateError,
  DIDCredentialLookupError,
} from "./errors.js"

let _credSeq = 1

export class SoulboundRegistry {
  private readonly credentials = new Map<string, SoulboundCredential>()

  /**
   * Issue a new Soulbound Credential to a holder.
   * A holder may hold multiple credentials of different types.
   *
   * @throws if the holder already holds an active credential of the same type.
   */
  issue(
    holderDid:  string,
    issuerDid:  string,
    type:       CredentialType,
    expiresAt:  number,
    zkProof:    string,
  ): SoulboundCredential {
    // Enforce uniqueness: one active (non-revoked, non-expired) credential per type per holder
    const existing = this.findActive(holderDid, type)
    if (existing) {
      throw new DIDCredentialDuplicateError(holderDid, type, existing.id)
    }
    const cred: SoulboundCredential = {
      id:        `sbt-${String(_credSeq++)}`,
      holderDid,
      issuerDid,
      type,
      issuedAt:  Math.floor(Date.now() / 1000),
      expiresAt,
      zkProof,
      revoked:   false,
    }
    this.credentials.set(cred.id, cred)
    return cred
  }

  /** Revoke a credential by ID. */
  revoke(credId: string): void {
    const cred = this._require(credId)
    this.credentials.set(credId, { ...cred, revoked: true })
  }

  /** Find an active (non-revoked, non-expired) credential of a type for a holder. */
  findActive(holderDid: string, type: CredentialType): SoulboundCredential | undefined {
    const now = Math.floor(Date.now() / 1000)
    return [...this.credentials.values()].find(
      (c) =>
        c.holderDid === holderDid &&
        c.type === type &&
        !c.revoked &&
        (c.expiresAt === 0 || c.expiresAt > now)
    )
  }

  /** Get a credential by ID. */
  get(id: string): SoulboundCredential | undefined {
    return this.credentials.get(id)
  }

  /** Total number of issued credentials (including revoked). */
  count(): number { return this.credentials.size }

  private _require(id: string): SoulboundCredential {
    const c = this.credentials.get(id)
    if (!c) throw new DIDCredentialLookupError(id)
    return c
  }
}
