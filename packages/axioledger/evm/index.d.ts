/**
 * @axioledger/evm
 * EVM Compatibility Layer — ZK-EVM bridge
 *
 * Namespace:   github.com/axioledger/evm
 * Source:      external/cosmos/evm/
 * Proto pkgs:  cosmos.evm.ante.v1, cosmos.evm.crypto.v1.ethsecp256k1, cosmos.evm.eip712.v1, cosmos.evm.erc20.v1, cosmos.evm.feemarket.v1, cosmos.evm.server.v1
 * Stats:       19 proto files · 86 messages · 2 services · 2 enums
 *
 * Full TypeScript SDK:  packages/axioledger/sdk/src/generated/
 * Regenerate:           bash toolchain/build-scripts/generate-proto.sh
 */

// ── Enums ───────────────────────────────────────────────────────────────────
export declare const enum Owner { _PLACEHOLDER = 0 }
export declare const enum AccessType { _PLACEHOLDER = 0 }

// ── Messages ─────────────────────────────────────────────────────────────────
export declare interface ExtensionOptionDynamicFeeTx { [key: string]: unknown }
export declare interface PubKey { [key: string]: unknown }
export declare interface PrivKey { [key: string]: unknown }
export declare interface ExtensionOptionsWeb3Tx { [key: string]: unknown }
export declare interface TokenPair { [key: string]: unknown }
export declare interface Allowance { [key: string]: unknown }
export declare interface RegisterCoinProposal { [key: string]: unknown }
export declare interface ProposalMetadata { [key: string]: unknown }
export declare interface RegisterERC20Proposal { [key: string]: unknown }
export declare interface ToggleTokenConversionProposal { [key: string]: unknown }
export declare interface EventRegisterPair { [key: string]: unknown }
export declare interface EventToggleTokenConversion { [key: string]: unknown }
export declare interface EventConvertCoin { [key: string]: unknown }
export declare interface EventConvertERC20 { [key: string]: unknown }
export declare interface GenesisState { [key: string]: unknown }
export declare interface Params { [key: string]: unknown }
export declare interface QueryTokenPairsRequest { [key: string]: unknown }
export declare interface QueryTokenPairsResponse { [key: string]: unknown }
export declare interface QueryTokenPairRequest { [key: string]: unknown }
export declare interface QueryTokenPairResponse { [key: string]: unknown }
export declare interface QueryParamsRequest { [key: string]: unknown }
export declare interface QueryParamsResponse { [key: string]: unknown }
export declare interface MsgConvertERC20 { [key: string]: unknown }
export declare interface MsgConvertERC20Response { [key: string]: unknown }
export declare interface MsgConvertCoin { [key: string]: unknown }
export declare interface MsgConvertCoinResponse { [key: string]: unknown }
export declare interface MsgUpdateParams { [key: string]: unknown }
export declare interface MsgUpdateParamsResponse { [key: string]: unknown }
export declare interface MsgRegisterERC20 { [key: string]: unknown }
export declare interface MsgRegisterERC20Response { [key: string]: unknown }
export declare interface MsgToggleConversion { [key: string]: unknown }
export declare interface MsgToggleConversionResponse { [key: string]: unknown }
export declare interface EventFeeMarket { [key: string]: unknown }
export declare interface EventBlockGas { [key: string]: unknown }
export declare interface QueryBaseFeeRequest { [key: string]: unknown }
export declare interface QueryBaseFeeResponse { [key: string]: unknown }
export declare interface QueryBlockGasRequest { [key: string]: unknown }
export declare interface QueryBlockGasResponse { [key: string]: unknown }
export declare interface TxResult { [key: string]: unknown }
export declare interface EventEthereumTx { [key: string]: unknown }
export declare interface EventTxLog { [key: string]: unknown }
export declare interface EventMessage { [key: string]: unknown }
export declare interface EventBlockBloom { [key: string]: unknown }
export declare interface ExtendedDenomOptions { [key: string]: unknown }
export declare interface AccessControl { [key: string]: unknown }
export declare interface AccessControlType { [key: string]: unknown }
export declare interface ChainConfig { [key: string]: unknown }
export declare interface State { [key: string]: unknown }
export declare interface TransactionLogs { [key: string]: unknown }
export declare interface Log { [key: string]: unknown }
export declare interface AccessTuple { [key: string]: unknown }
export declare interface TraceConfig { [key: string]: unknown }
export declare interface Preinstall { [key: string]: unknown }
export declare interface EvmCoinInfo { [key: string]: unknown }
export declare interface GenesisAccount { [key: string]: unknown }
export declare interface QueryConfigRequest { [key: string]: unknown }
export declare interface QueryConfigResponse { [key: string]: unknown }
export declare interface QueryAccountRequest { [key: string]: unknown }
export declare interface QueryAccountResponse { [key: string]: unknown }
export declare interface QueryCosmosAccountRequest { [key: string]: unknown }
export declare interface QueryCosmosAccountResponse { [key: string]: unknown }
export declare interface QueryValidatorAccountRequest { [key: string]: unknown }
export declare interface QueryValidatorAccountResponse { [key: string]: unknown }
export declare interface QueryBalanceRequest { [key: string]: unknown }
export declare interface QueryBalanceResponse { [key: string]: unknown }
export declare interface QueryStorageRequest { [key: string]: unknown }
export declare interface QueryStorageResponse { [key: string]: unknown }
export declare interface QueryCodeRequest { [key: string]: unknown }
export declare interface QueryCodeResponse { [key: string]: unknown }
export declare interface QueryTxLogsRequest { [key: string]: unknown }
export declare interface QueryTxLogsResponse { [key: string]: unknown }
export declare interface EthCallRequest { [key: string]: unknown }
export declare interface EstimateGasResponse { [key: string]: unknown }
export declare interface QueryTraceTxRequest { [key: string]: unknown }
export declare interface QueryTraceTxResponse { [key: string]: unknown }
export declare interface QueryTraceBlockRequest { [key: string]: unknown }
export declare interface QueryTraceBlockResponse { [key: string]: unknown }
export declare interface QueryTraceCallRequest { [key: string]: unknown }
export declare interface QueryTraceCallResponse { [key: string]: unknown }
export declare interface QueryGlobalMinGasPriceRequest { [key: string]: unknown }
export declare interface QueryGlobalMinGasPriceResponse { [key: string]: unknown }
export declare interface MsgEthereumTx { [key: string]: unknown }
export declare interface ExtensionOptionsEthereumTx { [key: string]: unknown }
export declare interface MsgEthereumTxResponse { [key: string]: unknown }
export declare interface MsgRegisterPreinstalls { [key: string]: unknown }
export declare interface MsgRegisterPreinstallsResponse { [key: string]: unknown }

// ── gRPC Service Clients ─────────────────────────────────────────────────────
export declare class QueryClient {
  constructor(endpoint: string)
}
export declare class MsgClient {
  constructor(endpoint: string)
}

// ── Proto file index ─────────────────────────────────────────────────────────
// proto/cosmos/evm/ante/v1/dynamic_fee.proto
// proto/cosmos/evm/crypto/v1/ethsecp256k1/keys.proto
// proto/cosmos/evm/eip712/v1/web3.proto
// proto/cosmos/evm/erc20/v1/erc20.proto
// proto/cosmos/evm/erc20/v1/events.proto
// proto/cosmos/evm/erc20/v1/genesis.proto
// proto/cosmos/evm/erc20/v1/query.proto
// proto/cosmos/evm/erc20/v1/tx.proto
// proto/cosmos/evm/feemarket/v1/events.proto
// proto/cosmos/evm/feemarket/v1/feemarket.proto
// proto/cosmos/evm/feemarket/v1/genesis.proto
// proto/cosmos/evm/feemarket/v1/query.proto
// proto/cosmos/evm/feemarket/v1/tx.proto
// proto/cosmos/evm/server/v1/indexer.proto
// proto/cosmos/evm/vm/v1/events.proto
// proto/cosmos/evm/vm/v1/evm.proto
// proto/cosmos/evm/vm/v1/genesis.proto
// proto/cosmos/evm/vm/v1/query.proto
// proto/cosmos/evm/vm/v1/tx.proto

export {}
