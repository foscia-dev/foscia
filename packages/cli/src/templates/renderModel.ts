import { renderDefinition } from '@foscia/cli/templates/renderComposable';
import renderExport from '@foscia/cli/templates/renderExport';
import renderImportsList from '@foscia/cli/templates/renderImportsList';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import { DefinitionProperty } from '@foscia/cli/utils/input/promptForProperties';

type ModelTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
  className: string;
  typeName: string;
  composables: string[];
  properties: DefinitionProperty[];
};

export default function renderModel(
  { config, imports, className, typeName, composables, properties }: ModelTemplateData,
) {
  const modelDef = renderDefinition({ config, composables, properties });
  const modelClass = `class ${className} extends makeModel('${typeName}', ${modelDef}) {\n}`;

  imports.add('makeModel', '@foscia/core');

  return `
${renderImportsList({ config, imports, context: 'models' })}
${renderExport({ config, expr: modelClass })}
`.trim();
}
