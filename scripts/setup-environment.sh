#!/usr/bin/env bash
# =============================================================================
# scripts/setup-environment.sh
# Axioledger v2.0 (Genesis Milestone) — Automated Environment Provisioning
#
# Cài đặt toàn bộ toolchain cần thiết cho Axioledger Monorepo:
#   [1] System build utilities (apt)
#   [2] protoc + protoc-gen-go-grpc
#   [3] Go 1.23 + protoc-gen-gocosmos
#   [4] Rust stable + wasm32 target
#   [5] Node.js 20 + pnpm 9
#   [6] Kiểm tra phiên bản sau khi cài đặt
#
# Chạy: bash scripts/setup-environment.sh
# Yêu cầu: Ubuntu 20.04+ / Debian 11+ / WSL2
# =============================================================================

set -euo pipefail

# ── Màu sắc ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'
log_step()    { echo -e "\n${BOLD}${BLUE}==> [$1/$TOTAL_STEPS] $2${NC}"; }
log_ok()      { echo -e "    ${GREEN}✓${NC}  $*"; }
log_warn()    { echo -e "    ${YELLOW}⚠${NC}  $*"; }
log_skip()    { echo -e "    ${YELLOW}↷${NC}  $* (bỏ qua — đã cài)"; }
log_error()   { echo -e "    ${RED}✗${NC}  $*" >&2; }

TOTAL_STEPS=6
MONOREPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${MONOREPO_ROOT}"

echo ""
echo -e "${BOLD}==================================================================="
echo -e "  AXIOLEDGER v2.0 — AUTOMATED ENVIRONMENT PROVISIONING SCRIPT"
echo -e "===================================================================${NC}"
echo -e "  Monorepo: ${MONOREPO_ROOT}"
echo -e "  Distro:   $(lsb_release -ds 2>/dev/null || cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2 | tr -d '"')"
echo -e "  Arch:     $(uname -m)"
echo ""

# ─── Bước 1: System dependencies ─────────────────────────────────────────────
log_step 1 "Cài đặt system build utilities"
sudo apt-get update -qq
sudo apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    wget \
    git \
    jq \
    pkg-config \
    libssl-dev \
    cmake \
    unzip \
    clang \
    llvm \
    ca-certificates \
    gnupg \
    lsb-release
log_ok "System utilities đã cài đặt"

# ─── Bước 2: Protocol Buffers Compiler ───────────────────────────────────────
log_step 2 "Cài đặt protoc compiler + grpc plugins"

PROTOC_VERSION="27.2"
PROTOC_ZIP="protoc-${PROTOC_VERSION}-linux-x86_64.zip"

if command -v protoc &>/dev/null && protoc --version 2>&1 | grep -q "27"; then
    log_skip "protoc $(protoc --version)"
else
    log_ok "Tải protoc v${PROTOC_VERSION}..."
    curl -fsSL "https://github.com/protocolbuffers/protobuf/releases/download/v${PROTOC_VERSION}/${PROTOC_ZIP}" \
         -o "/tmp/${PROTOC_ZIP}"
    sudo unzip -o "/tmp/${PROTOC_ZIP}" -d /usr/local bin/protoc     >/dev/null
    sudo unzip -o "/tmp/${PROTOC_ZIP}" -d /usr/local 'include/*'    >/dev/null
    sudo chmod +x /usr/local/bin/protoc
    rm -f "/tmp/${PROTOC_ZIP}"
    log_ok "protoc $(protoc --version) đã cài đặt"
fi

# protoc-gen-go-grpc (cần Go — cài sau bước 3)
# Đặt biến để bước 3 tự cài
INSTALL_PROTO_GEN_GO=true

# ─── Bước 3: Go 1.23 ─────────────────────────────────────────────────────────
log_step 3 "Cài đặt Go 1.23 + protoc-gen-gocosmos"

GO_VERSION="1.23.1"
GO_TARBALL="go${GO_VERSION}.linux-amd64.tar.gz"
GO_INSTALL_DIR="/usr/local/go"

if command -v go &>/dev/null && go version 2>&1 | grep -q "go1.23"; then
    log_skip "$(go version)"
else
    log_ok "Tải Go ${GO_VERSION}..."
    curl -fsSL "https://go.dev/dl/${GO_TARBALL}" -o "/tmp/${GO_TARBALL}"
    sudo rm -rf "${GO_INSTALL_DIR}"
    sudo tar -C /usr/local -xzf "/tmp/${GO_TARBALL}"
    rm -f "/tmp/${GO_TARBALL}"
    log_ok "Go ${GO_VERSION} đã giải nén vào ${GO_INSTALL_DIR}"
fi

# Thêm vào PATH ngay trong session hiện tại
export PATH="/usr/local/go/bin:${HOME}/go/bin:${PATH}"

# Thêm vĩnh viễn vào ~/.bashrc nếu chưa có
if ! grep -q '/usr/local/go/bin' ~/.bashrc 2>/dev/null; then
    cat >> ~/.bashrc <<'GOPATH'

# ── Go toolchain (Axioledger setup) ──────────────────────────────────────────
export PATH="/usr/local/go/bin:${HOME}/go/bin:${PATH}"
GOPATH
    log_ok "Đã thêm Go PATH vào ~/.bashrc"
fi

log_ok "$(go version)"

# Cài protoc-gen-go-grpc và gocosmos sau khi Go có mặt
log_ok "Cài đặt protoc-gen-gocosmos (Cosmos-optimized protobuf generator)..."
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest          2>/dev/null || log_warn "protoc-gen-go: bỏ qua"
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest         2>/dev/null || log_warn "protoc-gen-go-grpc: bỏ qua"
go install github.com/cosmos/gogoproto/protoc-gen-gocosmos@latest        2>/dev/null || log_warn "protoc-gen-gocosmos: bỏ qua (cần go.work sync)"
log_ok "Protoc Go plugins đã cài vào ${HOME}/go/bin"

# ─── Bước 4: Rust + wasm32 ───────────────────────────────────────────────────
log_step 4 "Cài đặt Rust stable + wasm32-unknown-unknown target"

if command -v rustup &>/dev/null; then
    log_ok "rustup đã có — cập nhật stable..."
    rustup update stable --quiet
else
    log_ok "Cài đặt rustup + Rust stable..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
         | sh -s -- -y --default-toolchain stable --no-modify-path
    # Thêm cargo bin vào PATH ngay
    source "${HOME}/.cargo/env"
fi

# Đảm bảo cargo trong PATH
[[ -f "${HOME}/.cargo/env" ]] && source "${HOME}/.cargo/env"
export PATH="${HOME}/.cargo/bin:${PATH}"

# wasm32 target cho CosmWasm smart contracts
rustup target add wasm32-unknown-unknown
log_ok "$(rustc --version)"
log_ok "Target wasm32-unknown-unknown: đã cài"

# cargo-generate và wasm-pack (tùy chọn, tiếp tục nếu thất bại)
cargo install cargo-generate  2>/dev/null || log_warn "cargo-generate: bỏ qua"
cargo install wasm-pack        2>/dev/null || log_warn "wasm-pack: bỏ qua"
log_ok "Rust toolchain hoàn tất"

# ─── Bước 5: Node.js 20 + pnpm 9 ────────────────────────────────────────────
log_step 5 "Cài đặt Node.js 20 + pnpm 9"

# Node.js
if command -v node &>/dev/null && node --version 2>&1 | grep -qE "^v2[0-9]"; then
    log_skip "Node.js $(node --version)"
else
    log_ok "Cài đặt Node.js 20.x từ NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - >/dev/null
    sudo apt-get install -y nodejs
    log_ok "Node.js $(node --version) đã cài đặt"
fi

# pnpm
if command -v pnpm &>/dev/null && pnpm --version 2>&1 | grep -qE "^9"; then
    log_skip "pnpm $(pnpm --version)"
else
    log_ok "Cài đặt pnpm 9 (global)..."
    sudo npm install -g pnpm@9 --quiet
    log_ok "pnpm $(pnpm --version) đã cài đặt"
fi

# ─── Bước 6: Kiểm tra phiên bản sau cài đặt ─────────────────────────────────
log_step 6 "Kiểm tra toàn bộ toolchain"

echo ""
echo -e "  ${BOLD}Toolchain versions:${NC}"

declare -A CHECKS=(
    ["Go"]="go version"
    ["Node.js"]="node --version"
    ["pnpm"]="pnpm --version"
    ["Rust"]="rustc --version"
    ["Cargo"]="cargo --version"
    ["protoc"]="protoc --version"
)

ALL_OK=true
for name in Go Node.js pnpm Rust Cargo protoc; do
    cmd="${CHECKS[$name]}"
    if result=$(eval "$cmd" 2>&1); then
        log_ok "$(printf '%-10s' "${name}:") ${result}"
    else
        log_warn "$(printf '%-10s' "${name}:") KHÔNG TÌM THẤY — kiểm tra lại PATH"
        ALL_OK=false
    fi
done

# ─── Tổng kết ─────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}===================================================================${NC}"
if [[ "$ALL_OK" == "true" ]]; then
    echo -e "${GREEN}  ✓  MÔI TRƯỜNG ĐÃ ĐƯỢC THIẾT LẬP THÀNH CÔNG — Axioledger v2.0${NC}"
else
    echo -e "${YELLOW}  ⚠  MÔI TRƯỜNG THIẾT LẬP XONG (một số tool cần kiểm tra lại PATH)${NC}"
fi
echo -e "${BOLD}===================================================================${NC}"
echo ""
echo "  Bước tiếp theo:"
echo "    1. source ~/.bashrc                         # Nạp PATH mới"
echo "    2. bash scripts/fork-cosmos-cores.sh        # Fork 12 Cosmos repos"
echo "    3. bash scripts/install-cosmos-libs.sh      # Cài 9 nhóm NPM G1–G9"
echo "    4. bash toolchain/build-scripts/generate-proto.sh  # Protobuf codegen"
echo ""
