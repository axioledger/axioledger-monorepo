/**
 * reputation-engine — StakeTracker
 */
import { ReputationEngineError, type ValidatorRecord } from "./types.js"

export class StakeTracker {
  private readonly records: Map<string, ValidatorRecord> = new Map()

  register(record: ValidatorRecord): void {
    this.records.set(record.validatorId, { ...record })
  }

  get(id: string): ValidatorRecord {
    const r = this.records.get(id)
    if (!r) throw new ReputationEngineError(`Validator "${id}" không tồn tại`, "VALIDATOR_NOT_FOUND", id)
    return r
  }

  updateStake(id: string, delta: bigint): void {
    const r = this.get(id)
    r.stake = r.stake + delta
    if (r.stake < 0n) r.stake = 0n
    this.records.set(id, r)
  }

  getTopValidators(n: number): ValidatorRecord[] {
    return Array.from(this.records.values())
      .filter((r) => r.status === "active")
      .sort((a, b) => (a.stake > b.stake ? -1 : a.stake < b.stake ? 1 : 0))
      .slice(0, n)
  }

  totalStake(): bigint {
    return Array.from(this.records.values()).reduce((acc, r) => acc + r.stake, 0n)
  }

  list(): ValidatorRecord[] {
    return Array.from(this.records.values())
  }
}
