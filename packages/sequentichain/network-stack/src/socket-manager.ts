/**
 * @file socket-manager.ts
 * SocketManager — manages AF_XDP / UDP socket bindings.
 *
 * Phase 1: no-op stub that records config.
 * Phase 2: delegates to Rust N-API addon (`axio_network_native`).
 */
import type { SocketConfig } from "./types.js"

export class SocketManager {
  private readonly sockets = new Map<string, SocketConfig>()
  private _running = false

  /**
   * Bind a new socket to the given interface and port.
   * @throws if the socket ID is already registered.
   */
  bind(id: string, config: SocketConfig): void {
    if (this.sockets.has(id)) {
      throw new Error(`Socket "${id}" already bound`)
    }
    this.sockets.set(id, config)
  }

  /** Unbind a socket. Returns true if it existed. */
  unbind(id: string): boolean {
    return this.sockets.delete(id)
  }

  /**
   * Start the packet I/O loop.
   * Phase 2: calls into the Rust AF_XDP poll loop.
   */
  start(): void {
    this._running = true
  }

  /** Stop the packet I/O loop. */
  stop(): void {
    this._running = false
  }

  isRunning(): boolean { return this._running }

  listSockets(): string[] { return [...this.sockets.keys()] }

  getConfig(id: string): SocketConfig | undefined {
    return this.sockets.get(id)
  }
}
