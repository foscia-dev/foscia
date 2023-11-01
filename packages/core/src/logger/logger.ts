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

function defaultLoggerLevel(): LoggerLevel | null {
  if (IS_TEST) {
    return null;
  }

  return IS_DEV ? 'warn' : 'error';
}

class Logger {
  public level: LoggerLevel | null = defaultLoggerLevel();

  public error(message: string, args: unknown[] = []) {
    this.message('error', message, args);
  }

  public warn(message: string, args: unknown[] = []) {
    this.message('warn', message, args);
  }

  public info(message: string, args: unknown[] = []) {
    this.message('info', message, args);
  }

  public debug(message: string, args: unknown[] = []) {
    this.message('debug', message, args);
  }

  private message(level: LoggerLevel, message: string, args: unknown[]) {
    if (this.level
      && LOGGER_LEVELS_WEIGHTS[level] >= LOGGER_LEVELS_WEIGHTS[this.level]
      && typeof console !== 'undefined'
      && typeof console[level] === 'function'
    ) {
      console[level](`[foscia] ${level}: ${message}`, ...args);
    }
  }
}

export default new Logger();
