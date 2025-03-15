import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportItem, ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import toIndent from '@foscia/cli/utils/output/toIndent';
import type { ModelsExplorer } from '@foscia/cli/utils/prompts/promptForModelsExplorer';
import { camelCase, sortBy, upperFirst } from 'lodash-es';

type ModelsExplorerTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
  models: ImportItem[];
  explorer: ModelsExplorer,
};

export default function renderModelsExplorer(
  { config, imports, models, explorer }: ModelsExplorerTemplateData,
) {
  if (explorer === 'import') {
    let typeAssertion = '';
    if (config.language === 'ts') {
      imports.add('Model', '@foscia/core');
      typeAssertion = ' as { [k: string]: Model }';
    }

    return `
Object.values(import.meta.glob('./models/*.${config.language}', {
${toIndent(config, 'import: \'default\',')}
${toIndent(config, 'eager: true,')}
})${typeAssertion})
`.trim();
  }

  if (explorer === 'require') {
    let anyTyping = '';
    let typeAssertion = '';
    if (config.language === 'ts') {
      imports.add('Model', '@foscia/core');
      anyTyping = ': any';
      typeAssertion = ' as Model';
    }

    return `
((context${anyTyping}) => context.keys().map(
${toIndent(config, `(key${anyTyping}) => context(key).default${typeAssertion}`)},
))(require.context('./models', true, /\\.${config.language}/))
`.trim();
  }

  let constAssertion = '';
  if (config.language === 'ts') {
    constAssertion = ' as const';
  }

  const modelsNames = sortBy(models, 'name').map((model) => {
    const className = upperFirst(camelCase(model.name));
    imports.add(className, model.from, { isDefault: true });

    return className;
  });

  if (modelsNames.length) {
    return `
[
${modelsNames.map((m) => toIndent(config, m)).join(',\n')},
]${constAssertion}`.trim();
  }

  return '[]';
}
