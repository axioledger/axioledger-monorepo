/**
 * @file templates.ts
 * Template registry for @axioledger/create-app.
 */
import type { Template } from "./types.js"

const TEMPLATES: readonly Template[] = [
  {
    id: "dapp",
    name: "Axioledger dApp",
    description: "React + axioledger VDOM + @axioledger/wallet-connector starter",
  },
  {
    id: "svm-program",
    name: "SVM Program",
    description: "Native Stateless SVM smart contract skeleton (Rust crate)",
  },
  {
    id: "zk-circuit",
    name: "ZK Circuit",
    description: "Halo2/PlonKy2 zero-knowledge circuit project (Rust crate)",
  },
  {
    id: "sdk-package",
    name: "SDK Package",
    description: "TypeScript library package with axio-build and vitest",
  },
]

/** Returns all available scaffold templates. */
export function listTemplates(): readonly Template[] {
  return TEMPLATES
}
