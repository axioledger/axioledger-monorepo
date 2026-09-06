/**
 * @file registry.ts
 * Circuit Registry — manages compiled ZK circuit descriptors.
 */
import type { Circuit, CircuitId } from "./types.js"

export class CircuitRegistry {
  private readonly circuits = new Map<CircuitId, Circuit>()

  /**
   * Register a compiled circuit.
   * @throws {Error} if a circuit with the same ID is already registered.
   */
  register(circuit: Circuit): void {
    if (this.circuits.has(circuit.id)) {
      throw new Error(`Circuit "${circuit.id}" is already registered`)
    }
    this.circuits.set(circuit.id, circuit)
  }

  /** Retrieve a circuit by ID, or undefined if not found. */
  get(id: CircuitId): Circuit | undefined {
    return this.circuits.get(id)
  }

  /** List all registered circuit IDs. */
  list(): CircuitId[] {
    return [...this.circuits.keys()]
  }

  /** Deregister a circuit by ID. */
  unregister(id: CircuitId): boolean {
    return this.circuits.delete(id)
  }
}
