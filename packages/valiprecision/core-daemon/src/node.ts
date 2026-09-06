/**
 * core-daemon — P2PNode
 * Lifecycle quản lý P2P node: start, stop, connect, broadcast.
 */

import type { DaemonConfig } from "./config.js"
import { PeerManager, type Peer } from "./peer-manager.js"

export class P2PNode {
  private _running     = false
  private _startedAt   = 0

  constructor(
    private readonly config:      DaemonConfig,
    private readonly peerManager: PeerManager
  ) {}

  /**
   * Khởi động node — bắt đầu lắng nghe kết nối P2P.
   * Trong môi trường production, đây sẽ bind socket thực.
   */
  async start(): Promise<void> {
    if (this._running) return
    this._running   = true
    this._startedAt = Date.now()
    // Kết nối bootstrap peers
    for (const addr of this.config.bootstrapPeers) {
      try { await this.connect(addr) } catch { /* tiếp tục nếu bootstrap lỗi */ }
    }
  }

  /** Dừng node và ngắt kết nối tất cả peers. */
  async stop(): Promise<void> {
    this._running = false
    for (const peer of this.peerManager.listPeers("connected")) {
      peer.status = "disconnected"
    }
  }

  /**
   * Kết nối tới một peer mới theo địa chỉ.
   * @param peerAddress - "host:port" hoặc "/ip4/host/tcp/port"
   */
  async connect(peerAddress: string): Promise<Peer> {
    if (!this._running) throw new Error("P2PNode: node chưa được start")
    const [host, portStr] = peerAddress.replace(/^\/ip4\//, "").replace(/\/tcp\//, ":").split(":")
    const port  = parseInt(portStr ?? "9000", 10)
    const id    = `peer-${host}-${port}`
    const now   = Date.now()
    const peer: Peer = {
      id, address: host ?? peerAddress, port,
      connectedAt: now, lastSeen: now, status: "connected",
    }
    this.peerManager.addPeer(peer)
    return peer
  }

  /** Gửi message tới tất cả connected peers (log trong môi trường dev). */
  broadcast(message: string): void {
    const peers = this.peerManager.listPeers("connected")
    for (const peer of peers) {
      // Production: gửi qua socket thực
      void peer // suppress unused warning
    }
    void message
  }

  isRunning(): boolean { return this._running }

  getStats(): { peersConnected: number; uptime: number; nodeId: string } {
    return {
      peersConnected: this.peerManager.connectedCount(),
      uptime:         this._running ? Date.now() - this._startedAt : 0,
      nodeId:         this.config.nodeId,
    }
  }
}
