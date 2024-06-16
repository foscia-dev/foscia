import renderModelsExplorer from '@foscia/cli/templates/concerns/renderModelsExplorer';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import makeImportsList, { ImportItem } from '@foscia/cli/utils/imports/makeImportsList';
import { select } from '@inquirer/prompts';
import boxen from 'boxen';
import { highlight } from 'cli-highlight';

export type ModelsExplorer = typeof MODELS_EXPLORERS[number]['value'];

export const MODELS_EXPLORERS = [
  {
    value: 'import',
    name: 'automatically using import.meta.glob (Vite)',
    disabled: (config: CLIConfig) => config.modules !== 'esm',
  },
  {
    value: 'require',
    name: 'automatically using require.context (Webpack)',
    disabled: () => false,
  },
  {
    value: 'manual',
    name: 'manually or maintained with `foscia make models`',
    disabled: () => false,
  },
] as const;

export default async function promptForModelsExplorer(
  config: CLIConfig,
  models: ImportItem[],
): Promise<ModelsExplorer> {
  return select({
    message: 'how your models should be discovered?',
    choices: MODELS_EXPLORERS.map((explorer) => ({
      value: explorer.value,
      name: explorer.name,
      disabled: explorer.disabled(config),
      description: boxen(
        highlight(renderModelsExplorer({
          config,
          imports: makeImportsList(),
          models,
          explorer: explorer.value,
        }), { language: config.language }),
        { title: 'source code', titleAlignment: 'center', padding: 1 },
      ),
    })),
  });
}
