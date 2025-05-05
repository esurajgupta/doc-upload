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
        target: "http://localhost:8087",
        pathReWrite: { '^/api/v1': '/api/v1' }
      },
      // "^/api/": {
      //   target: "http://localhost:3000",
      //   pathReWrite: { '/api': '/api' },
      // },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      "^/alfresco/": {
        target: "http://localhost:8081",
        pathReWrite: { '^/alfresco': '/alfresco' }
      }
    }
  }
})
