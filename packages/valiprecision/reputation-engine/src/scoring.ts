/**
 * reputation-engine — Scoring
 * score = uptimeWeight(40) + slashPenalty(40) + ageBonus(20), clamp 0-100
 */
import type { ValidatorRecord, SlashEvent, ReputationScore } from "./types.js"

export function calculateReputationScore(
  record:       ValidatorRecord,
  slashHistory: SlashEvent[]
): ReputationScore {
  const uptimeWeight = record.uptimePercent * 0.4                            // max 40
  const slashPenalty = Math.min(slashHistory.length * 15, 40)               // max 40
  const daysSince    = (Date.now() - record.joinedAt) / (1000 * 60 * 60 * 24)
  const ageBonus     = Math.min(daysSince / 365 * 20, 20)                   // max 20

  const raw = uptimeWeight + (40 - slashPenalty) + ageBonus
  const score = Math.max(0, Math.min(100, raw))

  return {
    validatorId:    record.validatorId,
    score:          Math.round(score * 10) / 10,
    uptimeWeight:   Math.round(uptimeWeight * 10) / 10,
    slashPenalty,
    ageBonus:       Math.round(ageBonus * 10) / 10,
    lastCalculated: Date.now(),
  }
}
