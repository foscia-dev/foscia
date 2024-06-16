import renderExport from '@foscia/cli/templates/concerns/renderExport';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import getFile from '@foscia/cli/utils/getFile';

export default async function hasManualModelsList(config: CLIConfig) {
  const modelsFile = await getFile(config, 'models');

  return modelsFile !== null
    && modelsFile.indexOf(renderExport({ config, expr: '[', nonClosing: true })) !== -1;
}
