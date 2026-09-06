/**
 * @axioledger/create-app — Public API
 *
 * Scaffolding engine for bootstrapping Axioledger projects.
 * Invoked via: `pnpm create axioledger-app <project-name> --template <template>`
 *
 * Available templates:
 *   - dapp       : React + axioledger VDOM + wallet-connector
 *   - svm-program: Native SVM program skeleton (Rust crate stub)
 *   - zk-circuit : Halo2/PlonKy2 circuit project (Rust crate stub)
 *   - sdk-package: TypeScript SDK library package
 */

export { scaffold }    from "./scaffold.js"
export { listTemplates } from "./templates.js"
export type { ScaffoldOptions, Template } from "./types.js"
