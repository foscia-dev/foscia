import useShowable, { ShowableOptions } from '@foscia/cli/commands/composables/useShowable';
import { Command } from '@foscia/cli/commands/types';
import renderTransformer from '@foscia/cli/templates/renderTransformer';
import useConfig from '@foscia/cli/utils/config/useConfig';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import makeFile from '@foscia/cli/utils/makeFile';
import { camelCase } from 'lodash-es';
import pc from 'picocolors';

export type MakeTransformerCommandOptions = {
  name: string;
} & ShowableOptions;

const [showOptions, getShow] = useShowable();

export default {
  name: 'make:transformer',
  command: 'make:transformer <name>',
  describe: pc.dim('Create a transformer file.'),
  builder: (argv) => argv
    .usage(`Usage: ${pc.magenta('foscia')} ${pc.bold('make:transformer')} <name> [options]`)
    .example([
      [`${pc.magenta('foscia')} ${pc.bold('make:transformer')} toDateTime`, pc.dim('Initialize a toDate transformer.')],
    ])
    .positional('name', {
      type: 'string',
      demandOption: true,
      description: pc.dim('Name to use for new transformer (impacts file name).'),
    })
    .options(showOptions),
  handler: async (args) => {
    const config = await useConfig(args.config);
    const show = getShow(args);
    await warnMissingDependencies(config);

    const name = camelCase(args.name);
    const fileName = `transformers/${name}`;
    await makeFile(config, `Transformer ${name}`, fileName, async () => {
      const imports = makeImportsList();

      return renderTransformer({
        config,
        imports,
      });
    }, show);
  },
} as Command<MakeTransformerCommandOptions>;
