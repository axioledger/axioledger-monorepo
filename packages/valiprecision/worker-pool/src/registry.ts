/**
 * @file registry.ts
 * WorkerRegistry — manages the set of available compute workers.
 */
import type { WorkerConfig, WorkerStatus, TaskType } from "./types.js"

export interface WorkerEntry {
  config: WorkerConfig
  status: WorkerStatus
  activeTasks: number
  registeredAt: number
}

export class WorkerRegistry {
  private readonly workers = new Map<string, WorkerEntry>()

  /** Register a new compute worker. */
  register(config: WorkerConfig): void {
    if (this.workers.has(config.id)) {
      throw new Error(`Worker "${config.id}" is already registered`)
    }
    this.workers.set(config.id, {
      config,
      status: "idle",
      activeTasks: 0,
      registeredAt: Date.now(),
    })
  }

  /** Deregister a worker. Returns true if it existed. */
  deregister(workerId: string): boolean {
    return this.workers.delete(workerId)
  }

  /** Update the status of a worker. */
  setStatus(workerId: string, status: WorkerStatus): void {
    const entry = this._require(workerId)
    this.workers.set(workerId, { ...entry, status })
  }

  /**
   * Find an idle worker that supports the given task type.
   * Returns undefined if none is available.
   */
  findAvailable(taskType: TaskType): WorkerEntry | undefined {
    for (const entry of this.workers.values()) {
      if (
        entry.status === "idle" &&
        entry.activeTasks < entry.config.maxConcurrency &&
        entry.config.capabilities.includes(taskType)
      ) {
        return entry
      }
    }
    return undefined
  }

  /** List all registered workers. */
  list(): WorkerEntry[] {
    return [...this.workers.values()]
  }

  /** Total number of registered workers. */
  count(): number {
    return this.workers.size
  }

  private _require(id: string): WorkerEntry {
    const entry = this.workers.get(id)
    if (!entry) throw new Error(`Worker "${id}" not found`)
    return entry
  }
}
