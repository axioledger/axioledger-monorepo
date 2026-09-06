/**
 * @axioledger/ibc-go
 * IBC Protocol v11 — channel/client/transfer
 *
 * Namespace:   github.com/axioledger/ibc-go
 * Source:      external/cosmos/ibc-go/
 * Proto pkgs:  ibc.applications.gmp.v1, ibc.applications.interchain_accounts.controller.v1, ibc.applications.interchain_accounts.genesis.v1, ibc.applications.interchain_accounts.host.v1, ibc.applications.interchain_accounts.v1, ibc.applications.packet_forward_middleware.v1
 * Stats:       60 proto files · 100 messages · 2 services · 7 enums
 *
 * Full TypeScript SDK:  packages/axioledger/sdk/src/generated/
 * Regenerate:           bash toolchain/build-scripts/generate-proto.sh
 */

// ── Enums ───────────────────────────────────────────────────────────────────
export declare const enum Type { _PLACEHOLDER = 0 }
export declare const enum PacketDirection { _PLACEHOLDER = 0 }
export declare const enum State { _PLACEHOLDER = 0 }
export declare const enum Order { _PLACEHOLDER = 0 }
export declare const enum ResponseResultType { _PLACEHOLDER = 0 }
export declare const enum PacketStatus { _PLACEHOLDER = 0 }
export declare const enum DataType { _PLACEHOLDER = 0 }

// ── Messages ─────────────────────────────────────────────────────────────────
export declare interface AccountIdentifier { [key: string]: unknown }
export declare interface ICS27Account { [key: string]: unknown }
export declare interface CosmosTx { [key: string]: unknown }
export declare interface GenesisState { [key: string]: unknown }
export declare interface RegisteredICS27Account { [key: string]: unknown }
export declare interface GMPPacketData { [key: string]: unknown }
export declare interface Acknowledgement { [key: string]: unknown }
export declare interface QueryAccountAddressRequest { [key: string]: unknown }
export declare interface QueryAccountAddressResponse { [key: string]: unknown }
export declare interface QueryAccountIdentifierRequest { [key: string]: unknown }
export declare interface QueryAccountIdentifierResponse { [key: string]: unknown }
export declare interface MsgSendCall { [key: string]: unknown }
export declare interface MsgSendCallResponse { [key: string]: unknown }
export declare interface Params { [key: string]: unknown }
export declare interface QueryInterchainAccountRequest { [key: string]: unknown }
export declare interface QueryInterchainAccountResponse { [key: string]: unknown }
export declare interface QueryParamsRequest { [key: string]: unknown }
export declare interface QueryParamsResponse { [key: string]: unknown }
export declare interface MsgRegisterInterchainAccount { [key: string]: unknown }
export declare interface MsgRegisterInterchainAccountResponse { [key: string]: unknown }
export declare interface MsgSendTx { [key: string]: unknown }
export declare interface MsgSendTxResponse { [key: string]: unknown }
export declare interface MsgUpdateParams { [key: string]: unknown }
export declare interface MsgUpdateParamsResponse { [key: string]: unknown }
export declare interface ControllerGenesisState { [key: string]: unknown }
export declare interface HostGenesisState { [key: string]: unknown }
export declare interface ActiveChannel { [key: string]: unknown }
export declare interface RegisteredInterchainAccount { [key: string]: unknown }
export declare interface QueryRequest { [key: string]: unknown }
export declare interface MsgModuleQuerySafe { [key: string]: unknown }
export declare interface MsgModuleQuerySafeResponse { [key: string]: unknown }
export declare interface InterchainAccount { [key: string]: unknown }
export declare interface Metadata { [key: string]: unknown }
export declare interface InterchainAccountPacketData { [key: string]: unknown }
export declare interface InFlightPacket { [key: string]: unknown }
export declare interface QueryAllRateLimitsRequest { [key: string]: unknown }
export declare interface QueryAllRateLimitsResponse { [key: string]: unknown }
export declare interface QueryRateLimitRequest { [key: string]: unknown }
export declare interface QueryRateLimitResponse { [key: string]: unknown }
export declare interface QueryRateLimitsByChainIDRequest { [key: string]: unknown }
export declare interface QueryRateLimitsByChainIDResponse { [key: string]: unknown }
export declare interface QueryRateLimitsByChannelOrClientIDRequest { [key: string]: unknown }
export declare interface QueryRateLimitsByChannelOrClientIDResponse { [key: string]: unknown }
export declare interface QueryAllBlacklistedDenomsRequest { [key: string]: unknown }
export declare interface QueryAllBlacklistedDenomsResponse { [key: string]: unknown }
export declare interface QueryAllWhitelistedAddressesRequest { [key: string]: unknown }
export declare interface QueryAllWhitelistedAddressesResponse { [key: string]: unknown }
export declare interface Path { [key: string]: unknown }
export declare interface Quota { [key: string]: unknown }
export declare interface Flow { [key: string]: unknown }
export declare interface RateLimit { [key: string]: unknown }
export declare interface WhitelistedAddressPair { [key: string]: unknown }
export declare interface HourEpoch { [key: string]: unknown }
export declare interface MsgAddRateLimit { [key: string]: unknown }
export declare interface MsgAddRateLimitResponse { [key: string]: unknown }
export declare interface MsgUpdateRateLimit { [key: string]: unknown }
export declare interface MsgUpdateRateLimitResponse { [key: string]: unknown }
export declare interface MsgRemoveRateLimit { [key: string]: unknown }
export declare interface MsgRemoveRateLimitResponse { [key: string]: unknown }
export declare interface MsgResetRateLimit { [key: string]: unknown }
export declare interface MsgResetRateLimitResponse { [key: string]: unknown }
export declare interface Allocation { [key: string]: unknown }
export declare interface TransferAuthorization { [key: string]: unknown }
export declare interface DenomTrace { [key: string]: unknown }
export declare interface FungibleTokenPacketData { [key: string]: unknown }
export declare interface QueryDenomRequest { [key: string]: unknown }
export declare interface QueryDenomResponse { [key: string]: unknown }
export declare interface QueryDenomsRequest { [key: string]: unknown }
export declare interface QueryDenomsResponse { [key: string]: unknown }
export declare interface QueryDenomHashRequest { [key: string]: unknown }
export declare interface QueryDenomHashResponse { [key: string]: unknown }
export declare interface QueryEscrowAddressRequest { [key: string]: unknown }
export declare interface QueryEscrowAddressResponse { [key: string]: unknown }
export declare interface QueryTotalEscrowForDenomRequest { [key: string]: unknown }
export declare interface QueryTotalEscrowForDenomResponse { [key: string]: unknown }
export declare interface Token { [key: string]: unknown }
export declare interface Denom { [key: string]: unknown }
export declare interface Hop { [key: string]: unknown }
export declare interface MsgTransfer { [key: string]: unknown }
export declare interface MsgTransferResponse { [key: string]: unknown }
export declare interface Channel { [key: string]: unknown }
export declare interface IdentifiedChannel { [key: string]: unknown }
export declare interface Counterparty { [key: string]: unknown }
export declare interface Packet { [key: string]: unknown }
export declare interface PacketState { [key: string]: unknown }
export declare interface PacketId { [key: string]: unknown }
export declare interface Timeout { [key: string]: unknown }
export declare interface PacketSequence { [key: string]: unknown }
export declare interface QueryChannelRequest { [key: string]: unknown }
export declare interface QueryChannelResponse { [key: string]: unknown }
export declare interface QueryChannelsRequest { [key: string]: unknown }
export declare interface QueryChannelsResponse { [key: string]: unknown }
export declare interface QueryConnectionChannelsRequest { [key: string]: unknown }
export declare interface QueryConnectionChannelsResponse { [key: string]: unknown }
export declare interface QueryChannelClientStateRequest { [key: string]: unknown }
export declare interface QueryChannelClientStateResponse { [key: string]: unknown }
export declare interface QueryChannelConsensusStateRequest { [key: string]: unknown }
export declare interface QueryChannelConsensusStateResponse { [key: string]: unknown }
export declare interface QueryPacketCommitmentRequest { [key: string]: unknown }
export declare interface QueryPacketCommitmentResponse { [key: string]: unknown }

// ── gRPC Service Clients ─────────────────────────────────────────────────────
export declare class QueryClient {
  constructor(endpoint: string)
}
export declare class MsgClient {
  constructor(endpoint: string)
}

// ── Proto file index ─────────────────────────────────────────────────────────
// proto/ibc/applications/gmp/v1/account.proto
// proto/ibc/applications/gmp/v1/genesis.proto
// proto/ibc/applications/gmp/v1/packet.proto
// proto/ibc/applications/gmp/v1/query.proto
// proto/ibc/applications/gmp/v1/tx.proto
// proto/ibc/applications/interchain_accounts/controller/v1/controller.proto
// proto/ibc/applications/interchain_accounts/controller/v1/query.proto
// proto/ibc/applications/interchain_accounts/controller/v1/tx.proto
// proto/ibc/applications/interchain_accounts/genesis/v1/genesis.proto
// proto/ibc/applications/interchain_accounts/host/v1/host.proto
// proto/ibc/applications/interchain_accounts/host/v1/query.proto
// proto/ibc/applications/interchain_accounts/host/v1/tx.proto
// proto/ibc/applications/interchain_accounts/v1/account.proto
// proto/ibc/applications/interchain_accounts/v1/metadata.proto
// proto/ibc/applications/interchain_accounts/v1/packet.proto
// proto/ibc/applications/packet_forward_middleware/v1/genesis.proto
// proto/ibc/applications/rate_limiting/v1/genesis.proto
// proto/ibc/applications/rate_limiting/v1/query.proto
// proto/ibc/applications/rate_limiting/v1/rate_limiting.proto
// proto/ibc/applications/rate_limiting/v1/tx.proto
// proto/ibc/applications/transfer/v1/authz.proto
// proto/ibc/applications/transfer/v1/denomtrace.proto
// proto/ibc/applications/transfer/v1/genesis.proto
// proto/ibc/applications/transfer/v1/packet.proto
// proto/ibc/applications/transfer/v1/query.proto
// proto/ibc/applications/transfer/v1/token.proto
// proto/ibc/applications/transfer/v1/transfer.proto
// proto/ibc/applications/transfer/v1/tx.proto
// proto/ibc/core/channel/v1/channel.proto
// proto/ibc/core/channel/v1/genesis.proto
// proto/ibc/core/channel/v1/query.proto
// proto/ibc/core/channel/v1/tx.proto
// proto/ibc/core/channel/v2/genesis.proto
// proto/ibc/core/channel/v2/packet.proto
// proto/ibc/core/channel/v2/query.proto
// proto/ibc/core/channel/v2/tx.proto
// proto/ibc/core/client/v1/client.proto
// proto/ibc/core/client/v1/genesis.proto
// proto/ibc/core/client/v1/query.proto
// proto/ibc/core/client/v1/tx.proto
// ... and 20 more

export {}
