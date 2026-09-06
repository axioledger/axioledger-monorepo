/**
 * @file peer-table.ts
 * PeerTable — tracks known peers and their connection state.
 */
import type { PeerEntry, PeerState } from "./types.js"

export class PeerTable {
  private readonly peers = new Map<string, PeerEntry>()

  /** Add or update a peer entry. */
  upsert(entry: PeerEntry): void {
    this.peers.set(entry.peerId, entry)
  }

  /** Remove a peer. Returns true if it existed. */
  remove(peerId: string): boolean {
    return this.peers.delete(peerId)
  }

  /** Get a peer by ID. */
  get(peerId: string): PeerEntry | undefined {
    return this.peers.get(peerId)
  }

  /** Update only the state of an existing peer. */
  setState(peerId: string, state: PeerState): void {
    const peer = this.peers.get(peerId)
    if (!peer) throw new Error(`Peer "${peerId}" not found in PeerTable`)
    this.peers.set(peerId, { ...peer, state })
  }

  /** List all connected peers. */
  connected(): PeerEntry[] {
    return [...this.peers.values()].filter((p) => p.state === "connected")
  }

  count(): number { return this.peers.size }
}
