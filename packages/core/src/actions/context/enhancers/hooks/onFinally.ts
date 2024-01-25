import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import { Action, ActionParsedExtension } from '@foscia/core/actions/types';
import registerHook from '@foscia/core/hooks/registerHook';
import { Awaitable } from '@foscia/shared';

/**
 * Register a "finally" hook callback on action.
 * Callback may be async.
 *
 * @param callback
 *
 * @category Enhancers
 */
export default function onFinally<C extends {}>(
  callback: (event: { context: C; }) => Awaitable<void>,
) {
  return (action: Action<C>) => {
    registerHook(action, 'finally', callback as any);
  };
}

type EnhancerExtension = ActionParsedExtension<{
  onFinally<C extends {}, E extends {}>(
    this: Action<C, E>,
    callback: (event: { context: C; }) => Awaitable<void>,
  ): Action<C, E>;
}>;

onFinally.extension = makeEnhancersExtension({ onFinally }) as EnhancerExtension;
