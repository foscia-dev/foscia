import path from 'node:path';
import { BuildConfig, defineBuildConfig } from 'unbuild';
import { entries } from './scripts/utils';

export default defineBuildConfig(entries.map((name) => {
  const config: BuildConfig = {
    clean: true,
    declaration: 'compatible',
    rootDir: path.resolve(__dirname, `packages/${name}`),
    entries: [{
      input: 'tmp/index',
      name: 'index',
    }],
    externals: entries.filter((n) => n !== name).map((n) => `@foscia/${n}`),
    rollup: {
      emitCJS: true,
      esbuild: {
        minify: true,
      },
    },
  };

  if (name === 'cli') {
    config.sourcemap = true;
    config.rollup = {
      ...config.rollup,
      inlineDependencies: true,
      resolve: {
        exportConditions: ['production', 'node'],
      },
    };
  }

  return config;
}));
