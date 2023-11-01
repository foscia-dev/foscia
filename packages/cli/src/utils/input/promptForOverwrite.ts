import pathExists from '@foscia/cli/utils/files/pathExists';
import cancel from '@foscia/cli/utils/output/cancel';
import logSymbols from '@foscia/cli/utils/output/logSymbols';
import { confirm } from '@inquirer/prompts';

export default async function promptForOverwrite(path: string, message?: string) {
  if (await pathExists(path)) {
    console.warn(`${logSymbols.warning} File already exists at "${path}"`);

    const overwriteConfig = await confirm({
      message: 'Would you like to overwrite it?',
      default: false,
    });

    if (!overwriteConfig) {
      cancel(message);
    }
  }
}
