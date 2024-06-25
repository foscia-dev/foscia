import output from '@foscia/cli/utils/cli/output';
import { CLIConfig, CONFIG_PACKAGE_MANAGERS } from '@foscia/cli/utils/config/config';
import { warnedMissingDependencies } from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import findChoice from '@foscia/cli/utils/prompts/findChoice';
import promptConfirm from '@foscia/cli/utils/prompts/promptConfirm';
import { execa } from 'execa';
import ora from 'ora';

export default async function installDependencies(
  config: CLIConfig,
  dependencies: string[],
  options: { show?: boolean; dev?: boolean },
) {
  if (!dependencies.length) {
    return;
  }

  output.info(`missing ${options.dev ? 'dev ' : ''}dependencies: ${dependencies.join(', ')}`);
  warnedMissingDependencies();
  if (options.show) {
    return;
  }

  const packageManager = findChoice(CONFIG_PACKAGE_MANAGERS, config.packageManager);
  const shouldInstall = await promptConfirm({
    name: 'install',
    message: `should we install them using ${packageManager.name}?`,
    initial: true,
  });
  if (shouldInstall) {
    const loader = ora({ text: 'installing packages...', color: 'magenta' }).start();
    try {
      await execa(packageManager.value, [
        'add',
        ...(options.dev ? ['-D'] : []),
        ...dependencies,
      ]);

      loader.stop();

      output.success('installed missing packages');

      return;
    } catch {
      loader.stop();

      output.warn('failed installing packages, install them using:');
    }
  } else {
    output.info('ok, install them later using:');
  }

  output.instruct(`${config.packageManager} add ${options.dev ? '-D ' : ''}${dependencies.join(' ')}`);
}
