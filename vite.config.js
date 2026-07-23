import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import injectPlugin from 'vite-plugin-html-inject'

const inputs = {}

function findHtmlFiles(dirPath, baseKey = '') {
  const files = fs.readdirSync(dirPath)

  files.forEach(file => {
    const fullPath = resolve(dirPath, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // Сохраняем имя папки целиком (например, "hiz.html" или "hiz.log")
      const nextKey = baseKey ? `${baseKey}/${file}` : file
      findHtmlFiles(fullPath, nextKey)
    } else if (file.endsWith('.html')) {
      // Обрезаем расширение только у самого HTML-файла
      const name = file.replace('.html', '')
      const finalKey = baseKey ? `${baseKey}/${name}` : name

      inputs[finalKey] = fullPath
    }
  })
}

// 1. Принудительно добавляем файлы из корня проекта
inputs['index'] = resolve(__dirname, 'index.html')
inputs['projects'] = resolve(__dirname, 'projects.html')

// 2. Сканируем папку pages (она соберет и pages/hiz.log, и pages/hiz.html)
const pagesDir = resolve(__dirname, 'pages')
if (fs.existsSync(pagesDir)) {
  findHtmlFiles(pagesDir, 'pages') // Передаем 'pages', чтобы сохранить эту папку в путях
}

export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '/' : '/hiz.log/', // Репозиторий на GitHub называется hiz.log
    plugins: [
      injectPlugin()
    ],
    server: {
      host: '127.0.0.1',
      port: 3000,
      open: true
    },
    build: {
      outDir: 'docs',
      emptyOutDir: true,
      rollupOptions: {
        input: inputs
      }
    }
  }
})
