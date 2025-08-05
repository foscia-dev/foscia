import isActionFrom from '@foscia/core/actions/checks/isActionFrom';
import { Action } from '@foscia/core/actions/types';
import { configuration } from '@foscia/core/configuration';

/**
 * Resolve a connection name for an action.
 *
 * @param action
 *
 * @internal
 */
export default async function resolveConnectionName(action: Action) {
  return await Object.entries(configuration.connections ?? {}).reduce(
    async (found, [key, factory]) => (
      await found ?? (
        factory && await isActionFrom(action, factory) ? key : null
      )
    ),
    Promise.resolve(null as string | null),
  ) ?? 'default';
}
