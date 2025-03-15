import { ActionFactory } from '@foscia/core/actions/types';

/**
 * Global configuration for Foscia.
 *
 * @internal
 */
export type FosciaConfiguration = {
  /**
   * Available action factories keyed by their connection name, which
   * can be used to manage models inside multiple connections environments.
   */
  connections?: Partial<{
    /**
     * Default action factory which is automatically registered with
     * first action factory creation.
     */
    default: ActionFactory<any>;
    [connection: string]: ActionFactory<any>;
  }>;
  /**
   * Utilities used by Foscia which are provided with a minimalist implementation.
   * Overriding those utilities with more advanced implementations (such as
   * `pluralize` NPM package for pluralization) can improve Foscia's behavior.
   *
   * TODO Remove it.
   */
  utilities?: {
    /**
     * Convert a string to its plural.
     */
    pluralize?: (value: string) => string;
    /**
     * Convert a string to its singular.
     */
    singularize?: (value: string) => string;
  };
};

/**
 * Global configuration for Foscia.
 *
 * @internal
 */
export const configuration: FosciaConfiguration = {};

/**
 * Configure Foscia.
 * This should be done in your application entry point.
 *
 * @param config
 */
export const configureFoscia = (config: FosciaConfiguration) => {
  Object.assign(configuration, config);
};
