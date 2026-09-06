/**
 * @file chain-types.ts
 * TypeScript types derived from the chains.json EVM chain registry.
 *
 * Schema source: https://github.com/ethereum-lists/chains
 * Used by ChainRegistry to provide type-safe chain queries for verifier deployment.
 */

// ---------------------------------------------------------------------------
// Chain record types
// ---------------------------------------------------------------------------

export interface ChainNativeCurrency {
  name: string
  symbol: string
  decimals: number
}

export interface ChainFeature {
  name: string
}

export interface ChainExplorer {
  name: string
  url: string
  standard: string
  icon?: string
}

export interface ChainParentBridge {
  url: string
}

export interface ChainParent {
  type: string
  chain: string
  bridges?: ChainParentBridge[]
}

export interface ChainEns {
  registry: string
}

/**
 * A single EVM-compatible chain record as stored in chains.json.
 * All optional fields may be absent in some entries.
 */
export interface ChainRecord {
  name: string
  chain: string
  icon?: string
  rpc: string[]
  features?: ChainFeature[]
  faucets: string[]
  nativeCurrency: ChainNativeCurrency
  infoURL: string
  shortName: string
  chainId: number
  networkId: number
  slip44?: number
  ens?: ChainEns
  explorers?: ChainExplorer[]
  title?: string
  status?: string
  redFlags?: string[]
  parent?: ChainParent
}

// ---------------------------------------------------------------------------
// Query types
// ---------------------------------------------------------------------------

/** EIP feature names commonly used for verifier deployment filtering */
export type EvmFeature =
  | "EIP155"
  | "EIP1559"
  | "EIP4844"
  | "EIP3091"
  | (string & Record<never, never>)   // allow arbitrary feature strings

/**
 * Filter options for ChainRegistry queries.
 * All fields are AND-ed together when multiple are provided.
 */
export interface ChainFilter {
  /**
   * Only include chains that have ALL listed features.
   * e.g. `["EIP155", "EIP1559"]` → chain must support both.
   */
  features?: EvmFeature[]

  /**
   * Only include chains whose status is NOT in this list.
   * Common values: "deprecated", "incubating".
   * Default exclusion list: ["deprecated"].
   */
  excludeStatus?: string[]

  /**
   * Only include chains that have NO redFlags.
   * When true, chains with `redFlags: ["reusedChainId", ...]` are excluded.
   */
  excludeRedFlags?: boolean

  /**
   * Only include chains whose RPC list contains at least one endpoint that
   * does NOT require an API key template substitution (e.g. `${INFURA_API_KEY}`).
   */
  publicRpcOnly?: boolean

  /**
   * Only include chains matching this `chain` string (e.g. "ETH", "MATIC").
   */
  chain?: string

  /**
   * Only include chains whose name contains this substring (case-insensitive).
   */
  nameLike?: string
}

/**
 * An RPC endpoint resolved for a specific chain, with metadata
 * useful for verifier deployment decisions.
 */
export interface ResolvedRpcEndpoint {
  chainId: number
  chainName: string
  url: string
  /** true if the URL contains an API key template placeholder */
  requiresApiKey: boolean
  /** Protocol: "wss" | "https" | "http" */
  protocol: "wss" | "https" | "http" | string
}

/**
 * Result of `getVerifierDeploymentTargets` — a ranked list of chains
 * suitable for deploying a Veraciphers ZK verifier contract.
 */
export interface VerifierDeploymentTarget {
  chain: ChainRecord
  /** Public (no API key) HTTPS RPC endpoints, ranked by preference */
  publicHttpsRpcs: string[]
  /** All RPC endpoints (may include wss:// and template URLs) */
  allRpcs: string[]
  /** Primary block explorer URL if available */
  explorerUrl: string | undefined
  /** True if chain supports EIP-1559 fee market */
  supportsEIP1559: boolean
  /** True if chain has ENS registry */
  hasEns: boolean
}
