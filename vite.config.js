import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import inject from 'vite-plugin-html-inject' // ПОДСТАВЬ СЮДА СВОЙ ИМПОРТ ПЛАГИНА (как было у тебя на 25 строчке)

// Автоматически собираем все HTML-страницы из папки pages
const getPages = () => {
  const pagesDir = resolve(__dirname, 'pages')
  if (!fs.existsSync(pagesDir)) return {}

  const files = fs.readdirSync(pagesDir)
  const pages = {}

  files.forEach(file => {
    const filePath = resolve(pagesDir, file)
    if (fs.statSync(filePath).isFile() && file.endsWith('.html')) {
      const name = file.replace('.html', '')
      pages[name] = filePath
    }
  })
  return pages
}

export default defineConfig({
  // Возвращаем твой плагин для вставок <load src="...">
  plugins: [
    inject()
  ],
  // Настройки локального сервера
  server: {
    host: '127.0.0.1',
    port: 3000,
    open: true
  },
  // Настройки сборки
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...getPages()
      }
    }
  }
})
