// ============================================================
// ecosystem.config.cjs — Axioledger Monorepo PM2
// Node: /opt/nvm/versions/node/v22.23.2
// Interpreter: /opt/nvm/versions/node/v22.23.2/bin/node
// ============================================================

const NODE = "/opt/nvm/versions/node/v22.23.2/bin/node"
const PNPM = "/opt/nvm/versions/node/v22.23.2/bin/pnpm"
const ROOT = "/root/workspage/Axioledger_Monorepo"

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
    cwd: `${ROOT}/${dir}`,
    script: PNPM,
    args: "run dev",
    interpreter: NODE,
    interpreter_args: "",
    env: {
      NODE_ENV: "development",
      PORT: String(port),
      PATH: `/opt/nvm/versions/node/v22.23.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin`,
    },
    watch: false,
    autorestart: true,
    restart_delay: 3000,
    max_restarts: 5,
    merge_logs: true,
    out_file: `/root/.pm2/logs/${name}-out.log`,
    error_file: `/root/.pm2/logs/${name}-error.log`,
  })),
}
