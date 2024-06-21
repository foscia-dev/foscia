import {
  ConfigurableOptions,
  useConfig,
  useConfigOption,
} from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForce, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShow, useShowOption } from '@foscia/cli/composables/useShow';
import { UsageOptions, useUsage, useUsageOption } from '@foscia/cli/composables/useUsage';
import renderAction from '@foscia/cli/templates/make/renderAction';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import validateFileName from '@foscia/cli/utils/files/validateFileName';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import makeFile from '@foscia/cli/utils/makeFile';
import promptForActionFactoryOptions from '@foscia/cli/utils/prompts/promptForActionFactoryOptions';

export type MakeActionCommandOptions =
  & {}
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions
  & UsageOptions;

export async function runMakeActionCommand(
  name: string,
  options: MakeActionCommandOptions,
) {
  const config = await useConfig(options);
  const show = useShow(options);
  const force = useForce(options);
  const usage = await useUsage(options, () => config.usage);

  await warnMissingDependencies(config);

  const fileName = validateFileName(name);

  await makeFile(config, `action factory "${fileName}"`, fileName, async () => {
    const imports = makeImportsList();

    return renderAction({
      config,
      imports,
      usage,
      options: await promptForActionFactoryOptions(config, imports, { usage, show, force }),
    });
  }, { show, force });
}

export default function makeActionCommand() {
  return makeCommander('action')
    .description('Create an action factory')
    .addHelpText('after', makeUsageExamples([
      ['Creates an action factory', 'make action'],
    ]))
    .argument('[name]', 'Name for action factory', 'action')
    .option(...useShowOption)
    .option(...useForceOption)
    .option(...useUsageOption)
    .option(...useConfigOption)
    .action(runMakeActionCommand);
}
