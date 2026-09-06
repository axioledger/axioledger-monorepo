/**
 * AXQ Design Token — Spacing
 * Scale: space/0 → space/128
 */

export const spacing = {
  "space/0":   "0px",
  "space/1":   "2px",
  "space/2":   "4px",
  "space/3":   "6px",
  "space/4":   "8px",
  "space/5":   "10px",
  "space/6":   "12px",
  "space/8":   "16px",
  "space/10":  "20px",
  "space/12":  "24px",
  "space/16":  "32px",
  "space/20":  "40px",
  "space/24":  "48px",
  "space/32":  "64px",
  "space/40":  "80px",
  "space/48":  "96px",
  "space/64":  "128px",
  "space/128": "256px",
} as const

export type SpacingToken = keyof typeof spacing
