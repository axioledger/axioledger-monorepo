#!/usr/bin/env bash
# =============================================================================
# scripts/migrate-cosmos-cores.sh
# Axioledger — Kịch Bản Kế Thừa & Chuyển Đổi Namespace 12 Cosmos Core Repos
#
# Chức năng:
#   1. Clone shallow 12 repository từ github.com/cosmos/*
#   2. Xóa .git gốc, khởi tạo git mới → remote axioledger/*
#   3. Thay thế namespace github.com/cosmos → github.com/axioledger
#   4. Tạo/cập nhật package.json với scope @axioledger/*
#   5. Commit genesis cho từng repo
#   6. Inline Node.js: patch tất cả package.json trong workspace → workspace:*
#   7. pnpm install --no-frozen-lockfile
#
# Chạy:
#   chmod +x scripts/migrate-cosmos-cores.sh
#   ./scripts/migrate-cosmos-cores.sh
#
# Yêu cầu: git, node ≥ 20, pnpm ≥ 9
# =============================================================================

set -euo pipefail

# ─── Màu sắc cho output ───────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
log_success() { echo -e "${GREEN}[OK]${NC}    $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }

# ─── Hằng số ─────────────────────────────────────────────────────────────────
OLD_ORG="cosmos"
NEW_ORG="axioledger"
TARGET_DIR="packages/axioledger"
VERSION="2.0.22"
MONOREPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# ─── 12 Repositories cần kế thừa ──────────────────────────────────────────────
declare -a REPOS=(
  "cosmos-sdk"
  "ibc-go"
  "ibc"
  "ibc-contracts"
  "iavl"
  "interchain-security"
  "tokenfactory"
  "evm"
  "kms"
  "gogoproto"
  "interchaintest"
  "rosetta"
)

# ─── Go modules (cần thay thế namespace trong .go, go.mod, go.sum, .proto) ───
declare -a GO_REPOS=(
  "cosmos-sdk"
  "ibc-go"
  "ibc"
  "iavl"
  "interchain-security"
  "tokenfactory"
  "evm"
  "gogoproto"
  "interchaintest"
  "rosetta"
)

# ─── Kiểm tra dependencies ───────────────────────────────────────────────────
check_dependencies() {
  local deps=("git" "node" "pnpm")
  for dep in "${deps[@]}"; do
    if ! command -v "$dep" &>/dev/null; then
      log_error "Thiếu dependency: $dep. Vui lòng cài đặt trước khi tiếp tục."
      exit 1
    fi
  done
  log_success "Tất cả dependencies đã sẵn sàng (git, node, pnpm)"
}

# ─── Hàm thay thế namespace ───────────────────────────────────────────────────
replace_namespace() {
  local repo_dir="$1"
  local repo_name="$2"
  local old_path="github.com/${OLD_ORG}/${repo_name}"
  local new_path="github.com/${NEW_ORG}/${repo_name}"

  log_info "  Thay thế namespace: ${old_path} → ${new_path}"

  # Thay thế trong các file Go và liên quan
  local extensions=("*.go" "go.mod" "go.sum" "*.proto" "*.md" "*.yaml" "*.yml")
  for ext in "${extensions[@]}"; do
    find "${repo_dir}" -name "${ext}" -type f 2>/dev/null | while read -r file; do
      sed -i "s|${old_path}|${new_path}|g" "$file"
    done
  done

  # Thay thế tổng quát hơn: github.com/cosmos/ → github.com/axioledger/
  find "${repo_dir}" \( -name "*.go" -o -name "go.mod" -o -name "*.proto" \) -type f \
    -exec sed -i "s|github.com/${OLD_ORG}/|github.com/${NEW_ORG}/|g" {} \;
}

# ─── Hàm tạo package.json chuẩn cho workspace ────────────────────────────────
create_package_json() {
  local repo_dir="$1"
  local repo_name="$2"
  local pkg_file="${repo_dir}/package.json"

  cat > "$pkg_file" <<EOF
{
  "name": "@axioledger/${repo_name}",
  "version": "${VERSION}",
  "private": true,
  "description": "Axioledger — Kế thừa từ cosmos/${repo_name}. Namespace: github.com/axioledger/${repo_name}",
  "main": "index.js",
  "types": "index.d.ts",
  "files": ["index.js", "index.d.ts", "proto", "types"],
  "scripts": {
    "build": "echo 'Go/Rust module — build qua go build ./... hoặc cargo build'",
    "test":  "echo 'Go/Rust module — test qua go test ./... hoặc cargo test'"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/axioledger/${repo_name}.git"
  },
  "keywords": ["axioledger", "cosmos", "${repo_name}", "blockchain", "interchain"],
  "license": "Apache-2.0"
}
EOF
  log_success "  Đã tạo package.json: @axioledger/${repo_name}@${VERSION}"
}

# ─── Vòng lặp chính ───────────────────────────────────────────────────────────
cd "${MONOREPO_ROOT}"
mkdir -p "${TARGET_DIR}"

log_info "=== Bắt đầu kế thừa ${#REPOS[@]} repositories từ @cosmos ==="
echo ""

for REPO in "${REPOS[@]}"; do
  DEST_DIR="${TARGET_DIR}/${REPO}"
  CLONE_URL="https://github.com/${OLD_ORG}/${REPO}.git"

  echo "────────────────────────────────────────────────"
  log_info "Đang xử lý: ${REPO}"

  # Bước 1 — Clone shallow nếu chưa có
  if [[ -d "${DEST_DIR}" ]]; then
    log_warn "  Thư mục ${DEST_DIR} đã tồn tại. Bỏ qua clone."
  else
    log_info "  Clone: ${CLONE_URL} → ${DEST_DIR}"
    if ! git clone --depth 1 "${CLONE_URL}" "${DEST_DIR}" 2>/dev/null; then
      log_warn "  Không thể clone ${REPO} (repo có thể chưa tồn tại). Tạo thư mục rỗng."
      mkdir -p "${DEST_DIR}"
    fi
  fi

  # Bước 2 — Xóa .git gốc, khởi tạo git mới
  if [[ -d "${DEST_DIR}/.git" ]]; then
    rm -rf "${DEST_DIR}/.git"
    log_info "  Đã xóa .git gốc"
  fi
  cd "${DEST_DIR}"
  git init -q
  git remote add origin "https://github.com/${NEW_ORG}/${REPO}.git"
  log_success "  Git mới khởi tạo → remote: github.com/${NEW_ORG}/${REPO}"

  # Bước 3 — Thay thế namespace (chỉ với Go repos)
  if printf '%s\n' "${GO_REPOS[@]}" | grep -q "^${REPO}$"; then
    replace_namespace "." "${REPO}"
  fi

  # Bước 4 — Tạo/cập nhật package.json
  create_package_json "." "${REPO}"

  # Bước 5 — Commit genesis
  git add -A
  git commit -q -m "feat: genesis — axioledger fork from cosmos/${REPO} @ v${VERSION}

- Namespace: github.com/cosmos/${REPO} → github.com/axioledger/${REPO}
- NPM scope: @axioledger/${REPO}@${VERSION}
- Tích hợp vào Axioledger Monorepo (pnpm workspace:*)" \
    --allow-empty
  log_success "  Đã commit genesis cho ${REPO}"

  cd "${MONOREPO_ROOT}"
  echo ""
done

# ─── Bước 6 — Patch tất cả package.json trong workspace → workspace:* ────────
log_info "=== Bước 6: Patch dependencies @axioledger/* → workspace:* ==="

node --input-type=module <<'NODEJS_PATCH'
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, resolve } from 'path'

const root    = process.cwd()
const scope   = '@axioledger/'
let patched   = 0

function findPackageJsonFiles(dir) {
  const results = []
  try {
    for (const entry of readdirSync(dir)) {
      if (entry === 'node_modules' || entry === '.git') continue
      const full = join(dir, entry)
      const st   = statSync(full)
      if (st.isDirectory()) {
        results.push(...findPackageJsonFiles(full))
      } else if (entry === 'package.json') {
        results.push(full)
      }
    }
  } catch {}
  return results
}

const files = findPackageJsonFiles(root)

for (const file of files) {
  try {
    const raw  = readFileSync(file, 'utf8')
    const pkg  = JSON.parse(raw)
    let changed = false

    for (const section of ['dependencies', 'devDependencies', 'peerDependencies']) {
      if (!pkg[section]) continue
      for (const [dep, ver] of Object.entries(pkg[section])) {
        if (dep.startsWith(scope) && ver !== 'workspace:*') {
          pkg[section][dep] = 'workspace:*'
          changed = true
          console.log(`  Patched: ${dep} in ${file.replace(root, '')}`)
        }
      }
    }

    if (changed) {
      writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n')
      patched++
    }
  } catch {}
}

console.log(`\nĐã patch ${patched} file(s) → workspace:*`)
NODEJS_PATCH

# ─── Bước 7 — pnpm install ────────────────────────────────────────────────────
log_info "=== Bước 7: pnpm install --no-frozen-lockfile ==="
pnpm install --no-frozen-lockfile

echo ""
log_success "=== Hoàn thành kế thừa ${#REPOS[@]} repos từ @cosmos → @axioledger ==="
echo ""
echo "Các bước tiếp theo:"
echo "  1. go work sync                          — Đồng bộ Go workspace"
echo "  2. go vet ./packages/axioledger/...     — Kiểm tra cú pháp Go"
echo "  3. pnpm --recursive run build            — Build toàn bộ TypeScript packages"
echo "  4. ./scripts/install-cosmos-libs.sh     — Cài đặt CosmJS + Cosmos Kit"
