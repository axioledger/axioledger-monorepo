/**
 * @axioledger/cometbft
 * CometBFT Consensus Engine
 *
 * Namespace:   github.com/axioledger/cometbft
 * Source:      external/cosmos/cometbft/
 * Proto pkgs:  tendermint.abci, tendermint.blocksync, tendermint.consensus, tendermint.crypto, tendermint.libs.bits, tendermint.mempool
 * Stats:       25 proto files · 100 messages · 2 services · 8 enums
 *
 * Full TypeScript SDK:  packages/axioledger/sdk/src/generated/
 * Regenerate:           bash toolchain/build-scripts/generate-proto.sh
 */

// ── Enums ───────────────────────────────────────────────────────────────────
export declare const enum CheckTxType { _PLACEHOLDER = 0 }
export declare const enum Result { _PLACEHOLDER = 0 }
export declare const enum ProposalStatus { _PLACEHOLDER = 0 }
export declare const enum VerifyStatus { _PLACEHOLDER = 0 }
export declare const enum MisbehaviorType { _PLACEHOLDER = 0 }
export declare const enum Errors { _PLACEHOLDER = 0 }
export declare const enum SignedMsgType { _PLACEHOLDER = 0 }
export declare const enum BlockIDFlag { _PLACEHOLDER = 0 }

// ── Messages ─────────────────────────────────────────────────────────────────
export declare interface Request { [key: string]: unknown }
export declare interface RequestEcho { [key: string]: unknown }
export declare interface RequestFlush { [key: string]: unknown }
export declare interface RequestInfo { [key: string]: unknown }
export declare interface RequestInitChain { [key: string]: unknown }
export declare interface RequestQuery { [key: string]: unknown }
export declare interface RequestCheckTx { [key: string]: unknown }
export declare interface RequestInsertTx { [key: string]: unknown }
export declare interface RequestReapTxs { [key: string]: unknown }
export declare interface RequestCommit { [key: string]: unknown }
export declare interface RequestListSnapshots { [key: string]: unknown }
export declare interface RequestOfferSnapshot { [key: string]: unknown }
export declare interface RequestLoadSnapshotChunk { [key: string]: unknown }
export declare interface RequestApplySnapshotChunk { [key: string]: unknown }
export declare interface RequestPrepareProposal { [key: string]: unknown }
export declare interface RequestProcessProposal { [key: string]: unknown }
export declare interface RequestExtendVote { [key: string]: unknown }
export declare interface RequestVerifyVoteExtension { [key: string]: unknown }
export declare interface RequestFinalizeBlock { [key: string]: unknown }
export declare interface Response { [key: string]: unknown }
export declare interface ResponseException { [key: string]: unknown }
export declare interface ResponseEcho { [key: string]: unknown }
export declare interface ResponseFlush { [key: string]: unknown }
export declare interface ResponseInfo { [key: string]: unknown }
export declare interface ResponseInitChain { [key: string]: unknown }
export declare interface ResponseQuery { [key: string]: unknown }
export declare interface ResponseCheckTx { [key: string]: unknown }
export declare interface ResponseInsertTx { [key: string]: unknown }
export declare interface ResponseReapTxs { [key: string]: unknown }
export declare interface ResponseCommit { [key: string]: unknown }
export declare interface ResponseListSnapshots { [key: string]: unknown }
export declare interface ResponseOfferSnapshot { [key: string]: unknown }
export declare interface ResponseLoadSnapshotChunk { [key: string]: unknown }
export declare interface ResponseApplySnapshotChunk { [key: string]: unknown }
export declare interface ResponsePrepareProposal { [key: string]: unknown }
export declare interface ResponseProcessProposal { [key: string]: unknown }
export declare interface ResponseExtendVote { [key: string]: unknown }
export declare interface ResponseVerifyVoteExtension { [key: string]: unknown }
export declare interface ResponseFinalizeBlock { [key: string]: unknown }
export declare interface CommitInfo { [key: string]: unknown }
export declare interface ExtendedCommitInfo { [key: string]: unknown }
export declare interface Event { [key: string]: unknown }
export declare interface EventAttribute { [key: string]: unknown }
export declare interface ExecTxResult { [key: string]: unknown }
export declare interface TxResult { [key: string]: unknown }
export declare interface Validator { [key: string]: unknown }
export declare interface ValidatorUpdate { [key: string]: unknown }
export declare interface VoteInfo { [key: string]: unknown }
export declare interface ExtendedVoteInfo { [key: string]: unknown }
export declare interface Misbehavior { [key: string]: unknown }
export declare interface Snapshot { [key: string]: unknown }
export declare interface SigCountMessage { [key: string]: unknown }
export declare interface SigCountBlockResponse { [key: string]: unknown }
export declare interface SigCountBlock { [key: string]: unknown }
export declare interface SigCountCommit { [key: string]: unknown }
export declare interface SigCountExtendedCommit { [key: string]: unknown }
export declare interface BlockRequest { [key: string]: unknown }
export declare interface NoBlockResponse { [key: string]: unknown }
export declare interface BlockResponse { [key: string]: unknown }
export declare interface StatusRequest { [key: string]: unknown }
export declare interface StatusResponse { [key: string]: unknown }
export declare interface Message { [key: string]: unknown }
export declare interface NewRoundStep { [key: string]: unknown }
export declare interface NewValidBlock { [key: string]: unknown }
export declare interface Proposal { [key: string]: unknown }
export declare interface ProposalPOL { [key: string]: unknown }
export declare interface BlockPart { [key: string]: unknown }
export declare interface Vote { [key: string]: unknown }
export declare interface HasVote { [key: string]: unknown }
export declare interface VoteSetMaj23 { [key: string]: unknown }
export declare interface VoteSetBits { [key: string]: unknown }
export declare interface MsgInfo { [key: string]: unknown }
export declare interface TimeoutInfo { [key: string]: unknown }
export declare interface EndHeight { [key: string]: unknown }
export declare interface WALMessage { [key: string]: unknown }
export declare interface TimedWALMessage { [key: string]: unknown }
export declare interface PublicKey { [key: string]: unknown }
export declare interface Proof { [key: string]: unknown }
export declare interface ValueOp { [key: string]: unknown }
export declare interface DominoOp { [key: string]: unknown }
export declare interface ProofOp { [key: string]: unknown }
export declare interface ProofOps { [key: string]: unknown }
export declare interface BitArray { [key: string]: unknown }
export declare interface Txs { [key: string]: unknown }
export declare interface PacketPing { [key: string]: unknown }
export declare interface PacketPong { [key: string]: unknown }
export declare interface PacketMsg { [key: string]: unknown }
export declare interface Packet { [key: string]: unknown }
export declare interface AuthSigMessage { [key: string]: unknown }
export declare interface PexRequest { [key: string]: unknown }
export declare interface PexAddrs { [key: string]: unknown }
export declare interface NetAddress { [key: string]: unknown }
export declare interface ProtocolVersion { [key: string]: unknown }
export declare interface DefaultNodeInfo { [key: string]: unknown }
export declare interface DefaultNodeInfoOther { [key: string]: unknown }
export declare interface RemoteSignerError { [key: string]: unknown }
export declare interface PubKeyRequest { [key: string]: unknown }
export declare interface PubKeyResponse { [key: string]: unknown }
export declare interface SignVoteRequest { [key: string]: unknown }
export declare interface SignedVoteResponse { [key: string]: unknown }

// ── gRPC Service Clients ─────────────────────────────────────────────────────
export declare class ABCIClient {
  constructor(endpoint: string)
}
export declare class BroadcastAPIClient {
  constructor(endpoint: string)
}

// ── Proto file index ─────────────────────────────────────────────────────────
// proto/tendermint/abci/types.proto
// proto/tendermint/blocksync/stub.proto
// proto/tendermint/blocksync/types.proto
// proto/tendermint/consensus/types.proto
// proto/tendermint/consensus/wal.proto
// proto/tendermint/crypto/keys.proto
// proto/tendermint/crypto/proof.proto
// proto/tendermint/libs/bits/types.proto
// proto/tendermint/mempool/types.proto
// proto/tendermint/p2p/conn.proto
// proto/tendermint/p2p/pex.proto
// proto/tendermint/p2p/types.proto
// proto/tendermint/privval/types.proto
// proto/tendermint/rpc/grpc/types.proto
// proto/tendermint/state/types.proto
// proto/tendermint/statesync/types.proto
// proto/tendermint/store/types.proto
// proto/tendermint/types/block.proto
// proto/tendermint/types/canonical.proto
// proto/tendermint/types/events.proto
// proto/tendermint/types/evidence.proto
// proto/tendermint/types/params.proto
// proto/tendermint/types/types.proto
// proto/tendermint/types/validator.proto
// proto/tendermint/version/types.proto

export {}
