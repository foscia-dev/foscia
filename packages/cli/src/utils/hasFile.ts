import { CLIConfig } from '@foscia/cli/utils/config/config';
import pathExists from '@foscia/cli/utils/files/pathExists';
import resolvePath from '@foscia/cli/utils/files/resolvePath';

export default async function hasFile(
  config: CLIConfig,
  fileName: string,
) {
  const filePath = resolvePath(config, `${fileName}.${config.language}`);

  return pathExists(filePath);
}
