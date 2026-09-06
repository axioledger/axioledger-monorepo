/**
 * @file types.ts
 * Core types for the @axioledger/create-app scaffolding engine.
 */

/** Supported project template identifiers */
export type TemplateId = "dapp" | "svm-program" | "zk-circuit" | "sdk-package"

/** A template descriptor */
export interface Template {
  /** Template identifier */
  id: TemplateId
  /** Human-readable name */
  name: string
  /** Short description of what this template bootstraps */
  description: string
}

/** Options passed to the scaffold() function */
export interface ScaffoldOptions {
  /** Target directory to scaffold the project into */
  targetDir: string
  /** Project name used as the package name and directory */
  projectName: string
  /** Template to use for scaffolding */
  template: TemplateId
  /** If true, skip git init */
  skipGit?: boolean
  /** If true, skip pnpm install after scaffolding */
  skipInstall?: boolean
}
