// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IDANodeRegistry
 * @notice On-chain interface for the Axioledger Data Availability Node Registry.
 *
 * DA Nodes stake $AXQ to participate in blob storage.
 * Slashing occurs when a node fails a Proof-of-Retrievability challenge within
 * CHALLENGE_WINDOW_BLOCKS (12 blocks).
 *
 * This interface is implemented by DANodeRegistry.sol and consumed by:
 *  - @sequentichain/da-layer  (TypeScript — off-chain challenge manager)
 *  - @sequentichain/zk-batcher (L2 sequencer — blob submission)
 *  - TreasuryEscrowContract   (auto-disbursement upon ZK-KPI verification)
 */
interface IDANodeRegistry {

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    /// @notice Emitted when a new DA Node registers and stakes $AXQ.
    event NodeRegistered(
        address indexed nodeId,
        uint256 stakeAmount,
        string  endpoint
    );

    /// @notice Emitted when a blob is submitted for availability.
    event BlobSubmitted(
        bytes32 indexed blobId,
        bytes32 merkleRoot,
        uint256 sizeBytes,
        uint256 feeCollected,   // in micro-AXQ
        address indexed submittedBy
    );

    /// @notice Emitted when a retrieval challenge is issued.
    event ChallengeIssued(
        bytes32 indexed challengeId,
        bytes32 indexed blobId,
        uint32  shardIndex,
        address indexed challengedNode,
        uint256 deadlineBlock
    );

    /// @notice Emitted when a challenge is resolved successfully.
    event ChallengeResolved(
        bytes32 indexed challengeId,
        address indexed resolvedBy
    );

    /// @notice Emitted when a node is slashed for failing a challenge.
    event NodeSlashed(
        bytes32 indexed challengeId,
        address indexed slashedNode,
        uint256 slashAmount         // in micro-AXQ
    );

    /// @notice Emitted when a blob transitions to cold archival.
    event BlobArchived(
        bytes32 indexed blobId,
        bytes32 merkleRoot,         // anchored permanently on-chain
        uint256 archivedAtBlock
    );

    // -------------------------------------------------------------------------
    // Node lifecycle
    // -------------------------------------------------------------------------

    /**
     * @notice Register as a DA Node operator.
     * @dev Caller must approve $AXQ transfer of at least MIN_STAKE before calling.
     * @param stakeAmount  Amount of $AXQ to stake (micro-AXQ units).
     * @param endpoint     P2P multiaddr endpoint (e.g. "/ip4/1.2.3.4/tcp/9000").
     */
    function registerNode(uint256 stakeAmount, string calldata endpoint) external;

    /**
     * @notice Voluntarily exit and reclaim stake (subject to unbonding period).
     */
    function exitNode() external;

    /**
     * @notice Return the on-chain record for a node.
     * @param nodeId  Operator address.
     */
    function getNode(address nodeId) external view returns (
        uint256 stakeAmount,
        string  memory endpoint,
        uint32  shardCount,
        uint256 slashedAmount,
        uint8   status          // 0=active, 1=suspended, 2=slashed, 3=exited
    );

    // -------------------------------------------------------------------------
    // Blob lifecycle
    // -------------------------------------------------------------------------

    /**
     * @notice Record blob submission on-chain and collect DA fee in $AXQ.
     * @dev Called by the L2 Sequencer after submitting a blob to the DA network.
     * @param blobId      Content-addressed blob identifier (SHA-256 or KZG commitment).
     * @param merkleRoot  Merkle root of all RS-encoded shard checksums.
     * @param sizeBytes   Raw payload size in bytes (≤ 131,072).
     * @param fee         Pre-computed DA fee in micro-AXQ (must match estimateFee output).
     */
    function submitBlob(
        bytes32 blobId,
        bytes32 merkleRoot,
        uint32  sizeBytes,
        uint256 fee
    ) external;

    /**
     * @notice Transition a blob to cold archival status.
     * @dev Called by the DA node daemon after hot retention window expires.
     *      Records the merkle root permanently on-chain for future dispute resolution.
     * @param blobId  The blob being archived.
     */
    function archiveBlob(bytes32 blobId) external;

    /**
     * @notice Return the on-chain blob record.
     */
    function getBlob(bytes32 blobId) external view returns (
        bytes32 merkleRoot,
        uint32  sizeBytes,
        address submittedBy,
        uint256 submittedAtBlock,
        uint256 expiresAtBlock,
        uint8   phase           // 0=hot, 1=cold, 2=pruned
    );

    // -------------------------------------------------------------------------
    // Challenge / Proof-of-Retrievability
    // -------------------------------------------------------------------------

    /**
     * @notice Issue a retrieval challenge to a DA Node.
     * @dev Any address may challenge. The challenger must deposit a small bond
     *      (returned on successful challenge, forfeited on invalid challenge).
     * @param blobId         Target blob.
     * @param shardIndex     Specific shard demanded (0 … k+m-1).
     * @param challengedNode Node operator address to challenge.
     * @return challengeId   Unique identifier for this challenge.
     */
    function issueChallenge(
        bytes32 blobId,
        uint32  shardIndex,
        address challengedNode
    ) external returns (bytes32 challengeId);

    /**
     * @notice Respond to a retrieval challenge by submitting the shard + Merkle proof.
     * @dev The contract verifies:
     *        1. sha256(shardData) == shardChecksum
     *        2. MerkleProof(shardChecksum, proof, shardIndex, merkleRoot) == true
     *        3. Block.number <= challenge.deadlineBlock
     * @param challengeId   The challenge being answered.
     * @param shardData     Raw shard bytes (base64-decoded, passed as bytes).
     * @param shardChecksum SHA-256 of shardData.
     * @param proof         Merkle inclusion proof (sibling hashes from leaf to root).
     */
    function respondToChallenge(
        bytes32          challengeId,
        bytes   calldata shardData,
        bytes32          shardChecksum,
        bytes32[] calldata proof
    ) external;

    /**
     * @notice Finalize an expired challenge and execute slashing.
     * @dev May be called by anyone after `challenge.deadlineBlock` has passed
     *      without a valid response. Slashes the challenged node's $AXQ stake.
     * @param challengeId  The expired challenge to finalize.
     */
    function finalizeExpiredChallenge(bytes32 challengeId) external;

    // -------------------------------------------------------------------------
    // Fee model (view)
    // -------------------------------------------------------------------------

    /**
     * @notice Compute the current DA fee quote for a given blob size.
     * @param sizeBytes  Size of the blob payload in bytes.
     * @return fee       Fee in micro-AXQ using the dynamic congestion formula.
     */
    function estimateFee(uint32 sizeBytes) external view returns (uint256 fee);

    // -------------------------------------------------------------------------
    // Constants (view)
    // -------------------------------------------------------------------------

    function MIN_STAKE()                external pure returns (uint256);  // 10_000 AXQ in μAXQ
    function CHALLENGE_WINDOW_BLOCKS()  external pure returns (uint256);  // 12
    function HOT_RETENTION_BLOCKS()     external pure returns (uint256);  // 302_400
    function MAX_BLOB_SIZE_BYTES()      external pure returns (uint32);   // 131_072
    function DATA_SHARDS()              external pure returns (uint8);    // 32
    function PARITY_SHARDS()            external pure returns (uint8);    // 32
}
