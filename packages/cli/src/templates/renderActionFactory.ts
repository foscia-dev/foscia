import renderExport from '@foscia/cli/templates/renderExport';
import renderImport from '@foscia/cli/templates/renderImport';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import type { ActionFactoryOptions } from '@foscia/cli/utils/input/promptForActionFactoryOptions';
import { sortBy } from 'lodash-es';

type ActionFactoryTemplateData = {
  config: CLIConfig;
  usage: CLIConfig['usage'];
  options: ActionFactoryOptions;
};

export function renderModelsDefinition({ config, options }: ActionFactoryTemplateData) {
  if (options.automaticRegistration === 'import.meta.glob') {
    const modelsCast = config.language === 'ts'
      ? ' as { [k: string]: Model }'
      : '';

    return `
const models = Object.values(import.meta.glob('./models/*.${config.language}', {
  import: 'default', eager: true,
})${modelsCast});
`.trim();
  }

  return 'const models = [/* TODO Post, Comment, [...] */];';
}

function renderBlueprintActionFactory({ config, usage, options }: ActionFactoryTemplateData) {
  const enableModelFeatures = ['jsonapi', 'jsonrest'].indexOf(usage) !== -1;
  const factoryFunction = {
    jsonapi: { name: 'makeJsonApi', package: 'jsonapi' },
    jsonrest: { name: 'makeJsonRest', package: 'rest' },
    http: { name: 'makeHttpClient', package: 'http' },
  }[usage];

  const factoryConfiguration = {
    ...(enableModelFeatures ? { models: '____models____' } : {}),
    ...options.config,
  };
  const factoryConfigured = Object.values(factoryConfiguration)
    .filter((o) => o !== undefined)
    .length > 0;
  const factoryConfigurationJsonLiteral = factoryConfigured
    ? JSON.stringify(factoryConfiguration, null, config.tabSize ?? 2).replace(/"([^"]+)":/g, '$1:')
    : '';
  const factoryConfigurationLiteral = factoryConfigurationJsonLiteral
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"____([a-z]+)____"/, '$1')
    .replace('models: models,', 'models,');

  const blueprintImportStatement = renderImport({
    config,
    name: `{ ${factoryFunction.name} }`,
    from: `@foscia/${factoryFunction.package}`,
  });

  const coreImports = [] as string[];
  if (enableModelFeatures && options.automaticRegistration) {
    coreImports.push('Model');
  }

  const coreImportStatement = coreImports.length
    ? `\n${renderImport({
      config,
      name: `{ ${sortBy(coreImports).join(', ')} }`,
      from: '@foscia/core',
    })}`
    : '';

  return `
${blueprintImportStatement}${coreImportStatement}
${enableModelFeatures ? `\n${renderModelsDefinition({ config, usage, options })}\n` : ''}
const { action } = ${factoryFunction.name}(${factoryConfigurationLiteral});

${renderExport({ config, expr: 'action' })}
`.trim();
}

export default function renderActionFactory({ config, usage, options }: ActionFactoryTemplateData) {
  return renderBlueprintActionFactory({ config, usage, options });
}
