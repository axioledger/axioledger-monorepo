/**
 * @axioledger/ans-sdk — Public API
 *
 * Re-export toàn bộ public API từ các module con:
 *   schema      — Borsh layouts, types, serialize/deserialize helpers
 *   pda         — PDA derivation, seed constants, namehash
 *   instructions — TransactionInstruction builders
 *   client      — AnsClient class, error types
 */

// ─── Schema ───────────────────────────────────────────────────────────────────
export {
  ANS_IX_DISCRIMINATOR,
  ANS_RECORD_FORMAT,
  ANS_RECORD_FORMAT_NAME,
  AnsNameRecordLayout,
  AnsRegistryInfoLayout,
  RegisterNameLayout,
  UpdateRecordLayout,
  TransferNameLayout,
  RenewNameLayout,
  serializeAnsNameRecord,
  deserializeAnsNameRecord,
  rawToAnsRecord,
} from "./schema.js"

export type {
  AnsIxDiscriminator,
  AnsRecordFormat,
  AnsRecord,
  AnsNameRecordRaw,
  AnsRegistryInfoRaw,
  RegisterNameData,
  UpdateRecordData,
  TransferNameData,
  RenewNameData,
} from "./schema.js"

// ─── PDA ──────────────────────────────────────────────────────────────────────
export {
  ANS_NAME_SEED,
  ANS_RESOLVER_SEED,
  ANS_TLD_SEED,
  normalizeName,
  parseDomain,
  deriveNameAccountPDA,
  deriveResolverPDA,
  deriveTldAuthorityPDA,
  namehash,
} from "./pda.js"

// ─── Instructions ─────────────────────────────────────────────────────────────
export {
  buildRegisterNameIx,
  buildUpdateRecordIx,
  buildTransferNameIx,
  buildRenewNameIx,
} from "./instructions.js"

export type {
  RegisterNameParams,
  UpdateRecordParams,
  TransferNameParams,
  RenewNameParams,
} from "./instructions.js"

// ─── Client ───────────────────────────────────────────────────────────────────
export {
  AnsClient,
  AnsClientError,
} from "./client.js"

export type {
  AnsClientOptions,
  MinimalWalletAdapter,
  RegisterOptions,
} from "./client.js"

// ─── Compliance ───────────────────────────────────────────────────────────────
export {
  ComplianceChecker,
  ComplianceError,
  getDefaultComplianceChecker,
} from "./compliance.js"

export type {
  ComplianceCheckResult,
  ComplianceCheckerOptions,
} from "./compliance.js"

// ─── Program IDs ──────────────────────────────────────────────────────────────
export const ANS_PROGRAM_ID_LOCALNET = "AnsReg1111111111111111111111111111111111111"
export const ANS_PROGRAM_ID_DEVNET   = "AnsRegDevnet111111111111111111111111111111" // TBD
export const ANS_PROGRAM_ID_MAINNET  = "AnsRegMainnet1111111111111111111111111111111" // TBD at Genesis
