/**
 * reputation-engine — Public API
 */
import { StakeTracker }    from "./stake-tracker.js"
import { SlashingEngine }  from "./slashing.js"
import { calculateReputationScore } from "./scoring.js"
import { ReputationEngineError, type ValidatorRecord, type SlashEvent, type ReputationScore } from "./types.js"

export * from "./types.js"
export { StakeTracker }   from "./stake-tracker.js"
export { SlashingEngine, MINIMUM_STAKE } from "./slashing.js"
export { calculateReputationScore }      from "./scoring.js"

export class ReputationEngine {
  private readonly tracker: StakeTracker
  private readonly slasher: SlashingEngine

  constructor() {
    this.tracker = new StakeTracker()
    this.slasher = new SlashingEngine(this.tracker)
  }

  registerValidator(record: ValidatorRecord): void {
    this.tracker.register(record)
  }

  slash(event: SlashEvent): void {
    this.slasher.slash(event)
  }

  getScore(validatorId: string): ReputationScore {
    const record  = this.tracker.get(validatorId)
    const history = this.slasher.getSlashHistory(validatorId)
    return calculateReputationScore(record, history)
  }

  getAllScores(): ReputationScore[] {
    return this.tracker.list().map((r) =>
      calculateReputationScore(r, this.slasher.getSlashHistory(r.validatorId))
    )
  }

  getTopValidators(n: number): ValidatorRecord[] {
    return this.tracker.getTopValidators(n)
  }

  unjailValidator(id: string): void {
    this.slasher.unjail(id)
  }
}
