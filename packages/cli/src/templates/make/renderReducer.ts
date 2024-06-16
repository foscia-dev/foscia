import renderExport from '@foscia/cli/templates/concerns/renderExport';
import renderImportsList from '@foscia/cli/templates/concerns/renderImportsList';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';

type ModelReducerTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
};

export default function renderReducer(
  { config, imports }: ModelReducerTemplateData,
) {
  const modelReducer = `
makeModelsReducer()
`.trim();

  imports.add('makeModelsReducer', '@foscia/core');

  return `
${renderImportsList({ config, imports })}
${renderExport({ config, expr: modelReducer })}
`.trim();
}
