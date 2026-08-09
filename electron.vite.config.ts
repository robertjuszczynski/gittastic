import { defineConfig } from 'electron-vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['node-pty'],
      },
      lib: {
        entry: resolve('src/app/main/index.ts')
      }
    },
    resolve: {
      alias: {
        '@': resolve('src/main'),
        '@main': resolve('src/main'),
        '@shared': resolve('src/shared'),
      },
    },
  },
  preload: {
    build: {
      lib: {
        entry: {
          index: resolve('src/app/preload/index.ts'),
          onboarding: resolve('src/app/preload/onboarding-preload.ts'),
        }
      }
    },
    resolve: {
      alias: {
        '@shared': resolve('src/shared')
      }
    }
  },
  renderer: {
    root: resolve('src'),
    build: {
      rollupOptions: {
        input: {
          main: resolve('src/app/renderer/index.html'),
          onboarding: resolve('src/onboarding/renderer/index.html'),
        },
      },
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer'),
        '@onboarding': resolve('src/onboarding/renderer'),
        '@shared': resolve('src/shared'),
      },
    },
  },
})
