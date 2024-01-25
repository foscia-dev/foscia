import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import { Action, ActionParsedExtension } from '@foscia/core/actions/types';
import registerHook from '@foscia/core/hooks/registerHook';
import { Awaitable } from '@foscia/shared';

/**
 * Register a "error" hook callback on action.
 * Callback may be async.
 *
 * @param callback
 *
 * @category Enhancers
 */
export default function onError<C extends {}>(
  callback: (event: { context: C; error: unknown; }) => Awaitable<void>,
) {
  return (action: Action<C>) => {
    registerHook(action, 'error', callback as any);
  };
}

type EnhancerExtension = ActionParsedExtension<{
  onError<C extends {}, E extends {}>(
    this: Action<C, E>,
    callback: (event: { context: C; error: unknown; }) => Awaitable<void>,
  ): Action<C, E>;
}>;

onError.extension = makeEnhancersExtension({ onError }) as EnhancerExtension;
