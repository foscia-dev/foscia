import {
  ConfigurableOptions,
  useConfig,
  useConfigOption,
} from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForce, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShow, useShowOption } from '@foscia/cli/composables/useShow';
import renderReducer from '@foscia/cli/templates/make/renderReducer';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import makeFile from '@foscia/cli/utils/makeFile';

export type MakeReducerCommandOptions =
  & {}
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions;

export async function runMakeReducerCommand(
  options: MakeReducerCommandOptions,
) {
  const config = await useConfig(options);
  const show = useShow(options);
  const force = useForce(options);

  await warnMissingDependencies(config);

  await makeFile(config, 'models reducer', 'utils/reducer', async () => {
    const imports = makeImportsList();

    return renderReducer({
      config,
      imports,
    });
  }, { show, force });
}

export default function makeReducerCommand() {
  return makeCommander('reducer')
    .description('Create models reducer')
    .addHelpText('after', makeUsageExamples([
      ['Creates a reducer', 'make reducer'],
    ]))
    .option(...useShowOption)
    .option(...useForceOption)
    .option(...useConfigOption)
    .action(runMakeReducerCommand);
}
