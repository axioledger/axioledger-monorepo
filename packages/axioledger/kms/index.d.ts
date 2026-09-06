/**
 * @axioledger/kms
 * Key Management Service — HSM/Enclave
 *
 * Namespace:   github.com/axioledger/kms
 * Source:      external/cosmos/kms/
 * Proto pkgs:  cosmos.kms.signerservice
 * Stats:       1 proto files · 8 messages · 1 services · 1 enums
 *
 * Full TypeScript SDK:  packages/axioledger/sdk/src/generated/
 * Regenerate:           bash toolchain/build-scripts/generate-proto.sh
 */

// ── Enums ───────────────────────────────────────────────────────────────────
export declare const enum SignatureScheme { _PLACEHOLDER = 0 }

// ── Messages ─────────────────────────────────────────────────────────────────
export declare interface Payload { [key: string]: unknown }
export declare interface Key { [key: string]: unknown }
export declare interface GetKeyRequest { [key: string]: unknown }
export declare interface GetKeyResponse { [key: string]: unknown }
export declare interface GetKeysRequest { [key: string]: unknown }
export declare interface GetKeysResponse { [key: string]: unknown }
export declare interface SignRequest { [key: string]: unknown }
export declare interface SignResponse { [key: string]: unknown }

// ── gRPC Service Clients ─────────────────────────────────────────────────────
export declare class SignerServiceClient {
  constructor(endpoint: string)
}

// ── Proto file index ─────────────────────────────────────────────────────────
// proto/signerservice/signerservice.proto

export {}
