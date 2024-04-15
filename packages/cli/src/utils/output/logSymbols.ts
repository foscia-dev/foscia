import isUnicodeSupported from 'is-unicode-supported';
import pc from 'picocolors';

export default isUnicodeSupported() ? {
  foscia: pc.magenta('❃'),
  info: pc.blue('ℹ'),
  success: pc.green('✔'),
  warning: pc.yellow('⚠'),
  error: pc.red('✖'),
  instruction: pc.magenta('➜'),
} : {
  foscia: pc.magenta('*'),
  info: pc.blue('i'),
  success: pc.green('√'),
  warning: pc.yellow('!'),
  error: pc.red('x'),
  instruction: pc.magenta('>'),
};
