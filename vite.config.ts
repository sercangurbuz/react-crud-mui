import { resolve } from 'path';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

import pkg from './package.json';

const deps = Object.keys(pkg.dependencies);

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup/setup.ts'],
  },
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
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.build.json'),
      include: ['src/index.ts', 'src/components'],
      copyDtsFiles: true,
    }),
  ],
});
