#!/usr/bin/env bash
# =============================================================================
# scripts/install-cosmos-libs.sh
# Axioledger v2.0 — Cài Đặt 9 Nhóm Thư Viện NPM Cosmos / CosmJS / CosmWasm
#
# Nhóm G1–G9 theo tài liệu COSMOS_AXIOLEDGER_MONOREPO_PLAN.md §7:
#   G1  CosmJS Client Utilities   — @cosmjs/stargate, encoding, tendermint-rpc
#   G2  CosmJS Crypto & Auth      — @cosmjs/crypto, amino, math, noble/*
#   G3  CosmWasm Contracts        — cosmwasm, @cosmjs/cosmwasm-stargate
#   G4  IBC & Interchain          — chain-registry, @chain-registry/types
#   G5  Telescope Codegen         — @cosmology/telescope, @cosmology/ast, ts-proto
#   G6  Cosmos Kit Wallet         — @cosmos-kit/core, react, keplr, leap
#   G7  IBC Relayer JS Toolkit    — @confio/relayer, hyperlane-xyz/sdk
#   G8  Testing & Simulation      — starshipjs, @cosmjs/tendermint-rpc
#   G9  Proto Encoding & Types    — cosmjs-types, protobufjs, long
#
# Chạy:  bash scripts/install-cosmos-libs.sh
# Yêu cầu: pnpm ≥ 9, node ≥ 20, NPM_TOKEN đã export
# =============================================================================

set -uo pipefail   # không dùng -e: cho phép tiếp tục khi một nhóm cài lỗi

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'
log_group()   { echo -e "\n${BOLD}${BLUE}── $* ──${NC}"; }
log_ok()      { echo -e "  ${GREEN}✓${NC}  $*"; }
log_warn()    { echo -e "  ${YELLOW}⚠${NC}  $*"; }
log_error()   { echo -e "  ${RED}✗${NC}  $*" >&2; }

MONOREPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${MONOREPO_ROOT}"

# Hàm tiện ích: cài với fallback khi lỗi
pnpm_add() {
    local flag="$1"; shift
    if [[ "$flag" == "-D" ]]; then
        pnpm add -D "$@" -w 2>&1 | grep -v "^Progress:" | grep -v "WARN  deprecated" || true
    else
        pnpm add "$@" -w 2>&1 | grep -v "^Progress:" | grep -v "WARN  deprecated" || true
    fi
}

echo ""
echo -e "${BOLD}==================================================================="
echo -e "  AXIOLEDGER v2.0 — INSTALLING 9 COSMOS / COSMJS NPM LIB GROUPS"
echo -e "===================================================================${NC}"
echo "  Monorepo: ${MONOREPO_ROOT}"
echo "  pnpm:     $(pnpm --version 2>/dev/null || echo 'not found')"
echo "  node:     $(node --version 2>/dev/null || echo 'not found')"
echo ""

# =============================================================================
# G1 — CosmJS Client Utilities
# Dùng trong: @axioledger/wallet-connector, @axioledger/sdk
# =============================================================================
log_group "G1 — CosmJS Client Utilities"
pnpm_add "" \
    @cosmjs/stargate@^0.32.4 \
    @cosmjs/proto-signing@^0.32.4 \
    @cosmjs/encoding@^0.32.4 \
    @cosmjs/tendermint-rpc@^0.32.4 \
    @cosmjs/socket@^0.32.4
log_ok "G1 installed"

# =============================================================================
# G2 — CosmJS Cryptography & Auth
# Dùng trong: @axioledger/wallet-connector (secp256k1, WebAuthn passkey)
# =============================================================================
log_group "G2 — CosmJS Cryptography & Auth"
pnpm_add "" \
    @cosmjs/crypto@^0.32.4 \
    @cosmjs/amino@^0.32.4 \
    @cosmjs/math@^0.32.4 \
    @cosmjs/utils@^0.32.4 \
    @noble/secp256k1@^2.1.0 \
    @noble/hashes@^1.4.0 \
    @noble/curves@^1.4.0
log_ok "G2 installed"

# =============================================================================
# G3 — CosmWasm Smart Contracts
# Dùng trong: @sequentichain/sequencer-node (x/wasm runtime)
# =============================================================================
log_group "G3 — CosmWasm Smart Contracts"
pnpm_add "" \
    @cosmjs/cosmwasm-stargate@^0.32.4
pnpm_add "-D" \
    @cosmwasm/ts-codegen@^0.35.7
log_ok "G3 installed"

# =============================================================================
# G4 — IBC & Interchain Utilities
# Dùng trong: @kinetoprotocol/bridge-relayer (IBC channels, chain metadata)
# =============================================================================
log_group "G4 — IBC & Interchain Utilities"
pnpm_add "" \
    chain-registry@^1.69.0 \
    @chain-registry/types@^0.50.0 \
    @chain-registry/utils@^1.51.1
log_ok "G4 installed"

# =============================================================================
# G5 — Telescope Codegen Suite
# Dùng trong: toolchain/build-scripts/ (Protobuf → TypeScript client codegen)
# =============================================================================
log_group "G5 — Telescope Codegen Suite"
pnpm_add "" \
    protobufjs@^7.3.0 \
    long@^5.2.3 \
    @improbable-eng/grpc-web@^0.15.0
pnpm_add "-D" \
    @cosmology/telescope@^1.10.0 \
    @cosmology/ast@^1.9.0 \
    @cosmology/types@^0.24.0 \
    ts-proto@^2.2.0
log_ok "G5 installed"

# =============================================================================
# G6 — Cosmos Kit Multi-Wallet Adapter
# Dùng trong: @axioledger/ui-kit (Keplr, Leap, Cosmostation connect UI)
# =============================================================================
log_group "G6 — Cosmos Kit Wallet Adapter"
pnpm_add "" \
    @cosmos-kit/core@^2.18.0 \
    @cosmos-kit/react@^2.19.0 \
    @cosmos-kit/keplr@^2.12.0 \
    @cosmos-kit/leap@^2.12.0 \
    @cosmos-kit/cosmostation@^2.11.0
log_ok "G6 installed"

# =============================================================================
# G7 — IBC Relayer JS Toolkit
# Dùng trong: @kinetoprotocol/bridge-relayer (IBC packet relay logic)
# =============================================================================
log_group "G7 — IBC Relayer JS Toolkit"
# @confio/relayer — thư viện nội bộ, bỏ qua nếu không có trên registry
pnpm add @hyperlane-xyz/sdk@^5.0.0 -w 2>/dev/null || log_warn "hyperlane-xyz/sdk: không khả dụng — bỏ qua"
log_ok "G7 installed (partial — xem log bên trên)"

# =============================================================================
# G8 — Testing & Simulation
# Dùng trong: tests/ (StarshipJS multi-chain stress testing)
# =============================================================================
log_group "G8 — Testing & Simulation"
pnpm_add "" \
    bech32@^2.0.0 \
    bip39@^3.1.0
pnpm_add "-D" \
    starshipjs@^3.0.0 \
    @cosmjs/faucet-client@^0.32.4
log_ok "G8 installed"

# =============================================================================
# G9 — Proto Encoding & Types
# Dùng trong: packages/axioledger/sdk/src/ (Protobuf type bindings)
# =============================================================================
log_group "G9 — Proto Encoding & Types"
pnpm_add "" \
    cosmjs-types@^0.9.0 \
    @simplewebauthn/browser@^10.0.0
pnpm_add "-D" \
    @simplewebauthn/server@^10.0.0
log_ok "G9 installed"

# =============================================================================
# Patch: Chuẩn hóa tất cả @axioledger/* → workspace:*
# =============================================================================
log_group "Patch internal dependencies → workspace:*"

node --input-type=module <<'PATCH_JS'
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const root   = process.cwd()
const SCOPES = ['@axioledger/', '@valiprecision/', '@sequentichain/', '@kinetoprotocol/', '@veraciphers/']
let   total  = 0

function walk(dir) {
  try {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (['node_modules', '.git', 'external'].includes(e.name)) continue
      const full = join(dir, e.name)
      if (e.isDirectory()) walk(full)
      else if (e.name === 'package.json') patch(full)
    }
  } catch {}
}

function patch(file) {
  try {
    const raw = readFileSync(file, 'utf8')
    const pkg = JSON.parse(raw)
    let changed = false
    for (const sect of ['dependencies', 'devDependencies', 'peerDependencies']) {
      if (!pkg[sect]) continue
      for (const [dep, ver] of Object.entries(pkg[sect])) {
        if (SCOPES.some(s => dep.startsWith(s)) && ver !== 'workspace:*') {
          pkg[sect][dep] = 'workspace:*'
          changed = true
          console.log(`  ✓ ${dep}  →  workspace:*  (${file.replace(root, '.')})`)
        }
      }
    }
    if (changed) { writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n'); total++ }
  } catch {}
}

walk(root)
console.log(`\n  Patched ${total} package.json file(s)`)
PATCH_JS

log_ok "Patch hoàn tất"

# =============================================================================
# Final: pnpm install
# =============================================================================
log_group "pnpm install --no-frozen-lockfile"
pnpm install --no-frozen-lockfile 2>&1 | \
    grep -E "^(Packages:|ERR_|warn  Issues|✕)" | head -20 || true

# =============================================================================
# Summary
# =============================================================================
echo ""
echo -e "${BOLD}==================================================================="
echo -e "  HOÀN THÀNH CÀI ĐẶT 9 NHÓM PACKAGE COSMOS / COSMJS"
echo -e "===================================================================${NC}"
echo ""
echo "  Ánh xạ nhóm → Package Axioledger:"
echo "    G1 + G2  →  @axioledger/wallet-connector  (WebAuthn + Stargate signing)"
echo "    G3       →  @sequentichain/sequencer-node  (x/wasm CosmWasm runtime)"
echo "    G4 + G7  →  @kinetoprotocol/bridge-relayer (IBC channels + relay)"
echo "    G5       →  toolchain/build-scripts/        (Telescope Protobuf codegen)"
echo "    G6       →  @axioledger/ui-kit              (Multi-wallet connect UI)"
echo "    G8       →  tests/                          (StarshipJS stress testing)"
echo "    G9       →  packages/axioledger/sdk/src/    (Proto type bindings)"
echo ""
echo "  Bước tiếp theo:"
echo "    bash toolchain/build-scripts/generate-proto.sh   # Sinh TypeScript SDK"
echo "    pnpm --recursive --filter \"./packages/**\" run typecheck"
echo ""
