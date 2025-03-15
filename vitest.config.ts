import path from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';
import { entries, useRootDirname } from './scripts/utils';

const rootDirname = useRootDirname();

export default defineConfig({
  resolve: {
    alias: entries.reduce((aliases, entry) => ({
      ...aliases, [`@foscia/${entry}`]: path.resolve(rootDirname, 'packages', entry, 'src'),
    }), {}),
  },
  test: {
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'istanbul',
      all: true,
      include: ['packages/*/src/**'],
      exclude: [...(configDefaults.coverage.exclude ?? []), 'packages/cli/src/**'],
    },
    typecheck: {
      tsconfig: path.resolve(rootDirname, 'tsconfig.json'),
    },
  },
});
