#!/bin/bash
# audit-ui-kit.sh — Kiểm tra trạng thái hoàn thiện của ui-kit components
# Phân loại dựa trên pattern placeholder: data-testid="axq-<number>"
# Chạy từ monorepo root: bash scripts/audit-ui-kit.sh

set -euo pipefail

COMPONENTS_DIR="packages/axioledger/ui-kit/src/components"

echo "🔍 AXIOLEDGER UI-KIT AUDIT REPORT"
echo "================================="

if [ ! -d "$COMPONENTS_DIR" ]; then
  echo "❌ Lỗi: Không tìm thấy thư mục $COMPONENTS_DIR" >&2
  exit 1
fi

TOTAL=$(find "$COMPONENTS_DIR" -maxdepth 1 -name "*.tsx" | wc -l | tr -d ' ')
echo "Tổng số components: $TOTAL"

echo ""
echo "🔴 PLACEHOLDERS (Nợ kỹ thuật — còn data-testid=\"axq-\"):"
EMPTY_LIST=$(grep -rl 'data-testid="axq-' "$COMPONENTS_DIR" | sort | xargs -I{} basename {})
EMPTY_COUNT=$(echo "$EMPTY_LIST" | grep -c . || true)
echo "$EMPTY_LIST" | awk '{print "  - " $0}'
echo "  ↳ Tổng placeholder: $EMPTY_COUNT"

echo ""
echo "✅ IMPLEMENTED (Đã hoàn thiện):"
DONE_LIST=$(grep -rL 'data-testid="axq-' "$COMPONENTS_DIR" | grep '\.tsx$' | sort | xargs -I{} basename {})
DONE_COUNT=$(echo "$DONE_LIST" | grep -c . || true)
echo "$DONE_LIST" | awk '{print "  - " $0}'
echo "  ↳ Tổng đã implement: $DONE_COUNT"

echo ""
echo "📊 Tỉ lệ hoàn thiện: $DONE_COUNT / $TOTAL"
