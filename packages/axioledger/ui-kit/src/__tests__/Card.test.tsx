/**
 * @axioledger/ui-kit — Tests: Card
 */
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import React from "react"
import { Card } from "../components/Card.js"

describe("Card", () => {
  it("render children", () => {
    render(<Card>Nội dung card</Card>)
    expect(screen.getByText("Nội dung card")).toBeDefined()
  })

  it("render header và footer", () => {
    render(
      <Card header={<span>Tiêu đề</span>} footer={<span>Footer</span>}>
        Body
      </Card>
    )
    expect(screen.getByText("Tiêu đề")).toBeDefined()
    expect(screen.getByText("Footer")).toBeDefined()
  })

  it("gọi onClick khi click vào clickable card", () => {
    const onClick = vi.fn()
    render(<Card onClick={onClick}>Click me</Card>)
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("không có role button khi không có onClick", () => {
    render(<Card>Static</Card>)
    expect(screen.queryByRole("button")).toBeNull()
  })

  it("áp dụng variant elevated không có border", () => {
    const { container } = render(<Card variant="elevated">Elevated</Card>)
    const div = container.firstChild as HTMLElement
    expect(div.style.border).toBeFalsy()
  })
})
