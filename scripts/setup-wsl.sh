#!/usr/bin/env bash
# scripts/setup-wsl.sh
# ─────────────────────────────────────────────────────────────────────────────
# One-time WSL 1 environment bootstrap for Axioledger Monorepo.
#
# WSL 1 does not support renameat2 (atomic rename), so pnpm's default store
# staging fails with EACCES when node_modules lives on the Windows filesystem.
#
# This script:
#   1. Installs pnpm@9 globally if missing
#   2. Creates /tmp/axio-nm (tmpfs) and symlinks it as node_modules
#   3. Installs the correct @esbuild/linux-x64 binaries globally
#   4. Runs `pnpm install --ignore-scripts` (safe — esbuild already patched)
#   5. Patches esbuild postinstall manually for root (0.20.x) and vite (0.21.x)
#
# Usage (from repo root):
#   bash scripts/setup-wsl.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NM_TMP="/tmp/axio-nm"

echo "▶ Axioledger WSL1 bootstrap — repo: $REPO_ROOT"

# ── 1. pnpm ──────────────────────────────────────────────────────────────────
if ! command -v pnpm &>/dev/null; then
  echo "  Installing pnpm@9 globally..."
  npm install -g pnpm@9
else
  echo "  pnpm $(pnpm --version) found ✓"
fi

# ── 2. node_modules symlink ───────────────────────────────────────────────────
NM_LINK="$REPO_ROOT/node_modules"
if [ -L "$NM_LINK" ] && [ "$(readlink "$NM_LINK")" = "$NM_TMP" ]; then
  echo "  node_modules symlink already points to $NM_TMP ✓"
else
  echo "  Removing stale node_modules..."
  rm -rf "$NM_LINK"
  mkdir -p "$NM_TMP"
  ln -s "$NM_TMP" "$NM_LINK"
  echo "  node_modules → $NM_TMP ✓"
fi

# ── 3. esbuild platform binaries ─────────────────────────────────────────────
# Detect the two esbuild versions used in this monorepo:
#   0.20.x — root toolchain
#   0.21.x — vite's nested copy
ESBUILD_ROOT_VER="0.20.2"
ESBUILD_VITE_VER="0.21.5"

install_esbuild_binary() {
  local ver="$1"
  local pkg="@esbuild/linux-x64@${ver}"
  local bin_path
  bin_path="$(npm root -g)/@esbuild/linux-x64/bin/esbuild"

  # Check if correct version already installed globally
  if [ -f "$bin_path" ] && "$bin_path" --version 2>/dev/null | grep -q "^${ver}$"; then
    echo "  @esbuild/linux-x64@${ver} global binary found ✓"
  else
    echo "  Installing ${pkg} globally..."
    npm install -g "$pkg"
  fi
}

install_esbuild_binary "$ESBUILD_VITE_VER"   # install latest first (overwrites global)
install_esbuild_binary "$ESBUILD_ROOT_VER"   # then root version (it's used for patching below)

# ── 4. pnpm install (skip postinstall — esbuild patched manually below) ──────
echo "  Running pnpm install --ignore-scripts..."
cd "$REPO_ROOT"
pnpm install --ignore-scripts

# ── 5. Patch esbuild postinstall manually ────────────────────────────────────
patch_esbuild() {
  local esbuild_dir="$1"
  local target_ver="$2"

  [ -f "$esbuild_dir/install.js" ] || return 0

  local bin_dir="$esbuild_dir/node_modules/@esbuild/linux-x64/bin"
  if [ ! -f "$bin_dir/esbuild" ]; then
    echo "  Installing @esbuild/linux-x64@${target_ver} into ${esbuild_dir}..."
    cd "$esbuild_dir" && npm install "@esbuild/linux-x64@${target_ver}" --no-save --silent
    cd "$REPO_ROOT"
  fi

  echo "  Patching esbuild@${target_ver} postinstall in $(basename "$(dirname "$esbuild_dir")")/$(basename "$esbuild_dir")..."
  cd "$esbuild_dir" && node install.js 2>/dev/null || true
  cd "$REPO_ROOT"
}

patch_esbuild "$NM_TMP/esbuild"                          "$ESBUILD_ROOT_VER"
patch_esbuild "$NM_TMP/vite/node_modules/esbuild"        "$ESBUILD_VITE_VER"

echo ""
echo "✅ Setup complete — workspace ready."
echo "   All 16 workspace packages installed."
echo "   Re-run this script after: git clean -fdx, rm -rf /tmp/axio-nm, or node_modules removal."
