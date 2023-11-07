import renderExport from '@foscia/cli/templates/renderExport';
import renderImportsList from '@foscia/cli/templates/renderImportsList';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import toIndent from '@foscia/cli/utils/output/toIndent';

type TransformerData = {
  config: CLIConfig;
  imports: ImportsList;
};

export default function renderTransformer({ config, imports }: TransformerData) {
  const transformerCall = `
() => makeTransformer(
${toIndent(config, '(value) => value,/* TODO Define deserialize function. */')}
${toIndent(config, '(value) => value,/* TODO Define serialize function. */')}
)
`.trim();

  imports.add('makeTransformer', '@foscia/core');

  return `
${renderImportsList({ config, imports })}

${renderExport({ config, expr: transformerCall })}
`.trim();
}
