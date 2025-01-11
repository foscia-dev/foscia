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

const makeDefaultLevel = (): LoggerLevel | null => {
  if (IS_TEST) {
    return null;
  }

  return IS_DEV ? 'warn' : 'error';
};

const makeMessageLog = (level: LoggerLevel) => function log(
  this: { level: LoggerLevel | null; },
  message: string,
  args: unknown[] = [],
) {
  if (this.level
    && LOGGER_LEVELS_WEIGHTS[level] >= LOGGER_LEVELS_WEIGHTS[this.level]
    && typeof console !== 'undefined'
    && typeof console[level] === 'function'
  ) {
    console[level](`[foscia] ${level}: ${message}`, ...args);
  }
};

export default {
  /**
   * The minimum level of logged messages.
   */
  level: makeDefaultLevel(),
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
