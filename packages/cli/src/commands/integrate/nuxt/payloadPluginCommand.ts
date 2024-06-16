import { runMakeReducerCommand } from '@foscia/cli/commands/make/makeReducerCommand';
import { runMakeReviverCommand } from '@foscia/cli/commands/make/makeReviverCommand';
import {
  ConfigurableOptions,
  useConfig,
  useConfigOption,
} from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForce, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShow, useShowOption } from '@foscia/cli/composables/useShow';
import renderPayloadPlugin from '@foscia/cli/templates/integrate/nuxt/renderPayloadPlugin';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import hasModelsReducer from '@foscia/cli/utils/context/hasModelsReducer';
import hasModelsReviver from '@foscia/cli/utils/context/hasModelsReviver';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import pathExists from '@foscia/cli/utils/files/pathExists';
import validateFileName from '@foscia/cli/utils/files/validateFileName';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import makeFile from '@foscia/cli/utils/makeFile';
import { resolve } from 'node:path';

export type PayloadPluginCommandOptions =
  & { directory?: string; }
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions;

async function guessNuxtPluginsDirectory() {
  if (await pathExists(resolve('app'))) {
    return 'app/plugins';
  }

  return 'plugins';
}

export async function runPayloadPluginCommand(
  name: string,
  options: PayloadPluginCommandOptions,
) {
  const config = await useConfig(options);
  const show = useShow(options);
  const force = useForce(options);

  await warnMissingDependencies(config);

  const directory = resolve(options.directory || await guessNuxtPluginsDirectory());
  const fileName = validateFileName(name);

  await makeFile(config, `plugin "${fileName}"`, `${directory}/${fileName}`, async () => {
    if (!(await hasModelsReducer(config))) {
      await runMakeReducerCommand(options);
    }

    if (!(await hasModelsReviver(config))) {
      await runMakeReviverCommand(options);
    }

    const imports = makeImportsList();

    return renderPayloadPlugin({
      config,
      imports,
    });
  }, { show, force, external: true });
}

export default function payloadPluginCommand() {
  return makeCommander('payload-plugin')
    .description('Publish only payload plugin for nuxt')
    .argument('[name]', 'Name for the plugin', 'fosciaPayloadPlugin')
    .option(...useShowOption)
    .option(...useForceOption)
    .option('--directory <directory>', 'Plugins directory path')
    .option(...useConfigOption)
    .action(runPayloadPluginCommand);
}
