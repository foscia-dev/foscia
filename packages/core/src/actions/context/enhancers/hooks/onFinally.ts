import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import { Action } from '@foscia/core/actions/types';
import registerHook from '@foscia/core/hooks/registerHook';
import { Awaitable } from '@foscia/shared';

/**
 * Register a "finally" hook callback on action.
 * Callback may be async.
 *
 * @param callback
 *
 * @category Enhancers
 * @category Hooks
 *
 * @example
 * ```typescript
 * import { onFinally } from '@foscia/core';
 *
 * action(onFinally((event) => {
 *   console.log(event.action);
 * }));
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('onFinally', <C extends {}>(
  callback: (event: { action: Action<C>; }) => Awaitable<unknown>,
) => (action: Action<C>) => {
  registerHook(action, 'finally', callback as any);
});
