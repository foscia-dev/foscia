import renderExport from '@foscia/cli/templates/concerns/renderExport';
import renderImportsList from '@foscia/cli/templates/concerns/renderImportsList';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import toIndent from '@foscia/cli/utils/output/toIndent';
import { RelationsLoader } from '@foscia/cli/utils/prompts/promptForLoader';

type ModelLoaderTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
  loader: RelationsLoader;
  onlyMissing: boolean;
};

function renderLoaderOnlyMissingExclude(imports: ImportsList, onlyMissing: boolean) {
  if (onlyMissing) {
    imports.add('loaded', '@foscia/core');

    return 'exclude: loaded,';
  }

  return null;
}

function renderLoaderConfig(config: CLIConfig, options: (string | null)[]) {
  const renderedOptions = options
    .filter((option) => option !== null)
    .map((option) => toIndent(config, option!))
    .join('\n');
  if (renderedOptions.length) {
    return `, {\n${renderedOptions}\n}`;
  }

  return '';
}

function renderRefreshIncludeLoader({ config, imports, onlyMissing }: ModelLoaderTemplateData) {
  imports.add('makeRefreshIncludeLoader', '@foscia/core');

  return `
makeRefreshIncludeLoader(action${renderLoaderConfig(config, [
    '// Customize `prepare` to filter action on queried instances IDs.',
    '// prepare: (action, { instances }) => action.use(param(\'ids\', instances.map(({ id }) => id))),',
    renderLoaderOnlyMissingExclude(imports, onlyMissing),
  ])})
`.trim();
}

function renderQueryModelLoader({ config, imports, onlyMissing }: ModelLoaderTemplateData) {
  imports.add('makeQueryModelLoader', '@foscia/core');

  return `
makeQueryModelLoader(action${renderLoaderConfig(config, [
    '// Customize `prepare` to filter action on queried instances IDs.',
    '// prepare: (action, { ids }) => action.use(param(\'ids\', ids)),',
    renderLoaderOnlyMissingExclude(imports, onlyMissing),
  ])})
`.trim();
}

function renderQueryRelationLoader({ config, imports, onlyMissing }: ModelLoaderTemplateData) {
  imports.add('makeQueryModelLoader', '@foscia/core');

  return `
makeQueryModelLoader(action${renderLoaderConfig(config, [
    renderLoaderOnlyMissingExclude(imports, onlyMissing),
  ])})
`.trim();
}

export default function renderLoader(
  { config, imports, loader, onlyMissing }: ModelLoaderTemplateData,
) {
  const modelLoader = {
    'refresh.include': renderRefreshIncludeLoader,
    'query.model': renderQueryModelLoader,
    'query.relation': renderQueryRelationLoader,
  }[loader]({ config, imports, loader, onlyMissing });

  imports.add('action', 'action', { isDefault: true });

  return `
${renderImportsList({ config, imports })}
${renderExport({ config, expr: modelLoader })}
`.trim();
}
