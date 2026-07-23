import { defineConfig } from 'vite'

export default defineConfig({
  base: '/hiz.log/',
  server: {
    host: '127.0.0.1',
    port: 3000
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true
  }
})
