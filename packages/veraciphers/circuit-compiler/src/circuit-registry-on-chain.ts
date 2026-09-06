/**
 * @file circuit-registry-on-chain.ts
 * @veraciphers/circuit-compiler — On-Chain Circuit Registry
 *
 * Extends the in-memory CircuitRegistry with:
 *   CR-1  Versioning       — semver-tagged circuit versions, immutable history
 *   CR-2  Audit trail      — per-circuit audit status + auditor signature
 *   CR-3  $VRQ reward pool — each circuit can attach a reward pool for provers
 *   CR-4  Prover assignment — circuit_id → assigned prover(s) from proving-marketplace
 *   CR-5  On-chain anchor  — Merkle commitment of all registered circuits (for ZK-Metrics)
 *
 * This module does NOT replace CircuitRegistry — it wraps it with governance-layer metadata.
 */
import { createHash, randomUUID } from "node:crypto"
import type { Circuit, CircuitId, CircuitBackend } from "./types.js"
import { CircuitRegistry } from "./registry.js"

// ---------------------------------------------------------------------------
// CR-1 Versioning
// ---------------------------------------------------------------------------

/** Semantic version string: "MAJOR.MINOR.PATCH" */
export type SemVer = string

export interface CircuitVersion {
  circuitId: CircuitId
  version: SemVer
  /** Immutable snapshot of the circuit at this version */
  snapshot: Circuit
  publishedAt: number
  publishedBy: string
  /** SHA-256 of snapshot.compiledBytes for integrity */
  commitHash: string
}

// ---------------------------------------------------------------------------
// CR-2 Audit Trail
// ---------------------------------------------------------------------------

export type AuditStatus = "unaudited" | "pending" | "approved" | "rejected"

export interface AuditRecord {
  circuitId: CircuitId
  version: SemVer
  status: AuditStatus
  /** Name/address of auditing firm or community reviewer */
  auditor: string
  /** Base64-encoded auditor signature over (circuitId + version + commitHash) */
  auditorSignature: string
  /** UNIX ms */
  auditedAt: number
  /** Human-readable notes */
  notes: string
}

// ---------------------------------------------------------------------------
// CR-3 $VRQ Reward Pool
// ---------------------------------------------------------------------------

/** μVRQ = 1 VRQ / 1_000_000 */
export type MicroVRQ = bigint

export interface CircuitRewardPool {
  circuitId: CircuitId
  /** Total $VRQ deposited for provers who generate proofs for this circuit */
  totalDeposited: MicroVRQ
  /** $VRQ paid out per successful proof */
  rewardPerProof: MicroVRQ
  /** Total proofs generated (for payout accounting) */
  proofsGenerated: number
  /** Total $VRQ already distributed */
  totalDistributed: MicroVRQ
  lastUpdated: number
}

// ---------------------------------------------------------------------------
// CR-4 Prover Assignment
// ---------------------------------------------------------------------------

export interface CircuitProverAssignment {
  circuitId: CircuitId
  /** ProviderId from @sequentichain/proving-marketplace */
  providerIds: string[]
  /** Preferred proving-marketplace jobId template for this circuit */
  preferredTier: "gpu-consumer" | "gpu-datacenter" | "fpga"
  assignedAt: number
}

// ---------------------------------------------------------------------------
// CR-5 Merkle Commitment
// ---------------------------------------------------------------------------

export interface RegistryCommitment {
  /** Merkle root of all (circuitId + version + commitHash) tuples */
  merkleRoot: string
  circuitCount: number
  computedAt: number
}

// ---------------------------------------------------------------------------
// OnChainCircuitRegistry
// ---------------------------------------------------------------------------

export class OnChainCircuitRegistry {
  private readonly inner: CircuitRegistry
  private readonly versions = new Map<CircuitId, CircuitVersion[]>()
  private readonly audits   = new Map<CircuitId, AuditRecord[]>()
  private readonly pools    = new Map<CircuitId, CircuitRewardPool>()
  private readonly assignments = new Map<CircuitId, CircuitProverAssignment>()

  constructor(inner?: CircuitRegistry) {
    this.inner = inner ?? new CircuitRegistry()
  }

  // -------------------------------------------------------------------------
  // CR-1: Circuit Registration with Versioning
  // -------------------------------------------------------------------------

  /**
   * Register a new circuit with an initial version tag.
   * Computes a SHA-256 commitHash over compiledBytes for integrity.
   *
   * @throws {Error} if circuitId already exists (use upgrade() to update)
   */
  register(circuit: Circuit, version: SemVer = "1.0.0", publishedBy: string = "unknown"): CircuitVersion {
    this.inner.register(circuit)  // throws if duplicate

    const commitHash = createHash("sha256")
      .update(circuit.compiledBytes)
      .digest("hex")

    const cv: CircuitVersion = {
      circuitId: circuit.id,
      version,
      snapshot: { ...circuit },
      publishedAt: Date.now(),
      publishedBy,
      commitHash,
    }
    this.versions.set(circuit.id, [cv])

    // Initialize empty reward pool
    this.pools.set(circuit.id, {
      circuitId: circuit.id,
      totalDeposited: 0n,
      rewardPerProof: 0n,
      proofsGenerated: 0,
      totalDistributed: 0n,
      lastUpdated: Date.now(),
    })

    return cv
  }

  /**
   * Publish an upgraded version of an existing circuit (immutable history kept).
   *
   * @throws {Error} if circuitId not found
   */
  upgrade(
    updatedCircuit: Circuit,
    newVersion: SemVer,
    publishedBy: string,
  ): CircuitVersion {
    const existing = this.inner.get(updatedCircuit.id)
    if (!existing) throw new Error(`Circuit "${updatedCircuit.id}" not registered; use register() first`)

    // Replace active circuit in inner registry (unregister + re-register)
    this.inner.unregister(updatedCircuit.id)
    this.inner.register(updatedCircuit)

    const commitHash = createHash("sha256")
      .update(updatedCircuit.compiledBytes)
      .digest("hex")

    const cv: CircuitVersion = {
      circuitId: updatedCircuit.id,
      version: newVersion,
      snapshot: { ...updatedCircuit },
      publishedAt: Date.now(),
      publishedBy,
      commitHash,
    }
    const history = this.versions.get(updatedCircuit.id) ?? []
    history.push(cv)
    this.versions.set(updatedCircuit.id, history)
    return cv
  }

  /** Get the current (latest) version record for a circuit. */
  getCurrentVersion(circuitId: CircuitId): CircuitVersion | undefined {
    const history = this.versions.get(circuitId)
    return history?.at(-1)
  }

  /** Full version history for a circuit. */
  getVersionHistory(circuitId: CircuitId): CircuitVersion[] {
    return this.versions.get(circuitId) ?? []
  }

  /** Get circuit by version string. Returns undefined if version not found. */
  getByVersion(circuitId: CircuitId, version: SemVer): CircuitVersion | undefined {
    return (this.versions.get(circuitId) ?? []).find((v) => v.version === version)
  }

  // -------------------------------------------------------------------------
  // CR-2: Audit Trail
  // -------------------------------------------------------------------------

  /**
   * Submit an audit record for a circuit version.
   * Multiple auditors can audit the same circuit/version.
   */
  submitAudit(record: Omit<AuditRecord, "auditedAt"> & { auditedAt?: number }): AuditRecord {
    if (!this.inner.get(record.circuitId)) {
      throw new Error(`Circuit "${record.circuitId}" not registered`)
    }
    const full: AuditRecord = { ...record, auditedAt: record.auditedAt ?? Date.now() }
    const existing = this.audits.get(record.circuitId) ?? []
    existing.push(full)
    this.audits.set(record.circuitId, existing)
    return full
  }

  /** Get latest audit status for a circuit. */
  getLatestAudit(circuitId: CircuitId): AuditRecord | undefined {
    const recs = this.audits.get(circuitId)
    return recs?.at(-1)
  }

  getAuditHistory(circuitId: CircuitId): AuditRecord[] {
    return this.audits.get(circuitId) ?? []
  }

  /**
   * Returns true if the circuit has at least one "approved" audit record
   * for its current version.
   */
  isApproved(circuitId: CircuitId): boolean {
    const current = this.getCurrentVersion(circuitId)
    if (!current) return false
    return (this.audits.get(circuitId) ?? []).some(
      (a) => a.version === current.version && a.status === "approved"
    )
  }

  // -------------------------------------------------------------------------
  // CR-3: $VRQ Reward Pool
  // -------------------------------------------------------------------------

  /**
   * Deposit $VRQ into a circuit's reward pool.
   * Deposited by dApps, DAO treasury, or the circuit author.
   */
  depositReward(circuitId: CircuitId, amount: MicroVRQ, rewardPerProof?: MicroVRQ): void {
    const pool = this._getPool(circuitId)
    pool.totalDeposited += amount
    if (rewardPerProof !== undefined) pool.rewardPerProof = rewardPerProof
    pool.lastUpdated = Date.now()
  }

  /**
   * Claim $VRQ reward for a completed proof.
   * Called when a prover delivers a valid proof for this circuit.
   *
   * @returns amount actually distributed (may be 0 if pool exhausted)
   */
  claimProofReward(circuitId: CircuitId, proverId: string): MicroVRQ {
    const pool = this._getPool(circuitId)
    const remaining = pool.totalDeposited - pool.totalDistributed
    if (remaining < pool.rewardPerProof) return 0n

    pool.proofsGenerated++
    pool.totalDistributed += pool.rewardPerProof
    pool.lastUpdated = Date.now()
    return pool.rewardPerProof
  }

  getRewardPool(circuitId: CircuitId): CircuitRewardPool | undefined {
    return this.pools.get(circuitId)
  }

  // -------------------------------------------------------------------------
  // CR-4: Prover Assignment
  // -------------------------------------------------------------------------

  /** Assign preferred proving providers to a circuit. */
  assignProvers(
    circuitId: CircuitId,
    providerIds: string[],
    preferredTier: CircuitProverAssignment["preferredTier"] = "gpu-datacenter",
  ): CircuitProverAssignment {
    if (!this.inner.get(circuitId)) throw new Error(`Circuit "${circuitId}" not registered`)
    const assignment: CircuitProverAssignment = {
      circuitId,
      providerIds,
      preferredTier,
      assignedAt: Date.now(),
    }
    this.assignments.set(circuitId, assignment)
    return assignment
  }

  getProverAssignment(circuitId: CircuitId): CircuitProverAssignment | undefined {
    return this.assignments.get(circuitId)
  }

  // -------------------------------------------------------------------------
  // CR-5: Merkle Commitment (for ZK-Metrics Oracle)
  // -------------------------------------------------------------------------

  /**
   * Compute a Merkle commitment over all registered circuits.
   * Each leaf = SHA-256(circuitId + ":" + version + ":" + commitHash).
   *
   * Used by TreasuryEscrowContract to verify circuit set integrity on-chain.
   */
  computeCommitment(): RegistryCommitment {
    const leaves: string[] = []
    for (const [circuitId, history] of this.versions) {
      const latest = history.at(-1)
      if (!latest) continue
      const leaf = createHash("sha256")
        .update(`${circuitId}:${latest.version}:${latest.commitHash}`)
        .digest("hex")
      leaves.push(leaf)
    }
    leaves.sort()  // canonical ordering

    const merkleRoot = this._buildMerkleRoot(leaves)
    return {
      merkleRoot,
      circuitCount: leaves.length,
      computedAt: Date.now(),
    }
  }

  // -------------------------------------------------------------------------
  // Delegation to inner CircuitRegistry
  // -------------------------------------------------------------------------

  get(circuitId: CircuitId): Circuit | undefined { return this.inner.get(circuitId) }
  list(): CircuitId[] { return this.inner.list() }
  get size(): number { return this.inner.list().length }

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  private _getPool(circuitId: CircuitId): CircuitRewardPool {
    const pool = this.pools.get(circuitId)
    if (!pool) throw new Error(`No reward pool for circuit "${circuitId}"; register first`)
    return pool
  }

  private _buildMerkleRoot(leaves: string[]): string {
    if (leaves.length === 0) return createHash("sha256").update("empty").digest("hex")
    let current = [...leaves]
    while (current.length > 1) {
      const next: string[] = []
      for (let i = 0; i < current.length; i += 2) {
        const l = current[i] ?? ""
        const r = current[i + 1] ?? l  // duplicate last leaf if odd count
        next.push(createHash("sha256").update(l + r).digest("hex"))
      }
      current = next
    }
    return current[0] ?? ""
  }
}
