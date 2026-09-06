/**
 * @axioledger/ans-sdk — PDA Derivation Logic
 *
 * Tính toán Program Derived Address (PDA) cho các account của ANS Registry.
 * Sử dụng `PublicKey.findProgramAddressSync` từ @solana/web3.js
 * (synchronous, không phải async) để nhất quán với cách Solana runtime tính.
 *
 * Seed conventions (khớp với processor.rs trong ANS program):
 *   NameAccount   : [ b"ans_name",   UTF8(name),   UTF8(tld)  ]
 *   ResolverPDA   : [ b"ans_resolver", owner_bytes              ]
 *   TldAuthority  : [ b"ans_tld",    UTF8(tld)                 ]
 *
 * namehash (SHA-256 recursive):
 *   Được giữ lại cho mục đích caching/fingerprinting phía client,
 *   KHÔNG dùng làm seed trực tiếp trong PDA (seed dùng string thô).
 */

import { PublicKey } from "@solana/web3.js"

// ─── Seed Constants ───────────────────────────────────────────────────────────

/** Seed prefix cho NameAccount PDA */
export const ANS_NAME_SEED = "ans_name" as const

/** Seed prefix cho Resolver PDA (mỗi owner 1 resolver) */
export const ANS_RESOLVER_SEED = "ans_resolver" as const

/** Seed prefix cho TLD Authority PDA */
export const ANS_TLD_SEED = "ans_tld" as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Chuẩn hoá tên miền: lowercase, bỏ leading/trailing dot.
 * @param raw - Tên thô từ input người dùng
 */
export function normalizeName(raw: string): string {
  return raw.trim().toLowerCase().replace(/^\.+|\.+$/g, "")
}

/**
 * Tách tên miền thành { name, tld }.
 * Ví dụ: "alice.axq" → { name: "alice", tld: "axq" }
 * @throws Error nếu format không hợp lệ
 */
export function parseDomain(domain: string): { name: string; tld: string } {
  const parts = normalizeName(domain).split(".")
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error(
      `parseDomain: định dạng không hợp lệ "${domain}". ` +
      `Yêu cầu format "name.tld", ví dụ "alice.axq"`
    )
  }
  return { name: parts[0], tld: parts[1] }
}

// ─── PDA Derivation Functions ─────────────────────────────────────────────────

/**
 * Tính PDA cho một NameAccount (bản ghi tên miền).
 *
 * Seeds: [ b"ans_name", UTF8(name), UTF8(tld) ]
 *
 * @param name      - Tên đơn, ví dụ "alice" (không gồm TLD)
 * @param tld       - Top-level domain, ví dụ "axq"
 * @param programId - PublicKey của ANS program
 * @returns [pdaPublicKey, bumpSeed] — deterministic, off-curve
 *
 * @example
 *   const [pda, bump] = deriveNameAccountPDA("alice", "axq", new PublicKey(ANS_PROGRAM_ID))
 */
export function deriveNameAccountPDA(
  name: string,
  tld: string,
  programId: PublicKey
): [PublicKey, number] {
  const nameNorm = normalizeName(name)
  const tldNorm  = normalizeName(tld)

  if (!nameNorm) throw new Error("deriveNameAccountPDA: name không được rỗng")
  if (!tldNorm)  throw new Error("deriveNameAccountPDA: tld không được rỗng")

  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(ANS_NAME_SEED,   "utf8"),
      Buffer.from(nameNorm,        "utf8"),
      Buffer.from(tldNorm,         "utf8"),
    ],
    programId
  )
}

/**
 * Tính PDA cho Resolver account của một owner.
 * Mỗi owner có đúng một resolver account lưu danh sách tên miền họ sở hữu.
 *
 * Seeds: [ b"ans_resolver", owner_pubkey_bytes ]
 *
 * @param owner     - PublicKey của chủ sở hữu
 * @param programId - PublicKey của ANS program
 * @returns [pdaPublicKey, bumpSeed]
 */
export function deriveResolverPDA(
  owner: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(ANS_RESOLVER_SEED, "utf8"),
      owner.toBytes(),
    ],
    programId
  )
}

/**
 * Tính PDA cho TLD Authority account.
 * Quản lý metadata và phí của một TLD cụ thể.
 *
 * Seeds: [ b"ans_tld", UTF8(tld) ]
 *
 * @param tld       - Top-level domain, ví dụ "axq"
 * @param programId - PublicKey của ANS program
 * @returns [pdaPublicKey, bumpSeed]
 */
export function deriveTldAuthorityPDA(
  tld: string,
  programId: PublicKey
): [PublicKey, number] {
  const tldNorm = normalizeName(tld)
  if (!tldNorm) throw new Error("deriveTldAuthorityPDA: tld không được rỗng")

  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(ANS_TLD_SEED, "utf8"),
      Buffer.from(tldNorm,      "utf8"),
    ],
    programId
  )
}

// ─── namehash (SHA-256 recursive, dùng cho caching/fingerprinting) ────────────

/**
 * Tính SHA-256 namehash của một domain .axq.
 * Dùng cho fingerprinting, indexing phía client — KHÔNG dùng làm PDA seed.
 *
 * Algorithm:
 *   namehash("") = 0x00×32
 *   namehash("axq") = SHA256(namehash("") ++ SHA256("axq"))
 *   namehash("alice.axq") = SHA256(namehash("axq") ++ SHA256("alice"))
 */
export async function namehash(domain: string): Promise<Uint8Array> {
  const normalised = normalizeName(domain)
  let node = new Uint8Array(32)
  if (normalised === "") return node

  const labels = normalised.split(".").reverse()
  for (const label of labels) {
    const enc = new TextEncoder().encode(label)
    const labelHash = await _sha256(enc)
    node = await _sha256(_concat(node, labelHash))
  }
  return node
}

// ─── Internal SHA-256 (zero external deps) ───────────────────────────────────

async function _sha256(data: Uint8Array): Promise<Uint8Array> {
  if (typeof globalThis.crypto?.subtle?.digest === "function") {
    const buf = await globalThis.crypto.subtle.digest("SHA-256", data)
    return new Uint8Array(buf)
  }
  const { createHash } = await import("node:crypto")
  return new Uint8Array(createHash("sha256").update(data).digest())
}

function _concat(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((n, a) => n + a.length, 0)
  const out = new Uint8Array(total)
  let off = 0
  for (const a of arrays) { out.set(a, off); off += a.length }
  return out
}
