import { CLIConfig } from '@foscia/cli/utils/config/config';
import { sortBy, uniq } from 'lodash-es';

type ImportTemplateData = {
  config: CLIConfig;
  name?: string | string[];
  from?: string;
  typeOnly?: boolean;
  context?: string;
};

function resolveName(name: string | string[]) {
  return Array.isArray(name) ? `{ ${sortBy(uniq(name)).join(', ')} }` : name;
}

function resolveFrom(config: CLIConfig, from: string, context?: string) {
  if (!context) {
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

function renderEsmImport(name: string, from: string, typeOnly?: boolean) {
  return `import ${typeOnly ? 'type ' : ''}${name} from '${from}';`;
}

function renderCommonJSImport(name: string, from: string) {
  return `const ${name} = require('${from}');`;
}

export default function renderImport(
  { config, name, from, typeOnly, context }: ImportTemplateData,
) {
  if (!name || !from) {
    return undefined;
  }

  const resolvedName = resolveName(name);
  const resolvedFrom = resolveFrom(config, from, context);

  return config.modules === 'esm'
    ? renderEsmImport(resolvedName, resolvedFrom, typeOnly)
    : renderCommonJSImport(resolvedName, resolvedFrom);
}
