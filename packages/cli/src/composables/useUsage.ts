import output from '@foscia/cli/utils/cli/output';
import { AppUsage, CONFIG_USAGES } from '@foscia/cli/utils/config/config';
import process from 'node:process';
import terminalLink from 'terminal-link';

export type UsageOptions = {
  usage?: string;
};

export const useUsageOption = [
  '--usage <usage>',
  `Intended usage within: ${CONFIG_USAGES.map((u) => u.value).join(', ')}`,
] as const;

export async function useUsage(
  options: UsageOptions,
  defaultUsage: () => Promise<string | null> | string | null,
) {
  const usage = options.usage ?? (await defaultUsage());

  const possibleUsages = CONFIG_USAGES.map(({ value }) => value) as string[];
  if (!usage || possibleUsages.indexOf(usage) === -1) {
    output.error('sorry, but Foscia does not support other built-in usages for now');
    output.instruct(terminalLink('create an issue to suggest a feature', 'https://github.com/foscia-dev/foscia/issues/new/choose', {
      fallback: () => 'create an issue to suggest a feature: https://github.com/foscia-dev/foscia/issues/new/choose',
    }));
    process.exit(1);
  }

  return usage as AppUsage;
}
