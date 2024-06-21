import {
  ConfigurableOptions,
  useConfig,
  useConfigOption,
} from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForce, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShow, useShowOption } from '@foscia/cli/composables/useShow';
import renderComposable from '@foscia/cli/templates/make/renderComposable';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import validateFileName from '@foscia/cli/utils/files/validateFileName';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import makeFile from '@foscia/cli/utils/makeFile';
import promptForComposables from '@foscia/cli/utils/prompts/promptForComposables';
import promptForProperties from '@foscia/cli/utils/prompts/promptForProperties';

export type MakeComposableCommandOptions =
  & {}
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions;

export async function runMakeComposableCommand(
  name: string,
  options: MakeComposableCommandOptions,
) {
  const config = await useConfig(options);
  const show = useShow(options);
  const force = useForce(options);

  await warnMissingDependencies(config);

  const fileName = validateFileName(name);

  await makeFile(config, `composable "${fileName}"`, `composables/${fileName}`, async () => {
    const imports = makeImportsList();

    return renderComposable({
      config,
      imports,
      composables: await promptForComposables(config, imports),
      properties: await promptForProperties(config, imports),
    });
  }, { show, force });
}

export default function makeComposableCommand() {
  return makeCommander('composable')
    .description('Create a composable')
    .addHelpText('after', makeUsageExamples([
      ['Creates a "publishable" composable', 'make composable', 'publishable'],
    ]))
    .argument('<name>', 'Name for composable')
    .option(...useShowOption)
    .option(...useForceOption)
    .option(...useConfigOption)
    .action(runMakeComposableCommand);
}
