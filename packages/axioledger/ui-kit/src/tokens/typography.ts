/**
 * AXQ Design Token — Typography
 * Font: Work Sans · Scale: 10px → 96px
 */

export const fontFamily = "Work Sans, -apple-system, Segoe UI, sans-serif"

export const fontSize = {
  "type/overline":  "10px",
  "type/caption":   "12px",
  "type/body-sm":   "14px",
  "type/body":      "16px",
  "type/h6":        "20px",
  "type/h5":        "24px",
  "type/h4":        "34px",
  "type/h3":        "48px",
  "type/h2":        "60px",
  "type/h1":        "96px",
} as const

export const fontWeight = {
  regular:   400,
  medium:    500,
  semibold:  600,
  bold:      700,
} as const

export const lineHeight = {
  tight:   1.2,
  base:    1.5,
  relaxed: 1.6,
  loose:   1.8,
} as const

export type FontSizeToken = keyof typeof fontSize
