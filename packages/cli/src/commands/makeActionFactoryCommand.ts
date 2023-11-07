import useShowable, { ShowableOptions } from '@foscia/cli/commands/composables/useShowable';
import useUsage, { UsageOptions } from '@foscia/cli/commands/composables/useUsage';
import { Command } from '@foscia/cli/commands/types';
import renderActionFactory from '@foscia/cli/templates/renderActionFactory';
import useConfig from '@foscia/cli/utils/config/useConfig';
import warnMissingDependencies from '@foscia/cli/utils/dependencies/warnMissingDependencies';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import promptForActionFactoryOptions from '@foscia/cli/utils/input/promptForActionFactoryOptions';
import makeFile from '@foscia/cli/utils/makeFile';
import logSymbols from '@foscia/cli/utils/output/logSymbols';
import { camelCase } from 'lodash-es';
import pc from 'picocolors';

export type MakeActionFactoryCommandOptions = {
  name: string;
  usage: string;
} & UsageOptions & ShowableOptions;

const [usageOptions, getUsage] = useUsage();
const [showOptions, getShow] = useShowable();

export default {
  name: 'make:action',
  command: 'make:action [name]',
  describe: pc.dim('Create an action factory file.'),
  builder: (argv) => argv
    .usage(`Usage: ${pc.magenta('foscia')} ${pc.bold('make:action')} [name] [options]`)
    .positional('name', {
      type: 'string',
      description: pc.dim('Name to use for new action factory.'),
      default: 'action',
    })
    .options(usageOptions)
    .options(showOptions),
  handler: async (args) => {
    const config = await useConfig(args.config);
    const usage = await getUsage(args, async () => config.usage);
    const show = getShow(args);
    await warnMissingDependencies(config, usage);

    const name = camelCase(args.name);
    await makeFile(config, `ActionFactory ${name}`, name, async () => {
      console.log(
        pc.bold(`\n${logSymbols.foscia} Lets configure your action factory!\n`),
      );

      const imports = makeImportsList();

      return renderActionFactory({
        config,
        imports,
        usage,
        options: await promptForActionFactoryOptions(config, imports, usage),
      });
    }, show);
  },
} as Command<MakeActionFactoryCommandOptions>;
