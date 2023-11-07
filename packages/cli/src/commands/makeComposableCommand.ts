import useShowable, { ShowableOptions } from '@foscia/cli/commands/composables/useShowable';
import { Command } from '@foscia/cli/commands/types';
import renderComposable from '@foscia/cli/templates/renderComposable';
import useConfig from '@foscia/cli/utils/config/useConfig';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import promptForComposables from '@foscia/cli/utils/input/promptForComposables';
import promptForProperties from '@foscia/cli/utils/input/promptForProperties';
import makeFile from '@foscia/cli/utils/makeFile';
import logSymbols from '@foscia/cli/utils/output/logSymbols';
import { camelCase } from 'lodash-es';
import pc from 'picocolors';

export type MakeComposableCommandOptions = {
  name: string;
} & ShowableOptions;

const [showOptions, getShow] = useShowable();

export default {
  name: 'make:composable',
  command: 'make:composable <name>',
  describe: pc.dim('Create a composable file.'),
  builder: (argv) => argv
    .usage(`Usage: ${pc.magenta('foscia')} ${pc.bold('make:composable')} <name> [options]`)
    .example([
      [`${pc.magenta('foscia')} ${pc.bold('make:composable')} publishable`, pc.dim('Initialize a Publishable composable.')],
    ])
    .positional('name', {
      type: 'string',
      demandOption: true,
      description: pc.dim('Name to use for new composable (impacts file name).'),
    })
    .options(showOptions),
  handler: async (args) => {
    const config = await useConfig(args.config);
    const show = getShow(args);
    await warnMissingDependencies(config);

    const name = camelCase(args.name);
    const fileName = `composables/${name}`;
    await makeFile(config, `Composable ${name}`, fileName, async () => {
      console.log(
        `${logSymbols.foscia} Lets configure your composable's definition (attributes, etc.).\n`,
      );

      const imports = makeImportsList();

      return renderComposable({
        config,
        imports,
        composables: await promptForComposables(config, imports),
        properties: await promptForProperties(config, imports),
      });
    }, show);
  },
} as Command<MakeComposableCommandOptions>;
