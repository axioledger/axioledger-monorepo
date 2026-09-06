/**
 * @axioledger/ui-kit — Tests: CardVisual
 */
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import { CardVisual } from "../components/CardVisual.js"

const PROPS = {
  address:     "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  balance:     "1,250.00",
  tokenSymbol: "$AXQ",
  networkName: "Axioledger Mainnet",
}

describe("CardVisual", () => {
  it("render aria-label với địa chỉ rút gọn", () => {
    render(<CardVisual {...PROPS} />)
    const card = screen.getByRole("img")
    expect(card.getAttribute("aria-label")).toContain("$AXQ")
    expect(card.getAttribute("aria-label")).toContain("9WzDXw...AWWM")
  })

  it("hiển thị balance và tokenSymbol", () => {
    render(<CardVisual {...PROPS} />)
    expect(screen.getByText("1,250.00")).toBeDefined()
    expect(screen.getByText("$AXQ")).toBeDefined()
  })

  it("hiển thị networkName", () => {
    render(<CardVisual {...PROPS} />)
    expect(screen.getByText("Axioledger Mainnet")).toBeDefined()
  })

  it("hiển thị holderName khi được cung cấp", () => {
    render(<CardVisual {...PROPS} holderName="Alice" />)
    expect(screen.getByText("Alice")).toBeDefined()
  })

  it("render với variant vpx (không crash)", () => {
    const { container } = render(<CardVisual {...PROPS} variant="vpx" />)
    expect(container.firstChild).toBeDefined()
  })
})
