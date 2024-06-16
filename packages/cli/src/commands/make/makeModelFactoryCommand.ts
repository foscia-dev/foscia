import {
  ConfigurableOptions,
  useConfig,
  useConfigOption,
} from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForce, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShow, useShowOption } from '@foscia/cli/composables/useShow';
import renderModelFactory from '@foscia/cli/templates/make/renderModelFactory';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import makeFile from '@foscia/cli/utils/makeFile';
import promptForComposables from '@foscia/cli/utils/prompts/promptForComposables';
import promptForProperties from '@foscia/cli/utils/prompts/promptForProperties';
import pc from 'picocolors';

export type MakeModelFactoryCommandOptions =
  & {}
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions;

export async function runMakeModelFactoryCommand(
  options: MakeModelFactoryCommandOptions,
) {
  const config = await useConfig(options);
  const show = useShow(options);
  const force = useForce(options);

  await warnMissingDependencies(config);

  await makeFile(config, 'model factory', 'makeModel', async () => {
    const imports = makeImportsList();

    return renderModelFactory({
      config,
      imports,
      composables: await promptForComposables(config, imports),
      properties: await promptForProperties(config, imports),
    });
  }, { show, force });
}

export default function makeModelFactoryCommand() {
  return makeCommander('model-factory')
    .description('Create model factory')
    .addHelpText('after', makeUsageExamples([
      ['Creates a model factory', pc.bold('make model-factory')],
    ]))
    .option(...useShowOption)
    .option(...useForceOption)
    .option(...useConfigOption)
    .action(runMakeModelFactoryCommand);
}
