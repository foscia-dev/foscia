import { Logger, LoggerLevel, LoggerOutput } from '@foscia/core/logger/types';
import { IS_DEV, IS_TEST } from '@foscia/shared';

const LOGGER_LEVELS_WEIGHTS: Record<LoggerLevel, number> = {
  debug: 0,
  info: 10,
  warn: 100,
  error: 1000,
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
  level: makeDefaultLevel(),
  output: (typeof console !== 'undefined' ? console : null) as LoggerOutput | null,
  error: makeMessageLog('error'),
  warn: makeMessageLog('warn'),
  info: makeMessageLog('info'),
  debug: makeMessageLog('debug'),
} as Logger;
