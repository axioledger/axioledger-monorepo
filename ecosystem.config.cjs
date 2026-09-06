// ============================================================
// ecosystem.config.cjs — Axioledger Monorepo PM2
// Portable: không hardcode paths — chạy được trên mọi môi trường
// (WSL, Linux server, Codespaces, Docker container)
// ============================================================

const path = require("path")
const os   = require("os")

// Resolve tự động — không phụ thuộc môi trường cụ thể
const NODE = process.execPath
const PNPM = (() => {
  // Tìm pnpm cạnh node binary, hoặc fallback về PATH
  const nodeDir = path.dirname(process.execPath)
  const candidate = path.join(nodeDir, "pnpm")
  try { require("fs").accessSync(candidate); return candidate } catch {}
  return "pnpm" // fallback: rely on PATH
})()
const ROOT = path.resolve(__dirname)
const PM2_LOGS = path.join(os.homedir(), ".pm2", "logs")

const apps = [
  { name: "craft-portal",  port: 3001, dir: "apps/craft-portal" },
  { name: "dao-dashboard", port: 3002, dir: "apps/dao-dashboard" },
  { name: "docs-site",     port: 3003, dir: "apps/docs-site" },
  { name: "exchange-web",  port: 3004, dir: "apps/exchange-web" },
  { name: "pay-gateway",   port: 3005, dir: "apps/pay-gateway" },
  { name: "wallet-web",    port: 3006, dir: "apps/wallet-web" },
]

module.exports = {
  apps: apps.map(({ name, port, dir }) => ({
    name,
    cwd:         path.join(ROOT, dir),
    script:      PNPM,
    args:        "run dev",
    interpreter: NODE,
    interpreter_args: "",
    env: {
      NODE_ENV: "development",
      PORT:     String(port),
    },
    watch:         false,
    autorestart:   true,
    restart_delay: 3000,
    max_restarts:  5,
    merge_logs:    true,
    out_file:   path.join(PM2_LOGS, `${name}-out.log`),
    error_file: path.join(PM2_LOGS, `${name}-error.log`),
  })),
}
