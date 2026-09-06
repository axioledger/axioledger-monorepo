/**
 * @axioledger/ui-kit — Tests: StatusBadge
 */
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import { StatusBadge } from "../components/StatusBadge.js"

describe("StatusBadge", () => {
  it("render label", () => {
    render(<StatusBadge variant="success" label="Completed" />)
    expect(screen.getByText("Completed")).toBeDefined()
  })

  it("áp dụng màu đúng cho từng variant — success", () => {
    const { container } = render(<StatusBadge variant="success" label="OK" />)
    const el = container.firstChild as HTMLElement
    // badge/success-bg → #F0FFF5
    expect(el.style.background).toBe("rgb(240, 255, 245)")
    expect(el.style.color).toBe("rgb(0, 153, 122)")
  })

  it("áp dụng màu đúng cho variant error", () => {
    const { container } = render(<StatusBadge variant="error" label="Failed" />)
    const el = container.firstChild as HTMLElement
    // badge/error-bg → #FFF2F2
    expect(el.style.background).toBe("rgb(255, 242, 242)")
    expect(el.style.color).toBe("rgb(184, 29, 91)")
  })

  it("role=alert cho error variant", () => {
    render(<StatusBadge variant="error" label="Rejected" />)
    expect(screen.getByRole("alert")).toBeDefined()
  })

  it("role=status cho pending variant", () => {
    render(<StatusBadge variant="pending" label="Pending" />)
    expect(screen.getByRole("status")).toBeDefined()
  })

  it("không có role đặc biệt cho success / info", () => {
    const { container: c1 } = render(<StatusBadge variant="success" label="OK" />)
    expect((c1.firstChild as HTMLElement).getAttribute("role")).toBeNull()
    const { container: c2 } = render(<StatusBadge variant="info" label="Info" />)
    expect((c2.firstChild as HTMLElement).getAttribute("role")).toBeNull()
  })

  it("hiển thị chấm tròn khi showDot=true (mặc định)", () => {
    const { container } = render(<StatusBadge variant="info" label="Info" />)
    // 1 element child (dot <span>); label is a text node — not counted by .children
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.children.length).toBe(1) // dot span
  })

  it("không hiển thị chấm khi showDot=false", () => {
    const { container } = render(
      <StatusBadge variant="success" label="Done" showDot={false} />
    )
    // only text node, no span dot
    expect((container.firstChild as HTMLElement).children.length).toBe(0)
  })

  it("size sm: font-size 10px", () => {
    const { container } = render(<StatusBadge variant="info" label="x" size="sm" />)
    const el = container.firstChild as HTMLElement
    expect(el.style.fontSize).toBe("10px")
  })

  it("size md: font-size 12px (mặc định)", () => {
    const { container } = render(<StatusBadge variant="info" label="x" />)
    const el = container.firstChild as HTMLElement
    expect(el.style.fontSize).toBe("12px")
  })

  it("aria-label chứa variant và label", () => {
    render(<StatusBadge variant="pending" label="Processing" />)
    const el = screen.getByRole("status")
    expect(el.getAttribute("aria-label")).toBe("pending: Processing")
  })
})
