import renderExport from '@foscia/cli/templates/concerns/renderExport';
import renderImportsList from '@foscia/cli/templates/concerns/renderImportsList';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import toIndent from '@foscia/cli/utils/output/toIndent';

type EnhancerTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
  functionName: string;
};

export default function renderEnhancer(
  { config, imports, functionName }: EnhancerTemplateData,
) {
  imports.add('makeEnhancer', '@foscia/core');

  const functionGeneric = config.language === 'ts' ? '<C extends {}>' : '';
  const paramTyping = config.language === 'ts' ? ': Action<C>' : '';
  if (config.language === 'ts') {
    imports.add('Action', '@foscia/core');
  }

  const enhancer = `
makeEnhancer('${functionName}', ${functionGeneric}(
${toIndent(config, '// TODO Add enhancer parameters here.', 1)}
) => async (action${paramTyping}) => action.use(
${toIndent(config, '// TODO Use other enhancers here, such as `context`.', 1)}
))
`.trim();

  return `
${renderImportsList({ config, imports })}
${renderExport({ config, expr: enhancer })}
`.trim();
}
