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
      // Передаем вложенность дальше
      findHtmlFiles(fullPath, baseKey ? `${baseKey}/${file}` : file)
    } else if (file.endsWith('.html')) {
      const name = file.replace('.html', '')
      let finalKey = baseKey ? `${baseKey}/${name}` : name

      // ХАК: Если ключ начинается с "pages/", вырезаем его к чертям
      if (finalKey.startsWith('pages/')) {
        finalKey = finalKey.replace('pages/', '')
      }

      inputs[finalKey] = fullPath
    }
  })
}

// Принудительно кидаем корень в корень билда
inputs['index'] = resolve(__dirname, 'index.html')
inputs['projects'] = resolve(__dirname, 'projects.html')

// Сканируем остальную структуру
const pagesDir = resolve(__dirname, 'pages')
if (fs.existsSync(pagesDir)) {
  findHtmlFiles(pagesDir)
}

export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '/' : '/hiz.log/',
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
