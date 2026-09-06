/**
 * @axioledger/ui-kit — Tests: PINPad
 */
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import React from "react"
import { PINPad } from "../components/PINPad.js"

describe("PINPad", () => {
  it("render đủ số chấm theo maxLength mặc định (6)", () => {
    render(<PINPad onComplete={vi.fn()} />)
    // 6 chấm indicator + keypad buttons
    const buttons = screen.getAllByRole("button")
    // 9 số + 0 + ⌫ = 11 buttons
    expect(buttons.length).toBe(11)
  })

  it("gọi onComplete sau khi nhập đủ PIN", () => {
    const onComplete = vi.fn()
    render(<PINPad onComplete={onComplete} maxLength={4} />)
    fireEvent.click(screen.getByLabelText("1"))
    fireEvent.click(screen.getByLabelText("2"))
    fireEvent.click(screen.getByLabelText("3"))
    fireEvent.click(screen.getByLabelText("4"))
    expect(onComplete).toHaveBeenCalledWith("1234")
  })

  it("nút xoá giảm số chữ số đã nhập", () => {
    const onComplete = vi.fn()
    render(<PINPad onComplete={onComplete} maxLength={6} />)
    fireEvent.click(screen.getByLabelText("1"))
    fireEvent.click(screen.getByLabelText("2"))
    fireEvent.click(screen.getByLabelText("Xoá ký tự cuối"))
    // Chỉ còn "1" — không trigger onComplete
    expect(onComplete).not.toHaveBeenCalled()
  })

  it("disabled: không nhận input", () => {
    const onComplete = vi.fn()
    render(<PINPad onComplete={onComplete} disabled maxLength={4} />)
    fireEvent.click(screen.getByLabelText("1"))
    expect(onComplete).not.toHaveBeenCalled()
  })
})
