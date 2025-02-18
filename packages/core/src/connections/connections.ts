import type { ActionFactory } from '@foscia/core/actions/types';
import FosciaError from '@foscia/core/errors/fosciaError';
import type { ConnectionsRegistry } from '@foscia/core/types';
import { tap } from '@foscia/shared';

const registeredConnections = new Map<string, ActionFactory<any>>();

/**
 * Registry containing mapping between connections and action factories.
 * It should be used by an end user only when multiple action factories
 * coexist in the same project, and should be paired with models connection
 * declaration.
 *
 * @since 0.13.0
 */
const connectionsRegistry: ConnectionsRegistry = {
  register: (connection, action) => {
    registeredConnections.set(connection, action);
  },
  get: (connection = 'default') => tap(registeredConnections.get(connection), (factory) => {
    if (!factory) {
      throw new FosciaError(`Connection \`${connection}\` could not be found.`);
    }
  }) as ActionFactory<any>,
  all: () => registeredConnections,
};

export default connectionsRegistry;
