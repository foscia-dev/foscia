import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import { Action } from '@foscia/core/actions/types';
import registerHook from '@foscia/core/hooks/registerHook';
import { Awaitable } from '@foscia/shared';

/**
 * Register a "error" hook callback on action.
 * Callback may be async.
 *
 * @param callback
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { onError } from '@foscia/core';
 *
 * action().use(onError((event) => {
 *   console.log(event.action, event.error);
 * }));
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('onError', <C extends {}>(
  callback: (event: { action: Action<C>; error: unknown; }) => Awaitable<unknown>,
) => (action: Action<C>) => {
  registerHook(action, 'error', callback as any);
});
