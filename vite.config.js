import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      "^/api/v1/": {
        target: "http://192.168.0.127:8087",
        pathReWrite: { '^/api/v1': '/api/v1' }
      },
      "^/api/": {
        target: "http://localhost:3000",
        pathReWrite: { '^/api': '/api' },
      },
      "^/alfresco/": {
        target: "http://192.168.0.109:8080",
        pathReWrite: { '^/alfresco': '/alfresco' }
      }
    }
  }
})
