/**
 * @axioledger/ui-kit — Tests: BalanceCardHero
 */
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import React from "react"
import { BalanceCardHero } from "../components/BalanceCardHero.js"

const PlusIcon = () => <svg data-testid="plus-icon" />

describe("BalanceCardHero", () => {
  it("hiển thị balance khi isHidden=false", () => {
    render(<BalanceCardHero balance="2,500" balanceDecimal="70" />)
    // aria-label contains full balance
    expect(screen.getByLabelText(/Balance: \$2,500\.70/i)).toBeDefined()
  })

  it("ẩn balance khi isHidden=true (controlled)", () => {
    render(<BalanceCardHero balance="2,500" isHidden={true} />)
    expect(screen.getByLabelText("Balance hidden")).toBeDefined()
    // visible balance span should not exist
    expect(screen.queryByLabelText(/Balance: \$/)).toBeNull()
  })

  it("toggle eye button đổi aria-label", () => {
    render(<BalanceCardHero balance="2,500" />)
    const btn = screen.getByRole("button", { name: "Hide balance" })
    expect(btn).toBeDefined()
    fireEvent.click(btn)
    // After toggle: should now say "Show balance"
    expect(screen.getByRole("button", { name: "Show balance" })).toBeDefined()
  })

  it("gọi onToggleHide khi click toggle (controlled)", () => {
    const onToggle = vi.fn()
    render(
      <BalanceCardHero balance="2,500" isHidden={false} onToggleHide={onToggle} />
    )
    fireEvent.click(screen.getByRole("button", { name: "Hide balance" }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it("render quick actions", () => {
    render(
      <BalanceCardHero
        balance="1,000"
        quickActions={[
          { label: "Top up",   icon: <PlusIcon />, onClick: vi.fn() },
          { label: "Transfer", icon: <PlusIcon />, onClick: vi.fn() },
        ]}
      />
    )
    expect(screen.getByLabelText("Top up")).toBeDefined()
    expect(screen.getByLabelText("Transfer")).toBeDefined()
  })

  it("cap quick actions tại 4", () => {
    const actions = Array.from({ length: 6 }, (_, i) => ({
      label: `Action ${i}`,
      icon:  <PlusIcon />,
      onClick: vi.fn(),
    }))
    render(<BalanceCardHero balance="0" quickActions={actions} />)
    // Only 4 action buttons + 1 eye toggle = 5 total buttons
    const buttons = screen.getAllByRole("button")
    // 4 action buttons + 1 eye toggle
    expect(buttons.length).toBe(5)
  })

  it("gọi onClick của quick action khi click", () => {
    const onClick = vi.fn()
    render(
      <BalanceCardHero
        balance="500"
        quickActions={[{ label: "Swap", icon: <PlusIcon />, onClick }]}
      />
    )
    fireEvent.click(screen.getByLabelText("Swap"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("currencySymbol thay đổi ký hiệu", () => {
    render(<BalanceCardHero balance="1,000" currencySymbol="₫" />)
    expect(screen.getByLabelText(/Balance: ₫/)).toBeDefined()
  })
})
