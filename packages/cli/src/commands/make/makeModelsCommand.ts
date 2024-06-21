import {
  ConfigurableOptions,
  useConfig,
  useConfigOption,
} from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForce, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShow, useShowOption } from '@foscia/cli/composables/useShow';
import renderModels from '@foscia/cli/templates/make/renderModels';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import output from '@foscia/cli/utils/cli/output';
import resolveModels from '@foscia/cli/utils/context/resolveModels';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import makeFile from '@foscia/cli/utils/makeFile';
import promptForModelsExplorer, {
  MODELS_EXPLORERS,
  ModelsExplorer,
} from '@foscia/cli/utils/prompts/promptForModelsExplorer';
import process from 'node:process';

export type MakeModelsCommandOptions =
  & { explorer?: string; }
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions;

export async function runMakeModelsCommand(
  options: MakeModelsCommandOptions,
) {
  const config = await useConfig(options);
  const show = useShow(options);
  const force = useForce(options);

  if (
    options.explorer !== undefined
    && !MODELS_EXPLORERS.some((e) => options.explorer === e.value)
  ) {
    output.error(`invalid explorer given, choose within: ${MODELS_EXPLORERS.map((e) => e.value).join(', ')}`);
    process.exit(1);
  }

  await warnMissingDependencies(config);

  await makeFile(config, 'models list', 'models', async () => {
    const imports = makeImportsList();
    const models = await resolveModels(config);

    return renderModels({
      config,
      imports,
      models,
      explorer: (
        options.explorer ?? await promptForModelsExplorer(config, models)
      ) as ModelsExplorer,
    });
  }, { show, force });
}

export default function makeModelsCommand() {
  return makeCommander('models')
    .description('Create models list')
    .addHelpText('after', makeUsageExamples([
      ['Creates a models list', 'make models'],
    ]))
    .option(...useShowOption)
    .option(...useForceOption)
    .option('--explorer <explorer>', `Explorer to generate within: ${MODELS_EXPLORERS.map((e) => e.value).join(', ')}`)
    .option(...useConfigOption)
    .action(runMakeModelsCommand);
}
