import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RepoFlowSDK',
      formats: ['es', 'cjs'],
      fileName: (format) => `repoflow-sdk.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [],
    },
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/__tests__/**', 'src/index.ts'],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 50,
        lines: 60,
      },
    },
  },
})
