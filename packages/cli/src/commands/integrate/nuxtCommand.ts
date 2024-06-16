import payloadPluginCommand, {
  runPayloadPluginCommand,
} from '@foscia/cli/commands/integrate/nuxt/payloadPluginCommand';
import { ConfigurableOptions, useConfigOption } from '@foscia/cli/composables/useConfig';
import { ForceableOptions, useForceOption } from '@foscia/cli/composables/useForce';
import { ShowableOptions, useShowOption } from '@foscia/cli/composables/useShow';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';

export type NuxtCommandOptions =
  & { payloadPlugin: string; pluginsDirectory?: string; }
  & ConfigurableOptions
  & ShowableOptions
  & ForceableOptions;

export async function runNuxtCommand(options: NuxtCommandOptions) {
  await runPayloadPluginCommand(options.payloadPlugin, {
    directory: options.pluginsDirectory,
    show: options.show,
    force: options.force,
    config: options.config,
  });
}

export default function nuxtCommand() {
  return makeCommander('nuxt')
    .description('Publish all integrations for nuxt')
    .addCommand(payloadPluginCommand())
    .option(...useShowOption)
    .option(...useForceOption)
    .option('--payload-plugin <name>', 'Name for the payload plugin', 'fosciaPayloadPlugin')
    .option('--plugins-directory <directory>', 'Plugins directory path')
    .option(...useConfigOption)
    .action(runNuxtCommand);
}
