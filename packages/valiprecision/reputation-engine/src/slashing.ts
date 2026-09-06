/**
 * reputation-engine — SlashingEngine
 */
import { ReputationEngineError, type SlashEvent } from "./types.js"
import type { StakeTracker } from "./stake-tracker.js"

export const MINIMUM_STAKE = BigInt("1000000000")  // 1 billion lamports
const JAIL_THRESHOLD = 3

export class SlashingEngine {
  private readonly history: Map<string, SlashEvent[]> = new Map()

  constructor(private readonly tracker: StakeTracker) {}

  slash(event: SlashEvent): void {
    if (event.amount <= 0n) {
      throw new ReputationEngineError("Số lượng slash phải > 0", "INVALID_SLASH_AMOUNT", event.validatorId)
    }
    const record = this.tracker.get(event.validatorId)
    if (record.status === "tombstoned") return

    this.tracker.updateStake(event.validatorId, -event.amount)
    record.slashCount++

    if (record.slashCount >= JAIL_THRESHOLD) {
      record.status = "jailed"
    }

    // Lưu lịch sử
    const hist = this.history.get(event.validatorId) ?? []
    hist.push(event)
    this.history.set(event.validatorId, hist)
  }

  unjail(validatorId: string): void {
    const record = this.tracker.get(validatorId)
    if (record.status !== "jailed") {
      throw new ReputationEngineError(`Validator "${validatorId}" chưa bị jail`, "ALREADY_JAILED", validatorId)
    }
    if (record.stake < MINIMUM_STAKE) {
      throw new ReputationEngineError("Stake không đủ để unjail", "INSUFFICIENT_STAKE", validatorId)
    }
    record.status = "active"
  }

  getSlashHistory(validatorId: string): SlashEvent[] {
    return this.history.get(validatorId) ?? []
  }
}
