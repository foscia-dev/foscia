import { renderDefinition } from '@foscia/cli/templates/make/renderComposable';
import renderExport from '@foscia/cli/templates/concerns/renderExport';
import renderImportsList from '@foscia/cli/templates/concerns/renderImportsList';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import { DefinitionProperty } from '@foscia/cli/utils/prompts/promptForProperties';
import toIndent from '@foscia/cli/utils/output/toIndent';

type ModelFactoryTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
  composables: string[];
  properties: DefinitionProperty[];
};

export default function renderModelFactory(
  { config, imports, composables, properties }: ModelFactoryTemplateData,
) {
  const modelDef = renderDefinition({ config, composables, properties });
  const modelFactory = `
makeModelFactory({
${toIndent(config, '// TODO Write configuration.')}
}, ${modelDef})
`.trim();

  imports.add('makeModelFactory', '@foscia/core');

  return `
${renderImportsList({ config, imports })}
${renderExport({ config, expr: modelFactory })}
`.trim();
}
