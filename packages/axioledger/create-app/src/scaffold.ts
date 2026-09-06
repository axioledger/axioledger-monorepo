/**
 * @file scaffold.ts
 * Core scaffolding engine for @axioledger/create-app.
 *
 * Phase 1: directory creation + package.json generation.
 * Phase 2: full template file copying + git init + pnpm install.
 */
import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import type { ScaffoldOptions } from "./types.js"
import { listTemplates } from "./templates.js"

/**
 * Scaffold a new Axioledger project from the given options.
 * Creates the target directory and writes a minimal package.json.
 */
export async function scaffold(options: ScaffoldOptions): Promise<void> {
  const { targetDir, projectName, template } = options

  // Validate template
  const templates = listTemplates()
  const found = templates.find((t) => t.id === template)
  if (!found) {
    throw new Error(
      `Unknown template "${template}". Available: ${templates.map((t) => t.id).join(", ")}`
    )
  }

  // Create target directory
  const dest = join(targetDir, projectName)
  await mkdir(dest, { recursive: true })

  // Write a minimal package.json
  const pkg = {
    name: projectName,
    version: "0.1.0",
    private: true,
    type: "module",
    description: `${found.name} — created with @axioledger/create-app`,
    scripts: {
      dev: "vite",
      build: "vite build",
      test: "vitest run",
    },
  }

  await writeFile(
    join(dest, "package.json"),
    JSON.stringify(pkg, null, 2) + "\n",
    "utf-8"
  )

  // Phase 2: copy full template files, run git init, run pnpm install
  // TODO: implement full template copy in Phase 2 (Module 26.3)
}
