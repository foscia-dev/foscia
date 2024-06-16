import renderExport from '@foscia/cli/templates/concerns/renderExport';
import renderImportsList from '@foscia/cli/templates/concerns/renderImportsList';
import renderModelsExplorer from '@foscia/cli/templates/concerns/renderModelsExplorer';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportItem, ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import { ModelsExplorer } from '@foscia/cli/utils/prompts/promptForModelsExplorer';

type ModelsTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
  models: ImportItem[];
  explorer: ModelsExplorer,
};

export default function renderModels(
  { config, imports, models, explorer }: ModelsTemplateData,
) {
  const modelsArray = renderModelsExplorer({ config, imports, models, explorer });
  const modelsComment = explorer === 'manual'
    ? '\n// This file can be automatically updated using by calling `foscia make:models`.'
    : '';

  return `
${renderImportsList({ config, imports })}${modelsComment}
${renderExport({ config, expr: modelsArray })}
`.trim();
}
