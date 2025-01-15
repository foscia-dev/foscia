import { IS_DEV, IS_TEST } from '@foscia/shared';

const LOGGER_LEVELS = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
};

const LOGGER_LEVELS_WEIGHTS = {
  [LOGGER_LEVELS.debug]: 0,
  [LOGGER_LEVELS.info]: 10,
  [LOGGER_LEVELS.warn]: 100,
  [LOGGER_LEVELS.error]: 1000,
};

type LoggerLevel = keyof typeof LOGGER_LEVELS;

type LoggerOutput = {
  error: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
};

const makeDefaultLevel = (): LoggerLevel | null => {
  if (IS_TEST) {
    return null;
  }

  return IS_DEV ? 'warn' : 'error';
};

const makeMessageLog = (level: LoggerLevel) => function log(
  this: { level: LoggerLevel | null; output: LoggerOutput | null; },
  message: string,
  args: unknown[] = [],
) {
  if (this.level
    && LOGGER_LEVELS_WEIGHTS[level] >= LOGGER_LEVELS_WEIGHTS[this.level]
    && this.output
  ) {
    this.output[level](`[foscia] ${level}: ${message}`, ...args);
  }
};

export default {
  /**
   * The minimum level of logged messages.
   * Defaults to `error` in PROD env, `warn` in DEV env, and `null` in TEST env.
   */
  level: makeDefaultLevel(),
  /**
   * The output to use for logged messages.
   * Defaults to global `console` if available.
   */
  output: (
    typeof console !== 'undefined' ? console : null
  ) as LoggerOutput | null,
  /**
   * Log an error message.
   *
   * @internal
   */
  error: makeMessageLog('error'),
  /**
   * Log a warning message.
   *
   * @internal
   */
  warn: makeMessageLog('warn'),
  /**
   * Log an info message.
   *
   * @internal
   */
  info: makeMessageLog('info'),
  /**
   * Log a debug message.
   *
   * @internal
   */
  debug: makeMessageLog('debug'),
};
