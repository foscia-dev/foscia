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
  imports.add('makeRunner', '@foscia/core');

  const functionGeneric = config.language === 'ts' ? '<C extends {}>' : '';
  const paramTyping = config.language === 'ts' ? ': Action<C>' : '';
  if (config.language === 'ts') {
    imports.add('Action', '@foscia/core');
  }

  const runner = `
makeRunner('${functionName}', ${functionGeneric}(
${toIndent(config, '// TODO Add runner parameters here.', 1)}
) => async (action${paramTyping}) => action.run(
${toIndent(config, '// TODO Use other enhancers and one runner here, such as `one`.', 1)}
))
`.trim();

  return `
${renderImportsList({ config, imports })}
${renderExport({ config, expr: runner })}
`.trim();
}
