/**
 * @axioledger/ans-sdk — Borsh Schema Definitions
 *
 * Định nghĩa các layout Borsh cho dữ liệu on-chain của ANS Registry.
 * Sử dụng thư viện `borsh` v2 với API borsh.struct() (không dùng decorator).
 *
 * Cấu trúc on-chain (Axioledger SVM Program):
 *   - AnsNameRecord   : Bản ghi cho một tên miền .axq
 *   - AnsRegistryInfo : Header account của registry
 *   - Instruction discriminators theo thứ tự enum Rust
 */

import * as borsh from "borsh"
import BN from "bn.js"

// ─── Discriminator constants (khớp với enum Instruction trong Rust program) ───

/** Các discriminator byte cho từng instruction của ANS program */
export const ANS_IX_DISCRIMINATOR = {
  /** Đăng ký tên miền mới */
  REGISTER_NAME:   0,
  /** Cập nhật bản ghi của tên miền */
  UPDATE_RECORD:   1,
  /** Chuyển quyền sở hữu tên miền */
  TRANSFER_NAME:   2,
  /** Gia hạn tên miền */
  RENEW_NAME:      3,
  /** Huỷ đăng ký tên miền */
  REVOKE_NAME:     4,
} as const

export type AnsIxDiscriminator = typeof ANS_IX_DISCRIMINATOR[keyof typeof ANS_IX_DISCRIMINATOR]

// ─── Format Enum ──────────────────────────────────────────────────────────────

/**
 * Định dạng bản ghi ANS — tương ứng enum RecordFormat trong Rust program.
 * 0 = SVM native pubkey | 1 = EVM address | 2 = ZK-DID hash | 3 = IPFS CID
 */
export const ANS_RECORD_FORMAT = {
  SVM:    0,
  EVM:    1,
  ZK_DID: 2,
  IPFS:   3,
} as const

export type AnsRecordFormat = typeof ANS_RECORD_FORMAT[keyof typeof ANS_RECORD_FORMAT]

/** Map ngược từ số sang tên format */
export const ANS_RECORD_FORMAT_NAME: Record<AnsRecordFormat, string> = {
  0: "svm",
  1: "evm",
  2: "zk-did",
  3: "ipfs",
}

// ─── Domain Types (TypeScript) ────────────────────────────────────────────────

/**
 * Bản ghi một tên miền .axq sau khi deserialize từ dữ liệu on-chain.
 */
export interface AnsRecord {
  /** Tên đầy đủ, ví dụ "alice.axq" */
  name: string
  /** TLD của tên miền, ví dụ "axq" */
  tld: string
  /** Pubkey 32-byte của chủ sở hữu */
  owner: Uint8Array
  /** Giá trị bản ghi (địa chỉ / hash / CID) */
  value: string
  /** Định dạng bản ghi */
  format: AnsRecordFormat
  /** Thời điểm hết hạn (Unix timestamp, giây). 0 = không hết hạn */
  expiresAt: BN
  /** TTL cache tính bằng giây */
  ttl: number
}

/**
 * Dữ liệu thô Borsh của AnsNameRecord trên chain (field names khớp Rust struct).
 */
export interface AnsNameRecordRaw {
  owner:      Uint8Array   // [u8; 32]
  name:       string       // String
  tld:        string       // String
  value:      string       // String
  format:     number       // u8
  expires_at: BN           // u64 → BN
  ttl:        number       // u32
}

/**
 * Header account của ANS Registry.
 */
export interface AnsRegistryInfoRaw {
  is_initialized: number   // u8 (bool)
  authority:      Uint8Array
  record_count:   number   // u32
}

// ─── Borsh Layouts ────────────────────────────────────────────────────────────

/**
 * Layout Borsh cho AnsNameRecord.
 * Dùng `borsh.struct()` API — không decorator, tương thích strict TypeScript.
 */
export const AnsNameRecordLayout = borsh.struct<AnsNameRecordRaw>([
  borsh.array(borsh.u8(), 32, "owner"),
  borsh.str("name"),
  borsh.str("tld"),
  borsh.str("value"),
  borsh.u8("format"),
  borsh.u64("expires_at"),
  borsh.u32("ttl"),
])

/**
 * Layout Borsh cho AnsRegistryInfo (account header).
 */
export const AnsRegistryInfoLayout = borsh.struct<AnsRegistryInfoRaw>([
  borsh.u8("is_initialized"),
  borsh.array(borsh.u8(), 32, "authority"),
  borsh.u32("record_count"),
])

// ─── Layout cho Instruction data ─────────────────────────────────────────────

export interface RegisterNameData {
  discriminator: number
  name:          string
  tld:           string
  value:         string
  format:        number
  expires_at:    BN
  ttl:           number
}

export interface UpdateRecordData {
  discriminator: number
  name:          string
  tld:           string
  value:         string
  format:        number
  ttl:           number
}

export interface TransferNameData {
  discriminator: number
  name:          string
  tld:           string
  new_owner:     Uint8Array
}

export interface RenewNameData {
  discriminator: number
  name:          string
  tld:           string
  extend_by:     BN       // số giây gia hạn thêm
}

/** Layout Borsh cho instruction RegisterName */
export const RegisterNameLayout = borsh.struct<RegisterNameData>([
  borsh.u8("discriminator"),
  borsh.str("name"),
  borsh.str("tld"),
  borsh.str("value"),
  borsh.u8("format"),
  borsh.u64("expires_at"),
  borsh.u32("ttl"),
])

/** Layout Borsh cho instruction UpdateRecord */
export const UpdateRecordLayout = borsh.struct<UpdateRecordData>([
  borsh.u8("discriminator"),
  borsh.str("name"),
  borsh.str("tld"),
  borsh.str("value"),
  borsh.u8("format"),
  borsh.u32("ttl"),
])

/** Layout Borsh cho instruction TransferName */
export const TransferNameLayout = borsh.struct<TransferNameData>([
  borsh.u8("discriminator"),
  borsh.str("name"),
  borsh.str("tld"),
  borsh.array(borsh.u8(), 32, "new_owner"),
])

/** Layout Borsh cho instruction RenewName */
export const RenewNameLayout = borsh.struct<RenewNameData>([
  borsh.u8("discriminator"),
  borsh.str("name"),
  borsh.str("tld"),
  borsh.u64("extend_by"),
])

// ─── Serialize / Deserialize helpers ─────────────────────────────────────────

/**
 * Serialize AnsNameRecord thành buffer Borsh để ghi lên chain.
 * @param record - Dữ liệu bản ghi cần serialize
 * @returns Buffer chứa dữ liệu đã encode
 */
export function serializeAnsNameRecord(record: AnsNameRecordRaw): Buffer {
  const buf = Buffer.alloc(AnsNameRecordLayout.span !== -1 ? AnsNameRecordLayout.span : 1024)
  const len = AnsNameRecordLayout.encode(record, buf)
  return buf.subarray(0, len)
}

/**
 * Deserialize buffer Borsh thành AnsNameRecordRaw.
 * @param data - Buffer dữ liệu account từ on-chain
 * @returns AnsNameRecordRaw đã decode
 * @throws Error nếu buffer không đủ dữ liệu
 */
export function deserializeAnsNameRecord(data: Buffer | Uint8Array): AnsNameRecordRaw {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data)
  return AnsNameRecordLayout.decode(buf)
}

/**
 * Chuyển đổi AnsNameRecordRaw (on-chain format) sang AnsRecord (domain type).
 */
export function rawToAnsRecord(raw: AnsNameRecordRaw): AnsRecord {
  return {
    name:      raw.name,
    tld:       raw.tld,
    owner:     new Uint8Array(raw.owner),
    value:     raw.value,
    format:    raw.format as AnsRecordFormat,
    expiresAt: raw.expires_at instanceof BN ? raw.expires_at : new BN(raw.expires_at),
    ttl:       raw.ttl,
  }
}
