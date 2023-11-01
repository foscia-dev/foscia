import { CLIConfig } from '@foscia/cli/utils/config/config';
import { resolve } from 'node:path';

export default function resolvePath(config: CLIConfig, path: string) {
  return resolve(config.path, path);
}
