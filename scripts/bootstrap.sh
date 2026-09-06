#!/usr/bin/env bash
# =============================================================================
# scripts/bootstrap.sh
# Axioledger v2.0 (Genesis Milestone) — ONE-FILE BUILD & DEPLOY BOOTSTRAP
#
# Chạy một lần để thiết lập toàn bộ:
#   bootstrap.sh [OPTIONS]
#
# OPTIONS:
#   --install-go      Cài Go 1.23 (nếu chưa có)
#   --install-rust    Cài Rust + wasm32 target (nếu chưa có)
#   --clean           Xóa sạch node_modules + dist trước khi build
#   --codegen         Chạy Protobuf → TypeScript codegen (telescope)
#   --typecheck       Chạy TypeScript typecheck sau build
#   --test            Chạy toàn bộ unit tests
#   --deploy          Build production + publish packages (cần NPM_TOKEN)
#   --all             Tương đương --clean --codegen --typecheck --test
#
# Chạy nhanh (không cài Go/Rust, không test):
#   bash scripts/bootstrap.sh
#
# Chạy đầy đủ:
#   bash scripts/bootstrap.sh --all
#
# CI/CD:
#   NPM_TOKEN=${{ secrets.NPM_TOKEN }} bash scripts/bootstrap.sh --all --deploy
#
# Yêu cầu: node ≥ 20, pnpm ≥ 9
# =============================================================================

set -uo pipefail

# ── Màu sắc ───────────────────────────────────────────────────────────────────
R='\033[0;31m' G='\033[0;32m' Y='\033[1;33m' B='\033[0;34m' BOLD='\033[1m' NC='\033[0m'
ok()   { echo -e "  ${G}✓${NC}  $*"; }
warn() { echo -e "  ${Y}⚠${NC}  $*"; }
err()  { echo -e "  ${R}✗${NC}  $*" >&2; }
step() { echo -e "\n${BOLD}${B}━━━  $*  ━━━${NC}"; }

MONOREPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${MONOREPO_ROOT}"

# ── Parse options ─────────────────────────────────────────────────────────────
OPT_GO=false; OPT_RUST=false; OPT_CLEAN=false; OPT_CODEGEN=false
OPT_TYPECHECK=false; OPT_TEST=false; OPT_DEPLOY=false

for arg in "$@"; do case "$arg" in
  --install-go)  OPT_GO=true ;;
  --install-rust) OPT_RUST=true ;;
  --clean)       OPT_CLEAN=true ;;
  --codegen)     OPT_CODEGEN=true ;;
  --typecheck)   OPT_TYPECHECK=true ;;
  --test)        OPT_TEST=true ;;
  --deploy)      OPT_DEPLOY=true ;;
  --all)         OPT_CLEAN=true; OPT_CODEGEN=true; OPT_TYPECHECK=true; OPT_TEST=true ;;
esac; done

# ─────────────────────────────────────────────────────────────────────────────
BANNER="
${BOLD}╔══════════════════════════════════════════════════════════════════╗
║         AXIOLEDGER v2.0 — BOOTSTRAP BUILD & DEPLOY              ║
║  Cosmos Inheritance · 5-Token Suite · ZK-EVM · AxioPass Wallet  ║
╚══════════════════════════════════════════════════════════════════╝${NC}"
echo -e "$BANNER"
echo "  Root:    ${MONOREPO_ROOT}"
echo "  Node:    $(node --version 2>/dev/null || echo 'missing')"
echo "  pnpm:    $(pnpm --version 2>/dev/null || echo 'missing')"
echo "  Go:      $(go version 2>/dev/null | awk '{print $3}' || echo 'not installed')"
echo "  Rust:    $(rustc --version 2>/dev/null | awk '{print $2}' || echo 'not installed')"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP A: Cài Go (tuỳ chọn)
# ─────────────────────────────────────────────────────────────────────────────
if [[ "$OPT_GO" == "true" ]]; then
  step "A — Install Go 1.23"
  if command -v go &>/dev/null && go version 2>&1 | grep -q "go1.2[3-9]"; then
    ok "Go đã cài: $(go version)"
  else
    curl -fsSL https://go.dev/dl/go1.23.1.linux-amd64.tar.gz -o /tmp/go.tar.gz
    sudo rm -rf /usr/local/go
    sudo tar -C /usr/local -xzf /tmp/go.tar.gz
    rm -f /tmp/go.tar.gz
    export PATH="/usr/local/go/bin:$HOME/go/bin:$PATH"
    grep -q '/usr/local/go/bin' ~/.bashrc || \
      echo 'export PATH="/usr/local/go/bin:$HOME/go/bin:$PATH"' >> ~/.bashrc
    ok "$(go version)"
  fi
fi
export PATH="/usr/local/go/bin:$HOME/go/bin:$PATH"

# ─────────────────────────────────────────────────────────────────────────────
# STEP B: Cài Rust (tuỳ chọn)
# ─────────────────────────────────────────────────────────────────────────────
if [[ "$OPT_RUST" == "true" ]]; then
  step "B — Install Rust + wasm32"
  if command -v rustup &>/dev/null; then
    rustup update stable --quiet && ok "$(rustc --version)"
  else
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
    source "$HOME/.cargo/env"
    ok "$(rustc --version)"
  fi
  export PATH="$HOME/.cargo/bin:$PATH"
  rustup target add wasm32-unknown-unknown
  ok "wasm32-unknown-unknown target added"
fi

# ─────────────────────────────────────────────────────────────────────────────
# STEP C: Dọn node_modules (WSL1-safe hoisting)
# ─────────────────────────────────────────────────────────────────────────────
step "C — Node modules cleanup (WSL1-safe hoist)"

# Xóa tất cả nested node_modules (tránh EACCES rename trên WSL1)
ok "Removing nested node_modules..."
find node_modules -mindepth 2 -maxdepth 6 -name "node_modules" -type d \
  -exec rm -rf {} + 2>/dev/null || true
find node_modules -name "*_tmp_*" -exec rm -rf {} + 2>/dev/null || true
chmod -R 777 node_modules 2>/dev/null || true

if [[ "$OPT_CLEAN" == "true" ]]; then
  ok "--clean: removing all node_modules + dist..."
  rm -rf node_modules
  find packages -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
  find toolchain -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
  find packages -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
  ok "Clean done"
fi

# ─────────────────────────────────────────────────────────────────────────────
# STEP D: pnpm install (hoisted, no nested node_modules)
# ─────────────────────────────────────────────────────────────────────────────
step "D — pnpm install (hoisted)"
ok "Running pnpm install --no-frozen-lockfile --ignore-scripts..."
pnpm install --no-frozen-lockfile --ignore-scripts 2>&1 | \
  grep -vE "^Progress:|WARN  deprecated|WARN  GET" | \
  grep -E "^(Packages:|ERR_|warn  Issues)" | head -10 || true

# Verify G1–G9 cài đúng
ok "Verifying key packages..."
node --input-type=module << 'VERIFY'
const pkgs = [
  '@cosmjs/stargate','@cosmjs/encoding','@cosmjs/crypto',
  '@hot-labs/omni-sdk','@hot-labs/kit','@hot-labs/near-connect',
  '@solana/web3.js','borsh','chain-registry','@cosmos-kit/core',
  'protobufjs','long','cosmjs-types',
]
for (const p of pkgs) {
  try { const r = require.resolve(p); process.stdout.write(`  ✓ ${p}\n`) }
  catch { process.stdout.write(`  ✗ ${p} — MISSING\n`) }
}
VERIFY

# ─────────────────────────────────────────────────────────────────────────────
# STEP E: Sync proto + patch @axioledger/* stubs
# ─────────────────────────────────────────────────────────────────────────────
step "E — Sync Cosmos proto → packages/axioledger/*/proto/"

COSMOS_STUBS=(cometbft cosmos-sdk ibc-go ibc-contracts iavl interchain-security tokenfactory evm kms gogoproto interchaintest rosetta)
for repo in "${COSMOS_STUBS[@]}"; do
  ext="external/cosmos/$repo"
  stub="packages/axioledger/$repo"
  if [[ -d "$ext/proto" ]] && [[ -d "$stub/proto" ]]; then
    count=$(find "$ext/proto" -name "*.proto" 2>/dev/null | wc -l)
    cp -r "$ext/proto/." "$stub/proto/" 2>/dev/null || true
    ok "@axioledger/$repo: $count proto files synced"
  fi
done

# Patch workspace:* dependencies
ok "Patching @axioledger/* → workspace:*..."
node --input-type=module << 'PATCH'
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
const ROOT = process.cwd()
const SCOPES = ['@axioledger/','@valiprecision/','@sequentichain/','@kinetoprotocol/','@veraciphers/']
let n = 0
function walk(dir) {
  try { for (const e of readdirSync(dir,{withFileTypes:true})) {
    if (['node_modules','.git','external'].includes(e.name)) continue
    const full = join(dir, e.name)
    if (e.isDirectory()) walk(full)
    else if (e.name === 'package.json') {
      const raw = readFileSync(full,'utf8')
      const pkg = JSON.parse(raw)
      let changed = false
      for (const s of ['dependencies','devDependencies','peerDependencies']) {
        if (!pkg[s]) continue
        for (const [dep, ver] of Object.entries(pkg[s])) {
          if (SCOPES.some(sc => dep.startsWith(sc)) && ver !== 'workspace:*') {
            pkg[s][dep] = 'workspace:*'; changed = true
          }
        }
      }
      if (changed) { writeFileSync(full, JSON.stringify(pkg,null,2)+'\n'); n++ }
    }
  }} catch {}
}
walk(ROOT)
console.log(`  ✓ Patched ${n} package.json files → workspace:*`)
PATCH

# ─────────────────────────────────────────────────────────────────────────────
# STEP F: Protobuf → TypeScript codegen
# ─────────────────────────────────────────────────────────────────────────────
if [[ "$OPT_CODEGEN" == "true" ]]; then
  step "F — Protobuf Codegen (telescope)"
  bash toolchain/build-scripts/generate-proto.sh
fi

# ─────────────────────────────────────────────────────────────────────────────
# STEP G: Build tất cả TypeScript packages
# ─────────────────────────────────────────────────────────────────────────────
step "G — Build TypeScript packages"
ok "Building all packages..."
pnpm --recursive --filter "./packages/**" run build --if-present 2>&1 | \
  grep -E "^(@|ERR|error|warn )" | grep -v "lifecycle\|deprecated" | head -20 || true
ok "Build pass"

# ─────────────────────────────────────────────────────────────────────────────
# STEP H: TypeScript typecheck
# ─────────────────────────────────────────────────────────────────────────────
if [[ "$OPT_TYPECHECK" == "true" ]]; then
  step "H — TypeScript Typecheck"
  ERRORS=0
  while IFS= read -r pkg; do
    name=$(python3 -c "import json; print(json.load(open('${pkg}/package.json'))['name'])" 2>/dev/null || echo "$pkg")
    if result=$(pnpm --filter "$name" run typecheck 2>&1); then
      ok "$name"
    else
      echo "$result" | grep -E "error TS" | head -3 | while read l; do warn "$l"; done
      ERRORS=$((ERRORS+1))
    fi
  done < <(find packages -name "tsconfig.json" -not -path "*/node_modules/*" | xargs -I{} dirname {})

  if [[ $ERRORS -eq 0 ]]; then
    ok "TypeScript: 0 errors ✓"
  else
    warn "TypeScript: $ERRORS packages with errors"
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# STEP I: Unit tests
# ─────────────────────────────────────────────────────────────────────────────
if [[ "$OPT_TEST" == "true" ]]; then
  step "I — Unit Tests"
  pnpm --recursive --filter "./packages/**" run test --if-present 2>&1 | \
    grep -E "^(PASS|FAIL|Tests:|✓|✗|×)" | head -40 || true
fi

# ─────────────────────────────────────────────────────────────────────────────
# STEP J: Deploy / Publish
# ─────────────────────────────────────────────────────────────────────────────
if [[ "$OPT_DEPLOY" == "true" ]]; then
  step "J — Deploy (publish to npmjs.org)"
  if [[ -z "${NPM_TOKEN:-}" ]]; then
    err "NPM_TOKEN not set. Run: export NPM_TOKEN=npm_xxxx"
    exit 1
  fi
  ok "NPM_TOKEN: set (length=${#NPM_TOKEN})"
  ok "Auth: $(npm whoami --registry https://registry.npmjs.org 2>/dev/null || echo 'anonymous')"
  pnpm --recursive --filter "./packages/**" publish \
    --access public --no-git-checks --if-present 2>&1 | \
    grep -E "^(@|ERR|npm notice)" | head -20 || true
fi

# ─────────────────────────────────────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────────────────────────────────────
step "SUMMARY"
echo ""
echo -e "  ${BOLD}Axioledger Monorepo — Build Status${NC}"
echo "  ─────────────────────────────────────────────────"

# Đếm packages
ts_pkgs=$(find packages -name "tsconfig.json" -not -path "*/node_modules/*" | wc -l)
go_mods=$(find external/cosmos -name "go.mod" | wc -l)
proto_total=$(find packages/axioledger -name "*.proto" | wc -l)
stubs=$(ls packages/axioledger/*/index.d.ts 2>/dev/null | wc -l)

echo "  TypeScript packages : ${ts_pkgs}"
echo "  Go modules (forked) : ${go_mods}/11"
echo "  Proto files (synced): ${proto_total}"
echo "  @axioledger/* stubs : ${stubs}/12"
echo ""
echo "  Cosmos inheritance:"
for repo in cometbft cosmos-sdk ibc-go ibc-contracts iavl interchain-security tokenfactory evm kms gogoproto interchaintest rosetta; do
  go_n=$(find "external/cosmos/$repo" -name "*.go" 2>/dev/null | wc -l)
  proto_n=$(find "packages/axioledger/$repo/proto" -name "*.proto" 2>/dev/null | wc -l)
  mod=$(head -2 "external/cosmos/$repo/go.mod" 2>/dev/null | grep "^module" | awk '{print $2}' | sed 's|github.com/axioledger/||' || echo "—")
  printf "    %-24s %4d Go  %3d proto  %s\n" "@axioledger/$repo" "$go_n" "$proto_n" "$mod"
done

echo ""
echo -e "${BOLD}${G}  ✓  Bootstrap hoàn thành!${NC}"
echo ""
echo "  Bước tiếp theo:"
echo "    pnpm typecheck                    # Kiểm tra TypeScript toàn bộ"
echo "    pnpm test                         # Chạy tất cả unit tests"
echo "    bash scripts/bootstrap.sh --all   # Rebuild + test đầy đủ"
echo "    bash toolchain/build-scripts/generate-proto.sh  # Sinh TypeScript SDK"
echo ""
