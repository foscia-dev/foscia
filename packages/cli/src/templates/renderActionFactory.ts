import renderExport from '@foscia/cli/templates/renderExport';
import renderImportsList from '@foscia/cli/templates/renderImportsList';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import type {
  ActionFactoryDependency,
  ActionFactoryModelRegistration,
  ActionFactoryOptions,
} from '@foscia/cli/utils/input/promptForActionFactoryOptions';
import toIndent from '@foscia/cli/utils/output/toIndent';

type ActionFactoryTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
  usage: CLIConfig['usage'];
  options: ActionFactoryOptions;
};

export function renderModelsRegistration(
  { config, registry }: { config: CLIConfig; registry: ActionFactoryModelRegistration; },
) {
  let typeAssertion = '';
  if (registry === 'import.meta.glob') {
    if (config.language === 'ts') {
      typeAssertion = ' as { [k: string]: Model }';
    }

    return `
const models = Object.values(import.meta.glob('./models/*.${config.language}', {
${toIndent(config, 'import: \'default\', eager: true,')}
})${typeAssertion});
`.trim();
  }

  if (registry === 'require.context') {
    if (config.language === 'ts') {
      typeAssertion = ' as Model';
    }

    return `
const modelsRequireContext = require.context('./models', /\\.${config.language}/);
const models = modelsRequireContext.keys().map(
${toIndent(config, `(key) => modelsRequireContext(key).default${typeAssertion}`)},
);
`.trim();
  }

  return 'const models = [/* TODO Post, Comment, [...] */];';
}

function renderFactoryOptions(config: CLIConfig, options?: { [K: string]: unknown }) {
  const emptyOptions = Object.values(options ?? {}).filter((o) => o !== undefined).length === 0;
  if (emptyOptions) {
    return '';
  }

  return JSON.stringify(options, null, (config.tabSize ?? 2))
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/\\"/g, '\\\'')
    .replace(/"/g, '\'');
}

function renderFactoryDependency(
  config: CLIConfig,
  comment: string,
  dependency?: ActionFactoryDependency,
) {
  return dependency
    ? `${comment}\n...${dependency.name}(${renderFactoryOptions(config, dependency.options)}),`
    : undefined;
}

export default function renderActionFactory(
  { config, imports, options }: ActionFactoryTemplateData,
) {
  const modelsRegistration = options.registry
    ? `\n${renderModelsRegistration({ config, registry: options.registry })}\n`
    : '';

  const actionFactoryDependencies = [
    options.cache
      ? '// Cache stores already retrieved models\' instances\n// and avoid duplicates records to coexists.\n// If you don\'t care about this feature, you can remove it.\n...makeCache(),'
      : undefined,
    options.registry
      ? '// Registry stores a map of type string and models classes.\n// You have this dependency because you\'ve opt-in for it.\n...makeRegistry(models),'
      : undefined,
    renderFactoryDependency(
      config,
      '// Deserializer transforms data source\'s raw data to model\'s instances.\n// If you don\'t retrieve models from your data store, you can remove it.',
      options.deserializer,
    ),
    renderFactoryDependency(
      config,
      '// Serializer transforms model\'s instances to your data source\'s format.\n// If you don\'t send models to your data store, you can remove it.',
      options.serializer,
    ),
    renderFactoryDependency(
      config,
      '// Adapter exchanges data with your data source.\n// This is mandatory when using Foscia.',
      options.adapter,
    ),
  ];

  const actionFactory = `
makeActionFactory({
${actionFactoryDependencies.filter((d) => d).map((d) => toIndent(config, d!)).join('\n')}
})
`.trim();

  return `
${renderImportsList({ config, imports })}${modelsRegistration}
${renderExport({ config, expr: actionFactory })}
`.trim();
}
