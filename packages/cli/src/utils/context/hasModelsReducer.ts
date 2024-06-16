import { CLIConfig } from '@foscia/cli/utils/config/config';
import hasFile from '@foscia/cli/utils/hasFile';

export default function hasModelsReducer(config: CLIConfig) {
  return hasFile(config, 'utils/reducer');
}
