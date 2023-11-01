import { AppUsage, CONFIG_USAGES } from '@foscia/cli/utils/config/config';
import logSymbols from '@foscia/cli/utils/output/logSymbols';
import process from 'node:process';
import pc from 'picocolors';

export type UsageOptions = {
  usage?: string;
};

export default function useUsage() {
  const options = {
    usage: {
      type: 'string',
      description: pc.dim(`Typology of Foscia usage within: ${CONFIG_USAGES.map((u) => u.value).join(', ')}`),
    },
  } as const;

  const getUsage = async (
    args: UsageOptions,
    defaultUsage: () => Promise<AppUsage | undefined>,
  ) => {
    const usage = args.usage ?? (await defaultUsage());

    const possibleUsages = CONFIG_USAGES.map(({ value }) => value) as string[];
    if (!usage || possibleUsages.indexOf(usage) === -1) {
      console.error(`\n${logSymbols.error} Sorry, but Foscia does not support other built-in usages for now.`);
      console.error('Please create an issue to suggest the feature you need at: https://github.com/foscia-dev/foscia/issues/new/choose');
      process.exit(1);
    }

    return usage as AppUsage;
  };

  return [options, getUsage] as const;
}
