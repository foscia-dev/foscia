import consumeActionConnectionId
  from '@foscia/core/actions/context/consumers/consumeActionConnectionId';
import { Action, ActionFactory } from '@foscia/core/actions/types';

/**
 * Check if given action from a given factory.
 *
 * @param action
 * @param from
 *
 * @internal
 */
export default async (
  action: Action,
  from: ActionFactory<{}>,
) => from.connectionId === await consumeActionConnectionId(action, null);
