import { CLIConfig } from '@foscia/cli/utils/config/config';
import readFile from '@foscia/cli/utils/files/readFile';
import resolvePath from '@foscia/cli/utils/files/resolvePath';

export default async function getFile(
  config: CLIConfig,
  fileName: string,
) {
  const filePath = resolvePath(config, `${fileName}.${config.language}`);

  return readFile(filePath);
}
