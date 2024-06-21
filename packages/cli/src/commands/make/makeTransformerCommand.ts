import {
  ConfigurableOptions,
  useConfig,
  useConfigOption,
} from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForce, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShow, useShowOption } from '@foscia/cli/composables/useShow';
import renderTransformer from '@foscia/cli/templates/make/renderTransformer';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import validateFileName from '@foscia/cli/utils/files/validateFileName';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import makeFile from '@foscia/cli/utils/makeFile';

export type MakeTransformerCommandOptions =
  & {}
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions;

export async function runMakeTransformerCommand(
  name: string,
  options: MakeTransformerCommandOptions,
) {
  const config = await useConfig(options);
  const show = useShow(options);
  const force = useForce(options);

  await warnMissingDependencies(config);

  const fileName = validateFileName(name);

  await makeFile(config, `transformer "${fileName}"`, `transformers/${fileName}`, async () => {
    const imports = makeImportsList();

    return renderTransformer({
      config,
      imports,
    });
  }, { show, force });
}

export default function makeTransformerCommand() {
  return makeCommander('transformer')
    .description('Create a transformer')
    .addHelpText('after', makeUsageExamples([
      ['Creates a "toDateTime" transformer', 'make transformer', 'toDateTime'],
    ]))
    .argument('<name>', 'Name for transformer')
    .option(...useShowOption)
    .option(...useForceOption)
    .option(...useConfigOption)
    .action(runMakeTransformerCommand);
}
