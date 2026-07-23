import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'

// Автоматически вытаскиваем первый попавшийся HTML плагин из твоего package.json
const pkg = JSON.parse(fs.readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
const pluginName = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
  .find(name => name.includes('html') || name.includes('inject') || name.includes('include'))

// Динамически импортируем твой плагин
let injectPlugin = () => ({ name: 'noop' })
if (pluginName) {
  const mod = await import(pluginName)
  injectPlugin = mod.default || mod
}

// Собираем абсолютно все HTML-файлы, которые найдём
const getAllHtmlInputs = () => {
  const inputs = { main: resolve(__dirname, 'index.html') }

  // Файлы из корня
  fs.readdirSync(__dirname).forEach(file => {
    if (file.endsWith('.html') && file !== 'index.html') {
      inputs[file.replace('.html', '')] = resolve(__dirname, file)
    }
  })

  // Файлы из /pages
  const pagesDir = resolve(__dirname, 'pages')
  if (fs.existsSync(pagesDir)) {
    fs.readdirSync(pagesDir).forEach(file => {
      const filePath = resolve(pagesDir, file)
      if (fs.statSync(filePath).isFile() && file.endsWith('.html')) {
        inputs[`pages/${file.replace('.html', '')}`] = filePath
      }
    })
  }
  return inputs
}

export default defineConfig({
  base: '/hiz.log/',
  plugins: [
    injectPlugin() // Твой плагин для работы <load src="...">
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
      input: getAllHtmlInputs()
    }
  }
})
