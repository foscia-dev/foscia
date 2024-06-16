import {
  ConfigurableOptions,
  useConfig,
  useConfigOption,
} from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForce, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShow, useShowOption } from '@foscia/cli/composables/useShow';
import renderLoader from '@foscia/cli/templates/make/renderLoader';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import validateFileName from '@foscia/cli/utils/files/validateFileName';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import makeFile from '@foscia/cli/utils/makeFile';
import findChoice from '@foscia/cli/utils/prompts/findChoice';
import promptForLoader, { RELATIONS_LOADERS } from '@foscia/cli/utils/prompts/promptForLoader';
import { confirm } from '@inquirer/prompts';
import pc from 'picocolors';

export type MakeLoaderCommandOptions =
  & {}
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions;

export async function runMakeLoaderCommand(
  name: string | undefined,
  options: MakeLoaderCommandOptions,
) {
  const config = await useConfig(options);
  const show = useShow(options);
  const force = useForce(options);

  await warnMissingDependencies(config);

  const loader = await promptForLoader();
  const onlyMissing = await confirm({
    message: 'would you like it to only load missing relations?',
    default: false,
  });
  const fileName = validateFileName(
    name,
    () => `load${onlyMissing ? 'Missing' : ''}${findChoice(RELATIONS_LOADERS, loader)!.defaultName}`,
  );

  await makeFile(config, `action factory "${fileName}"`, `loaders/${fileName}`, async () => {
    const imports = makeImportsList();

    return renderLoader({
      config,
      imports,
      loader,
      onlyMissing,
    });
  }, { show, force });
}

export default function makeLoaderCommand() {
  return makeCommander('loader')
    .description('Create a relations loader')
    .addHelpText('after', makeUsageExamples([
      ['Creates a loader', pc.bold('make loader')],
    ]))
    .argument('[name]', 'Name for loader')
    .option(...useShowOption)
    .option(...useForceOption)
    .option(...useConfigOption)
    .action(runMakeLoaderCommand);
}
