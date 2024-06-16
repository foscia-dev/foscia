import CLIError from '@foscia/cli/utils/errors/cliError';
import pathExists from '@foscia/cli/utils/files/pathExists';
import { readFile as baseReadFile } from 'node:fs/promises';

export default async function readFile(path: string) {
  if (!(await pathExists(path))) {
    return null;
  }

  try {
    return await baseReadFile(path, { encoding: 'utf8' });
  } catch (error) {
    throw new CLIError(`Could not read file at ${path}:\n${error}`);
  }
}
