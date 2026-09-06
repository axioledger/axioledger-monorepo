/**
 * @axioledger/tokenfactory
 * 5-Token Suite Factory
 * Token:  ALL
 *
 * Namespace:   github.com/axioledger/tokenfactory
 * Source:      external/cosmos/tokenfactory/
 * Proto pkgs:  osmosis.tokenfactory.v1beta1
 * Stats:       5 proto files · 26 messages · 2 services · 0 enums
 *
 * Full TypeScript SDK:  packages/axioledger/sdk/src/generated/
 * Regenerate:           bash toolchain/build-scripts/generate-proto.sh
 */

// ── Messages ─────────────────────────────────────────────────────────────────
export declare interface DenomAuthorityMetadata { [key: string]: unknown }
export declare interface GenesisState { [key: string]: unknown }
export declare interface GenesisDenom { [key: string]: unknown }
export declare interface Params { [key: string]: unknown }
export declare interface QueryParamsRequest { [key: string]: unknown }
export declare interface QueryParamsResponse { [key: string]: unknown }
export declare interface QueryDenomAuthorityMetadataRequest { [key: string]: unknown }
export declare interface QueryDenomAuthorityMetadataResponse { [key: string]: unknown }
export declare interface QueryDenomsFromCreatorRequest { [key: string]: unknown }
export declare interface QueryDenomsFromCreatorResponse { [key: string]: unknown }
export declare interface QueryDenomsFromAdminRequest { [key: string]: unknown }
export declare interface QueryDenomsFromAdminResponse { [key: string]: unknown }
export declare interface MsgCreateDenom { [key: string]: unknown }
export declare interface MsgCreateDenomResponse { [key: string]: unknown }
export declare interface MsgMint { [key: string]: unknown }
export declare interface MsgMintResponse { [key: string]: unknown }
export declare interface MsgBurn { [key: string]: unknown }
export declare interface MsgBurnResponse { [key: string]: unknown }
export declare interface MsgChangeAdmin { [key: string]: unknown }
export declare interface MsgChangeAdminResponse { [key: string]: unknown }
export declare interface MsgSetDenomMetadata { [key: string]: unknown }
export declare interface MsgSetDenomMetadataResponse { [key: string]: unknown }
export declare interface MsgForceTransfer { [key: string]: unknown }
export declare interface MsgForceTransferResponse { [key: string]: unknown }
export declare interface MsgUpdateParams { [key: string]: unknown }
export declare interface MsgUpdateParamsResponse { [key: string]: unknown }

// ── gRPC Service Clients ─────────────────────────────────────────────────────
export declare class QueryClient {
  constructor(endpoint: string)
}
export declare class MsgClient {
  constructor(endpoint: string)
}

// ── Proto file index ─────────────────────────────────────────────────────────
// proto/osmosis/tokenfactory/v1beta1/authorityMetadata.proto
// proto/osmosis/tokenfactory/v1beta1/genesis.proto
// proto/osmosis/tokenfactory/v1beta1/params.proto
// proto/osmosis/tokenfactory/v1beta1/query.proto
// proto/osmosis/tokenfactory/v1beta1/tx.proto

export {}
