import { getVersion } from '@foscia/cli/utils/context/version';
import c from 'ansi-colors';
import isUnicodeSupported from 'is-unicode-supported';

export const symbols = isUnicodeSupported() ? {
  foscia: '❃',
  info: 'ℹ',
  success: '✔',
  warning: '⚑',
  error: '✖',
  step: '➜',
  radioOff: ' ',
  radioOn: '›',
  checkboxOff: '☐',
  checkboxOn: '☑',
} : {
  foscia: '*',
  info: 'i',
  success: '√',
  warning: '!',
  error: 'x',
  step: '»',
  radioOff: ' ',
  radioOn: '>',
  checkboxOff: ' ',
  checkboxOn: '√',
};

export default {
  info: (message: string) => console.info(`${c.blue(symbols.info)} ${message}`),
  success: (message: string) => console.info(`${c.green(symbols.success)} ${message}`),
  warn: (message: string) => console.warn(`${c.yellow(symbols.warning)} ${message}`),
  error: (message: string) => console.error(`${c.red(symbols.error)} ${message}`),
  step: (message: string) => console.info(`${c.magenta(symbols.step)} ${c.bold(message)}\n`),
  instruct: (message: string) => console.info(`  ${message}`),
  intro: (message: string) => console.info(`${c.bold(c.magenta(`Foscia v${getVersion()}`))} ${message}`),
};
