/**
 * @file telescope.config.ts
 * Axioledger v2.0 (Genesis Milestone) — @cosmology/telescope Protobuf Codegen
 *
 * Đọc .proto files từ external/cosmos/* và packages/axioledger/*/proto/,
 * sinh TypeScript clients ra packages/axioledger/sdk/src/generated/.
 *
 * Chạy:
 *   pnpx telescope transpile --config toolchain/build-scripts/telescope.config.ts
 *
 * Tham khảo: https://github.com/cosmology-tech/telescope
 */

import type { TelescopeOptions } from "@cosmology/telescope"

const config: TelescopeOptions = {
  // ── Protobuf Input Sources ─────────────────────────────────────────────────
  // Thứ tự ưu tiên: external/cosmos/* trước, custom Axioledger proto sau
  protoDirs: [
    // ── Go Core (sau khi chạy fork-cosmos-cores.sh) ──
    "external/cosmos/cosmos-sdk/proto",
    "external/cosmos/cosmos-sdk/third_party/proto",
    "external/cosmos/ibc-go/proto",
    "external/cosmos/interchain-security/proto",
    "external/cosmos/tokenfactory/proto",
    // ── packages/axioledger/* workspace stubs ──
    "packages/axioledger/cosmos-sdk/proto",
    "packages/axioledger/ibc-go/proto",
    "packages/axioledger/tokenfactory/proto",
    "packages/axioledger/interchain-security/proto",
    // ── Custom Axioledger Protobuf definitions ──
    "toolchain/proto",
  ],

  // ── Output: packages/axioledger/sdk/src/generated ─────────────────────────
  outPath: "packages/axioledger/sdk/src/generated",

  // ── Packages cần sinh types (Cosmos SDK modules) ──────────────────────────
  packages: [
    // Auth
    "cosmos.auth.v1beta1",
    // Bank
    "cosmos.bank.v1beta1",
    // Staking
    "cosmos.staking.v1beta1",
    // Governance v1 + v1beta1
    "cosmos.gov.v1",
    "cosmos.gov.v1beta1",
    // Distribution (validator rewards)
    "cosmos.distribution.v1beta1",
    // Slashing (slash evidence)
    "cosmos.slashing.v1beta1",
    // Transaction
    "cosmos.tx.v1beta1",
    // Base types (Coin, Dec, Int…)
    "cosmos.base.v1beta1",
    "cosmos.base.query.v1beta1",
    "cosmos.base.tendermint.v1beta1",
    // Upgrade module
    "cosmos.upgrade.v1beta1",
    // IBC core
    "ibc.core.channel.v1",
    "ibc.core.client.v1",
    "ibc.core.connection.v1",
    // IBC applications
    "ibc.applications.transfer.v1",
    "ibc.applications.interchain_accounts.v1",
    // Tokenfactory (5-Token Suite)
    "osmosis.tokenfactory.v1beta1",
  ],

  // ── Code Generation Options ────────────────────────────────────────────────
  options: {
    // Protobuf encode / decode / fromJSON / toJSON / fromPartial
    prototypes: {
      enabled: true,
      parser: {
        keepCase: false,       // camelCase output
      },
      methods: {
        encode:      true,
        decode:      true,
        fromJSON:    true,
        toJSON:      true,
        fromPartial: true,
      },
      includePackageVar: false,
      typingsFormat: {
        useDeepPartial: false,
        useExact:       false,
        timestamp:      "date",
        duration:       "duration",
        customTypes: {
          useCosmosSDKDec: true,
        },
      },
      // Amino JSON converters (Ledger hardware wallet support)
      includeAminos: true,
    },

    // Amino encoding (Keplr / Ledger signing)
    aminoEncoding: {
      enabled: true,
    },

    // LCD/REST query clients (cosmjs QueryClient)
    lcdClients: {
      enabled: true,
    },

    // RPC clients (Tendermint RPC)
    rpcClients: {
      enabled:    true,
      extensions: true,
      camelCase:  true,
    },

    // Stargate signing client bundle
    stargateClients: {
      enabled: true,
      includeCosmosDefaultAminoConverters: true,
    },

    // TypeScript interfaces (useUnionTypes = false → discriminated unions off)
    interfaces: {
      enabled:       true,
      useUnionTypes: false,
    },

    // Bundle: sinh index.ts export toàn bộ generated types
    bundle: {
      enabled: true,
    },

    // Auto-generated code — tắt eslint, tắt tsc strict
    tsDisable: {
      disableAll: false,
    },
    eslintDisable: {
      disableAll: true,
    },

    // Axioledger quản lý package.json thủ công — không tự sinh
    packages: {
      disabled: true,
    },
  },
}

export default config
