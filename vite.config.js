import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import inject from 'vite-plugin-html-inject' // Твой импорт плагина для вставок <load src="...">

// Функция корректного получения путей для Vite
const getPages = () => {
  const pagesDir = resolve(__dirname, 'pages')
  if (!fs.existsSync(pagesDir)) return {}

  const files = fs.readdirSync(pagesDir)
  const pages = {}

  files.forEach(file => {
    const filePath = resolve(pagesDir, file)
    // Строго отсекаем папки (как hiz.html), берем только файлы .html
    if (fs.statSync(filePath).isFile() && file.endsWith('.html')) {
      const name = file.replace('.html', '')
      // Передаем относительный путь от корня, чтобы Vite прогонял файл через плагины
      pages[name] = `pages/${file}`
    }
  })
  return pages
}

export default defineConfig({
  // Базовый путь для корректных ссылок на GitHub Pages
  base: '/hiz.log/',

  // Подключаем твой плагин для сборки вставок
  plugins: [
    inject()
  ],

  // Настройки локального сервера
  server: {
    host: '127.0.0.1',
    port: 3000,
    open: true
  },

  // Настройки сборки в папку docs
  build: {
    outDir: 'docs',
    emptyOutDir: true, // Чистим папку перед каждым билдом
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // Главная страница
        ...getPages() // Все остальные страницы из папки pages
      }
    }
  }
})
