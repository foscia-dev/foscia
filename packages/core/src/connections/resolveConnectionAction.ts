import { configuration } from '@foscia/core/configuration';
import FosciaError from '@foscia/core/errors/fosciaError';

/**
 * Resolve an action factory for a connection name.
 *
 * @param connection
 *
 * @internal
 */
export default function resolveConnectionAction(connection = 'default') {
  const factory = configuration.connections?.[connection];
  if (!factory) {
    throw new FosciaError(`Connection \`${connection}\` could not be found.`);
  }

  return factory;
}
