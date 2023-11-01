import { CLIConfig } from '@foscia/cli/utils/config/config';
import parseConfig from '@foscia/cli/utils/config/parseConfig';

let cachedConfig: CLIConfig | undefined;

export default async function useConfig(path: string) {
  if (!cachedConfig) {
    cachedConfig = await parseConfig(path);
  }

  return cachedConfig;
}
