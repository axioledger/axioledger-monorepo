import { describe, it, expect, vi } from "vitest"
import { SocketManager } from "../socket-manager.js"
import { PeerTable }     from "../peer-table.js"
import { PacketRouter }  from "../packet-router.js"
import type { SocketConfig, PeerEntry, Packet } from "../types.js"

const SOCKET_CFG: SocketConfig = {
  iface: "eth0", port: 9000, mode: "af-xdp",
  rxRingSize: 2048, txRingSize: 2048,
}

function makePeer(id: string): PeerEntry {
  return {
    peerId: id, address: "127.0.0.1:9001", state: "connected",
    latencyMs: 5, connectedAt: Date.now(),
    bytesReceived: 0n, bytesSent: 0n,
  }
}

function makePacket(type: Packet["type"] = "tx"): Packet {
  return {
    srcPeer: "peer-A", dstPeer: "peer-B", type,
    payload: "dGVzdA==", sizeBytes: 4, receivedAtNs: BigInt(Date.now()) * 1_000_000n,
  }
}

describe("SocketManager", () => {
  it("binds, starts and stops", () => {
    const mgr = new SocketManager()
    mgr.bind("sock-0", SOCKET_CFG)
    expect(mgr.listSockets()).toContain("sock-0")
    mgr.start()
    expect(mgr.isRunning()).toBe(true)
    mgr.stop()
    expect(mgr.isRunning()).toBe(false)
  })

  it("throws on duplicate bind", () => {
    const mgr = new SocketManager()
    mgr.bind("sock-dup", SOCKET_CFG)
    expect(() => mgr.bind("sock-dup", SOCKET_CFG)).toThrow("already bound")
  })
})

describe("PeerTable", () => {
  it("upserts and queries peers", () => {
    const table = new PeerTable()
    table.upsert(makePeer("peer-1"))
    table.upsert(makePeer("peer-2"))
    expect(table.count()).toBe(2)
    expect(table.connected()).toHaveLength(2)
  })

  it("setState updates peer state", () => {
    const table = new PeerTable()
    table.upsert(makePeer("p1"))
    table.setState("p1", "disconnected")
    expect(table.get("p1")?.state).toBe("disconnected")
    expect(table.connected()).toHaveLength(0)
  })
})

describe("PacketRouter", () => {
  it("routes packet to registered handler", async () => {
    const router  = new PacketRouter()
    const handler = vi.fn()
    router.on("tx", handler)
    await router.route(makePacket("tx"))
    expect(handler).toHaveBeenCalledOnce()
    expect(router.packetsRouted()).toBe(1)
  })

  it("silently drops unhandled packet types", async () => {
    const router = new PacketRouter()
    await expect(router.route(makePacket("gossip"))).resolves.toBeUndefined()
    expect(router.packetsRouted()).toBe(0)
  })
})
