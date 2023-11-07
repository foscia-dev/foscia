import useShowable, { ShowableOptions } from '@foscia/cli/commands/composables/useShowable';
import useUsage, { UsageOptions } from '@foscia/cli/commands/composables/useUsage';
import { Command } from '@foscia/cli/commands/types';
import renderActionFactory from '@foscia/cli/templates/renderActionFactory';
import {
  AppLanguage,
  AppModules,
  AppPackageManager,
  CLIConfig,
  CONFIG_LANGUAGES,
  CONFIG_MODULES,
  CONFIG_PACKAGE_MANAGERS,
  CONFIG_USAGES,
} from '@foscia/cli/utils/config/config';
import { AUTO_DETECT_CONFIG } from '@foscia/cli/utils/config/parseConfig';
import checkMissingDependencies from '@foscia/cli/utils/dependencies/checkMissingDependencies';
import usePkg from '@foscia/cli/utils/dependencies/usePkg';
import findUp from '@foscia/cli/utils/files/findUp';
import resolvePath from '@foscia/cli/utils/files/resolvePath';
import writeOrPrintFile from '@foscia/cli/utils/files/writeOrPrintFile';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import findChoice from '@foscia/cli/utils/input/findChoice';
import promptForActionFactoryOptions from '@foscia/cli/utils/input/promptForActionFactoryOptions';
import promptForOverwrite from '@foscia/cli/utils/input/promptForOverwrite';
import logSymbols from '@foscia/cli/utils/output/logSymbols';
import { confirm, input, select } from '@inquirer/prompts';
import { execa } from 'execa';
import { resolve } from 'node:path';
import ora from 'ora';
import pc from 'picocolors';

export type InitCommandOptions = {
  path: string;
  manual?: boolean;
} & UsageOptions & ShowableOptions;

async function checkGlobalPkgManager(pkgManager: AppPackageManager) {
  try {
    const { stdout } = await execa(pkgManager, ['--version']);

    return /^\d+\.\d+\.\d+$/.test(stdout) ? pkgManager : false;
  } catch {
    return false;
  }
}

async function checkLockFilePkgManager(pkgManager: AppPackageManager, lockFileName: string) {
  return (await findUp(lockFileName)).length ? pkgManager : false;
}

async function resolvePkgManager() {
  const lockFileManagers = await Promise.all([
    checkLockFilePkgManager('npm', 'package-lock.json'),
    checkLockFilePkgManager('yarn', 'yarn.lock'),
    checkLockFilePkgManager('pnpm', 'pnpm-lock.yaml'),
    checkLockFilePkgManager('bun', 'bun.lockb'),
  ]);
  const lockFileManager = lockFileManagers.find((p) => p);
  if (lockFileManager) {
    return lockFileManager as AppPackageManager;
  }

  const globalManagers = await Promise.all([
    checkGlobalPkgManager('npm'),
    checkGlobalPkgManager('yarn'),
    checkGlobalPkgManager('pnpm'),
    checkGlobalPkgManager('bun'),
  ]);
  const globalManager = globalManagers.find((p) => p);
  if (globalManager) {
    return globalManager as AppPackageManager;
  }

  return undefined;
}

async function resolveEnvironment(args: InitCommandOptions) {
  const detectEnvironment = [] as string[];

  let detectedPackageManager: AppPackageManager | undefined;
  let detectedLanguage: AppLanguage | undefined;
  let detectedModules: AppModules | undefined;
  if (!args.manual) {
    try {
      const pkg = await usePkg();

      detectedPackageManager = await resolvePkgManager();
      if (detectedPackageManager) {
        detectEnvironment.push(findChoice(CONFIG_PACKAGE_MANAGERS, detectedPackageManager).name);
      }

      detectedLanguage = (
        pkg.findDependency('typescript') !== null
        || pkg.findDevDependency('typescript') !== null
        || (await findUp('tsconfig.json')).length
      ) ? 'ts' : 'js';

      detectEnvironment.push(findChoice(CONFIG_LANGUAGES, detectedLanguage).name);

      if (pkg.type) {
        detectedModules = pkg.type === 'module' ? 'esm' : 'commonjs';
        detectEnvironment.push(findChoice(CONFIG_MODULES, detectedModules).name);
      }
    } catch {
      console.warn(`${logSymbols.warning} Environment detection failed.`);
    }
  }

  if (detectEnvironment.length) {
    console.info(
      `${logSymbols.success} ${pc.bold('Detected environment:')} ${pc.cyan(detectEnvironment.join(', '))}`,
    );
  }

  const packageManager = detectedPackageManager ?? await select({
    message: 'Select your package manager:',
    choices: CONFIG_PACKAGE_MANAGERS,
  });

  const language = detectedLanguage ?? await select({
    message: 'Select your programing language:',
    choices: CONFIG_LANGUAGES,
  });

  const modules = detectedModules ?? await select({
    message: 'Select your modules organization:',
    choices: CONFIG_MODULES,
  });

  return { packageManager, language, modules };
}

async function resolveAlias(args: InitCommandOptions) {
  const alias = await confirm({
    message: 'Are you using an alias for paths (e.g. "@/*" for "src/*")?',
    default: false,
  });

  return alias
    ? input({
      message: `What alias should be used for path "${args.path}"?`,
      default: '@/',
    })
    : undefined;
}

async function installDependencies(config: CLIConfig) {
  const packageManager = findChoice(CONFIG_PACKAGE_MANAGERS, config.packageManager);
  const missingPackages = await checkMissingDependencies(config.usage);
  if (missingPackages.length === 0) {
    return;
  }

  console.log(`${logSymbols.info} Your usage requires the following packages: ${missingPackages.join(', ')}.`);

  const shouldInstall = await confirm({
    message: `Would you like to install them through ${packageManager.name}?`,
    default: true,
  });
  if (shouldInstall) {
    const loader = ora({ text: 'Installing packages...', color: 'magenta' }).start();
    try {
      await execa(packageManager.value, ['add', ...missingPackages]);

      loader.stop();

      console.info(`${logSymbols.success} Successfully installed packages.`);

      return;
    } catch {
      loader.stop();

      console.warn(`${logSymbols.warning} Failed to install packages. Please run:`);
    }
  } else {
    console.info(`${logSymbols.success} To install those packages manually, run:`);
  }

  console.log(pc.bold(`${config.packageManager} add ${missingPackages.join(' ')}`));
}

const [usageOptions, getUsage] = useUsage();
const [showOptions, getShow] = useShowable();

export default {
  name: 'init',
  command: 'init <path>',
  describe: pc.dim('Initialize foscia configuration and files.'),
  builder: (argv) => argv
    .usage(`Usage: ${pc.magenta('foscia')} ${pc.bold('init')} <path> [options]`)
    .example([
      [`${pc.magenta('foscia')} ${pc.bold('init')} src/data`, pc.dim('Initialize foscia files inside "src/data" directory and write configuration to ".fosciarc.json".')],
      [`${pc.magenta('foscia')} ${pc.bold('init')} src/api --config .fosciarc.api.json`, pc.dim('Initialize foscia files inside "src/api" directory and write configuration to ".fosciarc.api.json".')],
    ])
    .positional('path', {
      type: 'string',
      demandOption: true,
      normalize: true,
      description: pc.dim('Directory to put new Foscia files in.'),
    })
    .option('manual', {
      type: 'boolean',
      description: pc.dim('Disable environment detection (TS, etc.)'),
    })
    .options(usageOptions)
    .options(showOptions),
  handler: async (args) => {
    const show = getShow(args);

    console.log(
      pc.bold(`${logSymbols.foscia} Start by configuring your Foscia environment!\n`),
    );

    const configPath = args.config === AUTO_DETECT_CONFIG
      ? resolve('.fosciarc.json')
      : resolve(args.config);
    if (!show) {
      await promptForOverwrite(configPath);
    }

    const usage = await getUsage(args, () => select({
      message: 'What will you use foscia for?',
      choices: [
        ...CONFIG_USAGES,
        {
          name: 'Something else...',
          value: undefined,
        },
      ],
    }));
    const { packageManager, language, modules } = await resolveEnvironment(args);
    const alias = await resolveAlias(args);

    const config: CLIConfig = {
      usage,
      packageManager,
      language,
      modules,
      path: args.path,
      alias: alias || undefined,
      tabSize: 2,
    };

    if (!show) {
      await installDependencies(config);
    }

    const configContent = JSON.stringify(config, null, 2);
    await writeOrPrintFile('Config', configPath, configContent, 'json', show);

    console.log(
      pc.bold(`\n${logSymbols.foscia} Now, lets configure your action factory!\n`),
    );

    const factoryPath = resolvePath(config, `action.${config.language === 'ts' ? 'ts' : 'js'}`);
    if (!show) {
      await promptForOverwrite(factoryPath, 'Action factory was not generated. You can run "foscia make:action" to generate an action factory.');
    }

    const imports = makeImportsList();

    const factoryOptions = await promptForActionFactoryOptions(config, imports, usage);
    const factoryContent = renderActionFactory({ config, imports, usage, options: factoryOptions });
    await writeOrPrintFile('Action factory', factoryPath, factoryContent, config.language, show);
  },
} as Command<InitCommandOptions>;
