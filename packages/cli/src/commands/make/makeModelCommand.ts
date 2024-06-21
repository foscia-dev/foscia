import { runMakeModelsCommand } from '@foscia/cli/commands/make/makeModelsCommand';
import { ConfigurableOptions, useConfig, useConfigOption } from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForce, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShow, useShowOption } from '@foscia/cli/composables/useShow';
import renderModel from '@foscia/cli/templates/make/renderModel';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import output from '@foscia/cli/utils/cli/output';
import hasManualModelsList from '@foscia/cli/utils/context/hasManualModelsList';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import validateFileName from '@foscia/cli/utils/files/validateFileName';
import hasFile from '@foscia/cli/utils/hasFile';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import makeFile from '@foscia/cli/utils/makeFile';
import promptConfirm from '@foscia/cli/utils/prompts/promptConfirm';
import promptForComposables from '@foscia/cli/utils/prompts/promptForComposables';
import promptForProperties from '@foscia/cli/utils/prompts/promptForProperties';
import { Dictionary } from '@foscia/shared';
import { camelCase, kebabCase, upperFirst } from 'lodash-es';
import { plural, singular } from 'pluralize';

export type MakeModelCommandOptions =
  & { writeModels?: boolean; }
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions;

export async function runMakeModelCommand(
  name: string,
  options: MakeModelCommandOptions,
) {
  const config = await useConfig(options);
  const show = useShow(options);
  const force = useForce(options);

  await warnMissingDependencies(config);

  const fileName = validateFileName(singular(name));

  await makeFile(config, `model "${fileName}"`, `models/${fileName}`, async () => {
    const imports = makeImportsList();

    const kebabPluralTypeResolver = () => kebabCase(plural(name));
    const typeFromNameResolver = ({
      jsonapi: kebabPluralTypeResolver,
      jsonrest: kebabPluralTypeResolver,
    } as Dictionary<() => string>)[config.usage] ?? kebabPluralTypeResolver;

    return renderModel({
      config,
      imports,
      className: upperFirst(camelCase(fileName)),
      typeName: typeFromNameResolver(),
      customFactory: await hasFile(config, 'makeModel'),
      composables: await promptForComposables(config, imports),
      properties: await promptForProperties(config, imports),
    });
  }, { show, force });

  if (!show) {
    const hasDiscoverModels = await hasManualModelsList(config);
    if (hasDiscoverModels) {
      const writeModels = options.writeModels || await promptConfirm({
        name: 'models',
        message: 'should we update models list file?',
        default: true,
      });
      if (writeModels) {
        await runMakeModelsCommand({ show: false, force: true, explorer: 'manual' });
      }
    } else if (options.writeModels) {
      output.info('"--write-models" option is useless when using none or automatic models list');
    }
  } else if (options.writeModels) {
    output.info('"--write-models" option has no effect when using "--show" option');
  }
}

export default function makeModelCommand() {
  return makeCommander('model')
    .description('Create a model')
    .addHelpText('after', makeUsageExamples([
      ['Creates a "Post" model', 'make model', 'post'],
    ]))
    .argument('<name>', 'Name for model')
    .option(...useShowOption)
    .option(...useForceOption)
    .option('--write-models', 'Update models list file immediately')
    .option(...useConfigOption)
    .action(runMakeModelCommand);
}
