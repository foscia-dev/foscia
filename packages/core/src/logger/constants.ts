export const LOGGER_LEVELS = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
};

export const LOGGER_LEVELS_WEIGHTS = {
  [LOGGER_LEVELS.debug]: 0,
  [LOGGER_LEVELS.info]: 10,
  [LOGGER_LEVELS.warn]: 100,
  [LOGGER_LEVELS.error]: 1000,
};
