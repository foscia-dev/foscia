import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportItem, ImportsList } from '@foscia/cli/utils/imports/makeImportsList';

type ImportsListTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
  context?: string;
};

function groupImports(imports: ImportItem[]) {
  return imports.reduce((items, item) => ({
    ...items,
    [item.from]: [
      ...(items[item.from] ?? []),
      item,
    ],
  }), {} as Record<string, ImportItem[]>);
}

function resolveFrom(config: CLIConfig, from: string, context?: string) {
  if (!context) {
    return from;
  }

  if (from.startsWith('@foscia/')) {
    return from;
  }

  if (config.alias) {
    return `${config.alias}${from}`;
  }

  if (from.startsWith(`${context}/`)) {
    return `.${from.replace(`${context}`, '')}`;
  }

  return `../${from}`;
}

function renderImportsNames(imports: ImportItem[]) {
  const mapToUniqNames = (items: ImportItem[]) => {
    const names = [...new Set(items.map((i) => i.name))];

    names.sort();

    return names;
  };

  const defaultImports = mapToUniqNames(imports.filter((i) => i.isDefault));
  const namedImports = mapToUniqNames(imports.filter((i) => !i.isDefault));

  return [
    ...defaultImports,
    ...(namedImports.length ? [`{ ${namedImports.join(', ')} }`] : []),
  ].join(', ');
}

function renderEsmImports(from: string, imports: ImportItem[], isTypeOnly: boolean) {
  return `import ${isTypeOnly ? 'type ' : ''}${renderImportsNames(imports)} from '${from}';`;
}

function renderCommonJSImports(from: string, imports: ImportItem[]) {
  return `const ${renderImportsNames(imports)} = require('${from})';`;
}

function renderGroupedImports(
  config: CLIConfig,
  imports: Record<string, ImportItem[]>,
  isTypeOnly: boolean,
  context?: string,
) {
  return Object.entries(imports).map(([from, items]) => {
    const resolvedFrom = resolveFrom(config, from, context);

    return {
      rendered: config.modules === 'esm'
        ? renderEsmImports(resolvedFrom, items, isTypeOnly)
        : renderCommonJSImports(resolvedFrom, items),
      from,
    };
  });
}

export default function renderImportsList({ config, imports, context }: ImportsListTemplateData) {
  const typeImports = config.language === 'ts' && config.modules === 'esm'
    ? groupImports(imports.imports.filter((i) => i.isTypeOnly))
    : {};
  const realImports = groupImports(imports.imports.filter((i) => !i.isTypeOnly));

  const renderedImports = [
    ...renderGroupedImports(config, typeImports, true, context),
    ...renderGroupedImports(config, realImports, false, context),
  ];

  renderedImports.sort((a, b) => a.from.localeCompare(b.from));

  return `${renderedImports.map((i) => i.rendered).join('\n')}\n`;
}
