import { symbols } from '@foscia/cli/utils/cli/output';
import { OutputConfiguration } from 'commander';
import pc from 'picocolors';

export default {
  outputError: (message, write) => write(`${pc.red(symbols.error)} ${message}`),
} as OutputConfiguration;
