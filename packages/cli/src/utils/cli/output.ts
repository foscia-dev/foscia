import isUnicodeSupported from 'is-unicode-supported';
import pc from 'picocolors';
import packageJson from '../../../package.json';

export const symbols = isUnicodeSupported() ? {
  foscia: '❃',
  info: 'ℹ',
  success: '✔',
  warning: '⚑',
  error: '✖',
  step: '➜',
} : {
  foscia: '*',
  info: 'i',
  success: '√',
  warning: '!',
  error: 'x',
  step: '>',
};

export default {
  info: (message: string) => console.info(`${pc.blue(symbols.info)} ${message}`),
  success: (message: string) => console.info(`${pc.green(symbols.success)} ${message}`),
  warn: (message: string) => console.warn(`${pc.yellow(symbols.warning)} ${message}`),
  error: (message: string) => console.error(`${pc.red(symbols.error)} ${message}`),
  step: (message: string) => console.info(`${pc.magenta(symbols.step)} ${pc.bold(message)}\n`),
  instruct: (message: string) => console.info(`  ${message}`),
  intro: (message: string) => console.info(`${pc.bold(pc.magenta(`Foscia v${packageJson.version}`))} ${message}`),
};
