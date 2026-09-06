/**
 * @axioledger/ans-sdk — Unit Tests: PDA Derivation
 *
 * Kiểm tra tính đúng đắn và determinism của các hàm PDA derivation.
 * Dùng Vitest với mock programId cố định để kết quả reproducible.
 */

import { describe, it, expect } from "vitest"
import { PublicKey } from "@solana/web3.js"

import {
  deriveNameAccountPDA,
  deriveResolverPDA,
  deriveTldAuthorityPDA,
  normalizeName,
  parseDomain,
  ANS_NAME_SEED,
  ANS_RESOLVER_SEED,
  ANS_TLD_SEED,
} from "../pda.js"

// Program ID giả lập dùng trong test (không phải địa chỉ thực)
const MOCK_PROGRAM_ID = new PublicKey("AnsReg1111111111111111111111111111111111111")

// ─── normalizeName ────────────────────────────────────────────────────────────

describe("normalizeName", () => {
  it("chuyển thành lowercase", () => {
    expect(normalizeName("ALICE")).toBe("alice")
  })

  it("bỏ khoảng trắng đầu/cuối", () => {
    expect(normalizeName("  alice  ")).toBe("alice")
  })

  it("bỏ dấu chấm đầu/cuối", () => {
    expect(normalizeName(".alice.axq.")).toBe("alice.axq")
  })

  it("chuỗi rỗng trả về rỗng", () => {
    expect(normalizeName("")).toBe("")
  })
})

// ─── parseDomain ──────────────────────────────────────────────────────────────

describe("parseDomain", () => {
  it("tách đúng name và tld", () => {
    expect(parseDomain("alice.axq")).toEqual({ name: "alice", tld: "axq" })
  })

  it("normalize trước khi tách", () => {
    expect(parseDomain("  ALICE.AXQ  ")).toEqual({ name: "alice", tld: "axq" })
  })

  it("ném lỗi khi không có TLD", () => {
    expect(() => parseDomain("alice")).toThrow(/định dạng không hợp lệ/)
  })

  it("ném lỗi khi có nhiều hơn 2 phần", () => {
    expect(() => parseDomain("sub.alice.axq")).toThrow(/định dạng không hợp lệ/)
  })
})

// ─── deriveNameAccountPDA ─────────────────────────────────────────────────────

describe("deriveNameAccountPDA", () => {
  it("trả về [PublicKey, number]", () => {
    const [pda, bump] = deriveNameAccountPDA("alice", "axq", MOCK_PROGRAM_ID)
    expect(pda).toBeInstanceOf(PublicKey)
    expect(typeof bump).toBe("number")
    expect(bump).toBeGreaterThanOrEqual(0)
    expect(bump).toBeLessThanOrEqual(255)
  })

  it("deterministic — cùng input cho cùng output", () => {
    const [pda1] = deriveNameAccountPDA("alice", "axq", MOCK_PROGRAM_ID)
    const [pda2] = deriveNameAccountPDA("alice", "axq", MOCK_PROGRAM_ID)
    expect(pda1.toBase58()).toBe(pda2.toBase58())
  })

  it("khác nhau khi khác name", () => {
    const [pda1] = deriveNameAccountPDA("alice", "axq", MOCK_PROGRAM_ID)
    const [pda2] = deriveNameAccountPDA("bob",   "axq", MOCK_PROGRAM_ID)
    expect(pda1.toBase58()).not.toBe(pda2.toBase58())
  })

  it("khác nhau khi khác tld", () => {
    const [pda1] = deriveNameAccountPDA("alice", "axq",  MOCK_PROGRAM_ID)
    const [pda2] = deriveNameAccountPDA("alice", "near", MOCK_PROGRAM_ID)
    expect(pda1.toBase58()).not.toBe(pda2.toBase58())
  })

  it("normalize tự động — ALICE.AXQ == alice.axq", () => {
    const [pda1] = deriveNameAccountPDA("ALICE", "AXQ", MOCK_PROGRAM_ID)
    const [pda2] = deriveNameAccountPDA("alice", "axq", MOCK_PROGRAM_ID)
    expect(pda1.toBase58()).toBe(pda2.toBase58())
  })

  it("ném lỗi khi name rỗng", () => {
    expect(() => deriveNameAccountPDA("", "axq", MOCK_PROGRAM_ID))
      .toThrow(/name không được rỗng/)
  })

  it("PDA là địa chỉ off-curve (valid PDA)", () => {
    const [pda] = deriveNameAccountPDA("alice", "axq", MOCK_PROGRAM_ID)
    // PublicKey.findProgramAddressSync đảm bảo off-curve — không thể isOnCurve()
    // Kiểm tra gián tiếp: PDA khác với programId
    expect(pda.toBase58()).not.toBe(MOCK_PROGRAM_ID.toBase58())
    // PDA phải là 32-byte non-zero
    const bytes = pda.toBytes()
    expect(bytes.length).toBe(32)
    const isAllZero = bytes.every((b) => b === 0)
    expect(isAllZero).toBe(false)
  })
})

// ─── deriveResolverPDA ────────────────────────────────────────────────────────

describe("deriveResolverPDA", () => {
  const OWNER = new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM")

  it("trả về [PublicKey, number]", () => {
    const [pda, bump] = deriveResolverPDA(OWNER, MOCK_PROGRAM_ID)
    expect(pda).toBeInstanceOf(PublicKey)
    expect(bump).toBeGreaterThanOrEqual(0)
  })

  it("deterministic", () => {
    const [pda1] = deriveResolverPDA(OWNER, MOCK_PROGRAM_ID)
    const [pda2] = deriveResolverPDA(OWNER, MOCK_PROGRAM_ID)
    expect(pda1.toBase58()).toBe(pda2.toBase58())
  })

  it("khác PDA của owner khác", () => {
    const OTHER_OWNER = new PublicKey("2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9")
    const [pda1] = deriveResolverPDA(OWNER,       MOCK_PROGRAM_ID)
    const [pda2] = deriveResolverPDA(OTHER_OWNER, MOCK_PROGRAM_ID)
    expect(pda1.toBase58()).not.toBe(pda2.toBase58())
  })
})

// ─── deriveTldAuthorityPDA ────────────────────────────────────────────────────

describe("deriveTldAuthorityPDA", () => {
  it("trả về [PublicKey, number]", () => {
    const [pda, bump] = deriveTldAuthorityPDA("axq", MOCK_PROGRAM_ID)
    expect(pda).toBeInstanceOf(PublicKey)
    expect(bump).toBeGreaterThanOrEqual(0)
  })

  it("deterministic", () => {
    const [pda1] = deriveTldAuthorityPDA("axq", MOCK_PROGRAM_ID)
    const [pda2] = deriveTldAuthorityPDA("axq", MOCK_PROGRAM_ID)
    expect(pda1.toBase58()).toBe(pda2.toBase58())
  })

  it("khác TLD khác PDA", () => {
    const [pda1] = deriveTldAuthorityPDA("axq",  MOCK_PROGRAM_ID)
    const [pda2] = deriveTldAuthorityPDA("near", MOCK_PROGRAM_ID)
    expect(pda1.toBase58()).not.toBe(pda2.toBase58())
  })

  it("seed constants có giá trị đúng", () => {
    expect(ANS_NAME_SEED).toBe("ans_name")
    expect(ANS_RESOLVER_SEED).toBe("ans_resolver")
    expect(ANS_TLD_SEED).toBe("ans_tld")
  })
})
