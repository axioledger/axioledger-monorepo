#!/usr/bin/env node
/**
 * scripts/check-doc-links.js
 * Axioledger — Automated Documentation Link Checker
 *
 * Quét toàn bộ file Markdown trong docs/ và kiểm tra:
 *   1. Relative links: [text](./path) — file có tồn tại không?
 *   2. Anchor links:   [text](#section) — heading có trong file không?
 *   3. Cross-doc:      [text](other.md#section) — file + anchor đều hợp lệ?
 *
 * Chạy:
 *   node scripts/check-doc-links.js
 *   node scripts/check-doc-links.js --dir docs/logic
 *   node scripts/check-doc-links.js --strict  # exit 1 nếu có lỗi
 *
 * CI Usage (trong .github/workflows/ci-test.yml):
 *   - name: Check doc links
 *     run: node scripts/check-doc-links.js --strict
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs"
import { resolve, dirname, join, relative, extname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = resolve(__dirname, "..")

// ─── CLI Args ──────────────────────────────────────────────────────────────────

const args   = process.argv.slice(2)
const STRICT = args.includes("--strict")
const dirArg = args.find(a => a.startsWith("--dir="))?.split("=")[1]
          ?? args[args.indexOf("--dir") + 1] ?? null

const SCAN_ROOT = dirArg ? resolve(ROOT, dirArg) : resolve(ROOT, "docs")

// ─── Utilities ─────────────────────────────────────────────────────────────────

/** Thu thập tất cả .md files trong một thư mục (đệ quy). */
function collectMarkdownFiles(dir) {
  const results = []
  if (!existsSync(dir)) return results
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...collectMarkdownFiles(full))
    } else if (extname(entry) === ".md") {
      results.push(full)
    }
  }
  return results
}

/**
 * Chuyển heading text thành anchor slug theo chuẩn GitHub Markdown.
 * GitHub giữ nguyên ký tự Unicode (tiếng Việt), chỉ loại ký tự đặc biệt
 * như `!`, `?`, `.`, `,`, `(`, `)`, `&`, `/`, `*`, `` ` ``, `"`, `'`.
 * @param {string} heading
 * @returns {string}
 */
function headingToSlug(heading) {
  return heading
    .toLowerCase()
    // Loại bỏ backtick và nội dung code inline, giữ text
    .replace(/`([^`]*)`/g, "$1")
    // Loại bỏ các ký tự đặc biệt mà GitHub bỏ qua khi tạo anchor
    .replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

/**
 * Trích xuất tất cả heading text từ nội dung Markdown.
 * Sinh đầy đủ các biến thể slug (có dấu + không dấu) để tăng khả năng match.
 * @param {string} content
 * @returns {Set<string>}
 */
function extractAnchors(content) {
  const anchors = new Set()
  for (const [, heading] of content.matchAll(/^#{1,6}\s+(.+)$/gm)) {
    // Slug chuẩn GitHub (giữ Unicode)
    const slug = headingToSlug(heading)
    anchors.add(slug)

    // Biến thể ASCII thuần (loại bỏ diacritics — một số renderers dùng cách này)
    const ascii = slug
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/-+/g, "-")
    anchors.add(ascii)
  }
  return anchors
}

/**
 * Trích xuất tất cả relative links từ nội dung Markdown.
 * Bỏ qua: external URLs (http/https), mailto:, data:
 * @param {string} content
 * @returns {{ href: string, text: string, line: number }[]}
 */
function extractLinks(content) {
  const links = []
  const lines = content.split("\n")
  lines.forEach((line, i) => {
    for (const [, text, href] of line.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)) {
      if (href.startsWith("http")
       || href.startsWith("mailto:")
       || href.startsWith("data:")
       || href.startsWith("//")) continue
      links.push({ href: href.split(" ")[0].trim(), text, line: i + 1 })
    }
  })
  return links
}

// ─── Checker ───────────────────────────────────────────────────────────────────

/**
 * @typedef {{ file: string, line: number, href: string, reason: string }} LinkError
 */

/** @type {LinkError[]} */
const errors   = []
/** @type {{ file: string, count: number }[]} */
const summary  = []

const files = collectMarkdownFiles(SCAN_ROOT)

console.log(`\n🔍 Axioledger Doc Link Checker`)
console.log(`   Scanning: ${relative(ROOT, SCAN_ROOT)}`)
console.log(`   Found ${files.length} Markdown files\n`)

for (const filePath of files) {
  const content  = readFileSync(filePath, "utf8")
  const links    = extractLinks(content)
  const fileDir  = dirname(filePath)
  let   fileErrs = 0

  for (const { href, text, line } of links) {
    // Anchor-only link → check trong cùng file
    if (href.startsWith("#")) {
      const anchors = extractAnchors(content)
      const anchor  = href.slice(1)
      if (!anchors.has(anchor)) {
        errors.push({ file: relative(ROOT, filePath), line, href, reason: `Anchor "${anchor}" không tồn tại trong file này` })
        fileErrs++
      }
      continue
    }

    // Tách path và anchor
    const [pathPart, anchorPart] = href.split("#")
    const targetPath = resolve(fileDir, pathPart)

    // Kiểm tra file tồn tại
    if (!existsSync(targetPath)) {
      errors.push({ file: relative(ROOT, filePath), line, href, reason: `File không tồn tại: ${relative(ROOT, targetPath)}` })
      fileErrs++
      continue
    }

    // Nếu có anchor → kiểm tra heading trong file đích
    if (anchorPart) {
      const targetContent = readFileSync(targetPath, "utf8")
      const anchors       = extractAnchors(targetContent)
      if (!anchors.has(anchorPart)) {
        errors.push({ file: relative(ROOT, filePath), line, href, reason: `Anchor "#${anchorPart}" không tồn tại trong ${relative(ROOT, targetPath)}` })
        fileErrs++
      }
    }
  }

  const status = fileErrs === 0 ? "✅" : `❌ (${fileErrs} lỗi)`
  console.log(`  ${status}  ${relative(ROOT, filePath)}  [${links.length} links]`)
  summary.push({ file: relative(ROOT, filePath), links: links.length, errors: fileErrs })
}

// ─── Report ────────────────────────────────────────────────────────────────────

const totalLinks  = summary.reduce((s, f) => s + f.links, 0)
const totalErrors = errors.length

console.log(`\n${"─".repeat(64)}`)
console.log(`📊 Tổng kết: ${files.length} files · ${totalLinks} links · ${totalErrors} lỗi`)
console.log(`${"─".repeat(64)}`)

if (totalErrors > 0) {
  console.log(`\n❌ Danh sách lỗi:\n`)
  for (const e of errors) {
    console.log(`  📄 ${e.file}:${e.line}`)
    console.log(`     Link:   ${e.href}`)
    console.log(`     Lý do:  ${e.reason}\n`)
  }
}

if (totalErrors === 0) {
  console.log(`\n✅ Tất cả liên kết hợp lệ!\n`)
} else if (STRICT) {
  console.error(`\n🚨 Strict mode: Phát hiện ${totalErrors} lỗi liên kết. Dừng CI.\n`)
  process.exit(1)
} else {
  console.warn(`\n⚠️  Cảnh báo: Phát hiện ${totalErrors} lỗi. Dùng --strict để dừng CI.\n`)
}
