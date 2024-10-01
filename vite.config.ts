import { resolve } from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import pkg from './package.json';
const deps = Object.keys(pkg.dependencies);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'coreui',
    },
    rollupOptions: {
      external: deps,
    },
  },
  plugins: [
    nodeResolve(),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    dts({ include: ['src/index.ts', 'src/components'], copyDtsFiles: true }),
  ],
})
