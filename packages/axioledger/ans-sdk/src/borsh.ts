/**
 * @axioledger/ans-sdk — Borsh Schema
 *
 * Định nghĩa cấu trúc dữ liệu on-chain cho ANS Registry:
 *   AnsNameRecord   — bản ghi một domain .axq
 *   AnsRegistryAccount — trạng thái toàn bộ registry cho một domain
 *
 * Borsh layout (little-endian, fixed-width fields):
 *
 *   AnsNameRecord:
 *     u8[32]  owner          — 32-byte Pubkey
 *     u8      format         — 0=svm | 1=evm | 2=zk-did | 3=ipfs
 *     u32     value_len      — độ dài chuỗi value (UTF-8)
 *     u8[N]   value          — địa chỉ / hash / CID
 *     u64     expires_at     — Unix timestamp (giây), 0 = không hết hạn
 *     u32     ttl            — seconds
 *
 *   AnsRegistryAccount:
 *     u8      is_initialized — 1 khi đã init
 *     u8[32]  authority      — admin pubkey
 *     u32     record_count
 *     AnsNameRecord[] records
 */

import type { RecordFormat } from "./index.js"

// ─── Constants ────────────────────────────────────────────────────────────────

export const FORMAT_MAP: Record<RecordFormat, number> = {
  svm:      0,
  evm:      1,
  "zk-did": 2,
  ipfs:     3,
}

export const FORMAT_MAP_REVERSE: Record<number, RecordFormat> = {
  0: "svm",
  1: "evm",
  2: "zk-did",
  3: "ipfs",
}

/** Fixed byte size of AnsNameRecord header (without variable-length `value`) */
export const ANS_RECORD_HEADER_SIZE =
  32 + // owner pubkey
  1  + // format
  4  + // value_len (u32)
  8  + // expires_at (u64)
  4    // ttl (u32)
// + value bytes (variable)

/** Fixed byte size of AnsRegistryAccount header */
export const ANS_REGISTRY_HEADER_SIZE =
  1  + // is_initialized
  32 + // authority pubkey
  4    // record_count (u32)

// ─── Raw Struct Types ─────────────────────────────────────────────────────────

export interface RawAnsNameRecord {
  owner: Uint8Array         // 32 bytes
  format: number            // u8 → RecordFormat
  value: string             // decoded UTF-8
  expiresAt: bigint         // u64 Unix timestamp
  ttl: number               // u32 seconds
}

export interface RawAnsRegistryAccount {
  isInitialized: boolean
  authority: Uint8Array     // 32 bytes
  records: RawAnsNameRecord[]
}

// ─── Writer (serializer) ──────────────────────────────────────────────────────

export class BorshWriter {
  private buf: Uint8Array
  private pos: number
  private view: DataView

  constructor(initialSize = 256) {
    this.buf = new Uint8Array(initialSize)
    this.view = new DataView(this.buf.buffer)
    this.pos = 0
  }

  private ensure(bytes: number): void {
    if (this.pos + bytes <= this.buf.length) return
    const next = new Uint8Array(Math.max(this.buf.length * 2, this.pos + bytes))
    next.set(this.buf)
    this.buf = next
    this.view = new DataView(this.buf.buffer)
  }

  writeU8(v: number): this {
    this.ensure(1)
    this.view.setUint8(this.pos++, v)
    return this
  }

  writeU32(v: number): this {
    this.ensure(4)
    this.view.setUint32(this.pos, v, true) // little-endian
    this.pos += 4
    return this
  }

  writeU64(v: bigint): this {
    this.ensure(8)
    this.view.setBigUint64(this.pos, v, true)
    this.pos += 8
    return this
  }

  writeBytes(b: Uint8Array): this {
    this.ensure(b.length)
    this.buf.set(b, this.pos)
    this.pos += b.length
    return this
  }

  writeString(s: string): this {
    const enc = new TextEncoder().encode(s)
    this.writeU32(enc.length)
    this.writeBytes(enc)
    return this
  }

  toBytes(): Uint8Array {
    return this.buf.slice(0, this.pos)
  }
}

// ─── Reader (deserializer) ────────────────────────────────────────────────────

export class BorshReader {
  private pos: number
  private view: DataView
  private readonly buf: Uint8Array

  constructor(buf: Uint8Array) {
    this.buf = buf
    this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
    this.pos = 0
  }

  remaining(): number {
    return this.buf.length - this.pos
  }

  readU8(): number {
    if (this.remaining() < 1) throw new RangeError("BorshReader: buffer underflow (u8)")
    return this.view.getUint8(this.pos++)
  }

  readU32(): number {
    if (this.remaining() < 4) throw new RangeError("BorshReader: buffer underflow (u32)")
    const v = this.view.getUint32(this.pos, true)
    this.pos += 4
    return v
  }

  readU64(): bigint {
    if (this.remaining() < 8) throw new RangeError("BorshReader: buffer underflow (u64)")
    const v = this.view.getBigUint64(this.pos, true)
    this.pos += 8
    return v
  }

  readBytes(len: number): Uint8Array {
    if (this.remaining() < len) throw new RangeError(`BorshReader: buffer underflow (bytes[${len}])`)
    const slice = this.buf.slice(this.pos, this.pos + len)
    this.pos += len
    return slice
  }

  readString(): string {
    const len = this.readU32()
    const bytes = this.readBytes(len)
    return new TextDecoder().decode(bytes)
  }
}

// ─── Encode / Decode AnsNameRecord ────────────────────────────────────────────

export function encodeAnsNameRecord(record: RawAnsNameRecord): Uint8Array {
  if (record.owner.length !== 32) {
    throw new Error("encodeAnsNameRecord: owner must be 32 bytes")
  }
  return new BorshWriter()
    .writeBytes(record.owner)
    .writeU8(record.format)
    .writeString(record.value)
    .writeU64(record.expiresAt)
    .writeU32(record.ttl)
    .toBytes()
}

export function decodeAnsNameRecord(buf: Uint8Array): RawAnsNameRecord {
  const r = new BorshReader(buf)
  return {
    owner:     r.readBytes(32),
    format:    r.readU8(),
    value:     r.readString(),
    expiresAt: r.readU64(),
    ttl:       r.readU32(),
  }
}

// ─── Encode / Decode AnsRegistryAccount ──────────────────────────────────────

export function encodeAnsRegistryAccount(account: RawAnsRegistryAccount): Uint8Array {
  if (account.authority.length !== 32) {
    throw new Error("encodeAnsRegistryAccount: authority must be 32 bytes")
  }
  const w = new BorshWriter()
  w.writeU8(account.isInitialized ? 1 : 0)
  w.writeBytes(account.authority)
  w.writeU32(account.records.length)
  for (const rec of account.records) {
    const encoded = encodeAnsNameRecord(rec)
    w.writeU32(encoded.length) // length-prefixed record
    w.writeBytes(encoded)
  }
  return w.toBytes()
}

export function decodeAnsRegistryAccount(buf: Uint8Array): RawAnsRegistryAccount {
  const r = new BorshReader(buf)
  const isInitialized = r.readU8() === 1
  const authority = r.readBytes(32)
  const recordCount = r.readU32()
  const records: RawAnsNameRecord[] = []
  for (let i = 0; i < recordCount; i++) {
    const recLen = r.readU32()
    const recBuf = r.readBytes(recLen)
    records.push(decodeAnsNameRecord(recBuf))
  }
  return { isInitialized, authority, records }
}
