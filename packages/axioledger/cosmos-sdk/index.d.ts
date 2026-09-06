/**
 * @axioledger/cosmos-sdk
 * Cosmos SDK — auth/bank/staking/gov/distribution
 * Token:  $AXQ
 *
 * Namespace:   github.com/axioledger/cosmos-sdk
 * Source:      external/cosmos/cosmos-sdk/
 * Proto pkgs:  amino, cosmos.app.runtime.v1alpha1, cosmos.app.v1alpha1, cosmos.auth.module.v1, cosmos.auth.v1beta1, cosmos.authz.module.v1
 * Stats:       124 proto files · 100 messages · 6 services · 14 enums
 *
 * Full TypeScript SDK:  packages/axioledger/sdk/src/generated/
 * Regenerate:           bash toolchain/build-scripts/generate-proto.sh
 */

// ── Enums ───────────────────────────────────────────────────────────────────
export declare const enum VoteOption { _PLACEHOLDER = 0 }
export declare const enum ProposalStatus { _PLACEHOLDER = 0 }
export declare const enum AuthorizationType { _PLACEHOLDER = 0 }
export declare const enum BondStatus { _PLACEHOLDER = 0 }
export declare const enum Infraction { _PLACEHOLDER = 0 }
export declare const enum SignMode { _PLACEHOLDER = 0 }
export declare const enum OrderBy { _PLACEHOLDER = 0 }
export declare const enum BroadcastMode { _PLACEHOLDER = 0 }
export declare const enum CheckTxType { _PLACEHOLDER = 0 }
export declare const enum Result { _PLACEHOLDER = 0 }
export declare const enum VerifyStatus { _PLACEHOLDER = 0 }
export declare const enum MisbehaviorType { _PLACEHOLDER = 0 }
export declare const enum SignedMsgType { _PLACEHOLDER = 0 }
export declare const enum BlockIDFlag { _PLACEHOLDER = 0 }

// ── Messages ─────────────────────────────────────────────────────────────────
export declare interface Module { [key: string]: unknown }
export declare interface StoreKeyConfig { [key: string]: unknown }
export declare interface Config { [key: string]: unknown }
export declare interface ModuleConfig { [key: string]: unknown }
export declare interface GolangBinding { [key: string]: unknown }
export declare interface ModuleDescriptor { [key: string]: unknown }
export declare interface PackageReference { [key: string]: unknown }
export declare interface MigrateFromInfo { [key: string]: unknown }
export declare interface QueryConfigRequest { [key: string]: unknown }
export declare interface QueryConfigResponse { [key: string]: unknown }
export declare interface ModuleAccountPermission { [key: string]: unknown }
export declare interface BaseAccount { [key: string]: unknown }
export declare interface ModuleAccount { [key: string]: unknown }
export declare interface ModuleCredential { [key: string]: unknown }
export declare interface Params { [key: string]: unknown }
export declare interface GenesisState { [key: string]: unknown }
export declare interface QueryAccountsRequest { [key: string]: unknown }
export declare interface QueryAccountsResponse { [key: string]: unknown }
export declare interface QueryAccountRequest { [key: string]: unknown }
export declare interface QueryAccountResponse { [key: string]: unknown }
export declare interface QueryParamsRequest { [key: string]: unknown }
export declare interface QueryParamsResponse { [key: string]: unknown }
export declare interface QueryModuleAccountsRequest { [key: string]: unknown }
export declare interface QueryModuleAccountsResponse { [key: string]: unknown }
export declare interface QueryModuleAccountByNameRequest { [key: string]: unknown }
export declare interface QueryModuleAccountByNameResponse { [key: string]: unknown }
export declare interface Bech32PrefixRequest { [key: string]: unknown }
export declare interface Bech32PrefixResponse { [key: string]: unknown }
export declare interface AddressBytesToStringRequest { [key: string]: unknown }
export declare interface AddressBytesToStringResponse { [key: string]: unknown }
export declare interface AddressStringToBytesRequest { [key: string]: unknown }
export declare interface AddressStringToBytesResponse { [key: string]: unknown }
export declare interface QueryAccountAddressByIDRequest { [key: string]: unknown }
export declare interface QueryAccountAddressByIDResponse { [key: string]: unknown }
export declare interface QueryAccountInfoRequest { [key: string]: unknown }
export declare interface QueryAccountInfoResponse { [key: string]: unknown }
export declare interface MsgUpdateParams { [key: string]: unknown }
export declare interface MsgUpdateParamsResponse { [key: string]: unknown }
export declare interface GenericAuthorization { [key: string]: unknown }
export declare interface Grant { [key: string]: unknown }
export declare interface GrantAuthorization { [key: string]: unknown }
export declare interface GrantQueueItem { [key: string]: unknown }
export declare interface EventGrant { [key: string]: unknown }
export declare interface EventRevoke { [key: string]: unknown }
export declare interface QueryGrantsRequest { [key: string]: unknown }
export declare interface QueryGrantsResponse { [key: string]: unknown }
export declare interface QueryGranterGrantsRequest { [key: string]: unknown }
export declare interface QueryGranterGrantsResponse { [key: string]: unknown }
export declare interface QueryGranteeGrantsRequest { [key: string]: unknown }
export declare interface QueryGranteeGrantsResponse { [key: string]: unknown }
export declare interface MsgGrant { [key: string]: unknown }
export declare interface MsgGrantResponse { [key: string]: unknown }
export declare interface MsgExec { [key: string]: unknown }
export declare interface MsgExecResponse { [key: string]: unknown }
export declare interface MsgRevoke { [key: string]: unknown }
export declare interface MsgRevokeResponse { [key: string]: unknown }
export declare interface ModuleOptions { [key: string]: unknown }
export declare interface ServiceCommandDescriptor { [key: string]: unknown }
export declare interface RpcCommandOptions { [key: string]: unknown }
export declare interface FlagOptions { [key: string]: unknown }
export declare interface PositionalArgDescriptor { [key: string]: unknown }
export declare interface AppOptionsRequest { [key: string]: unknown }
export declare interface AppOptionsResponse { [key: string]: unknown }
export declare interface SendAuthorization { [key: string]: unknown }
export declare interface SendEnabled { [key: string]: unknown }
export declare interface Input { [key: string]: unknown }
export declare interface Output { [key: string]: unknown }
export declare interface Supply { [key: string]: unknown }
export declare interface DenomUnit { [key: string]: unknown }
export declare interface Metadata { [key: string]: unknown }
export declare interface Balance { [key: string]: unknown }
export declare interface QueryBalanceRequest { [key: string]: unknown }
export declare interface QueryBalanceResponse { [key: string]: unknown }
export declare interface QueryAllBalancesRequest { [key: string]: unknown }
export declare interface QueryAllBalancesResponse { [key: string]: unknown }
export declare interface QuerySpendableBalancesRequest { [key: string]: unknown }
export declare interface QuerySpendableBalancesResponse { [key: string]: unknown }
export declare interface QuerySpendableBalanceByDenomRequest { [key: string]: unknown }
export declare interface QuerySpendableBalanceByDenomResponse { [key: string]: unknown }
export declare interface QueryTotalSupplyRequest { [key: string]: unknown }
export declare interface QueryTotalSupplyResponse { [key: string]: unknown }
export declare interface QuerySupplyOfRequest { [key: string]: unknown }
export declare interface QuerySupplyOfResponse { [key: string]: unknown }
export declare interface QueryDenomsMetadataRequest { [key: string]: unknown }
export declare interface QueryDenomsMetadataResponse { [key: string]: unknown }
export declare interface QueryDenomMetadataRequest { [key: string]: unknown }
export declare interface QueryDenomMetadataResponse { [key: string]: unknown }
export declare interface QueryDenomMetadataByQueryStringRequest { [key: string]: unknown }
export declare interface QueryDenomMetadataByQueryStringResponse { [key: string]: unknown }
export declare interface QueryDenomOwnersRequest { [key: string]: unknown }
export declare interface DenomOwner { [key: string]: unknown }
export declare interface QueryDenomOwnersResponse { [key: string]: unknown }
export declare interface QueryDenomOwnersByQueryRequest { [key: string]: unknown }
export declare interface QueryDenomOwnersByQueryResponse { [key: string]: unknown }
export declare interface QuerySendEnabledRequest { [key: string]: unknown }
export declare interface QuerySendEnabledResponse { [key: string]: unknown }
export declare interface MsgSend { [key: string]: unknown }
export declare interface MsgSendResponse { [key: string]: unknown }
export declare interface MsgMultiSend { [key: string]: unknown }
export declare interface MsgMultiSendResponse { [key: string]: unknown }

// ── gRPC Service Clients ─────────────────────────────────────────────────────
export declare class QueryClient {
  constructor(endpoint: string)
}
export declare class MsgClient {
  constructor(endpoint: string)
}
export declare class ServiceClient {
  constructor(endpoint: string)
}
export declare class ReflectionServiceClient {
  constructor(endpoint: string)
}
export declare class ABCIListenerServiceClient {
  constructor(endpoint: string)
}
export declare class ABCIClient {
  constructor(endpoint: string)
}

// ── Proto file index ─────────────────────────────────────────────────────────
// proto/amino/amino.proto
// proto/cosmos/app/runtime/v1alpha1/module.proto
// proto/cosmos/app/v1alpha1/config.proto
// proto/cosmos/app/v1alpha1/module.proto
// proto/cosmos/app/v1alpha1/query.proto
// proto/cosmos/auth/module/v1/module.proto
// proto/cosmos/auth/v1beta1/auth.proto
// proto/cosmos/auth/v1beta1/genesis.proto
// proto/cosmos/auth/v1beta1/query.proto
// proto/cosmos/auth/v1beta1/tx.proto
// proto/cosmos/authz/module/v1/module.proto
// proto/cosmos/authz/v1beta1/authz.proto
// proto/cosmos/authz/v1beta1/event.proto
// proto/cosmos/authz/v1beta1/genesis.proto
// proto/cosmos/authz/v1beta1/query.proto
// proto/cosmos/authz/v1beta1/tx.proto
// proto/cosmos/autocli/v1/options.proto
// proto/cosmos/autocli/v1/query.proto
// proto/cosmos/bank/module/v1/module.proto
// proto/cosmos/bank/v1beta1/authz.proto
// proto/cosmos/bank/v1beta1/bank.proto
// proto/cosmos/bank/v1beta1/genesis.proto
// proto/cosmos/bank/v1beta1/query.proto
// proto/cosmos/bank/v1beta1/tx.proto
// proto/cosmos/base/abci/v1beta1/abci.proto
// proto/cosmos/base/node/v1beta1/query.proto
// proto/cosmos/base/query/v1beta1/pagination.proto
// proto/cosmos/base/reflection/v1beta1/reflection.proto
// proto/cosmos/base/reflection/v2alpha1/reflection.proto
// proto/cosmos/base/tendermint/v1beta1/query.proto
// proto/cosmos/base/tendermint/v1beta1/types.proto
// proto/cosmos/base/v1beta1/coin.proto
// proto/cosmos/consensus/module/v1/module.proto
// proto/cosmos/consensus/v1/query.proto
// proto/cosmos/consensus/v1/tx.proto
// proto/cosmos/counter/module/v1/module.proto
// proto/cosmos/counter/v1/query.proto
// proto/cosmos/counter/v1/tx.proto
// proto/cosmos/crypto/bls12_381/keys.proto
// proto/cosmos/crypto/ed25519/keys.proto
// ... and 84 more

export {}
