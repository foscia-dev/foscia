import CLIError from '@foscia/cli/utils/errors/cliError';
import friendlyPath from '@foscia/cli/utils/files/friendlyPath';
import pathExists from '@foscia/cli/utils/files/pathExists';
import { confirm } from '@inquirer/prompts';

export default async function promptForOverwrite(path: string, message?: string) {
  if (await pathExists(path)) {
    const overwriteConfig = await confirm({
      message: `file "${friendlyPath(path)}" exists, overwrite it?`,
      default: false,
    });

    if (!overwriteConfig) {
      throw new CLIError(message ?? 'operation stopped, bye!');
    }
  }
}
