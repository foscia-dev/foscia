import { CLIConfig } from '@foscia/cli/utils/config/config';
import hasFile from '@foscia/cli/utils/hasFile';

export default function hasModelsReviver(config: CLIConfig) {
  return hasFile(config, 'utils/reviver');
}
