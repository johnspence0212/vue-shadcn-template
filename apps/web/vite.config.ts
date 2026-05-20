import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const apiProxyTarget =
  process.env.VITE_API_PROXY_TARGET?.replace(/\/api\/?$/, '') ?? 'http://localhost:5000'

// https://vite.dev/config/
export default defineConfig({
  root: fileURLToPath(new URL('./', import.meta.url)),
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true
      }
    }
  }
})
