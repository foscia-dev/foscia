import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import { Action, WithParsedExtension } from '@foscia/core/actions/types';
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
function onSuccess<C extends {}>(
  callback: (event: { context: C; result: unknown; }) => Awaitable<unknown>,
) {
  return (action: Action<C>) => {
    registerHook(action, 'success', callback as any);
  };
}

export default /* @__PURE__ */ appendExtension(
  'onSuccess',
  onSuccess,
  'use',
) as WithParsedExtension<typeof onSuccess, {
  onSuccess<C extends {}, E extends {}>(
    this: Action<C, E>,
    callback: (event: { context: C; result: unknown; }) => Awaitable<unknown>,
  ): Action<C, E>;
}>;
