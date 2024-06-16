import nuxtCommand from '@foscia/cli/commands/integrate/nuxtCommand';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';

export default function integrateCommand() {
  return makeCommander('integrate')
    .description('Manage Foscia integration in third-party tools')
    .addCommand(nuxtCommand());
}
