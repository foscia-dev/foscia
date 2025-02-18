import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import { Action } from '@foscia/core/actions/types';
import registerHook from '@foscia/core/hooks/registerHook';
import { Awaitable } from '@foscia/shared';

/**
 * Register a "success" hook callback on action.
 * Callback may be async.
 *
 * @param callback
 *
 * @category Enhancers
 * @category Hooks
 *
 * @example
 * ```typescript
 * import { onSuccess } from '@foscia/core';
 *
 * action(onSuccess((event) => {
 *   console.log(event.action, event.result);
 * }));
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('onSuccess', <C extends {}>(
  callback: (event: { action: Action<C>; result: unknown; }) => Awaitable<unknown>,
) => (action: Action<C>) => {
  registerHook(action, 'success', callback as any);
});
