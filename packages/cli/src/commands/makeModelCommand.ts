import useShowable, { ShowableOptions } from '@foscia/cli/commands/composables/useShowable';
import { Command } from '@foscia/cli/commands/types';
import renderModel from '@foscia/cli/templates/renderModel';
import useConfig from '@foscia/cli/utils/config/useConfig';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import promptForComposables from '@foscia/cli/utils/input/promptForComposables';
import promptForProperties from '@foscia/cli/utils/input/promptForProperties';
import makeFile from '@foscia/cli/utils/makeFile';
import logSymbols from '@foscia/cli/utils/output/logSymbols';
import { camelCase, kebabCase, upperFirst } from 'lodash-es';
import pc from 'picocolors';
import { plural, singular } from 'pluralize';

export type MakeModelCommandOptions = {
  name: string;
} & ShowableOptions;

const [showOptions, getShow] = useShowable();

export default {
  name: 'make:model',
  command: 'make:model <name>',
  describe: pc.dim('Create a model file.'),
  builder: (argv) => argv
    .usage(`Usage: ${pc.magenta('foscia')} ${pc.bold('make:model')} <name> [options]`)
    .example([
      [`${pc.magenta('foscia')} ${pc.bold('make:model')} Post`, pc.dim('Initialize a Post model.')],
    ])
    .positional('name', {
      type: 'string',
      demandOption: true,
      description: pc.dim('Name to use for new model (impacts file name, class, type, etc.).'),
    })
    .options(showOptions),
  handler: async (args) => {
    const config = await useConfig(args.config);
    const show = getShow(args);
    await warnMissingDependencies(config);

    const name = camelCase(singular(args.name));
    const fileName = `models/${name}`;
    const className = upperFirst(name);
    const typeName = kebabCase(plural(name));
    await makeFile(config, `Model ${className}`, fileName, async () => {
      console.log(
        `${logSymbols.foscia} Lets configure your model's definition (attributes, etc.).\n`,
      );

      const imports = makeImportsList();

      return renderModel({
        config,
        imports,
        className,
        typeName,
        composables: await promptForComposables(config, imports),
        properties: await promptForProperties(config, imports),
      });
    }, show);
  },
} as Command<MakeModelCommandOptions>;
