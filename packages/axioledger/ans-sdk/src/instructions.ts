/**
 * @axioledger/ans-sdk — ANS Instruction Builders
 *
 * Xây dựng các TransactionInstruction hoàn chỉnh cho ANS program.
 * Mỗi builder: tính PDA → serialize data qua Borsh → build AccountMeta list.
 *
 * Account conventions (theo thứ tự trong processor.rs):
 *   RegisterName : [nameAccount(writable), tldAuthority(read), payer(signer,writable), systemProgram]
 *   UpdateRecord : [nameAccount(writable), owner(signer)]
 *   TransferName : [nameAccount(writable), currentOwner(signer), newOwner(read)]
 *   RenewName    : [nameAccount(writable), payer(signer,writable), systemProgram]
 */

import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  type AccountMeta,
} from "@solana/web3.js"
import BN from "bn.js"

import {
  ANS_IX_DISCRIMINATOR,
  ANS_RECORD_FORMAT,
  RegisterNameLayout,
  UpdateRecordLayout,
  TransferNameLayout,
  RenewNameLayout,
  type AnsRecordFormat,
} from "./schema.js"
import {
  deriveNameAccountPDA,
  deriveTldAuthorityPDA,
} from "./pda.js"

// ─── Tham số đầu vào cho các builders ────────────────────────────────────────

export interface RegisterNameParams {
  /** Tên đơn cần đăng ký, ví dụ "alice" */
  name:      string
  /** TLD, ví dụ "axq" */
  tld:       string
  /** Giá trị bản ghi (địa chỉ SVM / EVM / ZK-DID hash / IPFS CID) */
  value:     string
  /** Định dạng bản ghi. Mặc định: SVM */
  format?:   AnsRecordFormat
  /** TTL tính bằng giây. Mặc định: 86400 (1 ngày) */
  ttl?:      number
  /** Thời điểm hết hạn Unix (giây). Mặc định: 0 (không hết hạn) */
  expiresAt?: BN
  /** PublicKey của người trả phí (fee payer / chủ sở hữu) */
  payer:     PublicKey
  /** PublicKey của ANS program */
  programId: PublicKey
}

export interface UpdateRecordParams {
  name:      string
  tld:       string
  value:     string
  format?:   AnsRecordFormat
  ttl?:      number
  /** PublicKey của chủ sở hữu hiện tại (phải ký) */
  owner:     PublicKey
  programId: PublicKey
}

export interface TransferNameParams {
  name:       string
  tld:        string
  /** Chủ sở hữu hiện tại (phải ký) */
  owner:      PublicKey
  /** Chủ sở hữu mới */
  newOwner:   PublicKey
  programId:  PublicKey
}

export interface RenewNameParams {
  name:       string
  tld:        string
  /** Số giây gia hạn thêm */
  extendBy:   BN
  /** Người trả phí gia hạn */
  payer:      PublicKey
  programId:  PublicKey
}

// ─── Helpers nội bộ ───────────────────────────────────────────────────────────

/**
 * Encode instruction data qua Borsh layout bất kỳ.
 * Dùng dynamic buffer: alloc 1024 byte, cắt theo độ dài thực.
 */
function encodeIxData<T extends object>(
  layout: { encode: (src: T, b: Buffer) => number; span: number },
  data: T
): Buffer {
  const maxSize = layout.span > 0 ? layout.span : 1024
  const buf = Buffer.alloc(maxSize)
  const len = layout.encode(data, buf)
  return buf.subarray(0, len)
}

// ─── Instruction Builders ─────────────────────────────────────────────────────

/**
 * Xây dựng instruction RegisterName.
 * Đăng ký một tên miền .axq mới cho `payer`.
 */
export function buildRegisterNameIx(params: RegisterNameParams): TransactionInstruction {
  const {
    name, tld, value, payer, programId,
    format     = ANS_RECORD_FORMAT.SVM,
    ttl        = 86400,
    expiresAt  = new BN(0),
  } = params

  const [nameAccountPda] = deriveNameAccountPDA(name, tld, programId)
  const [tldAuthorityPda] = deriveTldAuthorityPDA(tld, programId)

  const data = encodeIxData(RegisterNameLayout, {
    discriminator: ANS_IX_DISCRIMINATOR.REGISTER_NAME,
    name,
    tld,
    value,
    format,
    expires_at: expiresAt,
    ttl,
  })

  const keys: AccountMeta[] = [
    { pubkey: nameAccountPda,  isSigner: false, isWritable: true  },
    { pubkey: tldAuthorityPda, isSigner: false, isWritable: false },
    { pubkey: payer,           isSigner: true,  isWritable: true  },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ]

  return new TransactionInstruction({ keys, programId, data })
}

/**
 * Xây dựng instruction UpdateRecord.
 * Cập nhật bản ghi của một tên miền — chỉ chủ sở hữu mới ký được.
 */
export function buildUpdateRecordIx(params: UpdateRecordParams): TransactionInstruction {
  const {
    name, tld, value, owner, programId,
    format = ANS_RECORD_FORMAT.SVM,
    ttl    = 86400,
  } = params

  const [nameAccountPda] = deriveNameAccountPDA(name, tld, programId)

  const data = encodeIxData(UpdateRecordLayout, {
    discriminator: ANS_IX_DISCRIMINATOR.UPDATE_RECORD,
    name,
    tld,
    value,
    format,
    ttl,
  })

  const keys: AccountMeta[] = [
    { pubkey: nameAccountPda, isSigner: false, isWritable: true },
    { pubkey: owner,          isSigner: true,  isWritable: false },
  ]

  return new TransactionInstruction({ keys, programId, data })
}

/**
 * Xây dựng instruction TransferName.
 * Chuyển quyền sở hữu tên miền sang địa chỉ mới.
 */
export function buildTransferNameIx(params: TransferNameParams): TransactionInstruction {
  const { name, tld, owner, newOwner, programId } = params

  const [nameAccountPda] = deriveNameAccountPDA(name, tld, programId)

  const data = encodeIxData(TransferNameLayout, {
    discriminator: ANS_IX_DISCRIMINATOR.TRANSFER_NAME,
    name,
    tld,
    new_owner: Array.from(newOwner.toBytes()),
  })

  const keys: AccountMeta[] = [
    { pubkey: nameAccountPda, isSigner: false, isWritable: true  },
    { pubkey: owner,          isSigner: true,  isWritable: false },
    { pubkey: newOwner,       isSigner: false, isWritable: false },
  ]

  return new TransactionInstruction({ keys, programId, data })
}

/**
 * Xây dựng instruction RenewName.
 * Gia hạn thời gian sở hữu tên miền, trả phí bằng SOL.
 */
export function buildRenewNameIx(params: RenewNameParams): TransactionInstruction {
  const { name, tld, extendBy, payer, programId } = params

  const [nameAccountPda] = deriveNameAccountPDA(name, tld, programId)
  const [tldAuthorityPda] = deriveTldAuthorityPDA(tld, programId)

  const data = encodeIxData(RenewNameLayout, {
    discriminator: ANS_IX_DISCRIMINATOR.RENEW_NAME,
    name,
    tld,
    extend_by: extendBy,
  })

  const keys: AccountMeta[] = [
    { pubkey: nameAccountPda,  isSigner: false, isWritable: true  },
    { pubkey: tldAuthorityPda, isSigner: false, isWritable: true  },
    { pubkey: payer,           isSigner: true,  isWritable: true  },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ]

  return new TransactionInstruction({ keys, programId, data })
}
