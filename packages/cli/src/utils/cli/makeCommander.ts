import helpConfiguration from '@foscia/cli/utils/cli/helpConfiguration';
import outputConfiguration from '@foscia/cli/utils/cli/outputConfiguration';
import { Command } from 'commander';

export default function makeCommander(name: string) {
  return new Command()
    .name(name)
    .helpOption(undefined, 'Show help for command')
    .helpCommand(false)
    .configureHelp(helpConfiguration)
    .configureOutput(outputConfiguration);
}
