/**
 * @file packet-router.ts
 * PacketRouter — dispatches incoming packets to registered handlers by type.
 */
import type { Packet, RouteHandler } from "./types.js"

export class PacketRouter {
  private readonly routes = new Map<Packet["type"], RouteHandler>()
  private _packetsRouted = 0

  /**
   * Register a handler for a packet type.
   * Only one handler per type — registering again overwrites the previous.
   */
  on(type: Packet["type"], handler: RouteHandler): void {
    this.routes.set(type, handler)
  }

  /** Unregister the handler for a packet type. */
  off(type: Packet["type"]): void {
    this.routes.delete(type)
  }

  /**
   * Route an incoming packet to its registered handler.
   * If no handler is registered for the type, the packet is silently dropped.
   */
  async route(packet: Packet): Promise<void> {
    const handler = this.routes.get(packet.type)
    if (handler) {
      await handler(packet)
      this._packetsRouted++
    }
  }

  /** Number of packets successfully routed since instantiation. */
  packetsRouted(): number { return this._packetsRouted }

  /** List of registered packet types. */
  registeredTypes(): Packet["type"][] {
    return [...this.routes.keys()]
  }
}
