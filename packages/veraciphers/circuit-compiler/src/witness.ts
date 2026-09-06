/**
 * @file witness.ts
 * Witness Builder — generates ZK witness inputs for a circuit.
 */
import type { Circuit, Witness } from "./types.js"

export class WitnessBuilder {
  /**
   * Build a Witness from a circuit descriptor and raw private inputs.
   * Phase 1: passes inputs through as-is.
   * Phase 2: applies circuit-specific signal mapping and range checks.
   */
  build(
    circuit: Circuit,
    inputs: Record<string, string | number | bigint | boolean>,
  ): Witness {
    // Phase 2: validate input signal names against circuit.compiledBytes constraints
    return {
      circuitId: circuit.id,
      inputs,
    }
  }
}
