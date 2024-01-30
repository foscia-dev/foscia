import renderComposableForDef from '@foscia/cli/templates/renderComposableForDef';
import renderExport from '@foscia/cli/templates/renderExport';
import renderImportsList from '@foscia/cli/templates/renderImportsList';
import renderPropertyForDef from '@foscia/cli/templates/renderPropertyForDef';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import { DefinitionProperty } from '@foscia/cli/utils/input/promptForProperties';
import toIndent from '@foscia/cli/utils/output/toIndent';
import { orderBy, uniq } from 'lodash-es';

type ComposableTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
  composables: string[];
  properties: DefinitionProperty[];
};

export function renderDefinition(
  { config, composables, properties }: {
    config: CLIConfig;
    composables: string[];
    properties: DefinitionProperty[];
  },
) {
  const definition = (composables.length + properties.length)
    ? `${uniq([
      ...composables.map(
        (composable) => toIndent(config, renderComposableForDef({ composable })),
      ),
      ...orderBy(properties, [(p) => ['attr', 'hasOne', 'hasMany'].indexOf(p.typology)]).map(
        (property) => toIndent(config, renderPropertyForDef({ property })),
      ),
    ]).join(',\n')},`
    : `${toIndent(config, '// TODO Write definition.')}`;

  return `{\n${definition}\n}`.trim();
}

export default function renderComposable(
  { config, imports, composables, properties }: ComposableTemplateData,
) {
  const composableDef = renderDefinition({ config, composables, properties });
  const composableObject = `makeComposable(${composableDef})`;

  imports.add('makeComposable', '@foscia/core');

  return `
${renderImportsList({ config, imports, context: 'composables' })}
${renderExport({ config, expr: composableObject })}
`.trim();
}
