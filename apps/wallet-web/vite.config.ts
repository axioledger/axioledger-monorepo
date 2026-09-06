import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      // Đảm bảo logo AXQ được đưa vào danh sách precache
      includeAssets: ["icons/AXQ_logo.svg"],

      // Dùng manifest.json thủ công trong public/
      manifest: false,

      workbox: {
        runtimeCaching: [
          {
            // API endpoints: NetworkFirst — fail-visible khi mất mạng
            urlPattern: /^https:\/\/api\.axioledger\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "axio-api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60, // 1 ngày
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Static assets & SVG: CacheFirst để tối ưu tốc độ
            urlPattern: /\.(?:png|jpg|jpeg|svg|css|js|woff2?)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "axio-static-assets",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 ngày
              },
            },
          },
        ],
      },
    }),
  ],
  server: { port: 3006, host: "0.0.0.0", strictPort: true },
  build: {
    target: "es2022",
    outDir: "dist",
  },
})
