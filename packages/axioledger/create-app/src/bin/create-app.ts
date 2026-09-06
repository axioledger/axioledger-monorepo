#!/usr/bin/env node
/**
 * @axioledger/create-app — CLI entry point
 *
 * Usage: pnpm create axioledger-app <project-name> [--template dapp|svm-program|zk-circuit|sdk-package]
 */
import { scaffold, listTemplates } from "../index.js"
import type { TemplateId } from "../types.js"

const args = process.argv.slice(2)
const projectName = args[0]
const templateFlag = args.indexOf("--template")
const template: TemplateId =
  templateFlag !== -1 && args[templateFlag + 1]
    ? (args[templateFlag + 1] as TemplateId)
    : "dapp"

if (!projectName || projectName.startsWith("--")) {
  const available = listTemplates()
    .map((t) => `  ${t.id.padEnd(16)} ${t.description}`)
    .join("\n")
  console.error(
    `Usage: create-axioledger-app <project-name> [--template <id>]\n\nTemplates:\n${available}`
  )
  process.exit(1)
}

try {
  await scaffold({ targetDir: process.cwd(), projectName, template })
  console.log(`\n✅ Project "${projectName}" created using template "${template}".`)
  console.log(`   cd ${projectName} && pnpm install && pnpm dev\n`)
} catch (err) {
  console.error("❌ Scaffolding failed:", err instanceof Error ? err.message : String(err))
  process.exit(1)
}
