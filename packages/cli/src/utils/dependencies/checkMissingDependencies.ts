import { AppUsage, CONFIG_USAGES } from '@foscia/cli/utils/config/config';
import usePkg from '@foscia/cli/utils/dependencies/usePkg';
import findChoice from '@foscia/cli/utils/input/findChoice';

export default async function checkMissingDependencies(usage: AppUsage) {
  const pkg = await usePkg();
  const { packages } = findChoice(CONFIG_USAGES, usage);

  return packages.filter((p) => pkg.findDependency(p) === null);
}
