import { runNuxtCommand } from '@foscia/cli/commands/integrate/nuxtCommand';
import { runMakeActionCommand } from '@foscia/cli/commands/make/makeActionCommand';
import { runMakeModelCommand } from '@foscia/cli/commands/make/makeModelCommand';
import {
  ConfigurableOptions,
  setLifecycleConfig,
  useConfigOption,
} from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForce, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShow, useShowOption } from '@foscia/cli/composables/useShow';
import { UsageOptions, useUsage, useUsageOption } from '@foscia/cli/composables/useUsage';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import output from '@foscia/cli/utils/cli/output';
import {
  AppFramework,
  AppLanguage,
  AppModules,
  AppPackageManager,
  CLIConfig,
  CONFIG_LANGUAGES,
  CONFIG_MODULES,
  CONFIG_PACKAGE_MANAGERS,
  CONFIG_USAGES,
} from '@foscia/cli/utils/config/config';
import checkMissingDependencies from '@foscia/cli/utils/dependencies/checkMissingDependencies';
import installDependencies from '@foscia/cli/utils/dependencies/installDependencies';
import usePkg from '@foscia/cli/utils/dependencies/usePkg';
import findUp from '@foscia/cli/utils/files/findUp';
import pathExists from '@foscia/cli/utils/files/pathExists';
import writeOrPrintFile from '@foscia/cli/utils/files/writeOrPrintFile';
import findChoice from '@foscia/cli/utils/prompts/findChoice';
import promptConfirm from '@foscia/cli/utils/prompts/promptConfirm';
import promptForOverwrite from '@foscia/cli/utils/prompts/promptForOverwrite';
import promptSelect from '@foscia/cli/utils/prompts/promptSelect';
import promptText from '@foscia/cli/utils/prompts/promptText';
import c from 'ansi-colors';
import { execa } from 'execa';
import { normalize, resolve } from 'node:path';

export type InitCommandOptions =
  & { manual?: boolean; }
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions
  & UsageOptions;

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

async function resolveEnvironment(options: InitCommandOptions) {
  const detectEnvironment = [] as string[];

  let detectedPackageManager: AppPackageManager | undefined;
  let detectedLanguage: AppLanguage | undefined;
  let detectedModules: AppModules | undefined;
  if (!options.manual) {
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
      output.warn('environment detection failed');
    }
  }

  if (detectEnvironment.length) {
    output.success(`${c.bold('detected environment:')} ${c.cyan(detectEnvironment.join(', '))}`);
  }

  const packageManager = detectedPackageManager ?? await promptSelect({
    name: 'packageManager',
    message: 'what\'s your package manager:',
    choices: CONFIG_PACKAGE_MANAGERS,
  });

  const language = detectedLanguage ?? await promptSelect({
    name: 'language',
    message: 'what\'s your programing language:',
    choices: CONFIG_LANGUAGES,
  });

  const modules = detectedModules ?? await promptSelect({
    name: 'modules',
    message: 'what\'s your modules organization:',
    choices: CONFIG_MODULES,
  });

  return { packageManager, language, modules };
}

async function guessPathAndFramework(): Promise<[string, undefined] | [string, 'nuxt']> {
  if (
    await pathExists(resolve('nuxt.config.ts'))
    || await pathExists(resolve('nuxt.config.js'))
  ) {
    return [
      await pathExists(resolve('app'))
        ? 'app/data'
        : 'data',
      'nuxt',
    ];
  }

  if (await pathExists(resolve('artisan'))) {
    return [
      await pathExists(resolve('resources/ts'))
        ? 'resources/ts/data'
        : 'resources/js/data',
      undefined,
    ];
  }

  if (await pathExists(resolve('symfony.lock'))) {
    return [
      await pathExists(resolve('assets/ts'))
        ? 'assets/ts/data'
        : 'assets/js/data',
      undefined,
    ];
  }

  return ['src/data', undefined];
}

function guessAlias(path: string) {
  const commonPaths = [
    // Laravel project aliases.
    'resources/js/',
    'resources/ts/',
    // Symfony project aliases.
    'assets/js/',
    'assets/ts/',
    // Common project aliases.
    'src/',
    'app/',
  ];
  const commonPath = commonPaths.find((p) => path.startsWith(p));
  if (commonPath !== undefined) {
    return path.replace(commonPath, '@/');
  }

  return `@/${path}`;
}

async function resolveAlias(path: string) {
  const alias = await promptConfirm({
    name: 'alias',
    message: 'do you use an alias for imports paths?',
    initial: false,
  });
  if (!alias) {
    return undefined;
  }

  return promptText({
    name: 'alias',
    message: `what alias should be used for path "${path}"?`,
    default: guessAlias(path),
  });
}

export async function runInitCommand(
  path: string,
  options: InitCommandOptions,
) {
  output.intro('welcome!');

  output.step('config and dependencies');

  const configPath = options.config === undefined
    ? resolve('.fosciarc.json')
    : resolve(options.config);

  const show = useShow(options);
  const force = useForce(options);
  if (!show && !force) {
    await promptForOverwrite(configPath);
  }

  const usage = await useUsage(options, () => promptSelect({
    name: 'usage',
    message: 'what\'s your need?',
    choices: [
      ...CONFIG_USAGES,
      {
        name: 'something else...',
        value: null,
      },
    ],
  }));

  let framework: AppFramework | undefined;

  const [defaultPath, detectedFramework] = await guessPathAndFramework();
  if (detectedFramework) {
    output.success(`${c.bold('detected framework:')} ${c.cyan(detectedFramework)}`);

    const frameworkIntegrate = await promptConfirm({
      name: 'integrate',
      message: 'would you like to integrate it?',
      initial: true,
    });
    if (frameworkIntegrate) {
      framework = detectedFramework;
    } else {
      output.info('ok, you integrate it later using the following command, but it might requires additional configuration:');
      output.instruct(`foscia integrate ${detectedFramework}\n`);
    }
  }

  const filesPath = normalize(path?.length ? path : await promptText({
    name: 'path',
    message: 'where will you store Foscia files?',
    default: defaultPath,
  }));

  const { packageManager, language, modules } = await resolveEnvironment(options);
  const alias = await resolveAlias(filesPath);

  const config: CLIConfig = {
    usage,
    packageManager,
    language,
    modules,
    framework,
    path: filesPath,
    alias: alias || undefined,
    tabSize: 2,
  };

  setLifecycleConfig(config);

  const missingDependencies = await checkMissingDependencies(config.usage, config.framework);
  await installDependencies(config, missingDependencies, { show });

  const configContent = `${JSON.stringify(config, null, 2)}\n`;
  await writeOrPrintFile('config', configPath, configContent, 'json', show);

  output.step('first model');

  const model = await promptConfirm({
    name: 'model',
    message: 'would you like to generate a first model?',
    initial: true,
  });
  if (model) {
    const modelName = await promptText({
      name: 'model',
      message: 'what name should be used for model?',
    });

    await runMakeModelCommand(modelName, { show, force });
  } else {
    output.info('ok, create it later using:');
    output.instruct('foscia make model\n');
  }

  output.step('action factory');

  const actionFactory = await promptConfirm({
    name: 'action',
    message: 'would you like to generate an action factory?',
    initial: true,
  });
  if (actionFactory) {
    await runMakeActionCommand('action', { show, force });
  } else {
    output.info('ok, create it later using:');
    output.instruct('foscia make action\n');
  }

  if (config.framework) {
    output.step(`${config.framework} integration`);

    await runNuxtCommand({ payloadPlugin: 'fosciaPayloadPlugin', show, force });
  }
}

export default function initCommand() {
  return makeCommander('init')
    .description('Initialize Foscia in your project')
    .argument('[path]', 'Directory to put Foscia files in')
    .addHelpText('after', makeUsageExamples([
      ['Initializes Foscia in your project', 'init'],
      [
        'Initializes Foscia with dedicated paths and specific usage',
        'init',
        'src/api',
        '--config .fosciarc.api.json',
        '--usage jsonapi',
      ],
    ]))
    .option(...useShowOption)
    .option(...useForceOption)
    .option(...useUsageOption)
    .option('--manual', 'Disable environment detection (TS, ESM, etc.)')
    .option(...useConfigOption)
    .action(runInitCommand);
}
