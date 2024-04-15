import validateConfig from '@foscia/cli/utils/config/validateConfig';
import CLIError from '@foscia/cli/utils/errors/cliError';
import findUp from '@foscia/cli/utils/files/findUp';
import pathExists from '@foscia/cli/utils/files/pathExists';
import logSymbols from '@foscia/cli/utils/output/logSymbols';
import { select } from '@inquirer/prompts';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export const AUTO_DETECT_CONFIG = 'detect-automatically';

async function detectConfigPath(path: string): Promise<[string | undefined, string | undefined]> {
  if (path !== AUTO_DETECT_CONFIG) {
    const givenPath = resolve(path);
    const guessPath = resolve(`.fosciarc.${path}.json`);
    if (!await pathExists(givenPath) && await pathExists(guessPath)) {
      return [guessPath, `guessed from "${path}"`];
    }

    return [givenPath, undefined];
  }

  const guessPaths = (await findUp(/^\.fosciarc\.([A-Za-z0-9-_]+\.)?json$/))[0] ?? [];
  const defaultPath = guessPaths.find((p) => p.endsWith('.fosciarc.json'));
  if (defaultPath) {
    return [defaultPath, undefined];
  }

  if (guessPaths.length > 1) {
    return [await select({
      message: 'Please choose the config to use (or rerun this command using --config option):',
      choices: guessPaths.map((value) => ({ value })),
    }), undefined];
  }

  return [guessPaths[0] ?? undefined, undefined];
}

async function parseConfigFrom(path?: string): Promise<object> {
  if (path === undefined) {
    throw new CLIError('No configuration found.', 'Please run "foscia init <path>".');
  }

  if (!await pathExists(path)) {
    throw new CLIError(`Configuration file does not exists at "${path}".`, 'Please run "foscia init <path>".');
  }

  let config: unknown;
  try {
    config = JSON.parse(await readFile(path, 'utf-8'));
  } catch (error) {
    throw new CLIError(`Configuration file cannot be read at "${path}".`);
  }

  if (!config || typeof config !== 'object') {
    throw new CLIError(`Configuration file contains invalid JSON at "${path}" (must be a JSON object).`);
  }

  if (
    config
    && typeof config === 'object'
    && 'extends' in config
    && typeof config.extends === 'string'
  ) {
    return {
      ...config,
      ...(await parseConfigFrom(resolve(dirname(path), config.extends))),
    };
  }

  return config;
}

export default async function parseConfig(path: string) {
  const [configPath, explanation] = await detectConfigPath(path);
  const parsedConfig = await parseConfigFrom(configPath);

  console.info(
    `${logSymbols.info} Using config at "${configPath}"${explanation ? ` (${explanation})` : ''}`,
  );

  return validateConfig(parsedConfig);
}
