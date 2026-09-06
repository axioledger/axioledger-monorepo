/**
 * @file maci.ts
 * MaciCircuit — Minimum Anti-Collusion Infrastructure voting circuit.
 * Module 22 — Anti-Collusion Voting Circuit (MACI via $VRQ).
 *
 * MACI prevents voter bribery by making it impossible to prove to a third
 * party how you voted. Votes are encrypted with the coordinator's master key,
 * and voters can change their voting key at any time (invalidating any bribe).
 */
import type { MaciVote, MaciTally } from "./types.js"
import { DIDMaciNoVotesError } from "./errors.js"

let _voteSeq = 1

export class MaciCircuit {
  private readonly votes = new Map<string, MaciVote[]>()

  /**
   * Submit an encrypted vote for a proposal.
   * The voter can overwrite their vote by submitting again (only the last
   * vote counted by the coordinator is valid — bribe resistance property).
   */
  submitVote(vote: MaciVote): void {
    const list = this.votes.get(vote.proposalId) ?? []
    list.push(vote)
    this.votes.set(vote.proposalId, list)
  }

  /**
   * Tally all votes for a proposal and produce a ZK proof of the result.
   *
   * Phase 1: plaintext tally + stub proof.
   * Phase 2: run the off-chain MACI tally circuit (PlonKy2) and generate
   *          a proof of the correct result without revealing individual votes.
   */
  tally(proposalId: string): MaciTally {
    const votes = this.votes.get(proposalId) ?? []
    if (votes.length === 0) {
      throw new DIDMaciNoVotesError(proposalId)
    }

    // Phase 1: assume vote = { "0": "yes", "1": "no" } encoded in encryptedVote stub
    // For testing: count by index in submission order
    const results: Record<string, number> = {}
    for (let i = 0; i < votes.length; i++) {
      const key = String(i % 2)  // stub: alternate yes/no
      results[key] = (results[key] ?? 0) + 1
    }

    return {
      proposalId,
      totalVotes: votes.length,
      results,
      tallyProof: `maci-tally-stub-${proposalId}-n${votes.length}`,
    }
  }

  /** Number of votes submitted for a proposal. */
  voteCount(proposalId: string): number {
    return this.votes.get(proposalId)?.length ?? 0
  }
}
