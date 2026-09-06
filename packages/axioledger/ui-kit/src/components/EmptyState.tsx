/**
 * EmptyState — AXQ Design System
 * Inventory: #91–93 · Group 8 Feedback, System States & Banners · Phase 1–2 ⚡
 */

import React from "react"

export type EmptyStateContext = "transactions" | "crypto" | "search" | "generic"

export interface EmptyStateProps {
  context: EmptyStateContext
  title?: string
  message?: string
  ctaLabel?: string
  onCta?: () => void
}

const CONTEXT_META: Record<EmptyStateContext, { title: string; message: string; color: string; icon: string }> = {
  transactions: {
    title:   "Chưa có giao dịch",
    message: "Các giao dịch của bạn sẽ hiển thị tại đây sau khi bạn thực hiện lần đầu tiên.",
    color:   "var(--axq-brand-green, #BEFF6C)",
    icon:    "💳",
  },
  crypto: {
    title:   "Chưa có tài sản",
    message: "Bắt đầu mua hoặc nhận tiền điện tử để danh mục của bạn xuất hiện ở đây.",
    color:   "var(--axq-brand-teal, #49DBC8)",
    icon:    "📈",
  },
  search: {
    title:   "Không tìm thấy kết quả",
    message: "Thử tìm kiếm bằng tên khác hoặc kiểm tra lỗi chính tả.",
    color:   "var(--axq-bg-secondary, #EDF1F7)",
    icon:    "🔍",
  },
  generic: {
    title:   "Không có dữ liệu",
    message: "Hiện tại chưa có nội dung để hiển thị.",
    color:   "var(--axq-bg-secondary, #EDF1F7)",
    icon:    "📭",
  },
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  context,
  title,
  message,
  ctaLabel,
  onCta,
}) => {
  const meta = CONTEXT_META[context]

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "var(--axq-spacing-inset-xl, 32px)",
        gap: "var(--axq-spacing-gap-xl, 24px)",
        textAlign: "center",
      }}
    >
      {/* Illustration blob */}
      <div
        aria-hidden="true"
        style={{
          width: "96px",
          height: "96px",
          borderRadius: "var(--axq-radius-full, 9999px)",
          backgroundColor: meta.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.5rem",
        }}
      >
        {meta.icon}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "var(--axq-text-primary, #101426)" }}>
          {title ?? meta.title}
        </h3>
        <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.6, color: "var(--axq-text-secondary, #2E3A59)" }}>
          {message ?? meta.message}
        </p>
      </div>

      {ctaLabel && onCta && (
        <button
          type="button"
          onClick={onCta}
          style={{
            padding: "12px 32px",
            fontSize: "1rem",
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
            color: "var(--axq-text-inverse, #FFFFFF)",
            backgroundColor: "var(--axq-bg-brand, #000000)",
            border: "none",
            borderRadius: "var(--axq-radius-btn, 24px)",
          }}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  )
}

EmptyState.displayName = "EmptyState"
