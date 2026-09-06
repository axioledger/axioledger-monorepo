/**
 * reputation-engine — Types
 */

export type ValidatorStatus = "active" | "jailed" | "tombstoned"

export interface ValidatorRecord {
  validatorId:    string
  stake:          bigint
  status:         ValidatorStatus
  joinedAt:       number        // Unix timestamp ms
  slashCount:     number
  uptimePercent:  number        // 0–100
}

export interface SlashEvent {
  id:          string
  validatorId: string
  reason:      "double_sign" | "downtime" | "invalid_block"
  amount:      bigint
  timestamp:   number
  evidence:    string
}

export interface ReputationScore {
  validatorId:    string
  score:          number        // 0–100
  uptimeWeight:   number
  slashPenalty:   number
  ageBonus:       number
  lastCalculated: number
}

export type ReputationEngineErrorCode =
  | "VALIDATOR_NOT_FOUND"
  | "INSUFFICIENT_STAKE"
  | "ALREADY_JAILED"
  | "INVALID_SLASH_AMOUNT"

export class ReputationEngineError extends Error {
  constructor(
    message: string,
    public readonly code: ReputationEngineErrorCode,
    public readonly validatorId?: string
  ) {
    super(message)
    this.name = "ReputationEngineError"
  }
}
