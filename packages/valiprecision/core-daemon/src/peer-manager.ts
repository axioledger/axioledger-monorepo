/**
 * core-daemon — PeerManager
 * Quản lý danh sách peer, health check và kết nối lại.
 */

export type PeerStatus = "connected" | "disconnected" | "banned"

export interface Peer {
  id:          string
  address:     string
  port:        number
  connectedAt: number
  lastSeen:    number
  status:      PeerStatus
  banReason?:  string
}

export class PeerManager {
  private readonly peers: Map<string, Peer> = new Map()

  addPeer(peer: Peer): void {
    this.peers.set(peer.id, peer)
  }

  removePeer(id: string): boolean {
    return this.peers.delete(id)
  }

  getPeer(id: string): Peer | undefined {
    return this.peers.get(id)
  }

  listPeers(status?: PeerStatus): Peer[] {
    const all = Array.from(this.peers.values())
    return status ? all.filter((p) => p.status === status) : all
  }

  markSeen(id: string): void {
    const peer = this.peers.get(id)
    if (peer) { peer.lastSeen = Date.now(); this.peers.set(id, peer) }
  }

  banPeer(id: string, reason: string): void {
    const peer = this.peers.get(id)
    if (!peer) throw new Error(`PeerManager: peer "${id}" không tồn tại`)
    peer.status    = "banned"
    peer.banReason = reason
    this.peers.set(id, peer)
  }

  connectedCount(): number {
    return this.listPeers("connected").length
  }

  /** Trả về peers có lastSeen > 60 giây là stale */
  healthCheck(): { stalePeers: Peer[]; activePeers: Peer[] } {
    const threshold = Date.now() - 60_000
    const connected = this.listPeers("connected")
    return {
      stalePeers:  connected.filter((p) => p.lastSeen < threshold),
      activePeers: connected.filter((p) => p.lastSeen >= threshold),
    }
  }
}
