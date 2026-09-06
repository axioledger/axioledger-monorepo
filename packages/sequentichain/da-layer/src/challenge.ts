/**
 * @file challenge.ts
 * Proof-of-Retrievability (PoR) Challenge Protocol — Module 12.6
 *
 * When a DA Node fails to respond to a DAS sampling request, any participant
 * may issue a formal on-chain RetrievalChallenge.  The node has
 * CHALLENGE_WINDOW_BLOCKS (12 blocks ≈ 24 seconds) to respond with the
 * demanded shard + Merkle proof.  Failure → slashing of staked $AXQ.
 *
 * This module manages the off-chain challenge lifecycle. The on-chain
 * settlement is handled by `DANodeRegistry.sol`.
 *
 * Challenge lifecycle:
 *   issued (pending) → [node responds] → resolved
 *                    → [deadline passes] → expired → [slashing tx] → slashed
 */
import { randomUUID, createHash } from "node:crypto"
import type {
  BlobId,
  ChallengeResponse,
  ChallengeStatus,
  NodeId,
  RetrievalChallenge,
} from "./types.js"
import { CHALLENGE_WINDOW_BLOCKS } from "./types.js"
import { verifyMerkleProof } from "./erasure-coding.js"

// ---------------------------------------------------------------------------
// ChallengeManager
// ---------------------------------------------------------------------------

export class ChallengeManager {
  private readonly challenges = new Map<string, RetrievalChallenge>()

  /**
   * Issue a new retrieval challenge to a DA Node.
   *
   * @param blobId         - Blob whose shard availability is disputed
   * @param shardIndex     - Specific shard demanded from the node
   * @param challengedNode - NodeId of the node being challenged
   * @param challenger     - NodeId of the issuing party (or "network")
   * @param currentBlock   - Current L2 block number
   * @returns The created RetrievalChallenge
   */
  issue(
    blobId: BlobId,
    shardIndex: number,
    challengedNode: NodeId,
    challenger: NodeId,
    currentBlock: number,
  ): RetrievalChallenge {
    const challengeId = randomUUID()
    const challenge: RetrievalChallenge = {
      challengeId,
      blobId,
      shardIndex,
      challengedNode,
      challenger,
      issuedAtBlock: currentBlock,
      deadlineBlock: currentBlock + CHALLENGE_WINDOW_BLOCKS,
      status: "pending",
    }
    this.challenges.set(challengeId, challenge)
    return challenge
  }

  /**
   * Submit a response to an open challenge.
   *
   * Verifies:
   *   1. Challenge exists and is still "pending"
   *   2. Response arrives before `deadlineBlock`
   *   3. Shard index matches the challenged index
   *   4. Shard checksum matches shard data (SHA-256)
   *   5. Merkle proof validates against the committed root
   *
   * @param response     - The node's ChallengeResponse
   * @param currentBlock - Current L2 block number
   * @param merkleRoot   - Committed Merkle root for the blob
   * @returns true if the response is valid and challenge is resolved
   */
  respond(
    response: ChallengeResponse,
    currentBlock: number,
    merkleRoot: string,
  ): boolean {
    const challenge = this.challenges.get(response.challengeId)
    if (!challenge || challenge.status !== "pending") return false

    if (currentBlock > challenge.deadlineBlock) {
      this.expire(response.challengeId)
      return false
    }

    if (response.shard.index !== challenge.shardIndex) return false

    // Verify shard integrity: recompute checksum from data
    const computedChecksum: string = createHash("sha256")
      .update(response.shard.data)
      .digest("hex")
    if (computedChecksum !== response.shard.checksum) return false

    // Verify Merkle proof
    const valid = verifyMerkleProof(
      response.shard.checksum,
      response.proof,
      response.shard.index,
      merkleRoot,
    )
    if (!valid) return false

    this.challenges.set(response.challengeId, {
      ...challenge,
      status: "resolved",
    })
    return true
  }

  /**
   * Scan all pending challenges and expire those past their deadline.
   * Expired challenges are eligible for on-chain slashing.
   *
   * @param currentBlock - Current L2 block number
   * @returns Array of expired challengeIds
   */
  processExpiry(currentBlock: number): string[] {
    const expired: string[] = []
    for (const [id, ch] of this.challenges) {
      if (ch.status === "pending" && currentBlock > ch.deadlineBlock) {
        this.challenges.set(id, { ...ch, status: "expired" })
        expired.push(id)
      }
    }
    return expired
  }

  /**
   * Mark a challenge as slashed (after on-chain slashing tx is confirmed).
   */
  markSlashed(challengeId: string): boolean {
    const ch = this.challenges.get(challengeId)
    if (!ch || ch.status !== "expired") return false
    this.challenges.set(challengeId, { ...ch, status: "slashed" })
    return true
  }

  /** Retrieve a challenge by ID */
  get(challengeId: string): RetrievalChallenge | undefined {
    return this.challenges.get(challengeId)
  }

  /** All challenges by status */
  list(status?: ChallengeStatus): RetrievalChallenge[] {
    const all = [...this.challenges.values()]
    return status ? all.filter((c) => c.status === status) : all
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  private expire(challengeId: string): void {
    const ch = this.challenges.get(challengeId)
    if (ch && ch.status === "pending") {
      this.challenges.set(challengeId, { ...ch, status: "expired" })
    }
  }
}
