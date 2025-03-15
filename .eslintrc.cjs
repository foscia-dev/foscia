const path = require('node:path');
const entries = require('./scripts/entries.cjs');

module.exports = {
  root: true,
  env: {
    es2021: true,
    browser: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.resolve(__dirname, 'tsconfig.json'),
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ['import'],
  rules: {
    'no-console': [process.env.NODE_ENV === 'production' ? 'error' : 'off'],
    'no-debugger': [process.env.NODE_ENV === 'production' ? 'error' : 'off'],
    // https://github.com/typescript-eslint/typescript-eslint/issues/1824
    '@typescript-eslint/indent': ['error', 2],
    'object-curly-newline': ['off'],
    'import/no-unresolved': ['error'],
    'import/no-relative-packages': ['off'],
    'no-restricted-imports': ['error', {
      'patterns': ['.*'],
    }],
    'import/extensions': [
      'error', 'ignorePackages', { ts: 'never' },
    ],
    'import/no-extraneous-dependencies': [
      'error', {
        devDependencies: [
          'packages/cli/src/**/*', '**/*.mock.ts', '**/*.test.ts', '**/*.test-d.ts',
        ],
        packageDir: [
          '.',
          ...entries.map((e) => path.resolve('.', 'packages', e)),
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['**/tests/**/*'],
      rules: {
        'no-restricted-imports': ['off'],
      },
    },
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        project: ['tsconfig.json'],
      },
    },
  },
  ignorePatterns: [
    'dist',
    'node_modules',
  ],
};
