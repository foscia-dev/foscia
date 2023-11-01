export type AppPackageManager = typeof CONFIG_PACKAGE_MANAGERS[number]['value'];
export type AppLanguage = typeof CONFIG_LANGUAGES[number]['value'];
export type AppModules = typeof CONFIG_MODULES[number]['value'];
export type AppUsage = typeof CONFIG_USAGES[number]['value'];

export type CLIConfig = {
  path: string;
  alias?: string;
  tabSize?: number;
  packageManager: AppPackageManager;
  language: AppLanguage;
  modules: AppModules;
  usage: AppUsage;
};

export const CONFIG_PACKAGE_MANAGERS = [
  {
    name: 'NPM',
    value: 'npm',
  },
  {
    name: 'Yarn',
    value: 'yarn',
  },
  {
    name: 'PNPM',
    value: 'pnpm',
  },
  {
    name: 'Bun',
    value: 'bun',
  },
] as const;

export const CONFIG_LANGUAGES = [
  {
    name: 'TypeScript',
    value: 'ts',
  },
  {
    name: 'JavaScript',
    value: 'js',
  },
] as const;

export const CONFIG_MODULES = [
  {
    name: 'ESModules (import/export)',
    value: 'esm',
  },
  {
    name: 'CommonJS (require/module.exports)',
    value: 'commonjs',
  },
] as const;

export const CONFIG_USAGES = [
  {
    name: 'Interacting with a JSON:API',
    value: 'jsonapi',
    packages: ['@foscia/core', '@foscia/http', '@foscia/jsonapi'],
  },
  {
    name: 'Interacting with a JSON REST API',
    value: 'jsonrest',
    packages: ['@foscia/core', '@foscia/http', '@foscia/rest'],
  },
  {
    name: 'Using it as a simple HTTP client',
    value: 'http',
    packages: ['@foscia/core', '@foscia/http'],
  },
] as const;
