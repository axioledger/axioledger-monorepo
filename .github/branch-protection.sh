#!/usr/bin/env bash
# ============================================================
# branch-protection.sh
#
# Thiết lập Branch Protection Rules cho Axioledger Monorepo
# bằng GitHub CLI (gh). Chạy script này một lần từ máy dev
# hoặc từ Codespace — không tốn RAM máy chủ vật lý.
#
# Yêu cầu:
#   - GitHub CLI đã cài:  https://cli.github.com/
#   - Đã xác thực:        gh auth login
#   - Quyền:              Admin hoặc Owner của repository
#
# Cách dùng:
#   chmod +x .github/branch-protection.sh
#   OWNER=axioledger REPO=axioledger-monorepo bash .github/branch-protection.sh
# ============================================================

set -euo pipefail

OWNER="${OWNER:-axioledger}"
REPO="${REPO:-axioledger-monorepo}"

# ── Màu sắc terminal ──
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }

# ── Kiểm tra gh CLI ──
if ! command -v gh &>/dev/null; then
  error "GitHub CLI (gh) chưa được cài. Xem: https://cli.github.com/"
  exit 1
fi

if ! gh auth status &>/dev/null; then
  error "Chưa đăng nhập GitHub CLI. Chạy: gh auth login"
  exit 1
fi

# ── Hàm áp dụng Branch Protection qua REST API ──
apply_protection() {
  local branch="$1"
  local required_checks="$2"       # JSON array string, e.g. '["ci","typecheck"]'
  local min_approvals="$3"         # số lượng reviewer tối thiểu

  info "Đang áp dụng protection cho nhánh: ${branch}"

  gh api \
    --method PUT \
    -H "Accept: application/vnd.github+json" \
    "/repos/${OWNER}/${REPO}/branches/${branch}/protection" \
    --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "checks": $(echo "$required_checks" | jq '[.[] | {"context": ., "app_id": null}]')
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": ${min_approvals},
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "require_last_push_approval": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "required_linear_history": false,
  "required_signatures": false
}
EOF

  info "✅  Branch '${branch}' → protection applied (min approvals: ${min_approvals})"
}

# ══════════════════════════════════════════════════════════
# NHÁNH main — bảo vệ nghiêm ngặt nhất
# Required status checks khớp với job names trong ci.yml
# ══════════════════════════════════════════════════════════
MAIN_CHECKS='[
  "Install & Build",
  "TypeScript Typecheck",
  "Unit Tests",
  "🔒 Rust Release Guard — No testnet-stub",
  "Documentation Link Check"
]'

apply_protection "main" "$MAIN_CHECKS" 1

# ══════════════════════════════════════════════════════════
# NHÁNH develop — yêu cầu nhẹ hơn (không cần Rust guard)
# ══════════════════════════════════════════════════════════
DEV_CHECKS='[
  "Install & Build",
  "TypeScript Typecheck",
  "Unit Tests"
]'

apply_protection "develop" "$DEV_CHECKS" 1

# ══════════════════════════════════════════════════════════
# NHÁNH release/** — pattern-based protection
# Dùng ruleset API (hỗ trợ wildcard) thay vì branch protection
# ══════════════════════════════════════════════════════════
info "Đang tạo ruleset cho pattern 'release/**'..."

gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  "/repos/${OWNER}/${REPO}/rulesets" \
  --input - <<'RULESET'
{
  "name": "release-branch-protection",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/release/**"],
      "exclude": []
    }
  },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 2,
        "dismiss_stale_reviews_on_push": true,
        "require_last_push_approval": true,
        "required_review_thread_resolution": true
      }
    },
    { "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [
          { "context": "Install & Build" },
          { "context": "TypeScript Typecheck" },
          { "context": "Unit Tests" },
          { "context": "🔒 Rust Release Guard — No testnet-stub" }
        ]
      }
    }
  ]
}
RULESET

info "✅  Ruleset 'release-branch-protection' → created"

# ══════════════════════════════════════════════════════════
# TỔNG KẾT
# ══════════════════════════════════════════════════════════
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  Branch Protection Setup — HOÀN TẤT    ${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "  main       → PR required, 1 approval, all CI checks"
echo "  develop    → PR required, 1 approval, core CI checks"
echo "  release/** → PR required, 2 approvals (via Ruleset)"
echo ""
warn "Kiểm tra lại tại: https://github.com/${OWNER}/${REPO}/settings/branches"
