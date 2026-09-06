#!/usr/bin/env node
// @axioledger/build-scripts — shared esbuild runner
import { build } from "esbuild"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const pkg = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8"))

const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "neutral",
  format: "esm",
  outfile: "dist/index.js",
  external,
  sourcemap: true,
})

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "neutral",
  format: "cjs",
  outfile: "dist/index.cjs",
  external,
  sourcemap: true,
})

console.log(`✓ Built ${pkg.name}@${pkg.version}`)
