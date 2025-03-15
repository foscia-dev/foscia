import { configuration } from '@foscia/core/configuration';
import FosciaError from '@foscia/core/errors/fosciaError';

/**
 * Resolve an action factory by its connection name.
 *
 * @param connection
 *
 * @category Utilities
 * @internal
 */
export default (connection = 'default') => {
  const factory = configuration.connections?.[connection];
  if (!factory) {
    throw new FosciaError(`Connection \`${connection}\` could not be found.`);
  }

  return factory;
};
