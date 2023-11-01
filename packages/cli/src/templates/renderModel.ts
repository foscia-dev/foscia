import { CLIConfig } from '@foscia/cli/utils/config/config';
import {
  renderFosciaImports,
  renderDefinition,
  renderDefinitionImports,
} from '@foscia/cli/templates/renderComposable';
import renderExport from '@foscia/cli/templates/renderExport';
import { MakeProperty, MakeType } from '@foscia/cli/utils/make';

type ModelTemplateData = {
  config: CLIConfig;
  className: string;
  typeName: string;
  composables: MakeType[];
  properties: MakeProperty[];
};

export default function renderModel(
  { config, className, typeName, composables, properties }: ModelTemplateData,
) {
  const modelDef = renderDefinition({ config, composables, properties });
  const modelClass = `class ${className} extends makeModel('${typeName}', ${modelDef}) {\n}`;
  const modelTypes = [...composables, ...properties];

  return `
${renderFosciaImports({ config, properties, name: 'makeModel' })}
${renderDefinitionImports({ config, types: modelTypes }, 'models')}
${renderExport({ config, expr: modelClass })}
`.trim();
}
