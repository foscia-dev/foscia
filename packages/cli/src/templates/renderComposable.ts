import { CLIConfig } from '@foscia/cli/utils/config/config';
import renderComposableForDef from '@foscia/cli/templates/renderComposableForDef';
import renderExport from '@foscia/cli/templates/renderExport';
import renderImport from '@foscia/cli/templates/renderImport';
import renderPropertyForDef from '@foscia/cli/templates/renderPropertyForDef';
import toIndent from '@foscia/cli/utils/output/toIndent';
import toJoinMultiline from '@foscia/cli/utils/output/toJoinMultiline';
import { MakeProperty, MakeType } from '@foscia/cli/utils/make';
import { sortBy, uniq } from 'lodash-es';

type ComposableTemplateData = {
  config: CLIConfig;
  composables: MakeType[];
  properties: MakeProperty[];
};

export function renderFosciaImports(
  { config, properties, name }: { config: CLIConfig, properties: MakeProperty[], name: string },
) {
  return renderImport({
    config,
    name: [name, ...properties.map((p) => p.typology)],
    from: '@foscia/core',
  });
}

export function renderDefinitionImports(
  { config, types }: { config: CLIConfig, types: (MakeProperty | MakeType)[] },
  context: 'models' | 'composables',
) {
  return toJoinMultiline(sortBy(uniq(
    types
      .map((p) => {
        const isProperty = 'type' in p;
        const type = (isProperty ? p.type : p) as MakeType;

        return renderImport({
          config,
          name: type?.name,
          from: type?.from,
          typeOnly: isProperty,
          context,
        });
      })
      .filter((i) => i) as string[],
  )));
}

export function renderDefinition(
  { config, composables, properties }: {
    config: CLIConfig;
    composables: MakeType[];
    properties: MakeProperty[];
  },
) {
  const definition = (composables.length + properties.length)
    ? toJoinMultiline(uniq([
      ...composables.map(
        (c) => `${toIndent(config)}${renderComposableForDef({ composable: c })}`,
      ),
      ...properties.map(
        (p) => `${toIndent(config)}${renderPropertyForDef({ property: p })}`,
      ),
    ]), ',\n')
    : `${toIndent(config)}// TODO Write definition.\n`;

  return `{\n${definition}}`.trim();
}

export default function renderComposable(
  { config, composables, properties }: ComposableTemplateData,
) {
  const composableDef = renderDefinition({ config, composables, properties });
  const composableObject = `makeComposable(${composableDef})`;
  const composableTypes = [...composables, ...properties];

  return `
${renderFosciaImports({ config, properties, name: 'makeComposable' })}
${renderDefinitionImports({ config, types: composableTypes }, 'composables')}
${renderExport({ config, expr: composableObject })}
`.trim();
}
