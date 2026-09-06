/**
 * AXQ Design Token — Colors
 * Primitive → Semantic → Component (3-layer chain)
 *
 * Rule: Components MUST NOT reference Primitive tokens directly.
 *       Always resolve through Semantic layer.
 */

// ─── Primitive Colors ─────────────────────────────────────────────────────────

export const primitiveColors = {
  // Brand accent palette
  "brand/teal":   "#49DBC8",
  "brand/green":  "#BEFF6C",
  "brand/orange": "#FC7339",
  "brand/purple": "#AF96FB",
  "brand/yellow": "#FFF172",

  // Greyscale — AXQ DS spec (DESIGN_SYSTEM.md §Primitive Color)
  "greyscale/900": "#101426",
  "greyscale/800": "#151A30",
  "greyscale/700": "#192038",
  "greyscale/600": "#222B45",
  "greyscale/500": "#2E3A59",
  "greyscale/400": "#8F9BB3",
  "greyscale/300": "#C5CEE0",
  "greyscale/200": "#E4E9F2",
  "greyscale/100": "#EDF1F7",
  "greyscale/50":  "#F4F5F8",

  // Absolutes
  "black": "#000000",
  "white": "#FFFFFF",

  // Status palette — AXQ DS spec (DESIGN_SYSTEM.md §System Colors)
  "status/success/500": "#00D68F",
  "status/warning/500": "#FFAA00",
  "status/error/500":   "#FF3D71",
  "status/info/500":    "#0095FF",
} as const

export type PrimitiveColor = keyof typeof primitiveColors

// ─── Semantic Colors — Light Mode ─────────────────────────────────────────────

export const semanticColorsLight = {
  "text/primary":       primitiveColors["greyscale/900"],
  "text/secondary":     primitiveColors["greyscale/500"],
  "text/disabled":      primitiveColors["greyscale/300"],
  "text/inverse":       primitiveColors["white"],

  "bg/primary":         primitiveColors["white"],
  "bg/secondary":       primitiveColors["greyscale/50"],
  "bg/overlay":         "rgba(16,20,38,0.6)",

  "surface/default":    primitiveColors["white"],
  "surface/raised":     primitiveColors["greyscale/50"],

  "border/default":     primitiveColors["greyscale/100"],
  "border/strong":      primitiveColors["greyscale/200"],

  "accent/teal":        primitiveColors["brand/teal"],
  "accent/green":       primitiveColors["brand/green"],
  "accent/purple":      primitiveColors["brand/purple"],

  "icon/default":       primitiveColors["greyscale/600"],
  "icon/active":        primitiveColors["brand/teal"],
} as const

// ─── Semantic Colors — Dark Mode ──────────────────────────────────────────────

export const semanticColorsDark = {
  "text/primary":       primitiveColors["white"],
  "text/secondary":     primitiveColors["greyscale/300"],
  "text/disabled":      primitiveColors["greyscale/600"],
  "text/inverse":       primitiveColors["greyscale/900"],

  "bg/primary":         primitiveColors["black"],
  "bg/secondary":       primitiveColors["greyscale/900"],
  "bg/overlay":         "rgba(0,0,0,0.7)",

  "surface/default":    primitiveColors["greyscale/900"],
  "surface/raised":     primitiveColors["greyscale/800"],

  "border/default":     primitiveColors["greyscale/800"],
  "border/strong":      primitiveColors["greyscale/700"],

  "accent/teal":        primitiveColors["brand/teal"],
  "accent/green":       primitiveColors["brand/green"],
  "accent/purple":      primitiveColors["brand/purple"],

  "icon/default":       primitiveColors["greyscale/400"],
  "icon/active":        primitiveColors["brand/teal"],
} as const

export type SemanticColor = keyof typeof semanticColorsLight
