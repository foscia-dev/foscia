export type AppPackageManager = typeof CONFIG_PACKAGE_MANAGERS[number]['value'];
export type AppLanguage = typeof CONFIG_LANGUAGES[number]['value'];
export type AppModules = typeof CONFIG_MODULES[number]['value'];
export type AppFramework = typeof CONFIG_FRAMEWORKS[number]['value'];
export type AppUsage = typeof CONFIG_USAGES[number]['value'];

export type CLIConfig = {
  path: string;
  alias?: string;
  tabSize?: number;
  framework?: AppFramework;
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
    name: 'ESModules',
    hint: 'import/export',
    value: 'esm',
  },
  {
    name: 'CommonJS',
    hint: 'require/module.exports',
    value: 'commonjs',
  },
] as const;

export const CONFIG_FRAMEWORKS = [
  {
    name: 'Nuxt',
    value: 'nuxt',
    packages: ['ofetch'],
  },
] as const;

export const CONFIG_USAGES = [
  {
    name: 'consuming a JSON:API',
    value: 'jsonapi',
    packages: ['@foscia/core', '@foscia/http', '@foscia/jsonapi'],
  },
  {
    name: 'consuming a JSON REST API',
    value: 'jsonrest',
    packages: ['@foscia/core', '@foscia/http', '@foscia/rest'],
  },
  {
    name: 'an HTTP client',
    value: 'http',
    packages: ['@foscia/core', '@foscia/http'],
  },
] as const;
