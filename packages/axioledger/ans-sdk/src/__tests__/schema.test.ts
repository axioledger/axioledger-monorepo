/**
 * @axioledger/ans-sdk — Unit Tests: Borsh Schema
 *
 * Kiểm tra serialize/deserialize round-trip của AnsNameRecord.
 * Đảm bảo không mất dữ liệu qua quá trình encode → decode.
 */

import { describe, it, expect } from "vitest"
import BN from "bn.js"

import {
  serializeAnsNameRecord,
  deserializeAnsNameRecord,
  rawToAnsRecord,
  ANS_RECORD_FORMAT,
  ANS_RECORD_FORMAT_NAME,
  type AnsNameRecordRaw,
} from "../schema.js"

// ─── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_OWNER = new Uint8Array(32).fill(0xab)

const SAMPLE_RECORD: AnsNameRecordRaw = {
  owner:      SAMPLE_OWNER,
  name:       "alice",
  tld:        "axq",
  value:      "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  format:     ANS_RECORD_FORMAT.SVM,
  expires_at: new BN("1893456000"),  // 2030-01-01 00:00:00 UTC
  ttl:        86400,
}

// ─── Round-trip tests ─────────────────────────────────────────────────────────

describe("AnsNameRecord serialize/deserialize", () => {
  it("encode trả về Buffer không rỗng", () => {
    const buf = serializeAnsNameRecord(SAMPLE_RECORD)
    expect(buf).toBeInstanceOf(Buffer)
    expect(buf.length).toBeGreaterThan(0)
  })

  it("round-trip: serialize → deserialize trả về dữ liệu gốc", () => {
    const buf = serializeAnsNameRecord(SAMPLE_RECORD)
    const decoded = deserializeAnsNameRecord(buf)

    expect(decoded.name).toBe(SAMPLE_RECORD.name)
    expect(decoded.tld).toBe(SAMPLE_RECORD.tld)
    expect(decoded.value).toBe(SAMPLE_RECORD.value)
    expect(decoded.format).toBe(SAMPLE_RECORD.format)
    expect(decoded.ttl).toBe(SAMPLE_RECORD.ttl)
    // BN comparison
    expect(decoded.expires_at.toString()).toBe(SAMPLE_RECORD.expires_at.toString())
    // owner bytes
    expect(Array.from(decoded.owner as unknown as number[])).toEqual(Array.from(SAMPLE_OWNER))
  })

  it("round-trip với format EVM", () => {
    const evmRecord: AnsNameRecordRaw = {
      ...SAMPLE_RECORD,
      format: ANS_RECORD_FORMAT.EVM,
      value:  "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    }
    const buf = serializeAnsNameRecord(evmRecord)
    const decoded = deserializeAnsNameRecord(buf)
    expect(decoded.format).toBe(ANS_RECORD_FORMAT.EVM)
    expect(decoded.value).toBe(evmRecord.value)
  })

  it("round-trip với value IPFS CID dài", () => {
    const ipfsRecord: AnsNameRecordRaw = {
      ...SAMPLE_RECORD,
      format: ANS_RECORD_FORMAT.IPFS,
      value:  "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
    }
    const buf = serializeAnsNameRecord(ipfsRecord)
    const decoded = deserializeAnsNameRecord(buf)
    expect(decoded.value).toBe(ipfsRecord.value)
    expect(decoded.format).toBe(ANS_RECORD_FORMAT.IPFS)
  })

  it("round-trip với expires_at = 0 (không hết hạn)", () => {
    const noExpiry: AnsNameRecordRaw = { ...SAMPLE_RECORD, expires_at: new BN(0) }
    const buf = serializeAnsNameRecord(noExpiry)
    const decoded = deserializeAnsNameRecord(buf)
    expect(decoded.expires_at.toString()).toBe("0")
  })

  it("decode từ Uint8Array (không chỉ Buffer)", () => {
    const buf = serializeAnsNameRecord(SAMPLE_RECORD)
    const uint8 = new Uint8Array(buf)
    const decoded = deserializeAnsNameRecord(uint8)
    expect(decoded.name).toBe(SAMPLE_RECORD.name)
  })
})

// ─── rawToAnsRecord ───────────────────────────────────────────────────────────

describe("rawToAnsRecord", () => {
  it("chuyển đúng tất cả fields", () => {
    const buf = serializeAnsNameRecord(SAMPLE_RECORD)
    const raw = deserializeAnsNameRecord(buf)
    const record = rawToAnsRecord(raw)

    expect(record.name).toBe("alice")
    expect(record.tld).toBe("axq")
    expect(record.value).toBe(SAMPLE_RECORD.value)
    expect(record.format).toBe(ANS_RECORD_FORMAT.SVM)
    expect(record.ttl).toBe(86400)
    expect(record.expiresAt.toString()).toBe("1893456000")
    expect(record.owner).toBeInstanceOf(Uint8Array)
    expect(record.owner.length).toBe(32)
  })
})

// ─── ANS_RECORD_FORMAT_NAME ───────────────────────────────────────────────────

describe("ANS_RECORD_FORMAT_NAME", () => {
  it("map đúng từ số sang tên", () => {
    expect(ANS_RECORD_FORMAT_NAME[0]).toBe("svm")
    expect(ANS_RECORD_FORMAT_NAME[1]).toBe("evm")
    expect(ANS_RECORD_FORMAT_NAME[2]).toBe("zk-did")
    expect(ANS_RECORD_FORMAT_NAME[3]).toBe("ipfs")
  })
})
