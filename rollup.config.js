import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { createRequire } from 'node:module';
import path from 'node:path';
import { useRootDirname } from './scripts/utils.js';

const targetPackage = process.env.TARGET;
if (!targetPackage) {
  throw new Error('TARGET package must be specified via --environment flag.');
}

const require = createRequire(import.meta.url);
const rootDirname = useRootDirname();

const sourceMap = !!process.env.SOURCE_MAP;
const minify = !!process.env.MINIFY;

const packages = require('./scripts/entries.cjs')();
const packagesDir = path.resolve(rootDirname, 'packages');
const packageDir = path.resolve(packagesDir, targetPackage);

const packageResolve = (p) => path.resolve(packageDir, p);
const packageOptions = require(packageResolve(`buildOptions.json`));

const minifyPlugins = minify ? [terser()] : [];

const configs = {
  cli: {
    output: {
      sourcemap: sourceMap,
      file: packageResolve('dist/index.cjs'),
      format: 'cjs',
      banner: '#!/usr/bin/env node',
    },
    plugins: [
      commonjs(),
      nodeResolve({
        exportConditions: ['node'],
      }),
      ...minifyPlugins,
    ],
  },
  esm: {
    output: {
      sourcemap: sourceMap,
      file: packageResolve('dist/index.mjs'),
      format: 'es',
    },
    plugins: [
      ...minifyPlugins,
    ],
  },
  cjs: {
    output: {
      sourcemap: sourceMap,
      file: packageResolve('dist/index.cjs'),
      format: 'cjs',
    },
    plugins: [
      ...minifyPlugins,
    ],
  },
  global: {
    output: {
      sourcemap: sourceMap,
      minify: sourceMap,
      globals: packages.reduce((globals, p) => ({ ...globals, [p.path]: p.global }), {}),
      name: packageOptions.name,
      file: packageResolve('dist/index.global.js'),
      format: 'iife',
    },
    plugins: [terser()],
  },
};

export default packageOptions.formats.map((f) => ({
  external: [
    ...packages.map((p) => p.path),
  ],
  input: packageResolve('src/index.ts'),
  output: {
    ...configs[f].output,
  },
  plugins: [
    typescript({
      sourceMap,
      tsconfig: path.resolve(rootDirname, 'tsconfig.json'),
    }),
    json(),
    ...(configs[f].plugins ?? []),
  ],
}));
