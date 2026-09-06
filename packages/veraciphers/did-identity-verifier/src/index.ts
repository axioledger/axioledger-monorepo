/**
 * @veraciphers/did-identity-verifier — Public API
 *
 * ZK-DID Identity & Anti-Collusion Layer — Module 9 + Module 22
 *
 * Module 9 — ZK-DID Identity Verification System ($VRQ):
 *   - Soulbound Token (SBT) Credential issuance & verification
 *   - Zero-Knowledge Selective Disclosure proofs
 *   - Enterprise Identity Issuer Portal interface
 *   - Regulatory Compliance Gateway
 *
 * Module 22 — Anti-Collusion Voting Circuit (MACI via $VRQ):
 *   - MACI encrypted vote submission pipeline
 *   - De-anonymized tally proof generation
 *   - Bribery resistance verification
 *
 * Security — NPM Supply-Chain Checksum:
 *   - Verifies installed package integrity against known-good hashes
 */

export { SoulboundRegistry }    from "./soulbound.js"
export { SelectiveDisclosure }  from "./selective-disclosure.js"
export { MaciCircuit }          from "./maci.js"
export { IdentityVerifier }     from "./identity-verifier.js"

export type {
  SoulboundCredential,
  CredentialType,
  DisclosureProof,
  DisclosureRequest,
  MaciVote,
  MaciTally,
  IdentityVerifyResult,
} from "./types.js"

export {
  // Base
  DIDError,
  // Credential lifecycle
  DIDCredentialNotFoundError,
  DIDCredentialDuplicateError,
  DIDCredentialExpiredError,
  DIDCredentialRevokedError,
  DIDCredentialLookupError,
  // Proof generation / verification
  DIDProverCapacityError,
  DIDProofTimeoutError,
  DIDInvalidWitnessError,
  DIDProofVerificationError,
  // MACI
  DIDMaciNoVotesError,
  // Type guards
  isDIDError,
  isCredentialError,
  isProofError,
} from "./errors.js"
