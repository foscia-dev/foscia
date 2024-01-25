import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import { Action, ActionParsedExtension } from '@foscia/core/actions/types';
import registerHook from '@foscia/core/hooks/registerHook';
import { Awaitable } from '@foscia/shared';

/**
 * Register a "success" hook callback on action.
 * Callback may be async.
 *
 * @param callback
 *
 * @category Enhancers
 */
export default function onSuccess<C extends {}>(
  callback: (event: { context: C; result: unknown; }) => Awaitable<void>,
) {
  return (action: Action<C>) => {
    registerHook(action, 'success', callback as any);
  };
}

type EnhancerExtension = ActionParsedExtension<{
  onSuccess<C extends {}, E extends {}>(
    this: Action<C, E>,
    callback: (event: { context: C; result: unknown; }) => Awaitable<void>,
  ): Action<C, E>;
}>;

onSuccess.extension = makeEnhancersExtension({ onSuccess }) as EnhancerExtension;
