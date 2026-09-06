/**
 * @sequentichain/network-stack — Public API
 *
 * Zero-Copy Network Stack — Layer 1 (Network & Storage Layer)
 *
 * TypeScript interface layer over the Rust smoltcp-based network stack.
 *
 * Phase 1: pure TypeScript socket abstraction for development & testing.
 * Phase 2: Native addon (N-API) wrapping the Rust AF_XDP zero-copy socket.
 *           The Rust layer bypasses the kernel TCP/IP stack entirely,
 *           achieving ~600K TPS throughput on commodity NIC hardware.
 *
 * Exports:
 *   SocketManager    — manages AF_XDP / UDP socket pool
 *   PacketRouter     — routes L2 packets to the correct handler
 *   PeerTable        — tracks known peers and their connection state
 */

export { SocketManager }  from "./socket-manager.js"
export { PacketRouter }   from "./packet-router.js"
export { PeerTable }      from "./peer-table.js"

export type {
  SocketConfig,
  Packet,
  PeerEntry,
  PeerState,
  RouteHandler,
} from "./types.js"
