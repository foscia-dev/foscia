import { runMakeModelsCommand } from '@foscia/cli/commands/make/makeModelsCommand';
import {
  ConfigurableOptions,
  useConfig,
  useConfigOption,
} from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForce, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShow, useShowOption } from '@foscia/cli/composables/useShow';
import renderReviver from '@foscia/cli/templates/make/renderReviver';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import hasModelsList from '@foscia/cli/utils/context/hasModelsList';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import makeFile from '@foscia/cli/utils/makeFile';

export type MakeReviverCommandOptions =
  & {}
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions;

export async function runMakeReviverCommand(
  options: MakeReviverCommandOptions,
) {
  const config = await useConfig(options);
  const show = useShow(options);
  const force = useForce(options);

  await warnMissingDependencies(config);

  await makeFile(config, 'models reviver', 'utils/reviver', async () => {
    if (!await hasModelsList(config)) {
      await runMakeModelsCommand(options);
    }

    const imports = makeImportsList();

    return renderReviver({
      config,
      imports,
    });
  }, { show, force });
}

export default function makeReviverCommand() {
  return makeCommander('reviver')
    .description('Create models reviver')
    .addHelpText('after', makeUsageExamples([
      ['Creates a reviver', 'make reviver'],
    ]))
    .option(...useShowOption)
    .option(...useForceOption)
    .option(...useConfigOption)
    .action(runMakeReviverCommand);
}
