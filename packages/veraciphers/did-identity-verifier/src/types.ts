/**
 * @file types.ts
 * Core types for the DID Identity Verifier.
 */

/** Types of verifiable credentials that can be issued as Soulbound Tokens */
export type CredentialType =
  | "kyc-basic"           // Identity verified (name, DOB)
  | "kyc-enhanced"        // Full KYC (ID document + liveness)
  | "accredited-investor" // Regulatory accreditation status
  | "age-18+"             // Age gate proof (no personal data revealed)
  | "jurisdiction"        // Country/region verification
  | "unique-human"        // Sybil-resistance proof
  | "developer"           // Verified ecosystem contributor
  | "validator"           // Active validator node operator

/** A Soulbound Token credential — non-transferable identity badge */
export interface SoulboundCredential {
  /** Unique credential ID (UUID v4) */
  id:           string
  /** DID of the credential holder */
  holderDid:    string
  /** DID of the issuing authority */
  issuerDid:    string
  /** Credential type */
  type:         CredentialType
  /** Unix timestamp (seconds) when the credential was issued */
  issuedAt:     number
  /** Unix timestamp (seconds) when the credential expires (0 = never) */
  expiresAt:    number
  /** ZK proof of the credential's validity */
  zkProof:      string
  /** Whether this credential has been revoked */
  revoked:      boolean
}

/** Request for a selective disclosure proof */
export interface DisclosureRequest {
  holderDid:       string
  credentialType:  CredentialType
  /** Attributes the verifier needs to confirm (without revealing the raw values) */
  attributes:      ReadonlyArray<string>
}

/** A zero-knowledge selective disclosure proof */
export interface DisclosureProof {
  requestId:       string
  holderDid:       string
  credentialType:  CredentialType
  /** ZK proof proving the requested attributes hold */
  zkProof:         string
  /** Public signals (non-sensitive outputs of the circuit) */
  publicSignals:   Record<string, string>
  /** Timestamp of proof generation (Unix ms) */
  generatedAt:     number
}

/** A MACI-encrypted vote */
export interface MaciVote {
  /** Voter's public key (ephemeral, rotatable) */
  voterPubKey:     string
  /** Encrypted vote data (encrypted with coordinator's master key) */
  encryptedVote:   string
  /** Proposal ID the vote is for */
  proposalId:      string
  /** Unix timestamp when the vote was submitted */
  submittedAt:     number
}

/** Tally result from MACI de-anonymization circuit */
export interface MaciTally {
  proposalId:      string
  totalVotes:      number
  /** Vote count per option index */
  results:         Record<string, number>
  /** ZK proof of the tally accuracy */
  tallyProof:      string
}

/** Result of a full identity verification check */
export interface IdentityVerifyResult {
  holderDid:      string
  credentialType: CredentialType
  valid:          boolean
  expired:        boolean
  revoked:        boolean
  error?:         string
}
