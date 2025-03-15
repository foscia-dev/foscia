import ActionKind from '@foscia/core/actions/context/actionKind';
import consumeActionKind from '@foscia/core/actions/context/consumers/consumeActionKind';
import { Action } from '@foscia/core/actions/types';

/**
 * Check if given action is of one of given {@link ActionKind | `ActionKind`}.
 *
 * @param action
 * @param kinds
 *
 * @internal
 */
export default async (action: Action, kinds: ActionKind[]) => (
  kinds as (string | null)[]
).indexOf(await consumeActionKind(action, null)) !== -1;
