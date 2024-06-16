import renderExport from '@foscia/cli/templates/concerns/renderExport';
import renderImportsList from '@foscia/cli/templates/concerns/renderImportsList';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';

type PayloadPluginTemplateData = {
  config: CLIConfig;
  imports: ImportsList;
};

export default function renderPayloadPlugin(
  { config, imports }: PayloadPluginTemplateData,
) {
  const modelReducer = `
definePayloadPlugin(() => {
  definePayloadReducer('FosciaInstance', (data) => isInstance(data) && reducer.reduce(data));
  definePayloadReviver('FosciaInstance', (data) => reviver.revive(data));
})
`.trim();

  imports.add('isInstance', '@foscia/core');
  imports.add('reducer', 'utils/reducer', { isDefault: true });
  imports.add('reviver', 'utils/reviver', { isDefault: true });

  return `
${renderImportsList({ config, imports })}
${renderExport({ config, expr: modelReducer })}
`.trim();
}
