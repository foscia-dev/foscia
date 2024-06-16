import {
  ConfigurableOptions,
  useConfig,
  useConfigOption,
} from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForce, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShow, useShowOption } from '@foscia/cli/composables/useShow';
import renderRunner from '@foscia/cli/templates/make/renderRunner';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import validateFileName from '@foscia/cli/utils/files/validateFileName';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import makeFile from '@foscia/cli/utils/makeFile';
import { camelCase } from 'lodash-es';
import pc from 'picocolors';

export type MakeRunnerCommandOptions =
  & {}
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions;

export async function runMakeRunnerCommand(
  name: string,
  options: MakeRunnerCommandOptions,
) {
  const config = await useConfig(options);
  const show = useShow(options);
  const force = useForce(options);

  await warnMissingDependencies(config);

  const fileName = validateFileName(name);

  await makeFile(config, `runner "${fileName}"`, `runners/${fileName}`, async () => {
    const imports = makeImportsList();

    return renderRunner({
      config,
      imports,
      functionName: camelCase(fileName),
    });
  }, { show, force });
}

export default function makeRunnerCommand() {
  return makeCommander('runner')
    .description('Create an action runner')
    .addHelpText('after', makeUsageExamples([
      ['Creates an action runner', `${pc.bold('make runner')} firstOrFail`],
    ]))
    .argument('<name>', 'Name for runner')
    .option(...useShowOption)
    .option(...useForceOption)
    .option(...useConfigOption)
    .action(runMakeRunnerCommand);
}
