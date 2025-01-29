/**
 * Available logger levels.
 *
 * @internal
 */
export type LoggerLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Output to use on a logger.
 *
 * @internal
 */
export type LoggerOutput = {
  /**
   * Log an error message.
   *
   * @param message
   * @param args
   */
  error: (message: string, ...args: unknown[]) => void;
  /**
   * Log a warning message.
   *
   * @param message
   * @param args
   */
  warn: (message: string, ...args: unknown[]) => void;
  /**
   * Log an info message.
   *
   * @param message
   * @param args
   */
  info: (message: string, ...args: unknown[]) => void;
  /**
   * Log a debug message.
   *
   * @param message
   * @param args
   */
  debug: (message: string, ...args: unknown[]) => void;
};

/**
 * Logger used for all Foscia messages.
 *
 * @internal
 */
export type Logger =
  & {
    /**
     * The minimum level of logged messages.
     * Defaults to `error` in PROD env, `warn` in DEV env, and `null` in TEST env.
     */
    level: LoggerLevel | null;
    /**
     * The output to use for logged messages.
     * Defaults to global `console` if available.
     */
    output: LoggerOutput | null;
  }
  & Readonly<LoggerOutput>;
