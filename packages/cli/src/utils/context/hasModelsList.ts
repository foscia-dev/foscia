import { CLIConfig } from '@foscia/cli/utils/config/config';
import hasFile from '@foscia/cli/utils/hasFile';

export default function hasModelsList(config: CLIConfig) {
  return hasFile(config, 'models');
}
