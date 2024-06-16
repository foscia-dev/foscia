import output from '@foscia/cli/utils/cli/output';
import { AppUsage, CLIConfig } from '@foscia/cli/utils/config/config';
import checkMissingDependencies from '@foscia/cli/utils/dependencies/checkMissingDependencies';

let lifecycleWarned = false;

export function warnedMissingDependencies() {
  lifecycleWarned = true;
}

export default async function warnMissingDependencies(config: CLIConfig, otherUsage?: AppUsage) {
  if (!lifecycleWarned) {
    warnedMissingDependencies();
    const usage = otherUsage ?? config.usage;
    const missingPackages = await checkMissingDependencies(usage);
    if (missingPackages.length) {
      output.warn(`missing dependencies for "${usage}", install them with:`);
      output.instruct(`${config.packageManager} add ${missingPackages.join(' ')}`);
    }
  }
}
