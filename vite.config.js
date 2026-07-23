import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'

// Автоматически находим твой плагин для работы <load src="...">
const pkg = JSON.parse(fs.readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
const pluginName = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
  .find(name => name.includes('html') || name.includes('inject') || name.includes('include'))

let injectPlugin = () => ({ name: 'noop' })
if (pluginName) {
  const mod = await import(pluginName)
  injectPlugin = mod.default || mod
}

// Эта функция ищет ВСЕ HTML-файлы, даже если они лежат глубоко в папках
const getAllHtmlInputs = () => {
  const inputs = { main: resolve(__dirname, 'index.html') }

  // Ищем в корне
  fs.readdirSync(__dirname).forEach(file => {
    if (file.endsWith('.html') && file !== 'index.html') {
      inputs[file.replace('.html', '')] = resolve(__dirname, file)
    }
  })

  // Ищем внутри папки pages и во всех её подпапках
  const findHtmlFiles = (dir, baseKey = 'pages') => {
    if (!fs.existsSync(dir)) return
    fs.readdirSync(dir).forEach(file => {
      const fullPath = resolve(dir, file)
      if (fs.statSync(fullPath).isDirectory()) {
        findHtmlFiles(fullPath, `${baseKey}/${file}`) // Заходим внутрь папки
      } else if (file.endsWith('.html')) {
        const name = file.replace('.html', '')
        inputs[`${baseKey}/${name}`] = fullPath // Забираем файл
      }
    })
  }

  findHtmlFiles(resolve(__dirname, 'pages'))
  return inputs
}

export default defineConfig({
  base: '/hiz.log/', // Путь для GitHub Pages
  plugins: [
    injectPlugin() // Запускаем твой плагин вставок
  ],
  server: {
    host: '127.0.0.1',
    port: 3000,
    open: true
  },
  build: {
    outDir: 'docs', // Собираем в docs
    emptyOutDir: true,
    rollupOptions: {
      input: getAllHtmlInputs() // Передаем все найденные страницы
    }
  }
})
