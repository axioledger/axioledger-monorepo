#!/usr/bin/env bash
# =============================================================================
# scripts/fork-cosmos-cores.sh
# Axioledger — Fork & Kế Thừa 12 Cosmos Core Repos vào external/cosmos/
#
# Chiến lược (WSL1-safe, không dùng atomic rename):
#   1. Clone shallow từ github.com/cosmos/* vào external/cosmos/
#   2. Xóa .git gốc → khởi tạo git mới với remote axioledger/*
#   3. Patch namespace github.com/cosmos → github.com/axioledger
#   4. Tạo package.json @axioledger/* cho workspace recognition
#   5. Genesis commit cho từng repo
#   6. Tạo packages/axioledger/* stubs (Go modules → workspace:*)
#   7. Patch toàn bộ @axioledger/* deps → workspace:*
#
# Chạy: bash scripts/fork-cosmos-cores.sh
# Yêu cầu: git, node ≥ 20, pnpm ≥ 9
# =============================================================================

set -uo pipefail   # -e removed: cho phép tiếp tục khi một repo lỗi

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log_info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
log_ok()      { echo -e "${GREEN}[ OK ]${NC}  $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error()   { echo -e "${RED}[ERR ]${NC}  $*" >&2; }
log_section() { echo -e "\n${BLUE}══════════════════════════════════════════════${NC}"; echo -e "${BLUE}  $*${NC}"; echo -e "${BLUE}══════════════════════════════════════════════${NC}"; }

MONOREPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="2.0.22"
OLD_ORG="cosmos"
NEW_ORG="axioledger"
EXTERNAL_DIR="${MONOREPO_ROOT}/external/cosmos"
PACKAGES_DIR="${MONOREPO_ROOT}/packages/axioledger"

cd "${MONOREPO_ROOT}"

# ─── Danh sách repos ──────────────────────────────────────────────────────────
declare -A REPO_DESC=(
  ["cometbft"]="CometBFT consensus engine (fork of Tendermint)"
  ["cosmos-sdk"]="Core state machine: auth, bank, gov, staking modules"
  ["ibc-go"]="Inter-Blockchain Communication protocol (Go)"
  ["ibc-contracts"]="IBC v2 smart contracts (Solidity / CosmWasm)"
  ["iavl"]="Immutable AVL+ Merkle tree for state storage"
  ["interchain-security"]="Shared validator security model for \$VPX"
  ["tokenfactory"]="5-Token Suite lifecycle management"
  ["evm"]="EVM compatibility layer for ZK-EVM bridge"
  ["kms"]="Key Management Service (HSM / Enclave)"
  ["gogoproto"]="High-performance Protobuf library"
  ["interchaintest"]="E2E multi-chain testing framework"
  ["rosetta"]="Rosetta API for exchange integrations"
)

# Repos trong external/cosmos/ (full Go source)
EXTERNAL_REPOS=("cometbft" "cosmos-sdk" "ibc-go" "ibc-contracts" "iavl" "interchain-security" "tokenfactory" "evm" "kms" "gogoproto" "interchaintest" "rosetta")

# Repos cần patch namespace Go
GO_REPOS=("cometbft" "cosmos-sdk" "ibc-go" "iavl" "interchain-security" "tokenfactory" "evm" "gogoproto" "interchaintest" "rosetta")

# ─── Hàm: patch namespace ─────────────────────────────────────────────────────
patch_namespace() {
  local dir="$1"
  local repo="$2"
  log_info "  Patch namespace: github.com/${OLD_ORG}/${repo} → github.com/${NEW_ORG}/${repo}"
  find "${dir}" \
    \( -name "*.go" -o -name "go.mod" -o -name "go.sum" -o -name "*.proto" -o -name "*.md" \) \
    -type f \
    -exec sed -i "s|github\.com/${OLD_ORG}/|github\.com/${NEW_ORG}/|g" {} \; 2>/dev/null || true
}

# ─── Hàm: tạo package.json ────────────────────────────────────────────────────
make_package_json() {
  local dir="$1"
  local name="$2"
  local desc="${3:-Axioledger fork}"
  cat > "${dir}/package.json" <<PKGJSON
{
  "name": "@axioledger/${name}",
  "version": "${VERSION}",
  "private": true,
  "description": "${desc}",
  "main": "index.js",
  "types": "index.d.ts",
  "files": ["index.js", "index.d.ts", "proto", "types"],
  "scripts": {
    "build": "echo 'Go/Rust module — go build ./... hoặc cargo build'",
    "test":  "echo 'Go/Rust module — go test ./... hoặc cargo test'"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/${NEW_ORG}/${name}.git"
  },
  "keywords": ["axioledger", "cosmos", "${name}", "blockchain", "interchain"],
  "license": "Apache-2.0"
}
PKGJSON
}

# ─── Hàm: tạo index stubs ─────────────────────────────────────────────────────
make_index_stubs() {
  local dir="$1"
  local name="$2"
  # index.js stub
  cat > "${dir}/index.js" <<INDEXJS
// @axioledger/${name} — Go/Rust module
// TypeScript bindings generated via: pnpm run build (Telescope / ts-proto)
// Source: external/cosmos/${name}/
module.exports = {}
INDEXJS
  # index.d.ts stub
  cat > "${dir}/index.d.ts" <<INDEXDTS
// @axioledger/${name} — Type declarations
// Generated from: external/cosmos/${name}/proto/
export {}
INDEXDTS
}

# ─── STEP 1: Clone external/cosmos/* ──────────────────────────────────────────
log_section "STEP 1 — Clone 12 Cosmos Core Repos → external/cosmos/"
mkdir -p "${EXTERNAL_DIR}"

CLONED=0; SKIPPED=0; FAILED=0

for REPO in "${EXTERNAL_REPOS[@]}"; do
  DEST="${EXTERNAL_DIR}/${REPO}"
  CLONE_URL="https://github.com/${OLD_ORG}/${REPO}.git"

  echo ""
  log_info "── ${REPO} ──────────────────────────────────────"

  if [[ -d "${DEST}" && -n "$(ls -A "${DEST}" 2>/dev/null)" ]]; then
    log_warn "  Đã tồn tại: ${DEST} — bỏ qua clone."
    SKIPPED=$((SKIPPED+1))
  else
    mkdir -p "${DEST}"
    log_info "  Clone: ${CLONE_URL}"
    if git clone --depth 1 --single-branch "${CLONE_URL}" "${DEST}" 2>&1 | tail -3; then
      log_ok "  Clone thành công: ${REPO}"
      CLONED=$((CLONED+1))
    else
      log_warn "  Clone thất bại (repo có thể chưa public). Tạo cấu trúc rỗng."
      mkdir -p "${DEST}/proto" "${DEST}/types"
      FAILED=$((FAILED+1))
    fi
  fi

  # Xóa .git gốc (nếu có)
  if [[ -d "${DEST}/.git" ]]; then
    rm -rf "${DEST}/.git"
    log_info "  Đã tách khỏi upstream git"
  fi

  # Khởi tạo git mới với remote @axioledger
  cd "${DEST}"
  git init -q 2>/dev/null || true
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/${NEW_ORG}/${REPO}.git"
  log_ok "  Git remote → github.com/${NEW_ORG}/${REPO}"

  # Patch namespace (chỉ Go repos)
  if printf '%s\n' "${GO_REPOS[@]}" | grep -qx "${REPO}"; then
    patch_namespace "." "${REPO}"
  fi

  # Tạo/cập nhật package.json
  make_package_json "." "${REPO}" "${REPO_DESC[${REPO}]:-Axioledger fork of cosmos/${REPO}}"
  make_index_stubs  "." "${REPO}"

  # Genesis commit
  git add -A 2>/dev/null || true
  git -c user.email="forge@axioledger.io" -c user.name="Axioledger Forge" \
    commit -q -m "feat(genesis): fork cosmos/${REPO} → axioledger/${REPO} v${VERSION}

- Namespace: github.com/cosmos/${REPO} → github.com/axioledger/${REPO}
- NPM: @axioledger/${REPO}@${VERSION}
- Workspace: pnpm workspace:*
- Integrated into Axioledger Monorepo" \
    --allow-empty 2>/dev/null || true
  log_ok "  Genesis commit ✓"

  cd "${MONOREPO_ROOT}"
done

echo ""
log_ok "Clone summary: ${CLONED} cloned, ${SKIPPED} skipped, ${FAILED} failed (empty stubs created)"

# ─── STEP 2: Tạo packages/axioledger/* stubs ──────────────────────────────────
log_section "STEP 2 — Tạo packages/axioledger/* workspace stubs"

for REPO in "${EXTERNAL_REPOS[@]}"; do
  STUB_DIR="${PACKAGES_DIR}/${REPO}"
  if [[ -d "${STUB_DIR}" ]]; then
    log_warn "  ${STUB_DIR} đã tồn tại — bỏ qua."
    continue
  fi
  mkdir -p "${STUB_DIR}/proto" "${STUB_DIR}/types"
  make_package_json "${STUB_DIR}" "${REPO}" "${REPO_DESC[${REPO}]:-Axioledger @${REPO}}"
  make_index_stubs  "${STUB_DIR}" "${REPO}"
  log_ok "  Tạo stub: packages/axioledger/${REPO}"
done

# ─── STEP 3: Patch tất cả @axioledger/* deps → workspace:* ────────────────────
log_section "STEP 3 — Patch @axioledger/* dependencies → workspace:*"

node --input-type=module <<'NODEJS'
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const root    = process.cwd()
const SCOPES  = ['@axioledger/', '@valiprecision/', '@sequentichain/', '@kinetoprotocol/', '@veraciphers/']
let patched   = 0

function walk(dir) {
  const results = []
  try {
    for (const e of readdirSync(dir)) {
      if (['node_modules','.git','external'].includes(e)) continue
      const full = join(dir, e)
      const st = statSync(full)
      if (st.isDirectory())       results.push(...walk(full))
      else if (e === 'package.json') results.push(full)
    }
  } catch {}
  return results
}

for (const file of walk(root)) {
  try {
    const raw = readFileSync(file, 'utf8')
    const pkg = JSON.parse(raw)
    let changed = false

    for (const sect of ['dependencies','devDependencies','peerDependencies']) {
      if (!pkg[sect]) continue
      for (const [dep, ver] of Object.entries(pkg[sect])) {
        if (SCOPES.some(s => dep.startsWith(s)) && ver !== 'workspace:*') {
          pkg[sect][dep] = 'workspace:*'
          changed = true
          console.log(`  ✓ Patched ${dep}  in  ${file.replace(root,'.')}`)
        }
      }
    }
    if (changed) {
      writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n')
      patched++
    }
  } catch {}
}
console.log(`\nTotal patched: ${patched} package.json files`)
NODEJS

# ─── STEP 4: Cập nhật pnpm-workspace.yaml ─────────────────────────────────────
log_section "STEP 4 — Cập nhật pnpm-workspace.yaml"

cat > "${MONOREPO_ROOT}/pnpm-workspace.yaml" <<WORKSPACE
packages:
  - "."
  - "apps/*"
  - "packages/**"
  - "packages/axioledger/*"
  - "packages/valiprecision/*"
  - "packages/sequentichain/*"
  - "packages/kinetoprotocol/*"
  - "packages/veraciphers/*"
  - "external/cosmos/*"
  - "toolchain/*"
WORKSPACE
log_ok "pnpm-workspace.yaml đã cập nhật (bao gồm external/cosmos/*)"

# ─── STEP 5: Cập nhật go.work ─────────────────────────────────────────────────
log_section "STEP 5 — Cập nhật go.work"

# Kiểm tra go.mod tồn tại trong external repos
GO_WORK_USES=""
for REPO in cometbft cosmos-sdk ibc-go iavl interchain-security tokenfactory evm gogoproto interchaintest rosetta; do
  DEST="${EXTERNAL_DIR}/${REPO}"
  if [[ -f "${DEST}/go.mod" ]]; then
    GO_WORK_USES="${GO_WORK_USES}    ./external/cosmos/${REPO}\n"
  fi
done

cat > "${MONOREPO_ROOT}/go.work" <<GOWORK
go 1.23.0

use (
$(printf "${GO_WORK_USES}")    ./packages/axioledger/cosmos-sdk
)
GOWORK
log_ok "go.work đã cập nhật"

# ─── SUMMARY ──────────────────────────────────────────────────────────────────
log_section "HOÀN THÀNH"
echo ""
echo "  external/cosmos/   — ${#EXTERNAL_REPOS[@]} repos (Go/Rust source)"
echo "  packages/axioledger/ — Stubs + package.json đã tạo"
echo ""
echo "Bước tiếp theo:"
echo "  1. pnpm install --no-frozen-lockfile"
echo "  2. bash scripts/install-cosmos-libs.sh    # CosmJS + Cosmos Kit"
echo "  3. bash toolchain/build-scripts/generate-proto.sh  # Protobuf codegen"
echo ""
