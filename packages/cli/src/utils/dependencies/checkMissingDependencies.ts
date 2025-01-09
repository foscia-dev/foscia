import {
  AppFramework,
  AppUsage,
  CONFIG_FRAMEWORKS,
  CONFIG_USAGES,
} from '@foscia/cli/utils/config/config';
import usePkg from '@foscia/cli/utils/dependencies/usePkg';
import findChoice from '@foscia/cli/utils/prompts/findChoice';

export default async function checkMissingDependencies(
  usage: AppUsage,
  framework?: AppFramework,
) {
  const pkg = await usePkg();
  const packages = [...findChoice(CONFIG_USAGES, usage).packages] as string[];

  if (framework) {
    packages.push(...findChoice(CONFIG_FRAMEWORKS, framework).packages);
  }

  return packages.filter((p) => pkg.findDependency(p) === null);
}
