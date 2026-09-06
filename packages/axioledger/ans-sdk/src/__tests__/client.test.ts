/**
 * @axioledger/ans-sdk — Unit Tests: AnsClient
 *
 * Kiểm tra AnsClient với mock Connection từ @solana/web3.js.
 * Các test tập trung vào:
 *   - resolveName trả về null khi account không tồn tại
 *   - resolveName decode đúng khi account tồn tại
 *   - Cache hoạt động đúng
 *   - AnsClientError được throw với đúng code
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { Connection, PublicKey } from "@solana/web3.js"
import BN from "bn.js"

import { AnsClient, AnsClientError } from "../client.js"
import {
  serializeAnsNameRecord,
  ANS_RECORD_FORMAT,
  type AnsNameRecordRaw,
} from "../schema.js"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MOCK_PROGRAM_ID = new PublicKey("AnsReg1111111111111111111111111111111111111")

/** Tạo mock Connection với getAccountInfo có thể điều khiển */
function makeMockConnection(
  getAccountInfoImpl: () => Promise<{ data: Buffer; executable: boolean; lamports: number; owner: PublicKey; rentEpoch: number } | null>
): Connection {
  return {
    getAccountInfo:    vi.fn(getAccountInfoImpl),
    getProgramAccounts: vi.fn().mockResolvedValue([]),
    getLatestBlockhash: vi.fn().mockResolvedValue({
      blockhash: "FakeBlockhash111111111111111111111111111111",
      lastValidBlockHeight: 999999,
    }),
    sendRawTransaction: vi.fn().mockResolvedValue("FakeSig111111111111111111111111111111111111"),
    confirmTransaction: vi.fn().mockResolvedValue({ value: { err: null } }),
  } as unknown as Connection
}

/** Tạo buffer account giả lập từ AnsNameRecordRaw */
function makeMockAccountData(raw: AnsNameRecordRaw): Buffer {
  return serializeAnsNameRecord(raw)
}

const SAMPLE_RAW: AnsNameRecordRaw = {
  owner:      new Uint8Array(32).fill(0x01),
  name:       "alice",
  tld:        "axq",
  value:      "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  format:     ANS_RECORD_FORMAT.SVM,
  expires_at: new BN(0),
  ttl:        86400,
}

// ─── Tests: resolveName ───────────────────────────────────────────────────────

describe("AnsClient.resolveName", () => {
  it("trả về null khi account không tồn tại", async () => {
    const conn = makeMockConnection(async () => null)
    const client = new AnsClient({ connection: conn, programId: MOCK_PROGRAM_ID })

    const result = await client.resolveName("nonexistent", "axq")
    expect(result).toBeNull()
  })

  it("decode đúng khi account tồn tại", async () => {
    const data = makeMockAccountData(SAMPLE_RAW)
    const conn = makeMockConnection(async () => ({
      data,
      executable: false,
      lamports: 1_000_000,
      owner: MOCK_PROGRAM_ID,
      rentEpoch: 0,
    }))
    const client = new AnsClient({ connection: conn, programId: MOCK_PROGRAM_ID })

    const record = await client.resolveName("alice", "axq")
    expect(record).not.toBeNull()
    expect(record!.name).toBe("alice")
    expect(record!.tld).toBe("axq")
    expect(record!.value).toBe(SAMPLE_RAW.value)
    expect(record!.format).toBe(ANS_RECORD_FORMAT.SVM)
  })

  it("cache hoạt động: RPC chỉ gọi 1 lần khi resolve 2 lần", async () => {
    const data = makeMockAccountData(SAMPLE_RAW)
    const getAccountInfo = vi.fn(async () => ({
      data,
      executable: false,
      lamports: 1_000_000,
      owner: MOCK_PROGRAM_ID,
      rentEpoch: 0,
    }))
    const conn = { getAccountInfo } as unknown as Connection
    const client = new AnsClient({ connection: conn, programId: MOCK_PROGRAM_ID })

    await client.resolveName("alice", "axq")
    await client.resolveName("alice", "axq")

    expect(getAccountInfo).toHaveBeenCalledTimes(1)
    expect(client.cacheSize()).toBe(1)
  })

  it("clearCache khiến RPC được gọi lại", async () => {
    const data = makeMockAccountData(SAMPLE_RAW)
    const getAccountInfo = vi.fn(async () => ({
      data,
      executable: false,
      lamports: 1_000_000,
      owner: MOCK_PROGRAM_ID,
      rentEpoch: 0,
    }))
    const conn = { getAccountInfo } as unknown as Connection
    const client = new AnsClient({ connection: conn, programId: MOCK_PROGRAM_ID })

    await client.resolveName("alice", "axq")
    client.clearCache()
    await client.resolveName("alice", "axq")

    expect(getAccountInfo).toHaveBeenCalledTimes(2)
  })

  it("throw AnsClientError với code RPC_ERROR khi RPC thất bại", async () => {
    const conn = makeMockConnection(async () => {
      throw new Error("Network timeout")
    })
    const client = new AnsClient({ connection: conn, programId: MOCK_PROGRAM_ID })

    await expect(client.resolveName("alice", "axq"))
      .rejects
      .toThrow(AnsClientError)

    try {
      await client.resolveName("bob", "axq")
    } catch (err) {
      expect(err).toBeInstanceOf(AnsClientError)
      expect((err as AnsClientError).code).toBe("RPC_ERROR")
    }
  })
})

// ─── Tests: registerName ──────────────────────────────────────────────────────

describe("AnsClient.registerName", () => {
  it("throw WALLET_NOT_CONNECTED khi wallet.publicKey là null", async () => {
    const conn = makeMockConnection(async () => null)
    const client = new AnsClient({ connection: conn, programId: MOCK_PROGRAM_ID })

    const fakeWallet = {
      publicKey: null,
      signTransaction: vi.fn(),
    }

    await expect(
      client.registerName(fakeWallet, "alice", "axq", "someValue")
    ).rejects.toMatchObject({
      code: "WALLET_NOT_CONNECTED",
    })
  })

  it("gọi signTransaction và sendRawTransaction khi wallet đã connect", async () => {
    const conn = makeMockConnection(async () => null) as unknown as {
      getAccountInfo: ReturnType<typeof vi.fn>
      getLatestBlockhash: ReturnType<typeof vi.fn>
      sendRawTransaction: ReturnType<typeof vi.fn>
      confirmTransaction: ReturnType<typeof vi.fn>
    } & Connection

    conn.getLatestBlockhash = vi.fn().mockResolvedValue({
      blockhash: "FakeBlockhash",
      lastValidBlockHeight: 999,
    })
    conn.sendRawTransaction = vi.fn().mockResolvedValue("FakeSig")
    conn.confirmTransaction = vi.fn().mockResolvedValue({ value: { err: null } })

    const client = new AnsClient({ connection: conn as unknown as Connection, programId: MOCK_PROGRAM_ID })

    const fakeWallet = {
      publicKey: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"),
      signTransaction: vi.fn().mockImplementation((tx) => Promise.resolve(tx)),
    }

    const sig = await client.registerName(fakeWallet, "alice", "axq", "someValue")
    expect(sig).toBe("FakeSig")
    expect(fakeWallet.signTransaction).toHaveBeenCalledTimes(1)
  })
})
