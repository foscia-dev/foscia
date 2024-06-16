import renderExport from '@foscia/cli/templates/concerns/renderExport';
import renderImportsList from '@foscia/cli/templates/concerns/renderImportsList';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import toIndent from '@foscia/cli/utils/output/toIndent';

type RunnerTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
  functionName: string;
};

export default function renderRunner(
  { config, imports, functionName }: RunnerTemplateData,
) {
  const functionGeneric = config.language === 'ts' ? '<C extends {}>' : '';
  const paramTyping = config.language === 'ts' ? ': Action<C>' : '';
  if (config.language === 'ts') {
    imports.add('Action', '@foscia/core');
  }

  const runner = `
function ${functionName}${functionGeneric}() {
${toIndent(config, `return (action${paramTyping}) => {`)}
${toIndent(config, '// TODO Write runner logic.', 2)}
${toIndent(config, '};')}
}
`.trim();

  return `
${renderImportsList({ config, imports })}
${renderExport({ config, expr: runner })}
`.trim();
}
