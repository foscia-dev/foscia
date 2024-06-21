import { symbols } from '@foscia/cli/utils/cli/output';
import c from 'ansi-colors';
import { OutputConfiguration } from 'commander';

export default {
  outputError: (message, write) => write(`${c.red(symbols.error)} ${message}`),
} as OutputConfiguration;
