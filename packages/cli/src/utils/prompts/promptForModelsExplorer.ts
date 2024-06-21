import renderModelsExplorer from '@foscia/cli/templates/concerns/renderModelsExplorer';
import { symbols } from '@foscia/cli/utils/cli/output';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import makeImportsList, { ImportItem } from '@foscia/cli/utils/imports/makeImportsList';
import promptSelect from '@foscia/cli/utils/prompts/promptSelect';
import { highlight } from 'cli-highlight';

export type ModelsExplorer = typeof MODELS_EXPLORERS[number]['value'];

export const MODELS_EXPLORERS = [
  {
    value: 'import',
    name: 'import.meta.glob',
    hint: 'automatically, recommended with Vite',
    disabled: (config: CLIConfig) => config.modules !== 'esm',
  },
  {
    value: 'require',
    name: 'require.context',
    hint: 'automatically, recommended with Webpack',
    disabled: () => false,
  },
  {
    value: 'manual',
    name: 'manually',
    hint: 'can be maintained with `foscia make models`',
    disabled: () => false,
  },
] as const;

const makePreviewExplorer = (explorer: ModelsExplorer) => (
  config: CLIConfig,
  models: ImportItem[],
) => highlight(renderModelsExplorer({
  config,
  models,
  explorer,
  imports: makeImportsList(),
}), { language: config.language });

export default async function promptForModelsExplorer(
  config: CLIConfig,
  models: ImportItem[],
): Promise<ModelsExplorer> {
  const previews = MODELS_EXPLORERS.map((explorer) => makePreviewExplorer(explorer.value));

  return promptSelect({
    name: 'explorer',
    message: 'how your models should be discovered?',
    footer: ({ index }: { index: number }) => {
      const example = previews[index](config, models);

      return `${symbols.step} source code:\n${example.split('\n').map((l) => `  ${l}`).join('\n')}`;
    },
    choices: MODELS_EXPLORERS.map((explorer) => ({
      value: explorer.value,
      name: explorer.name,
      hint: explorer.hint,
      disabled: explorer.disabled(config),
    })),
  });
}
