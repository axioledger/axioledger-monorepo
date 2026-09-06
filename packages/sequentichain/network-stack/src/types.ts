/**
 * @file types.ts
 * Core types for the Network Stack.
 */

/** AF_XDP socket mode */
export type SocketMode = "af-xdp" | "udp" | "tcp"

/** Connection state of a peer */
export type PeerState = "connecting" | "connected" | "disconnected" | "banned"

/** Configuration for a socket binding */
export interface SocketConfig {
  /** Network interface name (e.g. "eth0", "enp3s0") */
  iface:        string
  /** UDP/TCP port to bind */
  port:         number
  /** Socket mode — af-xdp for zero-copy, udp/tcp as fallback */
  mode:         SocketMode
  /** Receive buffer ring size (must be power of 2) */
  rxRingSize:   number
  /** Transmit buffer ring size (must be power of 2) */
  txRingSize:   number
}

/** A raw network packet (L2 frame or L3 payload) */
export interface Packet {
  /** Source peer identifier */
  srcPeer:   string
  /** Destination peer identifier */
  dstPeer:   string
  /** Packet type tag */
  type:      "tx" | "block" | "gossip" | "ping" | "pong"
  /** Raw payload bytes (base64 encoded) */
  payload:   string
  /** Packet size in bytes */
  sizeBytes: number
  /** Receive timestamp (Unix ns) */
  receivedAtNs: bigint
}

/** A peer entry in the routing table */
export interface PeerEntry {
  peerId:       string
  address:      string   // "ip:port"
  state:        PeerState
  latencyMs:    number
  connectedAt:  number   // Unix ms
  bytesReceived: bigint
  bytesSent:     bigint
}

/** A route handler function for incoming packets of a given type */
export type RouteHandler = (packet: Packet) => void | Promise<void>
