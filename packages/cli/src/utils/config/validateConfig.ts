import {
  CLIConfig,
  CONFIG_LANGUAGES,
  CONFIG_MODULES,
  CONFIG_PACKAGE_MANAGERS,
  CONFIG_USAGES,
} from '@foscia/cli/utils/config/config';
import CLIError from '@foscia/cli/utils/errors/cliError';
import toTree from '@foscia/cli/utils/output/toTree';
import pc from 'picocolors';

export default function validateConfig(config: object) {
  const validateRequired = (value: unknown) => (
    (value !== undefined && value !== null && value !== '') || 'value must be defined'
  );
  const validateString = (value: unknown) => (
    validateRequired(value) !== true || typeof value === 'string' || 'value must be a string'
  );
  const validateUnsignedInt = (value: unknown) => (
    validateRequired(value) !== true || (typeof value === 'number' && value >= 0) || 'value must be a string'
  );
  const validateIn = <T extends unknown[]>(values: T) => (value: unknown) => (
    values.some((v) => value === v) || `value must match one of: ${values.join(', ')}.`
  );

  const errors = Object.entries({
    usage: [validateIn(CONFIG_USAGES.map(({ value }) => value))],
    packageManager: [validateIn(CONFIG_PACKAGE_MANAGERS.map(({ value }) => value))],
    language: [validateIn(CONFIG_LANGUAGES.map(({ value }) => value))],
    modules: [validateIn(CONFIG_MODULES.map(({ value }) => value))],
    path: [validateRequired, validateString],
    alias: [validateString],
    tabSize: [validateUnsignedInt],
  }).reduce((messages, [key, rules]) => {
    const value = config[key as keyof typeof config];
    let message = true as true | string;
    rules.some((rule) => {
      message = rule(value);

      return message !== true;
    });

    if (message !== true) {
      messages.push(`${pc.bold(key)}: ${message}`);
    }

    return messages;
  }, [] as string[]);

  if (errors.length > 0) {
    throw new CLIError(
      `Invalid configuration values:\n${toTree(errors, pc.red)}\nPlease fix your configuration or re-run "foscia init <path>".`,
    );
  }

  return config as CLIConfig;
}
