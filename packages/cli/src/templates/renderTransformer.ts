import { CLIConfig } from '@foscia/cli/utils/config/config';
import { renderFosciaImports } from '@foscia/cli/templates/renderComposable';
import renderExport from '@foscia/cli/templates/renderExport';
import toIndent from '@foscia/cli/utils/output/toIndent';

type TransformerData = {
  config: CLIConfig;
};

export default function renderTransformer({ config }: TransformerData) {
  const transformerCall = `
makeTransformer(
${toIndent(config)}(value) => value,/* TODO Define deserialize function. */
${toIndent(config)}(value) => value,/* TODO Define serialize function. */
)
`.trim();

  return `
${renderFosciaImports({ config, properties: [], name: 'makeTransformer' })}

${renderExport({ config, expr: transformerCall })}
`.trim();
}
