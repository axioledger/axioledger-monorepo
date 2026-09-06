# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:20-slim AS builder

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* .npmrc ./
COPY toolchain/ ./toolchain/
COPY packages/veraciphers/ ./packages/veraciphers/

RUN pnpm install --frozen-lockfile \
      --filter "@veraciphers/zk-prover-runtime..." \
      --filter "@veraciphers/circuit-compiler"

RUN pnpm --filter "@veraciphers/circuit-compiler" build
RUN pnpm --filter "@veraciphers/zk-prover-runtime" build

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
# NVIDIA CUDA base for GPU-accelerated Halo2/PlonKy2 proving.
# Change to node:20-slim if running on CPU-only hardware.
FROM nvidia/cuda:12.3.1-runtime-ubuntu22.04 AS runtime

# Install Node.js 20 in the CUDA image
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/packages/veraciphers/zk-prover-runtime/dist ./dist
COPY --from=builder /app/packages/veraciphers/circuit-compiler/dist  ./packages/circuit-compiler/dist
COPY --from=builder /app/node_modules ./node_modules

# Runtime configuration
ENV PROVER_BACKEND=halo2
ENV PROVER_TARGET_MS=100
ENV MAX_CONCURRENT_PROOFS=8
ENV LOG_LEVEL=info
ENV PORT=7050

EXPOSE 7050

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:7050/health').then(r=>r.ok||process.exit(1)).catch(()=>process.exit(1))"

CMD ["node", "--experimental-vm-modules", "dist/entrypoint.js"]
