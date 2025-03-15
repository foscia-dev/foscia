import isActionFrom from '@foscia/core/actions/checks/isActionFrom';
import { Action } from '@foscia/core/actions/types';
import { configuration } from '@foscia/core/configuration';

/**
 * Resolve an action factory by its connection name.
 *
 * @param action
 *
 * @category Utilities
 * @internal
 */
export default async (action: Action) => await Object.entries(
  configuration.connections ?? {},
).reduce(
  async (found, [key, factory]) => (
    await found ?? (
      factory && await isActionFrom(action, factory) ? key : null
    )
  ),
  Promise.resolve(null as string | null),
) ?? 'default';
