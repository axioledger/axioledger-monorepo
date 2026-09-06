/**
 * @axioledger/ui-kit — Tests: BottomNavBar
 */
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import React from "react"
import { BottomNavBar } from "../components/BottomNavBar.js"
import type { NavTabKey } from "../components/BottomNavBar.js"

describe("BottomNavBar", () => {
  it("render 5 tab buttons mặc định", () => {
    render(<BottomNavBar activeTab="home" onTabChange={vi.fn()} />)
    // Each tab has aria-label matching its label
    expect(screen.getByLabelText("Home")).toBeDefined()
    expect(screen.getByLabelText("Crypto")).toBeDefined()
    expect(screen.getByLabelText("Card")).toBeDefined()
    expect(screen.getByLabelText("Cashback")).toBeDefined()
    expect(screen.getByLabelText("More")).toBeDefined()
  })

  it("tab active có aria-current='page'", () => {
    render(<BottomNavBar activeTab="crypto" onTabChange={vi.fn()} />)
    const activeBtn = screen.getByLabelText("Crypto")
    expect(activeBtn.getAttribute("aria-current")).toBe("page")
  })

  it("tab inactive không có aria-current", () => {
    render(<BottomNavBar activeTab="home" onTabChange={vi.fn()} />)
    const inactiveBtn = screen.getByLabelText("Card")
    expect(inactiveBtn.getAttribute("aria-current")).toBeNull()
  })

  it("gọi onTabChange với đúng key khi click", () => {
    const onChange = vi.fn()
    render(<BottomNavBar activeTab="home" onTabChange={onChange} />)
    fireEvent.click(screen.getByLabelText("Card"))
    expect(onChange).toHaveBeenCalledWith("card" as NavTabKey)
  })

  it("render nav với aria-label='Main navigation'", () => {
    render(<BottomNavBar activeTab="home" onTabChange={vi.fn()} />)
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeDefined()
  })

  it("hiển thị badge count trong aria-label khi badge > 0", () => {
    const tabs = [
      {
        key:        "home" as NavTabKey,
        label:      "Home",
        iconBold:   <span />,
        iconLinear: <span />,
        badge:      3,
      },
    ]
    render(<BottomNavBar activeTab="home" onTabChange={vi.fn()} tabs={tabs} />)
    const btn = screen.getByLabelText("Home, 3 notifications")
    expect(btn).toBeDefined()
  })

  it("badge = 1 → singular 'notification'", () => {
    const tabs = [
      {
        key:        "more" as NavTabKey,
        label:      "More",
        iconBold:   <span />,
        iconLinear: <span />,
        badge:      1,
      },
    ]
    render(<BottomNavBar activeTab="home" onTabChange={vi.fn()} tabs={tabs} />)
    expect(screen.getByLabelText("More, 1 notification")).toBeDefined()
  })

  it("tabs=0 badge → aria-label sem badge text", () => {
    render(<BottomNavBar activeTab="home" onTabChange={vi.fn()} />)
    // "More" has no badge — aria-label is just "More"
    const btn = screen.getByLabelText("More")
    expect(btn.getAttribute("aria-label")).toBe("More")
  })
})
