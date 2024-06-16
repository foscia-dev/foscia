import output from '@foscia/cli/utils/cli/output';
import validateConfig from '@foscia/cli/utils/config/validateConfig';
import CLIError from '@foscia/cli/utils/errors/cliError';
import findUp from '@foscia/cli/utils/files/findUp';
import friendlyPath from '@foscia/cli/utils/files/friendlyPath';
import pathExists from '@foscia/cli/utils/files/pathExists';
import { select } from '@inquirer/prompts';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

async function detectConfigPath(path?: string): Promise<[string | undefined, string | undefined]> {
  if (path !== undefined) {
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
      message: 'choose config to use (or rerun this command using --config option):',
      choices: guessPaths.map((value) => ({ value })),
    }), undefined];
  }

  return [guessPaths[0] ?? undefined, undefined];
}

async function parseConfigFrom(path?: string): Promise<object> {
  if (path === undefined) {
    throw new CLIError('missing config file, please run:', 'foscia init');
  }

  if (!await pathExists(path)) {
    throw new CLIError(`config file cannot be found at "${path}"`);
  }

  let config: unknown;
  try {
    config = JSON.parse(await readFile(path, 'utf-8'));
  } catch (error) {
    throw new CLIError(`config file cannot be read at "${path}"`);
  }

  if (!config || typeof config !== 'object') {
    throw new CLIError(`config file contains invalid JSON at "${path}"`);
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

export default async function parseConfig(path?: string) {
  const [configPath, explanation] = await detectConfigPath(path);
  const parsedConfig = await parseConfigFrom(configPath);

  output.intro(`using config at "${friendlyPath(configPath!)}"${explanation ? ` (${explanation})` : ''}`);

  return validateConfig(parsedConfig);
}
