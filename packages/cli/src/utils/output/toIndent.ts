import { CLIConfig } from '@foscia/cli/utils/config/config';

export default function toIndent(config: CLIConfig, str: string, times = 1) {
  const indent = ' '.repeat(times * (config.tabSize ?? 2));

  return `${indent}${str.replace(/\n/g, `\n${indent}`)}`;
}
