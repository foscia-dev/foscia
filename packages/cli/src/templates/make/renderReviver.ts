import renderExport from '@foscia/cli/templates/concerns/renderExport';
import renderImportsList from '@foscia/cli/templates/concerns/renderImportsList';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';

type ModelReviverTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
};

export default function renderReviver(
  { config, imports }: ModelReviverTemplateData,
) {
  const modelReviver = `
makeModelsReviver({ models })
`.trim();

  imports.add('makeModelsReviver', '@foscia/core');
  imports.add('models', 'models', { isDefault: true });

  return `
${renderImportsList({ config, imports })}
${renderExport({ config, expr: modelReviver })}
`.trim();
}
