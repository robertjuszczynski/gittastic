import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

function findIpcHandlerFiles(dir: string): string[] {
  const results: string[] = []
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        results.push(...findIpcHandlerFiles(full))
      } else if (
        /^register-.+-ipc-handlers\.ts$/.test(entry.name) &&
        entry.name !== 'register-ipc-handlers.ts'
      ) {
        results.push(entry.name.replace('.ts', ''))
      }
    }
  } catch { /* directory doesn't exist */ }
  return results
}

const requireIpcHandlerRegistration = {
  meta: { type: 'problem' as const, schema: [] },
  create(context: any) {
    if (!context.filename.endsWith('register-ipc-handlers.ts')) return {}

    const imported: string[] = []

    return {
      ImportDeclaration(node: any) {
        imported.push(node.source.value)
      },
      'Program:exit'(node: any) {
        const handlers = findIpcHandlerFiles(join(import.meta.dirname, 'src/main'))
        for (const name of handlers) {
          if (!imported.some((s) => s.endsWith(name))) {
            context.report({ node, message: `'${name}' is not registered in registerIpcHandlers()` })
          }
        }
      },
    }
  },
}

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'no-console': 'warn',
      'no-debugger': 'error',
    },
  },
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['src/main/ipc/register-ipc-handlers.ts'],
    plugins: { local: { rules: { 'require-ipc-handler-registration': requireIpcHandlerRegistration } } },
    rules: { 'local/require-ipc-handler-registration': 'error' },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    extends: [pluginReact.configs.flat.recommended],
    settings: {
      react: { version: 'detect' },
    },
  },
])
