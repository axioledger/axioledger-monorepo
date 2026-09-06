/**
 * AXQ Design Token — Border Radius
 * Scale: none → full (9 bậc)
 */

// AXQ DS spec (DESIGN_SYSTEM.md §Radius Scale):
// none=0 · xs=2 · sm=4 · md=8 · lg=12 · xl=16 · 2xl=24 · 3xl=32 · full=9999
export const radius = {
  "radius/none":  "0px",
  "radius/xs":    "2px",
  "radius/sm":    "4px",
  "radius/md":    "8px",
  "radius/lg":    "12px",
  "radius/xl":    "16px",
  "radius/2xl":   "24px",
  "radius/3xl":   "32px",
  "radius/full":  "9999px",
} as const

export type RadiusToken = keyof typeof radius
