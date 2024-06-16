import { renderDefinition } from '@foscia/cli/templates/make/renderComposable';
import renderExport from '@foscia/cli/templates/concerns/renderExport';
import renderImportsList from '@foscia/cli/templates/concerns/renderImportsList';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import { DefinitionProperty } from '@foscia/cli/utils/prompts/promptForProperties';

type ModelTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
  className: string;
  typeName: string;
  customFactory: boolean;
  composables: string[];
  properties: DefinitionProperty[];
};

export default function renderModel(
  {
    config, imports, className, typeName, customFactory, composables, properties,
  }: ModelTemplateData,
) {
  const modelDef = renderDefinition({ config, composables, properties });
  const modelClass = `class ${className} extends makeModel('${typeName}', ${modelDef}) {\n}`;

  if (customFactory) {
    imports.add('makeModel', 'makeModel', { isDefault: true });
  } else {
    imports.add('makeModel', '@foscia/core');
  }

  return `
${renderImportsList({ config, imports, context: 'models' })}
${renderExport({ config, expr: modelClass })}
`.trim();
}
