/**
 * core-daemon — Tests
 */
import { describe, it, expect } from "vitest"
import { mergeDaemonConfig }    from "../config.js"
import { PeerManager }          from "../peer-manager.js"
import { P2PNode }              from "../node.js"
import { ValiprecisionDaemon }  from "../index.js"

const BASE_CONFIG = { nodeId: "node-test-001", listenPort: 9000 }

describe("mergeDaemonConfig", () => {
  it("throw khi thiếu nodeId", () => {
    expect(() => mergeDaemonConfig({ listenPort: 9000 })).toThrow(/nodeId/)
  })
  it("throw khi thiếu listenPort", () => {
    expect(() => mergeDaemonConfig({ nodeId: "abc" })).toThrow(/listenPort/)
  })
  it("fill defaults đúng", () => {
    const cfg = mergeDaemonConfig(BASE_CONFIG)
    expect(cfg.maxPeers).toBe(50)
    expect(cfg.logLevel).toBe("info")
  })
})

describe("PeerManager", () => {
  const makePeer = (id: string) => ({
    id, address: "127.0.0.1", port: 9000 + Number(id.slice(-1)),
    connectedAt: Date.now(), lastSeen: Date.now(), status: "connected" as const,
  })

  it("addPeer và getPeer hoạt động", () => {
    const pm = new PeerManager()
    pm.addPeer(makePeer("p1"))
    expect(pm.getPeer("p1")).toBeDefined()
  })
  it("removePeer trả về true khi xoá thành công", () => {
    const pm = new PeerManager()
    pm.addPeer(makePeer("p2"))
    expect(pm.removePeer("p2")).toBe(true)
    expect(pm.getPeer("p2")).toBeUndefined()
  })
  it("connectedCount đúng", () => {
    const pm = new PeerManager()
    pm.addPeer(makePeer("p3"))
    pm.addPeer(makePeer("p4"))
    expect(pm.connectedCount()).toBe(2)
  })
  it("banPeer thay đổi status sang banned", () => {
    const pm = new PeerManager()
    pm.addPeer(makePeer("p5"))
    pm.banPeer("p5", "double_sign")
    expect(pm.getPeer("p5")?.status).toBe("banned")
  })
  it("markSeen cập nhật lastSeen", async () => {
    const pm = new PeerManager()
    const before = Date.now() - 100
    pm.addPeer({ ...makePeer("p6"), lastSeen: before })
    pm.markSeen("p6")
    expect(pm.getPeer("p6")!.lastSeen).toBeGreaterThan(before)
  })
})

describe("P2PNode", () => {
  it("start() set isRunning=true", async () => {
    const pm   = new PeerManager()
    const node = new P2PNode(mergeDaemonConfig(BASE_CONFIG), pm)
    await node.start()
    expect(node.isRunning()).toBe(true)
    await node.stop()
  })
  it("stop() set isRunning=false", async () => {
    const pm   = new PeerManager()
    const node = new P2PNode(mergeDaemonConfig(BASE_CONFIG), pm)
    await node.start()
    await node.stop()
    expect(node.isRunning()).toBe(false)
  })
  it("connect() thêm peer vào PeerManager", async () => {
    const pm   = new PeerManager()
    const node = new P2PNode(mergeDaemonConfig(BASE_CONFIG), pm)
    await node.start()
    await node.connect("127.0.0.1:9001")
    expect(pm.connectedCount()).toBe(1)
    await node.stop()
  })
})

describe("ValiprecisionDaemon", () => {
  it("getStatus() trả về object hợp lệ", async () => {
    const daemon = new ValiprecisionDaemon(BASE_CONFIG)
    await daemon.start()
    const status = daemon.getStatus()
    expect(status.running).toBe(true)
    expect(status.nodeId).toBe("node-test-001")
    await daemon.stop()
  })
})
