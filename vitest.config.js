import typescript from '@rollup/plugin-typescript';
import { createRequire } from 'node:module';
import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { useRootDirname } from './scripts/utils.js';

const require = createRequire(import.meta.url);

const packages = require('./scripts/entries.cjs')();
const rootDirname = useRootDirname();

export default defineConfig({
  resolve: {
    alias: packages.reduce((aliases, pkg) => ({
      ...aliases, [pkg.path]: path.resolve(rootDirname, 'packages', pkg.name, 'src'),
    }), {}),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
    },
    typecheck: {
      tsconfig: path.resolve(rootDirname, 'tsconfig.json'),
    },
  },
  plugins: [
    typescript({
      tsconfig: path.resolve(rootDirname, 'tsconfig.json'),
      sourceMap: true,
      inlineSources: true,
    }),
  ],
});
