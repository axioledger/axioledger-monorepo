# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:20-slim AS builder

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* .npmrc ./
COPY toolchain/ ./toolchain/
COPY packages/kinetoprotocol/ ./packages/kinetoprotocol/

RUN pnpm install --frozen-lockfile \
      --filter "@kinetoprotocol/liquidity-node-docker..." \
      --filter "@kinetoprotocol/clamm-engine" \
      --filter "@kinetoprotocol/market-registry" \
      --filter "@kinetoprotocol/intents-engine"

RUN pnpm --filter "@kinetoprotocol/clamm-engine"    build
RUN pnpm --filter "@kinetoprotocol/market-registry" build
RUN pnpm --filter "@kinetoprotocol/intents-engine"  build
RUN pnpm --filter "@kinetoprotocol/liquidity-node-docker" build

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM node:20-slim AS runtime

WORKDIR /app

COPY --from=builder /app/packages/kinetoprotocol/liquidity-node-docker/dist    ./dist
COPY --from=builder /app/packages/kinetoprotocol/clamm-engine/dist             ./packages/clamm-engine/dist
COPY --from=builder /app/packages/kinetoprotocol/market-registry/dist          ./packages/market-registry/dist
COPY --from=builder /app/packages/kinetoprotocol/intents-engine/dist           ./packages/intents-engine/dist
COPY --from=builder /app/node_modules ./node_modules

# Runtime configuration — override at `docker run -e` time
ENV LP_NODE_ID="lp-node-default"
ENV POOL_IDS=""                    # comma-separated pool IDs to manage
ENV REBALANCE_INTERVAL_MS=60000    # how often to rebalance positions (60s)
ENV LOG_LEVEL=info
ENV PORT=8090

EXPOSE 8090

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:8090/health').then(r=>r.ok||process.exit(1)).catch(()=>process.exit(1))"

CMD ["node", "--experimental-vm-modules", "dist/entrypoint.js"]
