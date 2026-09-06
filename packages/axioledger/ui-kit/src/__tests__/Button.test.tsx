/**
 * @axioledger/ui-kit — Tests: Button
 */
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import React from "react"
import { Button } from "../components/Button.js"

describe("Button", () => {
  it("render đúng label", () => {
    render(<Button>Kết nối ví</Button>)
    expect(screen.getByRole("button", { name: "Kết nối ví" })).toBeDefined()
  })

  it("gọi onClick khi click", () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("disabled khi prop disabled=true", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole("button")).toHaveProperty("disabled", true)
  })

  it("disabled và aria-busy khi loading=true", () => {
    render(<Button loading>Loading</Button>)
    const btn = screen.getByRole("button")
    expect(btn).toHaveProperty("disabled", true)
    expect(btn.getAttribute("aria-busy")).toBe("true")
  })

  it("không gọi onClick khi disabled", () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>No click</Button>)
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("render leftIcon", () => {
    render(<Button leftIcon={<span data-testid="icon">★</span>}>With Icon</Button>)
    expect(screen.getByTestId("icon")).toBeDefined()
  })
})
