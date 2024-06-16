import { CLIConfig } from '@foscia/cli/utils/config/config';
import parseConfig from '@foscia/cli/utils/config/parseConfig';

export type ConfigurableOptions = {
  config?: string;
};

export const useConfigOption = ['-c, --config <path>', 'Configuration file path'] as const;

let lifecycleConfig: CLIConfig;

export function setLifecycleConfig(config: CLIConfig) {
  lifecycleConfig = config;
}

export async function useConfig(options: ConfigurableOptions) {
  if (!lifecycleConfig) {
    setLifecycleConfig(await parseConfig(options.config));
  }

  return lifecycleConfig!;
}
