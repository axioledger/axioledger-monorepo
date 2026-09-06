/**
 * core-daemon — Public API
 */
import { mergeDaemonConfig, type DaemonConfig } from "./config.js"
import { PeerManager, type Peer } from "./peer-manager.js"
import { P2PNode } from "./node.js"

export { mergeDaemonConfig, DEFAULT_DAEMON_CONFIG } from "./config.js"
export type { DaemonConfig, LogLevel }              from "./config.js"
export { PeerManager }                              from "./peer-manager.js"
export type { Peer, PeerStatus }                    from "./peer-manager.js"
export { P2PNode }                                  from "./node.js"

/** Facade kết hợp P2PNode + PeerManager */
export class ValiprecisionDaemon {
  private readonly node: P2PNode
  private readonly peerMgr: PeerManager

  constructor(config: Partial<DaemonConfig>) {
    const merged  = mergeDaemonConfig(config)
    this.peerMgr  = new PeerManager()
    this.node     = new P2PNode(merged, this.peerMgr)
  }

  start():  Promise<void> { return this.node.start() }
  stop():   Promise<void> { return this.node.stop() }

  getStatus() {
    return {
      running: this.node.isRunning(),
      ...this.node.getStats(),
    }
  }

  connectPeer(address: string): Promise<Peer> { return this.node.connect(address) }
  listPeers():  Peer[] { return this.peerMgr.listPeers() }
}
