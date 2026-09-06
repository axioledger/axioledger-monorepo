/**
 * @axioledger/interchain-security
 * Shared Validator Security
 * Token:  $VPX
 *
 * Namespace:   github.com/axioledger/interchain-security
 * Source:      external/cosmos/interchain-security/
 * Proto pkgs:  interchain_security.ccv.consumer.v1, interchain_security.ccv.provider.v1, interchain_security.ccv.v1
 * Stats:       10 proto files · 100 messages · 2 services · 3 enums
 *
 * Full TypeScript SDK:  packages/axioledger/sdk/src/generated/
 * Regenerate:           bash toolchain/build-scripts/generate-proto.sh
 */

// ── Enums ───────────────────────────────────────────────────────────────────
export declare const enum ConsumerPhase { _PLACEHOLDER = 0 }
export declare const enum ConsumerPacketDataType { _PLACEHOLDER = 0 }
export declare const enum InfractionType { _PLACEHOLDER = 0 }

// ── Messages ─────────────────────────────────────────────────────────────────
export declare interface CrossChainValidator { [key: string]: unknown }
export declare interface SlashRecord { [key: string]: unknown }
export declare interface GenesisState { [key: string]: unknown }
export declare interface HeightToValsetUpdateID { [key: string]: unknown }
export declare interface OutstandingDowntime { [key: string]: unknown }
export declare interface LastTransmissionBlockHeight { [key: string]: unknown }
export declare interface ConsumerPacketDataList { [key: string]: unknown }
export declare interface NextFeeDistributionEstimate { [key: string]: unknown }
export declare interface QueryNextFeeDistributionEstimateRequest { [key: string]: unknown }
export declare interface QueryNextFeeDistributionEstimateResponse { [key: string]: unknown }
export declare interface QueryParamsRequest { [key: string]: unknown }
export declare interface QueryParamsResponse { [key: string]: unknown }
export declare interface QueryProviderInfoRequest { [key: string]: unknown }
export declare interface QueryProviderInfoResponse { [key: string]: unknown }
export declare interface QueryThrottleStateRequest { [key: string]: unknown }
export declare interface QueryThrottleStateResponse { [key: string]: unknown }
export declare interface ChainInfo { [key: string]: unknown }
export declare interface MsgUpdateParams { [key: string]: unknown }
export declare interface MsgUpdateParamsResponse { [key: string]: unknown }
export declare interface ConsumerState { [key: string]: unknown }
export declare interface ValsetUpdateIdToHeight { [key: string]: unknown }
export declare interface ConsumerAdditionProposal { [key: string]: unknown }
export declare interface ConsumerRemovalProposal { [key: string]: unknown }
export declare interface ConsumerModificationProposal { [key: string]: unknown }
export declare interface EquivocationProposal { [key: string]: unknown }
export declare interface ChangeRewardDenomsProposal { [key: string]: unknown }
export declare interface GlobalSlashEntry { [key: string]: unknown }
export declare interface Params { [key: string]: unknown }
export declare interface SlashAcks { [key: string]: unknown }
export declare interface ConsumerAdditionProposals { [key: string]: unknown }
export declare interface ConsumerRemovalProposals { [key: string]: unknown }
export declare interface AddressList { [key: string]: unknown }
export declare interface ChannelToChain { [key: string]: unknown }
export declare interface ValidatorSetChangePackets { [key: string]: unknown }
export declare interface KeyAssignmentReplacement { [key: string]: unknown }
export declare interface ValidatorConsumerPubKey { [key: string]: unknown }
export declare interface ValidatorByConsumerAddr { [key: string]: unknown }
export declare interface ConsumerAddrsToPruneV2 { [key: string]: unknown }
export declare interface ConsensusValidator { [key: string]: unknown }
export declare interface ConsumerRewardsAllocation { [key: string]: unknown }
export declare interface ConsumerMetadata { [key: string]: unknown }
export declare interface ConsumerInitializationParameters { [key: string]: unknown }
export declare interface PowerShapingParameters { [key: string]: unknown }
export declare interface ConsumerIds { [key: string]: unknown }
export declare interface AllowlistedRewardDenoms { [key: string]: unknown }
export declare interface InfractionParameters { [key: string]: unknown }
export declare interface SlashJailParameters { [key: string]: unknown }
export declare interface QueryConsumerGenesisRequest { [key: string]: unknown }
export declare interface QueryConsumerGenesisResponse { [key: string]: unknown }
export declare interface QueryConsumerChainsRequest { [key: string]: unknown }
export declare interface QueryConsumerChainsResponse { [key: string]: unknown }
export declare interface Chain { [key: string]: unknown }
export declare interface QueryValidatorConsumerAddrRequest { [key: string]: unknown }
export declare interface QueryValidatorConsumerAddrResponse { [key: string]: unknown }
export declare interface QueryValidatorProviderAddrRequest { [key: string]: unknown }
export declare interface QueryValidatorProviderAddrResponse { [key: string]: unknown }
export declare interface QueryRegisteredConsumerRewardDenomsRequest { [key: string]: unknown }
export declare interface QueryRegisteredConsumerRewardDenomsResponse { [key: string]: unknown }
export declare interface QueryAllPairsValConsAddrByConsumerRequest { [key: string]: unknown }
export declare interface QueryAllPairsValConsAddrByConsumerResponse { [key: string]: unknown }
export declare interface PairValConAddrProviderAndConsumer { [key: string]: unknown }
export declare interface QueryConsumerChainOptedInValidatorsRequest { [key: string]: unknown }
export declare interface QueryConsumerChainOptedInValidatorsResponse { [key: string]: unknown }
export declare interface QueryConsumerValidatorsRequest { [key: string]: unknown }
export declare interface QueryConsumerValidatorsValidator { [key: string]: unknown }
export declare interface QueryConsumerValidatorsResponse { [key: string]: unknown }
export declare interface QueryConsumerChainsValidatorHasToValidateRequest { [key: string]: unknown }
export declare interface QueryConsumerChainsValidatorHasToValidateResponse { [key: string]: unknown }
export declare interface QueryValidatorConsumerCommissionRateRequest { [key: string]: unknown }
export declare interface QueryValidatorConsumerCommissionRateResponse { [key: string]: unknown }
export declare interface QueryBlocksUntilNextEpochRequest { [key: string]: unknown }
export declare interface QueryBlocksUntilNextEpochResponse { [key: string]: unknown }
export declare interface QueryConsumerIdFromClientIdRequest { [key: string]: unknown }
export declare interface QueryConsumerIdFromClientIdResponse { [key: string]: unknown }
export declare interface QueryConsumerChainRequest { [key: string]: unknown }
export declare interface QueryConsumerChainResponse { [key: string]: unknown }
export declare interface QueryConsumerGenesisTimeRequest { [key: string]: unknown }
export declare interface QueryConsumerGenesisTimeResponse { [key: string]: unknown }
export declare interface MsgAssignConsumerKey { [key: string]: unknown }
export declare interface MsgAssignConsumerKeyResponse { [key: string]: unknown }
export declare interface MsgSubmitConsumerMisbehaviour { [key: string]: unknown }
export declare interface MsgSubmitConsumerMisbehaviourResponse { [key: string]: unknown }
export declare interface MsgSubmitConsumerDoubleVoting { [key: string]: unknown }
export declare interface MsgSubmitConsumerDoubleVotingResponse { [key: string]: unknown }
export declare interface MsgConsumerAddition { [key: string]: unknown }
export declare interface MsgConsumerRemoval { [key: string]: unknown }
export declare interface MsgRemoveConsumer { [key: string]: unknown }
export declare interface MsgRemoveConsumerResponse { [key: string]: unknown }
export declare interface MsgChangeRewardDenoms { [key: string]: unknown }
export declare interface MsgChangeRewardDenomsResponse { [key: string]: unknown }
export declare interface MsgOptIn { [key: string]: unknown }
export declare interface MsgOptInResponse { [key: string]: unknown }
export declare interface MsgOptOut { [key: string]: unknown }
export declare interface MsgOptOutResponse { [key: string]: unknown }
export declare interface MsgSetConsumerCommissionRate { [key: string]: unknown }
export declare interface MsgSetConsumerCommissionRateResponse { [key: string]: unknown }
export declare interface MsgConsumerModification { [key: string]: unknown }
export declare interface MsgConsumerModificationResponse { [key: string]: unknown }
export declare interface MsgCreateConsumer { [key: string]: unknown }
export declare interface MsgCreateConsumerResponse { [key: string]: unknown }

// ── gRPC Service Clients ─────────────────────────────────────────────────────
export declare class QueryClient {
  constructor(endpoint: string)
}
export declare class MsgClient {
  constructor(endpoint: string)
}

// ── Proto file index ─────────────────────────────────────────────────────────
// proto/interchain_security/ccv/consumer/v1/consumer.proto
// proto/interchain_security/ccv/consumer/v1/genesis.proto
// proto/interchain_security/ccv/consumer/v1/query.proto
// proto/interchain_security/ccv/consumer/v1/tx.proto
// proto/interchain_security/ccv/provider/v1/genesis.proto
// proto/interchain_security/ccv/provider/v1/provider.proto
// proto/interchain_security/ccv/provider/v1/query.proto
// proto/interchain_security/ccv/provider/v1/tx.proto
// proto/interchain_security/ccv/v1/shared_consumer.proto
// proto/interchain_security/ccv/v1/wire.proto

export {}
