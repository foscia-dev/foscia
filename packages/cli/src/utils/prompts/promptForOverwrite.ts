import CLIError from '@foscia/cli/utils/errors/cliError';
import friendlyPath from '@foscia/cli/utils/files/friendlyPath';
import pathExists from '@foscia/cli/utils/files/pathExists';
import promptConfirm from '@foscia/cli/utils/prompts/promptConfirm';

export default async function promptForOverwrite(path: string, message?: string) {
  if (await pathExists(path)) {
    const overwriteConfig = await promptConfirm({
      name: 'overwrite',
      message: `file "${friendlyPath(path)}" exists, overwrite it?`,
      initial: false,
    });

    if (!overwriteConfig) {
      throw new CLIError(message ?? 'operation stopped, bye!');
    }
  }
}
