/**
 * @axioledger/ui-kit — Design Token Exports
 *
 * Tất cả token Design System được export từ đây.
 * Import CSS để áp dụng CSS custom properties toàn cục:
 *
 *   import '@axioledger/ui-kit/tokens/generated/axq-tokens.css'
 *
 * Import TypeScript để dùng trong styled-components / Tailwind / inline styles:
 *
 *   import { primitiveColors, semanticColorsLight, spacing } from '@axioledger/ui-kit/tokens'
 */

export { primitiveColors }            from "./colors.js"
export type { PrimitiveColor }        from "./colors.js"
export { semanticColorsLight }        from "./colors.js"
export { semanticColorsDark }         from "./colors.js"
export type { SemanticColor }         from "./colors.js"
export { spacing }                    from "./spacing.js"
export type { SpacingToken }          from "./spacing.js"
export { radius }                     from "./radius.js"
export type { RadiusToken }           from "./radius.js"
export { fontFamily, fontSize, fontWeight, lineHeight } from "./typography.js"
export type { FontSizeToken }         from "./typography.js"
