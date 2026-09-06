/**
 * @axioledger/ibc-contracts
 * IBC v2 Smart Contracts — Solidity/CosmWasm
 *
 * Namespace:   github.com/axioledger/ibc-contracts
 * Source:      external/cosmos/ibc-contracts/
 * Proto pkgs:  aggregator, ibc.applications.gmp.v1, ibc_attestor, proofapi, solana
 * Stats:       6 proto files · 26 messages · 3 services · 1 enums
 *
 * Full TypeScript SDK:  packages/axioledger/sdk/src/generated/
 * Regenerate:           bash toolchain/build-scripts/generate-proto.sh
 */

// ── Enums ───────────────────────────────────────────────────────────────────
export declare const enum CommitmentType { _PLACEHOLDER = 0 }

// ── Messages ─────────────────────────────────────────────────────────────────
export declare interface GetAttestationsRequest { [key: string]: unknown }
export declare interface AggregatedAttestation { [key: string]: unknown }
export declare interface GetAttestationsResponse { [key: string]: unknown }
export declare interface GMPPacketData { [key: string]: unknown }
export declare interface Acknowledgement { [key: string]: unknown }
export declare interface Attestation { [key: string]: unknown }
export declare interface StateAttestationRequest { [key: string]: unknown }
export declare interface StateAttestationResponse { [key: string]: unknown }
export declare interface PacketAttestationRequest { [key: string]: unknown }
export declare interface PacketAttestationResponse { [key: string]: unknown }
export declare interface LatestHeightRequest { [key: string]: unknown }
export declare interface LatestHeightResponse { [key: string]: unknown }
export declare interface RelayByTxRequest { [key: string]: unknown }
export declare interface SolanaUpdateClient { [key: string]: unknown }
export declare interface SolanaPacketTxs { [key: string]: unknown }
export declare interface SolanaRelayPacketBatch { [key: string]: unknown }
export declare interface RelayByTxResponse { [key: string]: unknown }
export declare interface CreateClientRequest { [key: string]: unknown }
export declare interface CreateClientResponse { [key: string]: unknown }
export declare interface UpdateClientRequest { [key: string]: unknown }
export declare interface UpdateClientResponse { [key: string]: unknown }
export declare interface InfoRequest { [key: string]: unknown }
export declare interface InfoResponse { [key: string]: unknown }
export declare interface Chain { [key: string]: unknown }
export declare interface GMPSolanaPayload { [key: string]: unknown }
export declare interface SolanaAccountMeta { [key: string]: unknown }

// ── gRPC Service Clients ─────────────────────────────────────────────────────
export declare class AggregatorServiceClient {
  constructor(endpoint: string)
}
export declare class AttestationServiceClient {
  constructor(endpoint: string)
}
export declare class ProofApiServiceClient {
  constructor(endpoint: string)
}

// ── Proto file index ─────────────────────────────────────────────────────────
// proto/aggregator/aggregator.proto
// proto/ibc/applications/gmp/v1/packet.proto
// proto/ibc_attestor/attestation.proto
// proto/ibc_attestor/ibc_attestor.proto
// proto/proofapi/proofapi.proto
// proto/solana/gmp_solana_payload.proto

export {}
