import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'

// Автоматически собираем все HTML-страницы из папки pages
const getPages = () => {
  const pagesDir = resolve(__dirname, 'pages')
  if (!fs.existsSync(pagesDir)) return {}

  const files = fs.readdirSync(pagesDir)
  const pages = {}

  files.forEach(file => {
    const filePath = resolve(pagesDir, file)
    // Проверяем, что это файл, а не папка, и что он заканчивается на .html
    if (fs.statSync(filePath).isFile() && file.endsWith('.html')) {
      const name = file.replace('.html', '')
      pages[name] = filePath
    }
  })
  return pages
}


export default defineConfig({
  // Настройки локального сервера
  server: {
    host: '127.0.0.1',
    port: 3000,
    open: true // Автоматически откроет браузер при старте
  },
  // Настройки сборки
  build: {
    outDir: 'docs', // Собирает всё в папку docs
    emptyOutDir: true, // Очищает docs перед новой сборкой
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // Главная страница в корне
        ...getPages() // Автоматически подмешивает все остальные страницы из /pages
      }
    }
  }
})
