import {
  ConfigurableOptions,
  useConfig,
  useConfigOption,
} from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForce, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShow, useShowOption } from '@foscia/cli/composables/useShow';
import renderEnhancer from '@foscia/cli/templates/make/renderEnhancer';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import validateFileName from '@foscia/cli/utils/files/validateFileName';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import makeFile from '@foscia/cli/utils/makeFile';
import { camelCase } from 'lodash-es';

export type MakeEnhancerCommandOptions =
  & {}
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions;

export async function runMakeEnhancerCommand(
  name: string,
  options: MakeEnhancerCommandOptions,
) {
  const config = await useConfig(options);
  const show = useShow(options);
  const force = useForce(options);

  await warnMissingDependencies(config);

  const fileName = validateFileName(name);

  await makeFile(config, `enhancer "${fileName}"`, `enhancers/${fileName}`, async () => {
    const imports = makeImportsList();

    return renderEnhancer({
      config,
      imports,
      functionName: camelCase(fileName),
    });
  }, { show, force });
}

export default function makeEnhancerCommand() {
  return makeCommander('enhancer')
    .description('Create an action enhancer')
    .argument('<name>', 'Name for enhancer')
    .addHelpText('after', makeUsageExamples([
      ['Creates an action enhancer', 'make enhancer', 'queryFirst'],
    ]))
    .option(...useShowOption)
    .option(...useForceOption)
    .option(...useConfigOption)
    .action(runMakeEnhancerCommand);
}
