# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-slim AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copy workspace manifests for layer-cache efficiency
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* .npmrc ./
COPY toolchain/ ./toolchain/
COPY packages/sequentichain/ ./packages/sequentichain/

# Install only production + build deps
RUN pnpm install --frozen-lockfile --filter "@sequentichain/docker-runtime..." \
      --filter "@sequentichain/sequencer-node" \
      --filter "@sequentichain/async-task-runner"

# Build
RUN pnpm --filter "@sequentichain/sequencer-node" build
RUN pnpm --filter "@sequentichain/async-task-runner" build
RUN pnpm --filter "@sequentichain/docker-runtime" build

# ─── Stage 2: Runtime ────────────────────────────────────────────────────────
FROM node:20-slim AS runtime

# CAP_NET_RAW is required for AF_XDP zero-copy socket access.
# Grant it explicitly — the host must also set --cap-add=NET_RAW.
# Phase 2: replace with a custom Rust binary that bypasses Node.js entirely.

WORKDIR /app

# Copy only the built artifacts and production node_modules
COPY --from=builder /app/packages/sequentichain/docker-runtime/dist ./dist
COPY --from=builder /app/packages/sequentichain/sequencer-node/dist  ./packages/sequencer-node/dist
COPY --from=builder /app/packages/sequentichain/async-task-runner/dist ./packages/async-task-runner/dist
COPY --from=builder /app/node_modules ./node_modules

# Runtime environment variables (override at `docker run` time)
ENV SEQUENCER_ACCOUNT="sequencer.axq"
ENV MAX_BATCH_SIZE=1000
ENV MAX_BATCH_DELAY_MS=200
ENV LOG_LEVEL=info
ENV PORT=8080

EXPOSE 8080

# Health-check: poll the /health endpoint every 30 s
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:8080/health').then(r=>r.ok||process.exit(1)).catch(()=>process.exit(1))"

CMD ["node", "--experimental-vm-modules", "dist/entrypoint.js"]
