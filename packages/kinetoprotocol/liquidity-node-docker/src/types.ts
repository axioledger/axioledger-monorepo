/**
 * @file types.ts
 */

export interface LiquidityConfig {
  nodeId:               string
  poolIds:              string[]
  rebalanceIntervalMs:  number
  logLevel:             "debug" | "info" | "warn" | "error"
  port:                 number
}

export interface PositionSummary {
  positionId:    string
  poolId:        string
  owner:         string
  inRange:       boolean
  liquidity:     bigint
  feesOwedA:     bigint
  feesOwedB:     bigint
}

export interface NodeHealth {
  healthy:           boolean
  nodeId:            string
  managedPools:      number
  activePositions:   number
  rebalancesRun:     number
  uptime:            number  // seconds
}
