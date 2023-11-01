import CLIError from '@foscia/cli/utils/errors/cliError';
import { mkdir, writeFile as baseWriteFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export default async function writeFile(path: string, data: string) {
  try {
    await mkdir(dirname(path), { recursive: true });
    await baseWriteFile(path, data, { encoding: 'utf8', flag: 'w' });
  } catch (error) {
    throw new CLIError(`Could not write file at ${path}:\n${error}`);
  }
}
