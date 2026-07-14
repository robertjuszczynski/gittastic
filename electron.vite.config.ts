import { defineConfig } from 'electron-vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: resolve('src/app/main/index.ts')
      }
    },
    resolve: {
      alias: {
        '@': resolve('src/app/main'),
      },
    },
  },
  preload: {
    build: {
      lib: {
        entry: resolve('src/app/preload/index.ts')
      }
    }
  },
  renderer: {
    root: resolve('src'),
    build: {
      rollupOptions: {
        input: resolve('src/app/renderer/index.html'),
      },
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': resolve('src/renderer'),
      },
    },
  },
})
