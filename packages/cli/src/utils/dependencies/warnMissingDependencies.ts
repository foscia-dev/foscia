import { AppUsage, CLIConfig } from '@foscia/cli/utils/config/config';
import checkMissingDependencies from '@foscia/cli/utils/dependencies/checkMissingDependencies';
import logSymbols from '@foscia/cli/utils/output/logSymbols';
import pc from 'picocolors';

export default async function warnMissingDependencies(config: CLIConfig, otherUsage?: AppUsage) {
  const usage = otherUsage ?? config.usage;
  const missingPackages = await checkMissingDependencies(usage);
  if (missingPackages.length) {
    console.warn(`${logSymbols.warning} You are missing Foscia dependencies for "${usage}" usage. You should run:`);
    console.log(pc.bold(`${config.packageManager} add ${missingPackages.join(' ')}\n`));
  }
}
