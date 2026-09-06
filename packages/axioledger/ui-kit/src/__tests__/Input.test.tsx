/**
 * @axioledger/ui-kit — Tests: Input
 */
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import React from "react"
import { Input } from "../components/Input.js"

describe("Input", () => {
  it("render với label", () => {
    render(<Input label="Địa chỉ ví" />)
    expect(screen.getByLabelText("Địa chỉ ví")).toBeDefined()
  })

  it("hiển thị errorMessage và aria-invalid", () => {
    render(<Input errorMessage="Địa chỉ không hợp lệ" />)
    expect(screen.getByRole("alert").textContent).toBe("Địa chỉ không hợp lệ")
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true")
  })

  it("hiển thị helperText khi không có error", () => {
    render(<Input helperText="Nhập địa chỉ .axq" />)
    expect(screen.getByText("Nhập địa chỉ .axq")).toBeDefined()
  })

  it("gọi onValueChange khi nhập", () => {
    const onValueChange = vi.fn()
    render(<Input onValueChange={onValueChange} />)
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "alice" } })
    expect(onValueChange).toHaveBeenCalledWith("alice")
  })

  it("disabled khi prop disabled", () => {
    render(<Input disabled />)
    expect(screen.getByRole("textbox")).toHaveProperty("disabled", true)
  })
})
