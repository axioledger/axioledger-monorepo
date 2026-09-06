/**
 * @veraciphers/on-chain-verifier — ChainRegistry Test Suite
 *
 * Uses a small inline fixture (not the full 77k-line chains.json) so tests run
 * in milliseconds and are not coupled to external data changes.
 */
import { describe, it, expect, beforeEach } from "vitest"
import { ChainRegistry } from "../chain-registry.js"
import type { ChainRecord } from "../chain-types.js"

// ---------------------------------------------------------------------------
// Fixture: minimal chain records that exercise all query paths
// ---------------------------------------------------------------------------

const CHAINS: ChainRecord[] = [
  {
    name: "Ethereum Mainnet",
    chain: "ETH",
    rpc: [
      "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
      "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
      "https://cloudflare-eth.com",
      "https://ethereum-rpc.publicnode.com",
    ],
    features: [{ name: "EIP155" }, { name: "EIP1559" }],
    faucets: [],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    infoURL: "https://ethereum.org",
    shortName: "eth",
    chainId: 1,
    networkId: 1,
    slip44: 60,
    ens: { registry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" },
    explorers: [
      { name: "etherscan", url: "https://etherscan.io", standard: "EIP3091" },
    ],
  },
  {
    name: "Polygon Mainnet",
    chain: "MATIC",
    rpc: [
      "https://polygon-rpc.com",
      "https://rpc-mainnet.matic.network",
      "https://matic-mainnet.chainstacklabs.com",
    ],
    features: [{ name: "EIP155" }, { name: "EIP1559" }],
    faucets: [],
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    infoURL: "https://polygon.technology",
    shortName: "matic",
    chainId: 137,
    networkId: 137,
    explorers: [
      { name: "polygonscan", url: "https://polygonscan.com", standard: "EIP3091" },
    ],
  },
  {
    name: "BNB Smart Chain Mainnet",
    chain: "BSC",
    rpc: [
      "https://bsc-dataseed.binance.org",
      "https://bsc-dataseed1.defibit.io",
    ],
    features: [{ name: "EIP155" }],   // no EIP1559
    faucets: [],
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    infoURL: "https://www.bnbchain.org",
    shortName: "bnb",
    chainId: 56,
    networkId: 56,
    explorers: [
      { name: "bscscan", url: "https://bscscan.com", standard: "EIP3091" },
    ],
  },
  {
    name: "Goerli Testnet",
    chain: "ETH",
    rpc: [
      "https://goerli.infura.io/v3/${INFURA_API_KEY}",
      "https://ethereum-goerli-rpc.publicnode.com",
    ],
    features: [{ name: "EIP155" }, { name: "EIP1559" }],
    faucets: ["https://faucet.goerli.mudit.blog"],
    nativeCurrency: { name: "Goerli Ether", symbol: "ETH", decimals: 18 },
    infoURL: "https://goerli.net",
    shortName: "gor",
    chainId: 5,
    networkId: 5,
    status: "deprecated",
    explorers: [
      { name: "etherscan-goerli", url: "https://goerli.etherscan.io", standard: "EIP3091" },
    ],
  },
  {
    name: "Expanse Network",
    chain: "EXP",
    rpc: ["https://node.expanse.tech"],
    faucets: [],
    nativeCurrency: { name: "Expanse", symbol: "EXP", decimals: 18 },
    infoURL: "https://expanse.tech",
    shortName: "exp",
    chainId: 2,
    networkId: 1,
    // No features → will be excluded from verifier targets
  },
  {
    name: "Flagged Chain",
    chain: "FLAG",
    rpc: ["https://rpc.flaggedchain.io"],
    faucets: [],
    nativeCurrency: { name: "Flag", symbol: "FLAG", decimals: 18 },
    infoURL: "https://example.com",
    shortName: "flag",
    chainId: 9999,
    networkId: 9999,
    features: [{ name: "EIP155" }],
    redFlags: ["reusedChainId"],
  },
]

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ChainRegistry — getById / getByShortName / getByName", () => {
  let registry: ChainRegistry

  beforeEach(() => { registry = ChainRegistry.fromArray(CHAINS) })

  it("finds Ethereum Mainnet by chainId 1", () => {
    const chain = registry.getById(1)
    expect(chain?.name).toBe("Ethereum Mainnet")
    expect(chain?.chain).toBe("ETH")
  })

  it("returns undefined for unknown chainId", () => {
    expect(registry.getById(99999)).toBeUndefined()
  })

  it("finds by shortName (case-insensitive)", () => {
    expect(registry.getByShortName("ETH")?.chainId).toBe(1)
    expect(registry.getByShortName("matic")?.chainId).toBe(137)
    expect(registry.getByShortName("BNB")?.chainId).toBe(56)
  })

  it("returns undefined for unknown shortName", () => {
    expect(registry.getByShortName("xyz")).toBeUndefined()
  })

  it("finds by exact name (case-insensitive)", () => {
    expect(registry.getByName("ethereum mainnet")?.chainId).toBe(1)
    expect(registry.getByName("Polygon Mainnet")?.chainId).toBe(137)
  })

  it("size returns total chain count", () => {
    expect(registry.size).toBe(CHAINS.length)
  })
})

describe("ChainRegistry — filter()", () => {
  let registry: ChainRegistry

  beforeEach(() => { registry = ChainRegistry.fromArray(CHAINS) })

  it("filters by single feature (EIP1559)", () => {
    const eip1559 = registry.filter({ features: ["EIP1559"] })
    const names = eip1559.map((c) => c.name)
    // Ethereum, Polygon, Goerli (deprecated but not excluded unless excludeStatus)
    expect(names).toContain("Ethereum Mainnet")
    expect(names).toContain("Polygon Mainnet")
    expect(names).not.toContain("BNB Smart Chain Mainnet")
    expect(names).not.toContain("Expanse Network")
  })

  it("filters by multiple features (EIP155 AND EIP1559)", () => {
    const both = registry.filter({ features: ["EIP155", "EIP1559"] })
    for (const chain of both) {
      expect(chain.features?.some((f) => f.name === "EIP155")).toBe(true)
      expect(chain.features?.some((f) => f.name === "EIP1559")).toBe(true)
    }
  })

  it("excludes deprecated chains by default", () => {
    const result = registry.filter({ features: ["EIP1559"] })
    expect(result.map((c) => c.name)).not.toContain("Goerli Testnet")
  })

  it("includes deprecated chains when excludeStatus is empty", () => {
    const result = registry.filter({ features: ["EIP1559"], excludeStatus: [] })
    expect(result.map((c) => c.name)).toContain("Goerli Testnet")
  })

  it("excludes chains with redFlags when excludeRedFlags=true", () => {
    const result = registry.filter({ excludeRedFlags: true })
    expect(result.map((c) => c.name)).not.toContain("Flagged Chain")
  })

  it("includes flagged chains when excludeRedFlags is not set", () => {
    const result = registry.filter({ excludeStatus: [] })
    expect(result.map((c) => c.name)).toContain("Flagged Chain")
  })

  it("filters by publicRpcOnly — excludes chains with only template RPCs", () => {
    // Goerli has one public RPC; Ethereum has public RPCs alongside template ones
    const result = registry.filter({ publicRpcOnly: true, excludeStatus: [] })
    const names = result.map((c) => c.name)
    expect(names).toContain("Ethereum Mainnet")
    expect(names).toContain("Polygon Mainnet")
    expect(names).toContain("Goerli Testnet")  // has publicnode.com
  })

  it("filters by chain string", () => {
    const ethChains = registry.filter({ chain: "ETH", excludeStatus: [] })
    expect(ethChains.every((c) => c.chain === "ETH")).toBe(true)
    expect(ethChains.length).toBeGreaterThanOrEqual(2)  // mainnet + goerli
  })

  it("filters by nameLike substring (case-insensitive)", () => {
    const results = registry.filter({ nameLike: "mainnet" })
    expect(results.length).toBeGreaterThanOrEqual(3)
    expect(results.every((c) => c.name.toLowerCase().includes("mainnet"))).toBe(true)
  })

  it("search() is a shorthand for nameLike filter", () => {
    const results = registry.search("polygon")
    expect(results.map((c) => c.name)).toContain("Polygon Mainnet")
  })

  it("withFeature() returns chains with specified feature", () => {
    const result = registry.withFeature("EIP1559")
    expect(result.map((c) => c.name)).toContain("Ethereum Mainnet")
    expect(result.map((c) => c.name)).not.toContain("BNB Smart Chain Mainnet")
  })
})

describe("ChainRegistry — RPC endpoint queries", () => {
  let registry: ChainRegistry

  beforeEach(() => { registry = ChainRegistry.fromArray(CHAINS) })

  it("getRpcEndpoints returns all endpoints for chain 1", () => {
    const endpoints = registry.getRpcEndpoints(1)
    expect(endpoints.length).toBe(4)

    const infura = endpoints.find((e) => e.url.includes("infura"))
    expect(infura?.requiresApiKey).toBe(true)
    expect(infura?.protocol).toBe("https")

    const wss = endpoints.find((e) => e.url.startsWith("wss://"))
    expect(wss?.protocol).toBe("wss")
    expect(wss?.requiresApiKey).toBe(true)

    const cloudflare = endpoints.find((e) => e.url.includes("cloudflare"))
    expect(cloudflare?.requiresApiKey).toBe(false)
    expect(cloudflare?.protocol).toBe("https")
  })

  it("getRpcEndpoints returns empty array for unknown chainId", () => {
    expect(registry.getRpcEndpoints(99999)).toHaveLength(0)
  })

  it("getPublicRpcs returns only non-template HTTPS endpoints", () => {
    const rpcs = registry.getPublicRpcs(1)
    expect(rpcs).not.toContain("https://mainnet.infura.io/v3/${INFURA_API_KEY}")
    expect(rpcs).toContain("https://cloudflare-eth.com")
    expect(rpcs).toContain("https://ethereum-rpc.publicnode.com")
    // wss:// should be excluded
    expect(rpcs.every((r) => r.startsWith("https://"))).toBe(true)
  })

  it("getPublicRpcs returns empty array for unknown chain", () => {
    expect(registry.getPublicRpcs(99999)).toHaveLength(0)
  })

  it("resolveRpcs injects API keys into template URLs", () => {
    const resolved = registry.resolveRpcs(1, { INFURA_API_KEY: "MY_KEY_123" })
    expect(resolved).toContain("https://mainnet.infura.io/v3/MY_KEY_123")
    expect(resolved).toContain("wss://mainnet.infura.io/ws/v3/MY_KEY_123")
    // Non-template URLs pass through unchanged
    expect(resolved).toContain("https://cloudflare-eth.com")
  })

  it("resolveRpcs passes through URLs with no matching keys", () => {
    const resolved = registry.resolveRpcs(1, {})
    // Template URLs remain unresolved (no substitution)
    expect(resolved).toContain("https://mainnet.infura.io/v3/${INFURA_API_KEY}")
  })
})

describe("ChainRegistry — getVerifierTargets()", () => {
  let registry: ChainRegistry

  beforeEach(() => { registry = ChainRegistry.fromArray(CHAINS) })

  it("returns only EIP155 chains", () => {
    const targets = registry.getVerifierTargets()
    for (const t of targets) {
      expect(t.chain.features?.some((f) => f.name === "EIP155")).toBe(true)
    }
  })

  it("excludes deprecated chains by default", () => {
    const targets = registry.getVerifierTargets()
    expect(targets.map((t) => t.chain.name)).not.toContain("Goerli Testnet")
  })

  it("excludes chains with redFlags by default", () => {
    const targets = registry.getVerifierTargets()
    expect(targets.map((t) => t.chain.name)).not.toContain("Flagged Chain")
  })

  it("EIP-1559 chains are ranked before non-EIP-1559 chains", () => {
    const targets = registry.getVerifierTargets()
    const eip1559Idx = targets.findIndex((t) => t.supportsEIP1559)
    const nonEip1559Idx = targets.findIndex((t) => !t.supportsEIP1559)
    if (eip1559Idx !== -1 && nonEip1559Idx !== -1) {
      expect(eip1559Idx).toBeLessThan(nonEip1559Idx)
    }
  })

  it("supportsEIP1559 and hasEns are correct for Ethereum Mainnet", () => {
    const target = registry.getVerifierTargets().find((t) => t.chain.chainId === 1)
    expect(target).toBeDefined()
    expect(target?.supportsEIP1559).toBe(true)
    expect(target?.hasEns).toBe(true)
    expect(target?.explorerUrl).toBe("https://etherscan.io")
  })

  it("publicHttpsRpcs excludes template and wss URLs", () => {
    const target = registry.getVerifierTargets().find((t) => t.chain.chainId === 1)
    expect(target?.publicHttpsRpcs.every((r) => r.startsWith("https://"))).toBe(true)
    expect(target?.publicHttpsRpcs.every((r) => !r.includes("${"))).toBe(true)
  })

  it("accepts additional filter constraints", () => {
    const targets = registry.getVerifierTargets({ features: ["EIP155", "EIP1559"] })
    for (const t of targets) {
      expect(t.supportsEIP1559).toBe(true)
    }
    // BNB (EIP155-only, no EIP1559) should not appear
    expect(targets.map((t) => t.chain.name)).not.toContain("BNB Smart Chain Mainnet")
  })

  it("Expanse Network is excluded (no EIP155 feature)", () => {
    const targets = registry.getVerifierTargets()
    expect(targets.map((t) => t.chain.name)).not.toContain("Expanse Network")
  })
})

describe("ChainRegistry — diagnostics", () => {
  let registry: ChainRegistry

  beforeEach(() => { registry = ChainRegistry.fromArray(CHAINS) })

  it("chainTypes returns unique sorted chain strings", () => {
    const types = registry.chainTypes
    expect(types).toContain("ETH")
    expect(types).toContain("MATIC")
    expect(types).toContain("BSC")
    // Should be sorted and deduplicated
    expect(types).toStrictEqual([...new Set(types)].sort())
  })

  it("statuses returns unique status values", () => {
    const statuses = registry.statuses
    expect(statuses).toContain("deprecated")
  })
})
