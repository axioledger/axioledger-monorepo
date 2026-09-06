#!/usr/bin/env node
/**
 * @axioledger/cli — axq / axioledger CLI entry point
 *
 * Commands:
 *   axq node start     — start a Validator/Sequencer node
 *   axq node status    — check node health (node-diagnostics)
 *   axq domain resolve <name.axq>
 *   axq domain register <name.axq> <address>
 *   axq wallet create  — create new Passkey wallet
 *   axq deploy <package>
 */

const [,, command, ...args] = process.argv

const COMMANDS: Record<string, () => void> = {
  "node":    () => nodeCmd(args),
  "domain":  () => domainCmd(args),
  "wallet":  () => walletCmd(args),
  "deploy":  () => deployCmd(args),
  "--help":  printHelp,
  "-h":      printHelp,
  "--version": () => console.log("@axioledger/cli v1.0.0"),
}

function nodeCmd(args: string[]): void {
  const sub = args[0]
  if (sub === "start")  console.log("TODO (Phase 3.1): start node — @valiprecision/core-daemon")
  if (sub === "status") console.log("TODO (Phase 3.1): node status — @valiprecision/node-diagnostics")
  else printHelp()
}

function domainCmd(args: string[]): void {
  const [sub, name, value] = args
  if (sub === "resolve")  console.log(`TODO (Phase 1.2): resolve ${name} via @axioledger/ans-sdk`)
  if (sub === "register") console.log(`TODO (Phase 1.2): register ${name} → ${value}`)
  else printHelp()
}

function walletCmd(args: string[]): void {
  const sub = args[0]
  if (sub === "create") console.log("TODO (Phase 2.4): create Passkey wallet")
  else printHelp()
}

function deployCmd(args: string[]): void {
  console.log(`TODO (Phase 1.1): deploy ${args[0]}`)
}

function printHelp(): void {
  console.log(`
axq — Axioledger CLI v1.0.0

USAGE
  axq <command> [subcommand] [options]

COMMANDS
  node start            Start a Validator / Sequencer node
  node status           Print node health report
  domain resolve <name> Resolve a .axq domain to address
  domain register <n> <addr>  Register a .axq domain
  wallet create         Create a new Passkey wallet
  deploy <pkg>          Deploy a package to the network

OPTIONS
  -h, --help            Show this help message
  --version             Print CLI version
`.trim())
}

const handler = COMMANDS[command ?? "--help"]
if (handler) {
  handler()
} else {
  console.error(`Unknown command: ${command}\n`)
  printHelp()
  process.exit(1)
}
