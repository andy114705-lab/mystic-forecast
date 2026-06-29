import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'lunar-javascript': path.resolve(__dirname, 'vendor/lunar-javascript/index.js'),
      'taibu-core/liuyao': path.resolve(__dirname, 'vendor/taibu-core/dist/domains/liuyao/index.js'),
    },
  },
  optimizeDeps: {
    include: ['lunar-javascript'],
  },
  build: {
    outDir: 'dist',
  },
})
