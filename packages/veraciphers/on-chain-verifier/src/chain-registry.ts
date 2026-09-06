/**
 * @file chain-registry.ts
 * ChainRegistry — type-safe query engine over chains.json
 *
 * Provides:
 *   - `ChainRegistry.getById(chainId)`         — look up a chain by chainId
 *   - `ChainRegistry.getByShortName(name)`      — look up by shortName (e.g. "eth")
 *   - `ChainRegistry.filter(options)`           — multi-criteria filter
 *   - `ChainRegistry.getRpcEndpoints(chainId)`  — structured RPC endpoint list
 *   - `ChainRegistry.getVerifierTargets()`      — chains ranked for verifier deployment
 *
 * The registry is lazily indexed on first access (O(n) scan → O(1) lookup).
 *
 * chains.json source: https://github.com/ethereum-lists/chains
 * Used by `@veraciphers/on-chain-verifier` for EVM network selection during
 * verifier contract deployment.
 */
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import type {
  ChainFilter,
  ChainRecord,
  EvmFeature,
  ResolvedRpcEndpoint,
  VerifierDeploymentTarget,
} from "./chain-types.js"

// ---------------------------------------------------------------------------
// Lazy JSON loader
// ---------------------------------------------------------------------------

let _cached: ChainRecord[] | null = null

/**
 * Load chains.json from the package root.
 * Cached after first load — safe to call repeatedly.
 */
function loadChains(): ChainRecord[] {
  if (_cached) return _cached
  // Use createRequire so this works in both CJS and ESM contexts.
  const require = createRequire(import.meta.url)
  const __dir = dirname(fileURLToPath(import.meta.url))
  // chains.json lives at the package root (one level above src/)
  const jsonPath = resolve(__dir, "..", "chains.json")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  _cached = require(jsonPath) as ChainRecord[]
  return _cached
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const API_KEY_PATTERN = /\$\{[^}]+\}/

function hasApiKeyTemplate(url: string): boolean {
  return API_KEY_PATTERN.test(url)
}

function urlProtocol(url: string): ResolvedRpcEndpoint["protocol"] {
  if (url.startsWith("wss://")) return "wss"
  if (url.startsWith("https://")) return "https"
  if (url.startsWith("http://")) return "http"
  return url.split("://")[0] ?? "unknown"
}

function chainHasFeature(chain: ChainRecord, feature: string): boolean {
  return chain.features?.some((f) => f.name === feature) ?? false
}

function chainHasAllFeatures(chain: ChainRecord, features: string[]): boolean {
  return features.every((f) => chainHasFeature(chain, f))
}

function publicHttpsRpcs(chain: ChainRecord): string[] {
  return chain.rpc.filter(
    (url) => url.startsWith("https://") && !hasApiKeyTemplate(url)
  )
}

function applyFilter(chain: ChainRecord, filter: ChainFilter): boolean {
  // Feature filter: chain must have ALL requested features
  if (filter.features && filter.features.length > 0) {
    if (!chainHasAllFeatures(chain, filter.features)) return false
  }

  // Status exclusion: skip deprecated / incubating etc.
  const excludeStatus = filter.excludeStatus ?? ["deprecated"]
  if (chain.status && excludeStatus.includes(chain.status)) return false

  // RedFlags exclusion
  if (filter.excludeRedFlags && chain.redFlags && chain.redFlags.length > 0) return false

  // Public RPC filter: at least one non-template https endpoint
  if (filter.publicRpcOnly && publicHttpsRpcs(chain).length === 0) return false

  // Chain string match (exact)
  if (filter.chain && chain.chain !== filter.chain) return false

  // Name substring match (case-insensitive)
  if (filter.nameLike) {
    const needle = filter.nameLike.toLowerCase()
    if (!chain.name.toLowerCase().includes(needle)) return false
  }

  return true
}

// ---------------------------------------------------------------------------
// ChainRegistry
// ---------------------------------------------------------------------------

export class ChainRegistry {
  private readonly chains: ChainRecord[]

  /** Index: chainId → ChainRecord (built lazily) */
  private _byId: Map<number, ChainRecord> | null = null

  /** Index: shortName → ChainRecord (built lazily) */
  private _byShortName: Map<string, ChainRecord> | null = null

  /**
   * Create a ChainRegistry from a pre-loaded array of chain records.
   * In normal usage, call `ChainRegistry.load()` which reads chains.json.
   */
  constructor(chains: ChainRecord[]) {
    this.chains = chains
  }

  /**
   * Load the bundled chains.json and return a ready-to-use registry.
   */
  static load(): ChainRegistry {
    return new ChainRegistry(loadChains())
  }

  /**
   * Create a registry from a custom array (useful for testing).
   */
  static fromArray(chains: ChainRecord[]): ChainRegistry {
    return new ChainRegistry(chains)
  }

  // ---------------------------------------------------------------------------
  // Lazy index builders
  // ---------------------------------------------------------------------------

  private get byId(): Map<number, ChainRecord> {
    if (!this._byId) {
      this._byId = new Map(this.chains.map((c) => [c.chainId, c]))
    }
    return this._byId
  }

  private get byShortName(): Map<string, ChainRecord> {
    if (!this._byShortName) {
      this._byShortName = new Map(this.chains.map((c) => [c.shortName.toLowerCase(), c]))
    }
    return this._byShortName
  }

  // ---------------------------------------------------------------------------
  // Single-record lookups
  // ---------------------------------------------------------------------------

  /**
   * Find a chain by its numeric chainId.
   * @returns `ChainRecord` or `undefined` if not found.
   *
   * @example
   * registry.getById(1)  // → Ethereum Mainnet
   * registry.getById(137) // → Polygon Mainnet
   */
  getById(chainId: number): ChainRecord | undefined {
    return this.byId.get(chainId)
  }

  /**
   * Find a chain by its `shortName` (case-insensitive).
   * @example
   * registry.getByShortName("eth")   // → Ethereum Mainnet
   * registry.getByShortName("matic") // → Polygon Mainnet
   */
  getByShortName(shortName: string): ChainRecord | undefined {
    return this.byShortName.get(shortName.toLowerCase())
  }

  /**
   * Find a chain by its human-readable name (exact match, case-insensitive).
   */
  getByName(name: string): ChainRecord | undefined {
    const lower = name.toLowerCase()
    return this.chains.find((c) => c.name.toLowerCase() === lower)
  }

  // ---------------------------------------------------------------------------
  // Multi-record queries
  // ---------------------------------------------------------------------------

  /**
   * Return all chain records, optionally filtered.
   *
   * @example
   * // All EIP-1559-capable chains with public RPC, no deprecated status
   * registry.filter({ features: ["EIP155", "EIP1559"], publicRpcOnly: true })
   */
  filter(options: ChainFilter = {}): ChainRecord[] {
    return this.chains.filter((c) => applyFilter(c, options))
  }

  /**
   * Return all chains that support a specific EIP feature.
   *
   * @example
   * registry.withFeature("EIP1559")  // → all EIP-1559 chains
   */
  withFeature(feature: EvmFeature): ChainRecord[] {
    return this.chains.filter((c) => chainHasFeature(c, feature))
  }

  /**
   * Return all chains whose name contains the given substring (case-insensitive).
   *
   * @example
   * registry.search("polygon")   // → Polygon Mainnet, Polygon zkEVM, ...
   * registry.search("testnet")   // → all testnets
   */
  search(nameLike: string): ChainRecord[] {
    return this.filter({ nameLike })
  }

  // ---------------------------------------------------------------------------
  // RPC endpoint queries
  // ---------------------------------------------------------------------------

  /**
   * Return all RPC endpoints for a chain as structured `ResolvedRpcEndpoint` objects.
   * Returns an empty array if the chain is not found.
   *
   * @example
   * registry.getRpcEndpoints(1).filter(e => !e.requiresApiKey && e.protocol === "https")
   */
  getRpcEndpoints(chainId: number): ResolvedRpcEndpoint[] {
    const chain = this.getById(chainId)
    if (!chain) return []
    return chain.rpc.map((url) => ({
      chainId: chain.chainId,
      chainName: chain.name,
      url,
      requiresApiKey: hasApiKeyTemplate(url),
      protocol: urlProtocol(url),
    }))
  }

  /**
   * Return only the public (no API key required) HTTPS RPC endpoints for a chain.
   * Sorted by preference: deterministic URLs first (no query params).
   *
   * @example
   * const rpcs = registry.getPublicRpcs(1)
   * // → ["https://cloudflare-eth.com", "https://ethereum-rpc.publicnode.com", ...]
   */
  getPublicRpcs(chainId: number): string[] {
    const chain = this.getById(chainId)
    if (!chain) return []
    const rpcs = publicHttpsRpcs(chain)
    // Simple preference sort: shorter URLs first (proxies and CDNs tend to be more reliable)
    return rpcs.sort((a, b) => a.length - b.length)
  }

  /**
   * Inject an API key into all template RPC URLs for a chain.
   * Template variables like `${INFURA_API_KEY}` are replaced with the provided key.
   *
   * @param chainId  Target chain.
   * @param keys     Map of variable name → value.
   *                 e.g. `{ INFURA_API_KEY: "abc123", ALCHEMY_API_KEY: "xyz" }`
   * @returns Fully resolved RPC URL list (public + injected template URLs).
   *
   * @example
   * registry.resolveRpcs(1, { INFURA_API_KEY: "mykey" })
   * // → ["https://cloudflare-eth.com", "https://mainnet.infura.io/v3/mykey", ...]
   */
  resolveRpcs(chainId: number, keys: Record<string, string>): string[] {
    const chain = this.getById(chainId)
    if (!chain) return []
    return chain.rpc.map((url) => {
      let resolved = url
      for (const [varName, value] of Object.entries(keys)) {
        resolved = resolved.replaceAll(`\${${varName}}`, value)
      }
      return resolved
    })
  }

  // ---------------------------------------------------------------------------
  // Verifier deployment helpers
  // ---------------------------------------------------------------------------

  /**
   * Return chains ranked and scored for deploying a Veraciphers ZK verifier contract.
   *
   * Ranking criteria (in order):
   *   1. Has EIP155 (replay protection) — required for verifier deployment
   *   2. Has EIP1559 — preferred for predictable gas fees
   *   3. Has public HTTPS RPC (no API key needed) — deployment without secrets
   *   4. No redFlags, no deprecated status
   *   5. Has a block explorer for post-deployment verification
   *
   * @param filter  Additional filter constraints applied before ranking.
   *
   * @example
   * // Get EIP-1559 chains with public RPCs for verifier deployment
   * const targets = registry.getVerifierTargets({ features: ["EIP155", "EIP1559"] })
   * const firstTarget = targets[0]
   * console.log(firstTarget?.chain.name, firstTarget?.publicHttpsRpcs[0])
   */
  getVerifierTargets(filter: ChainFilter = {}): VerifierDeploymentTarget[] {
    const baseFilter: ChainFilter = {
      excludeStatus: ["deprecated", "incubating"],
      excludeRedFlags: true,
      ...filter,
    }

    const candidates = this.filter(baseFilter)

    const targets: VerifierDeploymentTarget[] = candidates
      .filter((c) => chainHasFeature(c, "EIP155"))   // EIP155 is mandatory for deployment
      .map((chain) => {
        const httpRpcs = publicHttpsRpcs(chain)
        const explorer = chain.explorers?.find((e) => e.standard === "EIP3091")
        return {
          chain,
          publicHttpsRpcs: httpRpcs.sort((a, b) => a.length - b.length),
          allRpcs: chain.rpc,
          explorerUrl: explorer?.url,
          supportsEIP1559: chainHasFeature(chain, "EIP1559"),
          hasEns: !!chain.ens,
        } satisfies VerifierDeploymentTarget
      })

    // Sort: EIP-1559 first, then by public RPC availability, then by name
    return targets.sort((a, b) => {
      if (a.supportsEIP1559 !== b.supportsEIP1559) return a.supportsEIP1559 ? -1 : 1
      if (a.publicHttpsRpcs.length !== b.publicHttpsRpcs.length) {
        return b.publicHttpsRpcs.length - a.publicHttpsRpcs.length
      }
      return a.chain.name.localeCompare(b.chain.name)
    })
  }

  // ---------------------------------------------------------------------------
  // Diagnostics
  // ---------------------------------------------------------------------------

  /** Total number of chain records in the registry. */
  get size(): number { return this.chains.length }

  /** All unique `chain` string values (e.g. "ETH", "MATIC"). */
  get chainTypes(): string[] {
    return [...new Set(this.chains.map((c) => c.chain))].sort()
  }

  /** All unique status values present in the dataset. */
  get statuses(): string[] {
    const seen = new Set<string>()
    for (const c of this.chains) if (c.status) seen.add(c.status)
    return [...seen].sort()
  }
}
